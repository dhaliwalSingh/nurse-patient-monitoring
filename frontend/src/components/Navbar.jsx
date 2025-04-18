import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar({ token, onLogout, setView }) {
    const role = token ? jwtDecode(token).role : "guest";
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout?.(); // optional callback for App
        navigate("/");
        setView("login");
    };

    return (
        <nav className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">🏥 Nurse-Patient App</h1>

            <div className="flex gap-4 items-center text-sm">
                {role === "nurse" && (
                    <>
                        <button className="hover:underline" onClick={() => window.scrollTo(0, 0)}>
                            Vitals
                        </button>
                        <button className="hover:underline" onClick={() => window.scrollTo(0, document.body.scrollHeight / 3)}>
                            Tips
                        </button>
                        <button className="hover:underline" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                            History
                        </button>
                    </>
                )}

                {role === "patient" && (
                    <>
                        <button className="hover:underline" onClick={() => window.scrollTo(0, 0)}>
                            Emergency
                        </button>
                        <button className="hover:underline" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                            Tips
                        </button>
                    </>
                )}

                <span className="bg-white text-blue-600 px-3 py-1 rounded">
                    Role: {role}
                </span>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
