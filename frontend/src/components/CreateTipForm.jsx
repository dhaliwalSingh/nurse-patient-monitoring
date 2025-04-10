import {useState} from "react";
import {gql, useMutation} from "@apollo/client";

const CREATE_TIP = gql`
    mutation CreateTip($message: String!) {
        createTip(message: $message) {
            id
            createdAt
        }
    }    
`;

export default function CreateTipForm() {
    const [message, setMessage] = useState("");
    const [createTip, {data, loading}] = useMutation(CREATE_TIP);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTip({ variables: { message } });
        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md mx-auto mt-8">
      <textarea
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter daily motivational tip"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
      />
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {loading ? "Submitting..." : "Submit Tip"}
            </button>
        </form>
    );
}