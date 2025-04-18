import { jwtDecode } from "jwt-decode";
import { gql, useQuery } from "@apollo/client";
import EnterVitalsForm from "./EnterVitalsForm.jsx";
import EmergencyAlertForm from "./EmergencyAlertForm.jsx";
import CreateTipForm from "./CreateTipForm.jsx";
import TipsList from "./TipsList.jsx";
import VitalsHistory from "./VitalsHistory.jsx";
import Navbar from "./Navbar.jsx";
import EmergencyAlertList from "./EmergencyAlertList.jsx";
import SymptomForm from "./SymptomForm.jsx";
import SymptomsViewer from "./SymptomsViewer.jsx";
import AISuggestionForNurse from "./AISuggestionForNurse";
import AISuggestionForPatient from "./AISuggestionForPatient.jsx";

const GET_USERS = gql`
    query GetUsers {
        getUsers {
            id
            username
            email
        }
    }
`;

export default function Dashboard({ token }) {
    const decoded = token ? jwtDecode(token) : null;
    const role = decoded?.role;

    const { data: patientsData, loading: patientsLoading } = useQuery(GET_USERS, {
        skip: !token || role !== "nurse", // ✅ avoid query for non-nurse or no token
    });

    if (!token) {
        return <p className="text-center mt-10 text-red-600">Not logged in</p>;
    }

    return (
        <>
            <Navbar token={token} setView={() => window.location.reload()} />

            <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-8">Welcome, {role}</h2>

                {role === "nurse" && (
                    <div className="space-y-10 w-full max-w-2xl">
                        <section className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">🩺 Enter Patient Vitals</h3>
                            <EnterVitalsForm />
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">🧠 AI Suggestion</h3>
                            <AISuggestionForNurse patients={patientsData?.getUsers || []} />
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">🚨 Emergency Alerts</h3>
                            <EmergencyAlertList />
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">😷 View Patient Symptoms</h3>
                            {patientsLoading ? (
                                <p>Loading patient list...</p>
                            ) : (
                                <SymptomsViewer patients={patientsData?.getUsers || []} />
                            )}
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">📢 Send Daily Tips</h3>
                            <CreateTipForm />
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">📊 Vitals History</h3>
                            {patientsLoading ? (
                                <p>Loading patient list...</p>
                            ) : (
                                <VitalsHistory patients={patientsData?.getUsers || []} />
                            )}
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
                            <h3 className="text-xl font-semibold mb-4">😷 Enter Symptoms</h3>
                            <SymptomForm />
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">🧠 Get Personalized Symptom Advice</h3>
                            <AISuggestionForPatient />
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">💬 Daily Motivational Tips</h3>
                            <TipsList />
                        </section>
                    </div>
                )}
            </div>
        </>
    );
}