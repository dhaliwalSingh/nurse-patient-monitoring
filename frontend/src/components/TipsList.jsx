import { gql, useQuery } from "@apollo/client";

const GET_TIPS = gql`
    query GetTips {
        getTips {
            id
            message
            createdAt
        }
    }
`;

export default function TipsList() {
    const { data, loading, error } = useQuery(GET_TIPS);

    if (loading) return <p className="text-center">Loading tips...</p>;
    if (error) return <p className="text-center text-red-600">Failed to load tips: {error.message}</p>;

    const tips = data?.getTips ?? [];

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
            <h2 className="text-xl font-bold mb-4">📋 Daily Motivational Tips</h2>
            {tips.length === 0 ? (
                <p className="text-gray-600 text-center">No tips available yet.</p>
            ) : (
                <ul className="space-y-3">
                    {tips.map((tip) => (
                        <li key={tip.id} className="bg-gray-100 p-3 rounded">
                            {tip.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
