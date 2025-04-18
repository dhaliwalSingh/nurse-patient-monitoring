import { useState } from "react";
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

export default function Dashboard({ token, onLogout }) {
    const [currentView, setCurrentView] = useState("home");
    const decoded = jwtDecode(token);
    const role = decoded?.role;

    const { data: patientsData, loading: patientsLoading } = useQuery(GET_USERS, {
        skip: role !== "nurse",
    });

    return (
        <>
            <Navbar token={token} onLogout={onLogout} setView={setCurrentView} />

            <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-8">Welcome, {role}</h2>

                {role === "nurse" && (
                    <div className="w-full max-w-2xl space-y-8">
                        {currentView === "vitals" && <EnterVitalsForm />}
                        {currentView === "alerts" && <EmergencyAlertList />}
                        {currentView === "tips" && <CreateTipForm />}
                        {currentView === "symptoms" &&
                            (patientsLoading ? (
                                <p>Loading patient list...</p>
                            ) : (
                                <SymptomsViewer patients={patientsData?.getUsers || []} />
                            ))}
                        {currentView === "ai" && (
                            <AISuggestionForNurse patients={patientsData?.getUsers || []} />
                        )}
                        {currentView === "history" &&
                            (patientsLoading ? (
                                <p>Loading patient list...</p>
                            ) : (
                                <VitalsHistory patients={patientsData?.getUsers || []} />
                            ))}
                    </div>
                )}

                {role === "patient" && (
                    <div className="w-full max-w-2xl space-y-8">
                        {currentView === "alert" && <EmergencyAlertForm />}
                        {currentView === "symptom" && <SymptomForm />}
                        {currentView === "insight" && <AISuggestionForPatient />}
                        {currentView === "tips" && <TipsList />}
                    </div>
                )}
            </div>
        </>
    );
}