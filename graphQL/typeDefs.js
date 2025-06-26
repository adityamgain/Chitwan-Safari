const { gql } = require('graphql-tag');

const typeDefs = gql`
    type Query {
        hello: String
        reviews: [tbl_Reviews]
    }

    type tbl_Reviews {
        id: ID
        name: String
        country: String
        stars: Int
        review: String
    }

    type BookingResponse {
        success: Boolean!
        message: String!
    }

    input BookingInput {
        fullName: String!
        email: String!
        phone: String!
        country: String!
        activities: [String!]!
        startDate: String!
        endDate: String!
        preferredTime: String!
        participants: Int!
        specialRequirements: String
    }

    type Mutation {
        bookAdventure(input: BookingInput!): BookingResponse!
    }
`;

module.exports = typeDefs;
