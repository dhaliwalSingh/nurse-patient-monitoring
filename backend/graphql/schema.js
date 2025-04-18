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
        patientId: ID!
        message: String!
        createdAt: String
    }

    type Tip {
        id: ID!
        message: String!
        createdBy: User!
        createdAt: String
    }

    type Query {
        getUsers: [User]
        getAllUsers: [User]
        getTips: [Tip]
        getVitalsByPatient(patientId: ID!): [Vitals]
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
    }
`;

module.exports = typeDefs;
