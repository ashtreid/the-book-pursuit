import { gql } from '@apollo/client';

// export const QUERY_USER = gql`
//   query user($username: String!) {
//     user(username: $username) {
//       _id
//       username
//       email
//       savedBooks {
//         _id
//         authors
//         description
//         image
//         link
//         title
//       }
//     }
//   }
// `;

export const GET_ME = gql`
  query me {
    _id
    username
    email
    savedBooks
  }
`;