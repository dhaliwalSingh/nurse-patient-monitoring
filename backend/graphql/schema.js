const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
    }

    type Vitals {
        id: ID!
        patientId: ID!
        temperature: Float
        heartRate: Int
        bloodPressure: String
        respiratoryRate: Int
        createdAt: String
    }

    type Alert {
        id: ID!
        patientId: User!
        message: String!
        createdAt: String
        resolved: Boolean
        notes: String
    }

    type Tip {
        id: ID!
        message: String!
        createdBy: User!
        createdAt: String
    }

    type Symptom {
        id: ID!
        patientId: ID!
        description: String!
        createdAt: String
    }

    type Query {
        getUsers: [User]
        getAllUsers: [User]
        getTips: [Tip]
        getVitalsByPatient(patientId: ID!): [Vitals]
        getAllAlerts: [Alert]
        getSymptomsByPatient(patientId: ID!): [Symptom]
        getMySymptoms: [Symptom]
        getAISuggestion(patientId: ID!, followUp: String): String
        getAIHealthAdvice(patientId: ID!): String
        getPatientSymptomInsight: String
        chatWithAI(message: String!): String
    }

    type Mutation {
        register(username: String!, email: String!, password: String!, role: String!): User
        login(email: String!, password: String!): String

        addVitals(
            patientId: ID!
            temperature: Float
            heartRate: Int
            bloodPressure: String
            respiratoryRate: Int
        ): Vitals

        createEmergencyAlert(message: String!): Alert
        createTip(message: String!): Tip
        markAlertResolved(id: ID!, notes: String): Alert
        deleteAlert(id: ID!): Boolean
        addSymptom(descriptions: [String!]!): Boolean
    }
`;

module.exports = typeDefs;