import { gql } from '@apollo/client/core';

const QUERY_PROFILE_BY_ID = gql`
  query Profile($profileRequest: SingleProfileQueryRequest!) {
    profile(request: $profileRequest) {
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

export { QUERY_PROFILE_BY_ID };