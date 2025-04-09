import {useState} from "react";
import {gql, useMutation} from "@apollo/client";

const CREATE_ALERT = gql`
    mutation CreateEmergencyAlert($message: String!){
        createEmergencyAlert(message: $message) {
            id
            message
            createdAt
        }
    }
`;

export default function EmergencyAlertForm() {
    const [message, setMessage] = useState("");
    const [createAlert, { loading, data, error}] = useMutation(CREATE_ALERT);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createAlert({ variables: { message } });
        setSent(true);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow rounded max-w-md mx-auto mt-10">
      <textarea
          name="message"
          rows="4"
          placeholder="Enter emergency details..."
          className="w-full border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
      />
            <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
                {loading ? "Sending..." : "Send Emergency Alert"}
            </button>
            {sent && <p className="text-green-600 mt-2">🚨 Emergency alert sent!</p>}
            {error && <p className="text-red-600">Error: {error.message}</p>}
        </form>
    );
}