import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password123@db:27017/")
DB_NAME = "elite_drive"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def serialize_doc(doc):
    """Helper to serialize MongoDB documents"""
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    for key in ["start_time", "end_time", "date", "booked_at"]:
        if key in doc and isinstance(doc[key], datetime):
            doc[key] = doc[key].isoformat()
    for key in ["car_id", "customer_id", "slot_id"]:
        if key in doc and isinstance(doc[key], ObjectId):
            doc[key] = str(doc[key])
    return doc

@app.route('/cars', methods=['GET'])
def get_all_cars():
    """Get all cars"""
    cars = list(db.cars.find())
    return jsonify([serialize_doc(c) for c in cars])

@app.route('/cars/brand/<brand>', methods=['GET'])
def get_cars_by_brand(brand):
    """Filter cars by brand"""
    cars = list(db.cars.find({"brand": {"$regex": f"^{brand}$", "$options": "i"}}))
    return jsonify([serialize_doc(c) for c in cars])

@app.route('/schedules/car/<car_id>', methods=['GET'])
def get_schedules_by_car(car_id):
    """Get available viewing slots for a car"""
    try:
        oid = ObjectId(car_id)
        schedules = list(db.showroom_schedules.find({"car_id": oid, "is_available": True}))
        return jsonify([serialize_doc(s) for s in schedules])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/cars/availability', methods=['GET'])
def get_cars_availability():
    """List all cars with available slots"""
    available_slots = list(db.showroom_schedules.find({"is_available": True}))
    car_ids = list(set([s["car_id"] for s in available_slots]))
    cars = list(db.cars.find({"_id": {"$in": car_ids}}))
    return jsonify([serialize_doc(c) for c in cars])

@app.route('/customers/<customer_id>/history', methods=['GET'])
def get_customer_history(customer_id):
    """Get customer's booking history"""
    try:
        oid = ObjectId(customer_id)
        bookings = list(db.test_drives.find({"customer_id": oid}))
        result = []
        for booking in bookings:
            car = db.cars.find_one({"_id": ObjectId(booking["car_id"])})
            booking["car_details"] = serialize_doc(car)
            if "slot_id" in booking:
                slot = db.showroom_schedules.find_one({"_id": ObjectId(booking["slot_id"])})
                booking["slot_details"] = serialize_doc(slot)
            result.append(serialize_doc(booking))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/book-test-drive', methods=['POST'])
def book_test_drive():
    """Book a test drive slot"""
    data = request.json
    customer_id = data.get('customer_id')
    car_id = data.get('car_id')
    slot_id = data.get('slot_id')
    
    if not all([customer_id, car_id, slot_id]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        slot_oid = ObjectId(slot_id)
        slot = db.showroom_schedules.find_one({"_id": slot_oid, "is_available": True})
        if not slot:
            return jsonify({"error": "Slot not available"}), 409
        
        booking = {
            "customer_id": ObjectId(customer_id),
            "car_id": ObjectId(car_id),
            "slot_id": slot_oid,
            "status": "confirmed",
            "booked_at": datetime.now()
        }
        result = db.test_drives.insert_one(booking)
        db.showroom_schedules.update_one({"_id": slot_oid}, {"$set": {"is_available": False}})
        
        return jsonify({"message": "Booking confirmed", "booking_id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/customers', methods=['GET'])
def get_customers():
    """Get all customers"""
    customers = list(db.customers.find())
    return jsonify([serialize_doc(c) for c in customers])

@app.route('/services/due', methods=['GET'])
def get_service_alerts():
    """Get service alerts"""
    alerts = list(db.service_history.find({"next_service_due": True}))
    result = []
    for alert in alerts:
        car = db.cars.find_one({"_id": ObjectId(alert["car_id"])})
        alert["car_details"] = serialize_doc(car)
        result.append(serialize_doc(alert))
    return jsonify(result)

@app.route('/bookings', methods=['GET'])
def get_all_bookings():
    """Get all bookings"""
    bookings = list(db.test_drives.find())
    result = []
    for booking in bookings:
        car = db.cars.find_one({"_id": ObjectId(booking["car_id"])})
        customer = db.customers.find_one({"_id": ObjectId(booking["customer_id"])})
        booking["car_details"] = serialize_doc(car)
        booking["customer_details"] = serialize_doc(customer)
        if "slot_id" in booking:
            slot = db.showroom_schedules.find_one({"_id": ObjectId(booking["slot_id"])})
            booking["slot_details"] = serialize_doc(slot)
        result.append(serialize_doc(booking))
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
