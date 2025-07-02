const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const path = require('path');
const http = require('http');
const { exportBookingsToCSV } = require('./utils/exportCSV');
const { sendBookingConfirmation } = require('./utils/email');
const { initSocket, emitBookingUpdate } = require('./socket');

const app = express();
const server = http.createServer(app);
initSocket(server);

const PORT = 5000;
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Generate weekly slots if empty
const generateWeeklySlots = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const slots = [];
  const now = new Date();
  const startOfWeek = now.getDate() - now.getDay() + 1;

  days.forEach((_, i) => {
    const date = new Date();
    date.setDate(startOfWeek + i);
    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, min, 0, 0);
        slots.push({
          id: uuid(),
          time: slotTime.toISOString(),
          booked: false
        });
      }
    }
  });

  return slots;
};

const db = readDB();
if (db.slots.length === 0) {
  db.slots = generateWeeklySlots();
  writeDB(db);
  console.log('Slots seeded.');
}

// Routes
app.get('/slots', (req, res) => {
  const db = readDB();
  res.json(db.slots);
});

app.post('/book', (req, res) => {
  const { slotId, name, email, reason } = req.body;
  if (!slotId || !name || !email || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDB();
  const slot = db.slots.find(s => s.id === slotId);
  if (!slot) return res.status(404).json({ error: 'Slot not found' });
  if (slot.booked) return res.status(409).json({ error: 'Slot already booked' });

  slot.booked = true;
db.bookings.push({
  id: uuid(),
  slotId,
  name,
  email,
  reason,
  status: 'pending',
  time: slot.time 
});

  writeDB(db);
  emitBookingUpdate();
  console.log(`📧 Booking made: ${email} @ ${slot.time}`);
  res.json({ message: 'Booking successful' });
});

app.get('/bookings', (req, res) => {
  const db = readDB();
  const { status } = req.query;
  const bookings = status ? db.bookings.filter(b => b.status === status) : db.bookings;
  res.json(bookings);
});

app.put('/booking/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDB();
  const booking = db.bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = status;
  if (status === 'denied') {
    const slot = db.slots.find(s => s.id === booking.slotId);
    if (slot) slot.booked = false;
  }
   if (status === 'approved') {
    console.log(booking);
    sendBookingConfirmation(booking)
  }

  writeDB(db);
  emitBookingUpdate();
  res.json({ message: `Booking ${status}` });
});

app.get('/bookings/export', (req, res) => {
  const db = readDB();
  exportBookingsToCSV(db.bookings, res);
});

server.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
