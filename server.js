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

// LOGIN FIX
const LOGIN_ID = "montimahur882";
const LOGIN_PASS = "montimahur882";

// EMAIL HOURLY LIMIT
let sentCount = 0;
let resetTime = Date.now() + 3600000;

function allowed() {
    if (Date.now() > resetTime) {
        sentCount = 0;
        resetTime = Date.now() + 3600000;
    }
    return sentCount < 31;
}

app.post("/login", (req, res) => {
    res.json({
        success: req.body.id === LOGIN_ID && req.body.password === LOGIN_PASS
    });
});

app.post("/send", async (req, res) => {
    if (!allowed()) return res.json({ limit: true });

    const { fromName, gmail, appPass, subject, body, to } = req.body;

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

        sentCount++;
        res.json({ success: true });
    }
    catch {
        res.json({ success: false });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

app.listen(3000, () => console.log("SERVER RUNNING 3000"));
