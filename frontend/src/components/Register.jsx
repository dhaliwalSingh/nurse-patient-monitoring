import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const REGISTER_MUTATION = gql`
    mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
        register(username: $username, email: $email, password: $password, role: $role) {
            id
            username
            email
            role
        }
    }
`;

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "patient",
    });

    const [register, { loading }] = useMutation(REGISTER_MUTATION);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await register({ variables: formData });
            setMessage("Registration successful!");
        } catch (err) {
            setError(err.message || "Registration failed.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2"
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2"
                >
                    <option value="patient">Patient</option>
                    <option value="nurse">Nurse</option>
                </select>

                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
