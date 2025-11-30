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

// FIXED LOGIN
const LOGIN_ID = "montimahur882";
const LOGIN_PASS = "montimahur882";

app.post("/login", (req, res) => {
    const { id, password } = req.body;
    return res.json({ success: id === LOGIN_ID && password === LOGIN_PASS });
});

// FAST SENDER
app.post("/send", async (req, res) => {
    const { fromName, gmail, appPass, subject, body, to } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: { user: gmail, pass: appPass }
        });

        await transporter.sendMail({
            from: `${fromName} <${gmail}>`,
            to,
            subject,
            text: body
        });

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});

app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "login.html"))
);

app.listen(3000, () => console.log("Server running on 3000"));
