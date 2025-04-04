const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Enable CORS for your frontend domain (localhost:5173)
const corsOptions = {
  origin: "https://www.trinai.in", // Allow your frontend origin
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.post("/send-email", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const mailOptions = {
    from: email, // User's email
    to: process.env.RECEIVER_EMAIL, // Your main email
    cc: process.env.CC_EMAIL, // Email that should receive a copy
    subject: `New Contact Form Submission: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Api working successfully",
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
