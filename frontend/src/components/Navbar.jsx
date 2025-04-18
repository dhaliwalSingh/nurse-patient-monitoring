import { jwtDecode } from "jwt-decode";

export default function Navbar({ token, onLogout, setView }) {
    const role = jwtDecode(token).role;

    return (
        <nav className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">🏥 Nurse-Patient App</h1>

            <div className="flex gap-4 items-center text-sm">
                {role === "nurse" && (
                    <>
                        <button onClick={() => setView("vitals")} className="hover:underline">Vitals</button>
                        <button onClick={() => setView("alerts")} className="hover:underline">Alerts</button>
                        <button onClick={() => setView("symptoms")} className="hover:underline">Symptoms</button>
                        <button onClick={() => setView("ai")} className="hover:underline">AI Suggestion</button>
                        <button onClick={() => setView("tips")} className="hover:underline">Tips</button>
                        <button onClick={() => setView("history")} className="hover:underline">History</button>
                    </>
                )}

                {role === "patient" && (
                    <>
                        <button onClick={() => setView("alert")} className="hover:underline">Emergency</button>
                        <button onClick={() => setView("symptom")} className="hover:underline">Symptoms</button>
                        <button onClick={() => setView("insight")} className="hover:underline">AI Advice</button>
                        <button onClick={() => setView("tips")} className="hover:underline">Tips</button>
                    </>
                )}

                <span className="bg-white text-blue-600 px-3 py-1 rounded">Role: {role}</span>

                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}