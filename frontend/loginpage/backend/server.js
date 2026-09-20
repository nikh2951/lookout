require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();

const PORT = 5050;


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(cors());

app.use(express.json());


/* =====================================================
   TEMPORARY OTP STORAGE
===================================================== */

const otpStore = new Map();


/* =====================================================
   EMAIL CONFIGURATION
===================================================== */

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_APP_PASSWORD

    }

});


/* =====================================================
   TEST EMAIL CONNECTION
===================================================== */

transporter.verify((error, success) => {

    if (error) {

        console.error(
            "Email configuration error:",
            error.message
        );

    } else {

        console.log(
            "Email server is ready."
        );

    }

});


/* =====================================================
   HOME / HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "LookOut backend is running!"

    });

});


/* =====================================================
   SEND OTP
===================================================== */

app.post("/api/send-otp", async (req, res) => {

    try {

        const email =
            req.body.email
                ?.trim()
                .toLowerCase();


        /* ================= VALIDATE EMAIL ================= */

        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Email address is required."

            });

        }


        /* ================= GENERATE OTP ================= */

        const otp =
            crypto
                .randomInt(
                    100000,
                    1000000
                )
                .toString();


        /* ================= CREATE TOKEN ================= */

        const token =
            crypto
                .randomBytes(32)
                .toString("hex");


        /* ================= EXPIRATION ================= */

        const expiresAt =
            Date.now() + 5 * 60 * 1000;


        /* ================= STORE OTP ================= */

        otpStore.set(
            token,
            {

                email: email,

                otp: otp,

                expiresAt: expiresAt

            }
        );


        /* ================= SEND EMAIL ================= */

        await transporter.sendMail({

            from:
                `"LookOut" <${process.env.EMAIL_USER}>`,

            to: email,

            subject:
                "Your LookOut Verification Code",

            text:
                `Your LookOut verification code is ${otp}. This code will expire in 5 minutes.`,

            html: `

                <div
                    style="
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    "
                >

                    <h2>
                        LookOut Verification
                    </h2>

                    <p>
                        Your verification code is:
                    </p>

                    <h1
                        style="
                            letter-spacing: 8px;
                        "
                    >
                        ${otp}
                    </h1>

                    <p>
                        This code will expire
                        in 5 minutes.
                    </p>

                    <p>
                        If you did not request
                        this code, you can ignore
                        this email.
                    </p>

                </div>

            `

        });


        /* ================= SUCCESS ================= */

        console.log(
            `OTP sent to ${email}`
        );


        res.json({

            success: true,

            message:
                "OTP sent successfully.",

            token: token

        });


    } catch (error) {

        console.error(
            "SEND OTP ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to send OTP."

        });

    }

});


/* =====================================================
   VERIFY OTP
===================================================== */

app.post("/api/verify-otp", (req, res) => {

    try {

        const email =
            req.body.email
                ?.trim()
                .toLowerCase();


        const otp =
            req.body.otp
                ?.trim();


        const token =
            req.body.token
                ?.trim();


        /* ================= VALIDATION ================= */

        if (
            !email ||
            !otp ||
            !token
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email, OTP and token are required."

            });

        }


        /* ================= FIND OTP ================= */

        const stored =
            otpStore.get(token);


        if (!stored) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP expired or invalid."

            });

        }


        /* ================= CHECK EXPIRATION ================= */

        if (
            Date.now() >
            stored.expiresAt
        ) {

            otpStore.delete(token);


            return res.status(400).json({

                success: false,

                message:
                    "OTP has expired. Please request a new OTP."

            });

        }


        /* ================= CHECK EMAIL ================= */

        if (
            stored.email !== email
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email does not match."

            });

        }


        /* ================= CHECK OTP ================= */

        if (
            stored.otp !== otp
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Incorrect OTP."

            });

        }


        /* ================= OTP VERIFIED ================= */

        otpStore.delete(token);


        console.log(
            `OTP verified for ${email}`
        );


        res.json({

            success: true,

            message:
                "OTP verified successfully."

        });


    } catch (error) {

        console.error(
            "VERIFY OTP ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to verify OTP."

        });

    }

});


/* =====================================================
   START SERVER
===================================================== */

app.listen(
    PORT,
    () => {

        console.log(
            `LookOut backend running at http://localhost:${PORT}`
        );

    }
);