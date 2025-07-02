const { format } = require('@fast-csv/format');

function exportBookingsToCSV(bookings, res) {
  res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
  res.setHeader('Content-Type', 'text/csv');

  const csv = format({ headers: true });
  csv.pipe(res);
  bookings.forEach(b => {
    csv.write({
      ID: b.id,
      Name: b.name,
      Email: b.email,
      Reason: b.reason,
      Status: b.status,
      SlotID: b.slotId,
      Time: new Date(b.time).toLocaleString()
    });
  });
  csv.end();
}

module.exports = { exportBookingsToCSV };
