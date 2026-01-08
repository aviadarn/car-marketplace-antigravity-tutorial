import requests
import time
import sys

BASE_URL = "http://localhost:5000"

def log(msg):
    print(f"[TEST] {msg}")

def wait_for_api():
    retries = 30
    for i in range(retries):
        try:
            requests.get(BASE_URL + "/cars")
            log("API is up!")
            return True
        except requests.exceptions.ConnectionError:
            log(f"Waiting for API... ({i+1}/{retries})")
            time.sleep(1)
    return False

def test_endpoints():
    # Test GET /cars
    log("Testing GET /cars...")
    res = requests.get(f"{BASE_URL}/cars")
    assert res.status_code == 200, f"GET /cars failed: {res.status_code}"
    cars = res.json()
    assert isinstance(cars, list), "/cars should return a list"
    assert len(cars) > 0, "Should have seeded cars"
    log(f"PASSED: Found {len(cars)} cars")

    # Test GET /cars/brand/:brand
    log("Testing GET /cars/brand/Ferrari...")
    res = requests.get(f"{BASE_URL}/cars/brand/Ferrari")
    assert res.status_code == 200, f"GET /cars/brand/Ferrari failed"
    ferraris = res.json()
    assert len(ferraris) >= 1, "Should have at least one Ferrari"
    log("PASSED: Ferrari filter works")

    # Test GET /customers
    log("Testing GET /customers...")
    res = requests.get(f"{BASE_URL}/customers")
    assert res.status_code == 200
    customers = res.json()
    assert len(customers) > 0, "Should have customers"
    customer_id = customers[0]['_id']
    log(f"PASSED: Found {len(customers)} customers")

    # Test GET /cars/availability
    log("Testing GET /cars/availability...")
    res = requests.get(f"{BASE_URL}/cars/availability")
    assert res.status_code == 200
    available = res.json()
    log(f"PASSED: Found {len(available)} available cars")

    # Test booking flow
    log("Testing POST /book-test-drive...")
    if available:
        car_id = available[0]['_id']
        res_sched = requests.get(f"{BASE_URL}/schedules/car/{car_id}")
        slots = res_sched.json()
        if slots:
            slot_id = slots[0]['_id']
            payload = {
                "customer_id": customer_id,
                "car_id": car_id,
                "slot_id": slot_id
            }
            res_book = requests.post(f"{BASE_URL}/book-test-drive", json=payload)
            assert res_book.status_code == 201, f"Booking failed: {res_book.text}"
            log("PASSED: Booking created successfully")
        else:
            log("SKIPPED: No available slots")
    else:
        log("SKIPPED: No available cars")

    # Test GET /customers/:id/history
    log("Testing GET /customers/:id/history...")
    res = requests.get(f"{BASE_URL}/customers/{customer_id}/history")
    assert res.status_code == 200
    log("PASSED: Customer history endpoint works")

    log("ALL API TESTS PASSED!")

if __name__ == "__main__":
    if not wait_for_api():
        log("API failed to start")
        sys.exit(1)
    try:
        test_endpoints()
    except AssertionError as e:
        log(f"FAILED: {e}")
        sys.exit(1)
