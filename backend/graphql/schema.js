const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
    }

    type Query {
        getUsers: [User]
    }

    type Mutation {
        register(username: String!, email: String!, password: String!, role: String!): User
        login(email: String!, password: String!): String
    }
`;

module.exports = typeDefs;
