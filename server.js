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

// PER EMAIL-ID LIMIT (SAFE)
let limits = {};  

function checkLimit(email) {
    const now = Date.now();

    if (!limits[email]) {
        limits[email] = { count: 0, reset: now + 3600000 };
    }

    if (now > limits[email].reset) {
        limits[email] = { count: 0, reset: now + 3600000 };
    }

    return limits[email].count < 30;
}

app.post("/login", (req, res) => {
    res.json({
        success: req.body.id === LOGIN_ID && req.body.password === LOGIN_PASS
    });
});

app.post("/send", async (req, res) => {
    const { fromName, gmail, appPass, subject, body, to } = req.body;

    if (!checkLimit(gmail)) {
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

        limits[gmail].count++;
        res.json({ success: true });

    } catch (e) {
        res.json({ success: false });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

app.listen(3000, () => console.log("SERVER RUNNING 3000"));
