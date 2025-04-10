import { jwtDecode } from "jwt-decode";
import EnterVitalsForm from "./EnterVitalsForm.jsx";
import EmergencyAlertForm from "./EmergencyAlertForm.jsx";
import CreateTipForm from "./CreateTipForm.jsx";
import TipsList from "./TipsList.jsx";

export default function Dashboard({ token }) {
    if (!token) return <p className="text-center mt-10 text-red-600">Not logged in</p>;

    const decoded = jwtDecode(token);
    const role = decoded?.role;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8">Welcome, {role}</h2>

            {role === "nurse" && (
                <div className="space-y-10 w-full max-w-2xl">
                    <section className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">🩺 Enter Patient Vitals</h3>
                        <EnterVitalsForm />
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">📢 Send Daily Tips</h3>
                        <CreateTipForm />
                    </section>
                </div>
            )}

            {role === "patient" && (
                <div className="space-y-10 w-full max-w-2xl">
                    <section className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">🚨 Emergency Alert</h3>
                        <EmergencyAlertForm />
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">💬 Daily Motivational Tips</h3>
                        <TipsList />
                    </section>
                </div>
            )}
        </div>
    );
}
