import { jwtDecode } from "jwt-decode";
import EnterVitalsForm from "./EnterVitalsForm.jsx";

export default function Dashboard({ token }) {
    if (!token) return <p>Not logged in</p>;

    const decoded = jwtDecode(token);
    const role = decoded?.role;

    return (
        <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {role}</h2>
            {role === "nurse" && (
                <div>
                    <p className="mb-2">🩺 You can enter patient vitals, send tips, and analyze symptoms.</p>
                    <EnterVitalsForm/>
                </div>
            )}
            {role === "patient" && (
                <div>
                    <p className="mb-2">💊 You can submit symptoms, enter daily info, and send emergency alerts.</p>
                </div>
            )}
        </div>
    );
}