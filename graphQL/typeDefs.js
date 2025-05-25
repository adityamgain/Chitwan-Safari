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
`;

module.exports = typeDefs;