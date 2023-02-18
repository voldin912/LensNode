import gql from 'graphql-tag'

const publicationStatsFragment = gql`
fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
	totalUpvotes
}
`
const profileFieldsFragment = gql`
fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
    displayType
    traitType
    key
    value
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
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
        ...MediaFields
      }
    }
  }
  ownedBy
  dispatcher {
    address
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
  }
  followModule {
    ...FollowModuleFields
  }
}
`

const postFieldsFragment = gql`
fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}
`
const mediaFieldsFragment = gql`
  fragment MediaFields on Media {
    url
  }
`
const metadataOutputFragment = gql`
  fragment MetadataOutputFields on MetadataOutput {
      content
    media {
      original {
        ...MediaFields
      }
    }
  }
`
const referenceModuleFragment = gql`
	fragment ReferenceModuleFields on ReferenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
	    type
	    contractAddress
	  }
	  ... on UnknownReferenceModuleSettings {
	    type
	    contractAddress
	    referenceModuleReturnData
	  }
	  ... on DegreesOfSeparationReferenceModuleSettings {
	    type
	    contractAddress
	    commentsRestricted
	    mirrorsRestricted
	    degreesOfSeparation
	  }
	}
`
const commentBaseFieldsFragment = gql`
	fragment CommentBaseFields on Comment {
	  id
	  createdAt
	  appId
	  hidden
	  reaction(request: null)
	  mirrors(by: null)
	  hasCollectedByMe
	  profile {
	    ...ProfileFields
	  }
	  metadata {
	    ...MetadataOutputFields
	  }
	  stats {
	    ...PublicationStatsFields
	  }

	}
`
const erc20Fragment = gql`
	fragment Erc20Fields on Erc20 {
	  name
	  symbol
	  decimals
	  address
	}
`
const followModuleFragment = gql`
	fragment FollowModuleFields on FollowModule {
	  ... on FeeFollowModuleSettings {
	    type
	    amount {
	      asset {
	        name
	        symbol
	        decimals
	        address
	      }
	      value
	    }
	    recipient
	  }
	  ... on ProfileFollowModuleSettings {
	    type
	    contractAddress
	  }
	  ... on RevertFollowModuleSettings {
	    type
	    contractAddress
	  }
	  ... on UnknownFollowModuleSettings {
	    type
	    contractAddress
	    followModuleReturnData
	  }
	}
`
const collectModuleFragment = gql`
	fragment CollectModuleFields on CollectModule {
	  __typename
	  ... on FreeCollectModuleSettings {
	    type
	    followerOnly
	    contractAddress
	  }
	  ... on FeeCollectModuleSettings {
	    type
	    amount {
	      asset {
	        ...Erc20Fields
	      }
	      value
	    }
	    recipient
	    referralFee
	  }
	  ... on LimitedFeeCollectModuleSettings {
	    type
	    collectLimit
	    amount {
	      asset {
	        ...Erc20Fields
	      }
	      value
	    }
	    recipient
	    referralFee
	  }
	  ... on LimitedTimedFeeCollectModuleSettings {
	    type
	    collectLimit
	    amount {
	      asset {
	        ...Erc20Fields
	      }
	      value
	    }
	    recipient
	    referralFee
	    endTimestamp
	  }
	  ... on RevertCollectModuleSettings {
	    type
	  }
	  ... on TimedFeeCollectModuleSettings {
	    type
	    amount {
	      asset {
	        ...Erc20Fields
	      }
	      value
	    }
	    recipient
	    referralFee
	    endTimestamp
	  }
	  ... on UnknownCollectModuleSettings {
	    type
	    contractAddress
	    collectModuleReturnData
	  }
	}
`
const commentFieldsFragment = gql`
	fragment CommentFields on Comment {
	  ...CommentBaseFields
	  mainPost {
	    ... on Post {
	      ...PostFields
	    }
	    ... on Mirror {
	      ...MirrorBaseFields
	      mirrorOf {
	        ... on Post {
	           ...PostFields          
	        }
	        ... on Comment {
	           ...CommentMirrorOfFields        
	        }
	      }
	    }
	  }
	}
`
const mirrorBaseFieldsFragment = gql`
	fragment MirrorBaseFields on Mirror {
	  id
	  profile {
	    ...ProfileFields
	  }
	  stats {
	    ...PublicationStatsFields
	  }
	  metadata {
	    ...MetadataOutputFields
	  }
	  createdAt
	  collectModule {
	    ...CollectModuleFields
	  }
	  referenceModule {
	    ...ReferenceModuleFields
	  }
	  appId
	}
`
const mirrorFieldsFragment = gql`
	fragment MirrorFields on Mirror {
	  ...MirrorBaseFields
	  mirrorOf {
	   ... on Post {
	      ...PostFields          
	   }
	   ... on Comment {
	      ...CommentFields          
	   }
	  }
	}
`
const commentMirrorOfFieldsFragment = gql`
	fragment CommentMirrorOfFields on Comment {
	  ...CommentBaseFields
	  mainPost {
	    ... on Post {
	      ...PostFields
	    }
	    ... on Mirror {
	       ...MirrorBaseFields
	    }
	  }
	}
`
export {
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