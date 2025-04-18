import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

const GET_PATIENT_INSIGHT = gql`
    query {
        getPatientSymptomInsight
    }
`;

export default function AISuggestionForPatient() {
    const [getInsight, { data, loading, error }] = useLazyQuery(GET_PATIENT_INSIGHT);
    const [fetched, setFetched] = useState(false);

    const handleFetch = () => {
        getInsight();
        setFetched(true);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-4 text-green-700">🤖 AI Symptom Insights</h3>

            <button
                onClick={handleFetch}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            >
                Get Friendly Advice
            </button>

            {loading && <p className="mt-4 text-green-600">Analyzing your symptoms...</p>}
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
            {fetched && !loading && !error && (
                <div className="mt-4 bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {data?.getPatientSymptomInsight}
                </div>
            )}
        </div>
    );
}