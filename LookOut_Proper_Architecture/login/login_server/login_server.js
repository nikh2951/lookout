const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());


/* =========================
   OTP STORAGE
========================= */

const otpStore = new Map();


/* =========================
   MAIL TRANSPORTER
========================= */

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


/* =========================
   GENERATE OTP
========================= */

function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}


/* =========================
   GENERATE TOKEN
========================= */

function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}


/* =========================
   SEND OTP
========================= */

app.post("/api/send-otp", async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }


        /* Generate OTP */

        const otp = generateOTP();

        const token = generateToken();


        /* OTP expires after 5 minutes */

        const expiresAt = Date.now() + 5 * 60 * 1000;


        /* Save OTP */

        otpStore.set(email.toLowerCase(), {
            otp,
            token,
            expiresAt,
            attempts: 0
        });


        /* Email */

        await transporter.sendMail({

            from: `"LookOut" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "LookOut Login OTP",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    background: #f5f7fb;
                ">

                    <div style="
                        max-width: 500px;
                        margin: auto;
                        background: white;
                        padding: 30px;
                        border-radius: 18px;
                    ">

                        <h2 style="margin-top:0;">
                            LookOut Login
                        </h2>

                        <p>
                            Your One-Time Password is:
                        </p>

                        <div style="
                            font-size: 36px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            padding: 20px;
                            text-align: center;
                            background: #f1f3f7;
                            border-radius: 12px;
                        ">
                            ${otp}
                        </div>

                        <p>
                            This OTP is valid for
                            <strong>5 minutes</strong>.
                        </p>

                        <p style="
                            color: #777;
                            font-size: 13px;
                        ">
                            If you did not request this OTP,
                            you can safely ignore this email.
                        </p>

                    </div>

                </div>
            `
        });


        console.log(`OTP sent to ${email}`);


        return res.json({
            success: true,
            message: "OTP sent successfully",
            token
        });

    } catch (error) {

        console.error("SEND OTP ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
});


/* =========================
   VERIFY OTP
========================= */

app.post("/api/verify-otp", async (req, res) => {

    try {

        const {
            email,
            otp,
            token
        } = req.body;


        if (!email || !otp || !token) {

            return res.status(400).json({
                success: false,
                message: "Email, OTP and token are required"
            });
        }


        const key = email.toLowerCase();

        const record = otpStore.get(key);


        /* No OTP */

        if (!record) {

            return res.status(400).json({
                success: false,
                message: "OTP expired or not found"
            });
        }


        /* Check expiration */

        if (Date.now() > record.expiresAt) {

            otpStore.delete(key);

            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }


        /* Check token */

        if (token !== record.token) {

            return res.status(401).json({
                success: false,
                message: "Invalid verification token"
            });
        }


        /* Check OTP */

        if (otp !== record.otp) {

            record.attempts++;

            if (record.attempts >= 5) {

                otpStore.delete(key);

                return res.status(429).json({
                    success: false,
                    message: "Too many incorrect attempts"
                });
            }

            return res.status(401).json({
                success: false,
                message: "Wrong OTP"
            });
        }


        /* Successful verification */

        otpStore.delete(key);


        return res.json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {

        console.error("VERIFY OTP ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP"
        });
    }
});


/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "LookOut OTP server is running"
    });

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

    console.log("=================================");
    console.log(" LookOut OTP Backend");
    console.log("=================================");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`API:    http://localhost:${PORT}/api`);
    console.log("=================================");

});