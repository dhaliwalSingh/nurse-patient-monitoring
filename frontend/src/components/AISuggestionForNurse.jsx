import { useLazyQuery, gql } from "@apollo/client";
import { useState } from "react";

const GET_AI_SUGGESTION = gql`
    query GetAISuggestion($patientId: ID!) {
        getAISuggestion(patientId: $patientId)
    }
`;

export default function AISuggestionForNurse({ patients }) {
    const [selectedPatient, setSelectedPatient] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const [getSuggestion, { loading, error }] = useLazyQuery(GET_AI_SUGGESTION, {
        onCompleted: (data) => {
            setChatHistory((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: data.getAISuggestion.replace(/\*\*/g, ""),
                },
            ]);
        },
    });

    const handleInitialFetch = () => {
        if (!selectedPatient) return;
        const selected = patients.find((p) => p.id === selectedPatient);
        setChatHistory([
            {
                sender: "nurse",
                text: `Can you give health advice for ${selected.username} (${selected.email})?`,
            },
        ]);
        getSuggestion({ variables: { patientId: selectedPatient } });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-6 text-blue-800">🧠 AI Health Suggestion</h3>

            <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="border rounded-md px-4 py-2 mb-4 w-full"
            >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.username} ({p.email})
                    </option>
                ))}
            </select>

            <button
                onClick={handleInitialFetch}
                disabled={!selectedPatient}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition w-full"
            >
                Get Suggestion
            </button>

            <div className="mt-6 max-h-96 overflow-y-auto space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${
                            msg.sender === "nurse"
                                ? "bg-blue-100 text-left"
                                : "bg-green-100 text-left"
                        }`}
                    >
                        {msg.text.split("\n").map((line, idx) => (
                            <p key={idx} className="mb-2">{line}</p>
                        ))}
                    </div>
                ))}
                {loading && <p className="text-blue-600 font-medium animate-pulse">AI is thinking...</p>}
                {error && <p className="text-red-500">Error: {error.message}</p>}
            </div>
        </div>
    );
}