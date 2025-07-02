import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API = 'http://localhost:5000';
const socket = io(API);

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');

  const fetchBookings = () => {
    const url = filter ? `${API}/bookings?status=${filter}` : `${API}/bookings`;
    axios.get(url).then(res => setBookings(res.data));
  };

  useEffect(() => {
    fetchBookings();
    socket.on('bookingUpdated', () => {
      fetchBookings();
      console.log('Booking updated!');
    });
    return () => socket.off('bookingUpdated');
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/booking/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error('Failed to update booking:', err);
    }
  };

  const downloadCSV = () => {
    window.open(`${API}/bookings/export`, '_blank');
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <button onClick={() => setFilter('')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('approved')}>Approved</button>
        <button onClick={() => setFilter('denied')}>Denied</button>
        <button onClick={downloadCSV}>📥 Download CSV</button>
      </div>

      {bookings.map(b => (
        <div key={b.id} style={{ border: '1px solid gray', margin: 10, padding: 10 }}>
          <p>
            <b>{b.name}</b> | {b.email}<br />
            Reason: {b.reason}<br />
            Slot ID: {b.slotId}<br />
            Status: <b>{b.status}</b><br />
            Slot Time: <b>{new Date(b.time).toLocaleString()}</b>
          </p>
          {b.status === 'pending' && (
            <>
              <button onClick={() => updateStatus(b.id, 'approved')}>Approve</button>
              <button onClick={() => updateStatus(b.id, 'denied')}>Deny</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
