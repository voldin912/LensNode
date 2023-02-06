const { gql } = require('@apollo/client/core')

const QUERY_PROFILE_BY_ID = gql`

  # create a GraphQL query to be executed by Apollo Client

  query Profile($profileRequest: SingleProfileQueryRequest!) {
    profile(request:$profileRequest){
      id
      name
      metadata
      handle
      bio
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      attributes {
        displayType
        traitType
        key
        value
      }
    }
  }
`;

module.exports = { QUERY_PROFILE_BY_ID }