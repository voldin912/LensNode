import { ApolloClient, InMemoryCache, HttpLink, createHttpLink } from '@apollo/client/core/index.js';
import { QUERY_PROFILE_BY_ID, GET_PUBLICATIONS_QUERY, GET_SINGLE_POST } from './queries';
import { REFRESH_TOKEN_MUTATION, CREATE_POST_TYPED_DATA } from './mutations';
import fetch from 'cross-fetch';

const API_URL = 'https://api.lens.dev';

// `httpLink` our gateway to the Lens GraphQL API. It lets us request for data from the API and passes it forward
const httpLink = new HttpLink({ uri: API_URL, fetch });

const client = new ApolloClient({
    //link: authLink.concat(httpLink),
    link: httpLink,
    cache: new InMemoryCache()
});

// QUERIES

const getProfile = async (handle) => {
    try {
        const { data } = await client.query({
            query: QUERY_PROFILE_BY_ID,
            variables: {
                profileRequest: { handle: handle }
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getPublications = async () => {
    const { data } = await client.query({
        query: GET_PUBLICATIONS_QUERY,
    });
    return data.explorePublications.items;
};

const getPublication = async (id) => {
    const { data } = await client.query({
        query: GET_SINGLE_POST,
        variables: { id: id }
    });
    //console.log(data.publication)
    return data.publication;
};

// MUTATIONS

const refresh = async refreshToken => {
    try {
        const { data } = await client.mutate({
            mutation: REFRESH_TOKEN_MUTATION,
            variables: {
                request: { refreshToken }
            }
        })
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

const createPostTypedData = async ({
    profileId,
    contentURI,
    collectModule,
    referenceModule
}) => {
    try {
        const { data } = await client.mutate({
            mutation: CREATE_POST_TYPED_DATA,
            variables: {
                request: {
                    profileId: "0x03",
                    contentURI: "ipfs://QmPogtffEF3oAbKERsoR4Ky8aTvLgBF5totp5AuF8YN6vl",
                    collectModule: {
                        revertCollectModule: true
                    },
                    referenceModule: {
                        followerOnlyReferenceModule: false
                    }
                }
            }
        })
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export {
    // QUERIES
    getProfile,
    getPublications,
    getPublication,
    // MUTATIONS
    refresh,
    createPostTypedData
};
