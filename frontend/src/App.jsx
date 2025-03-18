import { useState } from "react";
import axios from "axios";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");
    const [flag, setFlag] = useState("");

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("http://localhost:3000/login", {
                username,
                password
            });

            setMessage(response.data.message);
            setToken(response.data.token);
        } catch (error) {
            setMessage("Login failed: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    // Handle Get Flag
    const handleGetFlag = async () => {
        setFlag("");

        try {
            const response = await axios.get("http://localhost:3000/flag", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "User-Agent": "Mozilla/5.0" // Default (Incorrect) User-Agent
                }
            });

            setFlag(response.data.flag);
        } catch (error) {
            setFlag(error.response?.data?.message || "Error fetching flag");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>PicoCTF Challenge</h2>

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ marginRight: "10px" }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ marginRight: "10px" }}
                />
                <button type="submit">Login</button>
            </form>

            <p>{message}</p>

            {/* Get Flag Button */}
            <button onClick={handleGetFlag} disabled={!token}>
                Get Flag
            </button>

            <p>{flag}</p>
        </div>
    );
}

export default App;
