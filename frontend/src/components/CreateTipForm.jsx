import {useState} from "react";
import {gql, useMutation} from "@apollo/client";

const CREATE_TIP = gql`
    mutation CreateTip($message: String!) {
        createTip(message: $message) {
            id
        }
    }
`;

export default function CreateTipForm() {
    const [message, setMessage] = useState("");
    const [createTip] = useMutation(CREATE_TIP);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        await createTip({ variables: { message } });
        setMessage("");
        alert("Tip created!");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Write a motivational tip..."
                required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Tip</button>
        </form>
    );
}