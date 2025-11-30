import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SAFE LOGIN
const LOGIN_ID = "montimahur882@#";
const LOGIN_PASS = "montimahur882@#";

app.post("/login", (req, res) => {
    const { id, password } = req.body;
    if (id === LOGIN_ID && password === LOGIN_PASS) {
        return res.json({ success: true });
    }
    res.json({ success: false });
});

// SAFE SINGLE MAIL SENDER (Legal)
app.post("/send", async (req, res) => {
    const { fromName, gmail, appPass, subject, body, to } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: gmail,
                pass: appPass
            }
        });

        await transporter.sendMail({
            from: `${fromName} <${gmail}>`,
            to,
            subject,
            text: body + "\n\n📩 Secure — www.avast.com"
        });

        return res.json({ success: true });

    } catch (err) {
        return res.json({ success: false, message: "INVALID" });
    }
});

app.listen(3000, () => console.log("SAFE MAIL SERVER RUNNING"));
