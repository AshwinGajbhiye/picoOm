import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key"; // Change this to a secure key

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy users
const users = [
    { username: "admin", password: "password123" },
    { username: "user", password: "userpass" }
];

// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
});

// Flag Route
app.get("/flag", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    // Check User-Agent
    const userAgent = req.headers["user-agent"];
    
    if (userAgent !== "PicoBrowser") {
        return res.status(403).json({ message: "Change your User-Agent to 'PicoBrowser' and try again." });
    }

    res.json({ flag: "picoCTF{your_flag_here}" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
