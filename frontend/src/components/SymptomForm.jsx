import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const ADD_SYMPTOM = gql`
    mutation AddSymptom($descriptions: [String!]!) {
        addSymptom(descriptions: $descriptions)
    }
`;

const GET_MY_SYMPTOMS = gql`
    query GetMySymptoms {
        getMySymptoms {
            id
            description
            createdAt
        }
    }
`;

const checklistOptions = [
    "Fever or chills",
    "Cough",
    "Shortness of breath",
    "Fatigue",
    "Muscle or body aches",
    "Headache",
    "Loss of taste or smell",
    "Sore throat",
    "Congestion or runny nose",
    "Nausea or vomiting",
    "Diarrhea",
];

export default function SymptomForm() {
    const [freeText, setFreeText] = useState("");
    const [checked, setChecked] = useState([]);

    const [addSymptom] = useMutation(ADD_SYMPTOM, {
        refetchQueries: [{ query: GET_MY_SYMPTOMS }],
    });

    const { data, loading, error } = useQuery(GET_MY_SYMPTOMS);

    const handleCheckboxChange = (e) => {
        const { value, checked: isChecked } = e.target;
        setChecked((prev) =>
            isChecked ? [...prev, value] : prev.filter((symptom) => symptom !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const descriptions = [...checked];
        if (freeText.trim()) descriptions.push(freeText.trim());

        if (descriptions.length === 0)
            return alert("Please select or write a symptom.");

        await addSymptom({ variables: { descriptions } });
        setFreeText("");
        setChecked([]);
        alert("✅ Symptoms submitted");
    };

    return (
        <div className="space-y-6">
            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow space-y-4 border"
            >
                <h3 className="text-xl font-semibold">😷 Report Your Symptoms</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {checklistOptions.map((symptom, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                value={symptom}
                                checked={checked.includes(symptom)}
                                onChange={handleCheckboxChange}
                                className="accent-blue-600"
                            />
                            {symptom}
                        </label>
                    ))}
                </div>

                <textarea
                    className="w-full border rounded p-2 mt-4"
                    rows="3"
                    value={freeText}
                    onChange={(e) => setFreeText(e.target.value)}
                    placeholder="Anything else you want to describe?"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </form>

            {/* Submitted Symptoms Viewer */}
            <div className="bg-white p-6 rounded shadow border border-blue-100">
                <h3 className="text-lg font-semibold mb-4">📋 Your Submitted Symptoms</h3>

                {loading && <p className="text-blue-600">Loading symptoms...</p>}
                {error && <p className="text-red-500">Error loading symptoms</p>}

                {data?.getMySymptoms?.length ? (
                    <ul className="space-y-3">
                        {data.getMySymptoms.map((s) => (
                            <li
                                key={s.id}
                                className="p-3 rounded bg-gray-100 text-sm text-gray-800"
                            >
                                <p>{s.description}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(+s.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p className="text-gray-500">No symptoms submitted yet.</p>
                )}
            </div>
        </div>
    );
}