// frontend/src/apollo/client.js
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const client = new ApolloClient({
    link: createHttpLink({
        uri: "http://localhost:4000/graphql", // ✅ Adjust port if needed
        credentials: "same-origin",
    }),
    cache: new InMemoryCache(),
});

export default client;
