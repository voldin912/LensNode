import gql from 'graphql-tag';
import { 
  publicationStatsFragment, 
  profileFieldsFragment, 
  postFieldsFragment, 
  mediaFieldsFragment,
  metadataOutputFragment,
  referenceModuleFragment,
  commentBaseFieldsFragment,
  erc20Fragment,
  followModuleFragment,
  collectModuleFragment,
  commentFieldsFragment,
  mirrorBaseFieldsFragment,
  mirrorFieldsFragment,
  commentMirrorOfFieldsFragment
  } 
from './fragments';

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
`

const GET_PUBLICATIONS_QUERY = gql`
  query {
    explorePublications(request: {
      sortCriteria: LATEST,
      publicationTypes: [POST],
      limit: 50
    }) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
      }
    }
  }
  ${publicationStatsFragment}
  ${profileFieldsFragment}
  ${postFieldsFragment}
  ${mediaFieldsFragment}
  ${metadataOutputFragment}
  ${followModuleFragment}
  ${collectModuleFragment}
  ${referenceModuleFragment}
  ${erc20Fragment}
`

const GET_SINGLE_POST = gql`
query Publication($id: InternalPublicationId!) {
  publication(request: {
    publicationId: $id
  }) {
   __typename 
    ... on Post {
      ...PostFields
    }
    ... on Comment {
      ...CommentFields
    }
    ... on Mirror {
      ...MirrorFields
    }
  }
}

${mediaFieldsFragment}
${profileFieldsFragment}
${postFieldsFragment}
${publicationStatsFragment}
${metadataOutputFragment}
${erc20Fragment}
${mirrorBaseFieldsFragment}
${mirrorFieldsFragment}
${commentBaseFieldsFragment}
${commentFieldsFragment}
${commentMirrorOfFieldsFragment}
${followModuleFragment}
${collectModuleFragment}
${referenceModuleFragment}
`

const GET_POST_COMMENTS = gql`
query Publications($publicationsRequest: PublicationsQueryRequest!) {
  publications(request: $publicationsRequest) {
      items {
      ... on Comment {
        ...CommentFields
      }
    }
    }
  }
${mediaFieldsFragment}
${commentMirrorOfFieldsFragment}
${erc20Fragment}
${mirrorBaseFieldsFragment}
${metadataOutputFragment}
${commentBaseFieldsFragment}
${publicationStatsFragment}
${commentFieldsFragment}
${mirrorBaseFieldsFragment}
${profileFieldsFragment}
${postFieldsFragment}
${followModuleFragment}
${referenceModuleFragment}
${collectModuleFragment}
`

const HAS_TX_HASH_BEEN_INDEXED = gql`
  query hasTxHashBeenIndexed($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) {
      __typename
      ... on TransactionIndexedResult {
        indexed
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
        metadataStatus {
          status
          reason
        }
      }
      ... on TransactionError {
        reason
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
      }
    }
  }
`

const GET_TAGS = gql`
  query Search($request: SearchQueryRequest!) {
    search(request: $request)
      {
      ... on PublicationSearchResult {
         __typename 
        items {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentFields
          }
        }
        pageInfo {
          prev
          totalCount
          next
        }
      }
    }
  }
  ${mediaFieldsFragment}
  ${mirrorBaseFieldsFragment}
  ${profileFieldsFragment}
  ${publicationStatsFragment}
  ${metadataOutputFragment}
  ${postFieldsFragment}
  ${erc20Fragment}
  ${commentBaseFieldsFragment}
  ${commentFieldsFragment}
  ${commentMirrorOfFieldsFragment}
  ${followModuleFragment}
  ${collectModuleFragment}
  ${referenceModuleFragment}
`



export {
  QUERY_PROFILE_BY_ID,
  GET_PUBLICATIONS_QUERY,
  GET_SINGLE_POST,
  GET_POST_COMMENTS,
  HAS_TX_HASH_BEEN_INDEXED,
  GET_TAGS
}