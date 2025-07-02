# 📅 Appointment Booking App

A full-stack appointment booking system with real-time updates, email confirmation, CSV export, and separate interfaces for customers and business admins.

---

## 🚀 Features Implemented

### ✅ 1. Customer Side

* View available appointment slots (M–F, 9am–5pm, 30-min intervals)
* Book a single slot (Name, Email, Reason)
* Prevent double-booking (slot can't be booked twice)
* Clear feedback on booking success or failure

### ✅ 2. Admin (Client) Side

* View all booked appointments
* Approve or deny each booking (default: `pending`)
* Denied bookings become re-bookable
* Filter bookings by status: `pending`, `approved`, `denied`
* Download bookings as a `.csv` file
* Real-time auto-refresh via WebSockets

### ✅ 3. Backend API

* `GET /slots`: List available time slots
* `POST /book`: Book a slot
* `PUT /booking/:id/status`: Approve/Deny a booking
* `GET /bookings`: List all bookings (with optional status filter)
* `GET /bookings/export`: Export bookings as CSV
* Proper error handling for:

  * Missing fields
  * Invalid slot
  * Already-booked slot

### ✅ 4. Extras

* 📧 **Email Confirmation** using `nodemailer`
* 📁 **CSV Export** for client download
* 🔄 **Live Updates** using `Socket.IO` (auto refresh for both customer & admin)

---

## ⚙️ How to Run the App Locally

### 🧾 Step-by-step Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/appointment-booking-app.git
cd appointment-booking-app
```

```bash
# 2. Start the backend
cd backend
npm install
node server.js
```

```bash
# 3. Start the Customer Frontend
cd ../frontend/customer
npm install
npm start
```

```bash
# 4. Start the Admin (Client) Frontend
cd ../client
npm install
npm start
```

---

## 🗂️ Project Structure

```
appointment-booking-app/
│
├── backend/
│   ├── db.json                  # Local database (slots + bookings)
│   ├── server.js                # Express API + slot generation
│   ├── socket.js                # Socket.IO server + event broadcast
│   ├── utils/
│   │   ├── exportCSV.js         # CSV export helper
│   │   └── email.js             # Email sending helper (nodemailer)
│
├── frontend/
│   ├── customer/                # Customer-facing React UI
│   └── client/                  # Admin-facing React UI
```

---

## 📁 Folder-by-Folder Breakdown

### 🔙 `backend/`

Node.js + Express API server.

* 📄 **`server.js`**

  * Sets up REST API routes
  * Handles booking logic & slot validation
  * Emits live updates via Socket.IO
  * Sends confirmation emails

* 📄 **`db.json`**

  * JSON file used as local data storage (simulated DB)

* 📄 **`socket.js`**

  * Initializes Socket.IO
  * Broadcasts changes to frontend apps

* 📁 **`utils/`**

  * `exportCSV.js`: Exports bookings to `.csv`
  * `email.js`: Sends booking confirmation emails

---

### 🖥️ `frontend/`

#### 📁 `customer/` (React)

> User-facing app to browse and book slots

* Displays available slots
* Submits bookings
* Shows real-time updates when slots are taken

#### 📁 `client/` (React)

> Admin-facing app to manage bookings

* Lists all bookings
* Allows Approve / Deny actions
* Filters by status
* Exports `.csv` of all bookings
* Auto-refreshes on new booking or status change

---

## 🔗 Tech Stack

* **Frontend**: React, Axios, Socket.IO-client
* **Backend**: Node.js, Express, Socket.IO, Nodemailer
* **Storage**: JSON file (simulated DB)
* **Extras**: CSV generation, Live updates

---

## 🧪 Future Improvements

* Calendar view for slots
* Admin login (optional)
* Slot duration customization
* Persistent DB (e.g., SQLite or MongoDB)

---

## 🙌 Acknowledgements

Built as a hands-on full-stack project to demonstrate:

* Real-time systems (Socket.IO)
* Client-server communication
* Basic admin/customer flows
* Nodemailer & CSV generation in Node.js

---
