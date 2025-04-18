import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

const GET_SYMPTOMS = gql`
    query GetSymptomsByPatient($patientId: ID!) {
        getSymptomsByPatient(patientId: $patientId) {
            id
            description
            createdAt
        }
    }
`;

export default function SymptomsViewer({ patients }) {
    const [selectedPatient, setSelectedPatient] = useState("");
    const [getSymptoms, { data, loading, error }] = useLazyQuery(GET_SYMPTOMS);

    const handlePatientSelect = (e) => {
        const id = e.target.value;
        setSelectedPatient(id);
        getSymptoms({ variables: { patientId: id } });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">📝 View Patient Symptoms</h3>

            <select
                onChange={handlePatientSelect}
                value={selectedPatient}
                className="border rounded p-2 mb-4 w-full"
            >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.username} ({p.email})
                    </option>
                ))}
            </select>

            {loading && <p>Loading symptoms...</p>}
            {error && <p className="text-red-500">Error loading symptoms</p>}

            {data?.getSymptomsByPatient?.length > 0 ? (
                <ul className="space-y-2">
                    {data.getSymptomsByPatient.map((symptom) => (
                        <li
                            key={symptom.id}
                            className="bg-gray-100 p-4 rounded text-sm text-gray-700"
                        >
                            <p>{symptom.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(+symptom.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                selectedPatient && <p>No symptoms submitted.</p>
            )}
        </div>
    );
}