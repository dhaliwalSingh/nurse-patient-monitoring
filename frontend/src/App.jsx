import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
    const [view, setView] = useState("login");
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleLogin = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
        setView("dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setView("login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            {!token ? (
                <>
                    <div className="flex space-x-4 mb-6">
                        <button
                            className={`px-4 py-2 rounded ${view === "login" ? "bg-blue-600 text-white" : "bg-white border"}`}
                            onClick={() => setView("login")}
                        >
                            Login
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${view === "register" ? "bg-green-600 text-white" : "bg-white border"}`}
                            onClick={() => setView("register")}
                        >
                            Register
                        </button>
                    </div>

                    {view === "login" ? <LoginForm onLogin={handleLogin} /> : <RegisterForm />}
                </>
            ) : (
                <div className="flex flex-col items-center">
                    <Dashboard token={token} />
                    <button
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
