import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

const GET_USERS = gql`
    query GetUsers {
        getUsers {
            id
            username
            email
        }
    }
`;

const GET_VITALS = gql`
    query GetVitalsByPatient($patientId: ID!) {
        getVitalsByPatient(patientId: $patientId) {
            temperature
            heartRate
            bloodPressure
            respiratoryRate
            createdAt
        }
    }
`;

export default function VitalsHistory() {
    const [selectedPatient, setSelectedPatient] = useState("");
    const { data: userData } = useQuery(GET_USERS);
    const { data: vitalsData, refetch } = useQuery(GET_VITALS, {
        variables: { patientId: selectedPatient },
        skip: !selectedPatient,
    });

    useEffect(() => {
        if (selectedPatient) {
            refetch();
        }
    }, [selectedPatient]);

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
            <h2 className="text-xl font-bold mb-4">📊 Vitals History</h2>
            <select
                className="w-full p-2 border rounded mb-4"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
            >
                <option value="">Select Patient</option>
                {userData?.getUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                    </option>
                ))}
            </select>

            {vitalsData?.getVitalsByPatient?.length > 0 ? (
                <ul className="space-y-2">
                    {vitalsData.getVitalsByPatient.map((v, i) => (
                        <li key={i} className="border p-3 rounded bg-gray-50">
                            <p>🌡 Temp: {v.temperature}°C</p>
                            <p>❤️ Heart Rate: {v.heartRate} bpm</p>
                            <p>🩸 BP: {v.bloodPressure}</p>
                            <p>💨 Resp: {v.respiratoryRate}</p>
                            <p className="text-sm text-gray-500">
                                🕒 {new Date(Number(v.createdAt)).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                selectedPatient && <p className="text-gray-600">No vitals found.</p>
            )}
        </div>
    );
}
