import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API = 'http://localhost:5000';
const socket = io(API);

export default function App() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', reason: '', slotId: '' });

  const fetchSlots = () => {
    axios.get(`${API}/slots`).then(res => {
      setSlots(res.data.filter(s => !s.booked));
    });
  };

  useEffect(() => {
    fetchSlots();
    socket.on('bookingUpdated', () => {
      fetchSlots();
    });

    return () => socket.off('bookingUpdated');
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${API}/book`, form);
    setForm({ name: '', email: '', reason: '', slotId: '' });
    alert('Booking successful!');
  } catch (err) {
    alert(`${err.response?.data?.error || 'Error occurred'}`);
  }
};


  return (
    <div>
      <h1>Book Appointment</h1>
      <form onSubmit={handleSubmit}>
        <select value={form.slotId} onChange={e => setForm({ ...form, slotId: e.target.value })} required>
          <option value="">-- Select Slot --</option>
          {slots.map(slot => (
            <option key={slot.id} value={slot.id}>
              {new Date(slot.time).toLocaleString()}
            </option>
          ))}
        </select>
        <input placeholder="Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Reason" required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
        <button type="submit">Book</button>
      </form>
    </div>
  );
}
