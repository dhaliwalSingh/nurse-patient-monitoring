import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
    const [view, setView] = useState("login");

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
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

            {view === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
    );
}

export default App;