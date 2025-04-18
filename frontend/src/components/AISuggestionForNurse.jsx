import { useLazyQuery, gql } from "@apollo/client";
import { useState } from "react";

const GET_AI_SUGGESTION = gql`
    query GetAISuggestion($patientId: ID!) {
        getAISuggestion(patientId: $patientId)
    }
`;

export default function AISuggestionForNurse({ patients }) {
    const [selectedPatient, setSelectedPatient] = useState("");
    const [getSuggestion, { data, loading, error }] = useLazyQuery(GET_AI_SUGGESTION);

    const handleFetch = () => {
        if (selectedPatient) {
            getSuggestion({ variables: { patientId: selectedPatient } });
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
            <h3 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
                🧠 AI Health Suggestion
            </h3>

            <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full focus:ring focus:ring-blue-200"
            >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.username} ({p.email})
                    </option>
                ))}
            </select>

            <button
                onClick={handleFetch}
                disabled={!selectedPatient}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
                Get Suggestion
            </button>

            {loading && <p className="mt-4 text-blue-500 font-medium">Fetching AI insights...</p>}
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}

            {data?.getAISuggestion && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {data.getAISuggestion.replace(/\*\*/g, "")}
                </div>
            )}
        </div>
    );
}