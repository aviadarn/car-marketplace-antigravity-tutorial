# 🚀 Building a Full-Stack App with Antigravity AI

> A step-by-step tutorial demonstrating how to use **Antigravity**, an AI-powered coding assistant, to build a complete luxury car marketplace application.

---

## 📖 What You'll Learn

This tutorial walks you through using Antigravity to:
1. **Scaffold a containerized full-stack application** (MongoDB, Flask API, React UI)
2. **Generate production-ready code** through natural language prompts
3. **Implement automated testing** (unit tests + E2E tests with Playwright)
4. **Debug and iterate** with AI-assisted problem solving

---

## 🎯 Project Overview

**Elite Drive** is a luxury car marketplace featuring:
- A React frontend with a premium dark theme
- A Flask REST API for vehicle inventory and bookings
- MongoDB for data persistence
- Playwright for end-to-end testing
- Full Docker containerization

---

## 🛠️ Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Antigravity](https://antigravity.dev) installed on your machine
- Basic familiarity with terminal commands

---

## 📚 Tutorial Steps

### Step 1: Initialize Your Project

Open Antigravity and create a new workspace. Start by prompting:

```
Create a docker-compose.yml for a full-stack app with:
- MongoDB database
- Flask API on port 5000
- React UI on port 3000
- Mongo Express for database management
```

**What Antigravity Does:**
- Generates a complete `docker-compose.yml` with proper service dependencies
- Sets up networking between containers
- Configures health checks and volume mounts

---

### Step 2: Build the Database Layer

Prompt Antigravity to seed your database:

```
Create a seed_db.py script that populates MongoDB with:
- Luxury cars (Ferrari, Porsche, Lamborghini, Mercedes)
- Customer profiles with Israeli names
- Available test drive schedules
```

**What Antigravity Does:**
- Creates a Python script with proper MongoDB connection handling
- Generates realistic sample data
- Sets up document relationships between collections

---

### Step 3: Develop the API

Ask Antigravity to build your REST endpoints:

```
Build a Flask API with these endpoints:
- GET /cars - list all vehicles
- GET /cars/brand/<brand> - filter by brand
- GET /schedules/car/<car_id> - available time slots
- POST /book-test-drive - create a booking
- GET /customers/<id>/history - booking history
```

**What Antigravity Does:**
- Generates a complete Flask application with CORS support
- Implements proper error handling
- Creates Dockerized deployment configuration

---

### Step 4: Create the Frontend

Prompt for a premium UI:

```
Build a React frontend with:
- Premium dark theme (deep blacks, silver accents, gold buttons)
- Card-based car gallery with filtering
- Booking modal with form validation
- Customer dashboard showing upcoming appointments
```

**What Antigravity Does:**
- Scaffolds React components with modern styling
- Implements responsive design
- Connects frontend to API endpoints

---

### Step 5: Add Automated Testing

Request comprehensive test coverage:

```
Create a /tests folder with:
- API unit tests using pytest/requests
- E2E tests using Playwright that verify:
  - Homepage loads correctly
  - Car gallery displays seeded data
  - Booking flow works end-to-end
  - Mobile responsiveness
```

**What Antigravity Does:**
- Sets up a Playwright-enabled test container
- Generates test cases covering critical user flows
- Configures test execution in Docker

---

## 🚦 Running the Application

```bash
# Build and start all services
docker-compose up --build -d

# Seed the database
docker compose exec api python seed_db.py

# Run API tests
docker compose exec api python test_endpoints.py

# Run E2E tests
docker compose run --rm test-runner npx playwright test
```

---

## 🌐 Accessing Services

| Service | URL |
|---------|-----|
| **UI** | http://localhost:3000 |
| **API** | http://localhost:5000 |
| **Mongo Express** | http://localhost:8081 |

---

## 💡 Tips for Using Antigravity Effectively

### Be Specific with Prompts
Instead of: *"Make a login page"*
Try: *"Create a login page with email/password fields, 'Remember Me' checkbox, and a 'Forgot Password' link. Use a dark theme with gradient background."*

### Iterate Incrementally
Build features one at a time. After each step, test the result before moving on.

### Let Antigravity Debug
When tests fail, share the error output with Antigravity:
```
The E2E test failed with: "Element not found: .car-card"
Fix the selector and re-run the test.
```

### Use Natural Language
Antigravity understands context. You can say things like:
- *"The booking modal isn't closing after submission—fix it"*
- *"Add loading spinners to all API calls"*
- *"Make the car cards look more premium"*

---

## 📁 Project Structure

```
elite-drive/
├── api/
│   ├── Dockerfile
│   ├── app.py
│   ├── seed_db.py
│   └── requirements.txt
├── ui/
│   ├── Dockerfile
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   └── package.json
├── tests/
│   ├── api_unit_test.py
│   └── ui_e2e_test.spec.js
├── docker-compose.yml
└── README.md
```

---

## 🎓 What's Next?

After completing this tutorial, try extending the app with Antigravity:
- Add user authentication with JWT tokens
- Implement real-time notifications with WebSockets
- Create an admin dashboard for inventory management
- Deploy to a cloud provider (AWS, GCP, or Azure)

---

## 📝 License

This tutorial project is open source and available under the MIT License.

---

*Built with ❤️ using [Antigravity](https://antigravity.dev)*
