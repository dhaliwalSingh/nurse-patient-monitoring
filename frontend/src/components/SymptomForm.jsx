// src/components/SymptomForm.jsx
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const ADD_SYMPTOM = gql`
    mutation AddSymptom($description: String!) {
        addSymptom(description: $description) {
            id
            description
            createdAt
        }
    }
`;

export default function SymptomForm() {
    const [description, setDescription] = useState("");
    const [addSymptom] = useMutation(ADD_SYMPTOM);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description) return;
        await addSymptom({ variables: { description } });
        setDescription("");
        alert("✅ Symptom submitted");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
            <h3 className="text-xl font-semibold">📝 Describe Your Symptoms</h3>
            <textarea
                className="w-full border rounded p-2"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., headache, cough, chest pain..."
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Submit
            </button>
        </form>
    );
}