import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_ALL_ALERTS = gql`
    query GetAllAlerts {
        getAllAlerts {
            id
            message
            createdAt
            resolved
            notes
            patientId {
                username
                email
            }
        }
    }
`;

const MARK_RESOLVED = gql`
    mutation MarkAlertResolved($id: ID!, $notes: String) {
        markAlertResolved(id: $id, notes: $notes) {
            id
            resolved
            notes
        }
    }
`;

const DELETE_ALERT = gql`
    mutation DeleteAlert($id: ID!) {
        deleteAlert(id: $id)
    }
`;

export default function EmergencyAlertList() {
    const { data, loading, refetch } = useQuery(GET_ALL_ALERTS);
    const [markResolved] = useMutation(MARK_RESOLVED);
    const [deleteAlert] = useMutation(DELETE_ALERT);
    const [notesMap, setNotesMap] = useState({});

    const handleResolve = async (id) => {
        const notes = notesMap[id] || "";
        await markResolved({ variables: { id, notes } });
        refetch();
    };

    const handleDelete = async (id) => {
        await deleteAlert({ variables: { id } });
        refetch();
    };

    if (loading) return <p>Loading alerts...</p>;

    return (
        <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">🚨 Emergency Alerts</h3>
            {data?.getAllAlerts.length === 0 ? (
                <p>No alerts available.</p>
            ) : (
                <ul className="space-y-4">
                    {data.getAllAlerts.map((alert) => (
                        <li key={alert.id} className={`p-4 rounded ${alert.resolved ? "bg-green-100" : "bg-red-100"}`}>
                            <div className="mb-2">
                                <span className="font-bold">{alert.patientId.username}</span> ({alert.patientId.email})
                            </div>
                            <p className="text-sm">{alert.message}</p>
                            <p className="text-xs text-gray-500">{new Date(+alert.createdAt).toLocaleString()}</p>

                            {!alert.resolved ? (
                                <div className="mt-4 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Enter nurse notes..."
                                        value={notesMap[alert.id] || ""}
                                        onChange={(e) => setNotesMap({ ...notesMap, [alert.id]: e.target.value })}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                    <button
                                        onClick={() => handleResolve(alert.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Mark as Resolved
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-3 text-sm">
                                    <p><strong>Resolved Notes:</strong> {alert.notes}</p>
                                    <button
                                        onClick={() => handleDelete(alert.id)}
                                        className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-xs"
                                    >
                                        Delete Alert
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}