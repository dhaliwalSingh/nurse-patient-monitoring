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
    
    extend type Mutation {
        addVitals(
            patientId: ID!
            temperature: Float
            heartRate: Int
            bloodPressure: String
            respiratoryRate: Int
        ): Vitals
    }

    type Query {
        getUsers: [User]
        getAllUsers: [User]
    }

    type Mutation {
        register(username: String!, email: String!, password: String!, role: String!): User
        login(email: String!, password: String!): String
    }
`;

module.exports = typeDefs;
