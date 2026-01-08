import os
from datetime import datetime, timedelta
from pymongo import MongoClient
import random

MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password123@db:27017/")
DB_NAME = "elite_drive"

def get_db():
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]

def seed_database():
    db = get_db()
    
    print("Dropping existing collections...")
    for col in ["cars", "showroom_schedules", "test_drives", "customers", "service_history"]:
        db[col].drop()

    print("Seeding Cars...")
    cars_data = [
        {"brand": "Ferrari", "model": "SF90 Stradale", "year": 2024, "price": 625000, "specs": {"hp": 986, "engine": "V8 Hybrid"}, "category": "Supercar"},
        {"brand": "Lamborghini", "model": "Revuelto", "year": 2024, "price": 608000, "specs": {"hp": 1001, "engine": "V12 Hybrid"}, "category": "Supercar"},
        {"brand": "Porsche", "model": "911 GT3 RS", "year": 2024, "price": 241300, "specs": {"hp": 518, "engine": "4.0L Flat-6"}, "category": "GT"},
        {"brand": "Aston Martin", "model": "Valhalla", "year": 2025, "price": 800000, "specs": {"hp": 937, "engine": "V8 Hybrid"}, "category": "Supercar"},
        {"brand": "Tesla", "model": "Model S Plaid", "year": 2024, "price": 108990, "specs": {"hp": 1020, "engine": "Electric Tri-Motor"}, "category": "Sedan"},
        {"brand": "Rolls-Royce", "model": "Spectre", "year": 2024, "price": 420000, "specs": {"hp": 577, "engine": "Electric"}, "category": "Luxury"},
        {"brand": "Bentley", "model": "Continental GT Speed", "year": 2024, "price": 302000, "specs": {"hp": 650, "engine": "W12"}, "category": "GT"},
        {"brand": "Mercedes-AMG", "model": "ONE", "year": 2023, "price": 2720000, "specs": {"hp": 1049, "engine": "V6 Hybrid F1"}, "category": "Hypercar"},
        {"brand": "Bugatti", "model": "Chiron Super Sport", "year": 2023, "price": 3825000, "specs": {"hp": 1578, "engine": "W16 Quad-Turbo"}, "category": "Hypercar"},
        {"brand": "Pagani", "model": "Utopia", "year": 2024, "price": 2190000, "specs": {"hp": 852, "engine": "V12 Twin-Turbo"}, "category": "Hypercar"}
    ]
    car_ids = db.cars.insert_many(cars_data).inserted_ids
    print(f"Inserted {len(car_ids)} cars.")

    print("Seeding Customers...")
    customers_data = [
        {"name": "Avi Levi", "phone": "+972-50-1234567", "loyalty_tier": "VIP"},
        {"name": "Noa Mizrahi", "phone": "+972-52-7654321", "loyalty_tier": "Platinum"},
        {"name": "Eyal Biton", "phone": "+972-54-1112223", "loyalty_tier": "Gold"},
        {"name": "Yael Ashkenazi", "phone": "+972-50-9988776", "loyalty_tier": "VIP"},
        {"name": "Omer Cohen", "phone": "+972-53-4455667", "loyalty_tier": "Platinum"}
    ]
    customer_ids = db.customers.insert_many(customers_data).inserted_ids
    print(f"Inserted {len(customer_ids)} customers.")

    print("Seeding Schedules...")
    now = datetime.now()
    schedules_data = []
    for car_id in car_ids:
        for day in range(7):
            for hour in [10, 14, 16]:
                date = (now + timedelta(days=day)).replace(hour=hour, minute=0, second=0, microsecond=0)
                schedules_data.append({
                    "car_id": car_id,
                    "start_time": date,
                    "end_time": date + timedelta(hours=1),
                    "is_available": True
                })
    db.showroom_schedules.insert_many(schedules_data)
    print("Inserted showroom schedules.")

    print("Seeding Service History...")
    service_data = []
    for _ in range(5):
        car_id = random.choice(car_ids)
        service_data.append({
            "car_id": car_id,
            "date": now - timedelta(days=random.randint(30, 365)),
            "description": "Routine Maintenance",
            "cost": random.randint(1000, 5000),
            "next_service_due": random.choice([True, False])
        })
    db.service_history.insert_many(service_data)
    print("Inserted service history.")

    print("Seeding Test Drives...")
    slots = list(db.showroom_schedules.find().limit(3))
    for slot in slots:
        db.test_drives.insert_one({
            "customer_id": customer_ids[0],
            "car_id": slot["car_id"],
            "slot_id": slot["_id"],
            "status": "confirmed"
        })
        db.showroom_schedules.update_one({"_id": slot["_id"]}, {"$set": {"is_available": False}})
    print("Seeded test drives.")

    print("Database seeding completed!")

if __name__ == "__main__":
    seed_database()
