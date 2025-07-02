const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your-app-password'
  }
});

async function sendBookingConfirmation({ name, email, time }) {
  const formattedTime = new Date(time).toLocaleString();

  const mailOptions = {
    from: 'your.email@gmail.com',
    to: email,
    subject: 'Appointment Confirmation',
    text: `Hi ${name},\n\nYour appointment is confirmed for ${formattedTime}.\n\nThanks!`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

module.exports = { sendBookingConfirmation };
