import {useState} from "react";
import {gql, useQuery, useMutation} from "@apollo/client";


const ADD_VITALS = gql`
    mutation AddVitals(
        $patientId: ID!
        $temperature: Float
        $heartRate: Int
        $bloodPressure: String
        $respiratoryRate: Int
    ) {
        addVitals(
            patientId: $patientId
            temperature: $temperature
            heartRate: $heartRate
            bloodPressure: $bloodPressure
            respiratoryRate: $respiratoryRate
        ){
            id
            createdAt
        }
    }
`;

const GET_PATIENTS = gql`
    query GetUsers {
        getUsers {
            id
            username
            email
            role
        }
    }
`;


export default function EnterVitalsForm(){
    const [formData, setFormData] = useState({
        patientId: "",
        temperature: '',
        heartRate: '',
        bloodPressure: '',
        respiratoryRate: ''
    });

    const { data, loading: loadingPatients } = useQuery(GET_PATIENTS);
    const [addVitals, { loading, error }] = useMutation(ADD_VITALS);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addVitals({ variables: {
            ...formData,
                temperature: parseFloat(formData.temperature),
                heartRate: parseInt(formData.heartRate),
                respiratoryRate: parseInt(formData.respiratoryRate)}});

        alert("Vitals submitted");
    };

    return(
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded shadow max-w-md mx-auto mt-8">
            <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full border p-2"
            >
                <option value="">Select Patient</option>
                {loadingPatients
                    ? <option>Loading...</option>
                    : data?.getUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username} ({user.email})
                        </option>
                    ))}
            </select>
            <input name="temperature" placeholder="Temperature (°C)" onChange={handleChange} className="w-full border p-2" />
            <input name="heartRate" placeholder="Heart Rate (bpm)" onChange={handleChange} className="w-full border p-2" />
            <input name="bloodPressure" placeholder="Blood Pressure" onChange={handleChange} className="w-full border p-2" />
            <input name="respiratoryRate" placeholder="Respiratory Rate" onChange={handleChange} className="w-full border p-2" />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit Vitals</button>
        </form>
    );
}