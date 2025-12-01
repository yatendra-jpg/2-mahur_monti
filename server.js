require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(process.cwd(), "public");

// HARD LOGIN (username = password)
const HARD_USERNAME = "montimahur882";
const HARD_PASSWORD = "montimahur882";

// MIDDLEWARE
app.use(bodyParser.json());
app.use(express.static(PUBLIC_DIR));

app.use(
  session({
    secret: "launcher-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  })
);

// LOGIN REQUIRED
function auth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/");
}

// LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === HARD_USERNAME && password === HARD_PASSWORD) {
    req.session.user = username;
    return res.json({ success: true });
  }

  res.json({ success: false, message: "❌ Invalid credentials" });
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

// PAGES
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "login.html"));
});

app.get("/launcher", auth, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "launcher.html"));
});

// SAFE SERVER START
app.listen(PORT, () => {
  console.log(`SAFE server running on port ${PORT}`);
});
