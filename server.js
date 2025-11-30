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
const LOGIN_ID = "yourloginid";
const LOGIN_PASS = "yourloginpass";

// SAFE RATE LIMITING (NO SPAM)
let sentHistory = {};

function canSend(gmail) {
    const now = Date.now();

    if (!sentHistory[gmail]) {
        sentHistory[gmail] = { count: 0, reset: now + 3600000 };
    }

    if (now > sentHistory[gmail].reset) {
        sentHistory[gmail] = { count: 0, reset: now + 3600000 };
    }

    return sentHistory[gmail].count < 30;
}

app.post("/login", (req, res) => {
    res.json({
        success: req.body.id === LOGIN_ID && req.body.password === LOGIN_PASS
    });
});

app.post("/send", async (req, res) => {
    const { fromName, gmail, appPass, subject, body, to } = req.body;

    if (!canSend(gmail)) {
        return res.json({ limit: true });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: gmail, pass: appPass }
        });

        await transporter.sendMail({
            from: `${fromName} <${gmail}>`,
            to,
            subject,
            text: body
        });

        sentHistory[gmail].count++;
        res.json({ success: true });

    } catch {
        res.json({ success: false });
    }
});

app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "public/login.html"))
);

app.listen(3000, () => console.log("SAFE MAIL SERVER RUNNING"));
