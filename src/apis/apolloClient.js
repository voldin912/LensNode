import { ApolloClient, InMemoryCache, HttpLink, createHttpLink } from '@apollo/client/core/index.js';
import {
    QUERY_PROFILE_BY_ID,
    GET_PUBLICATIONS_QUERY,
    GET_SINGLE_POST,
    GET_POST_COMMENTS,
    HAS_TX_HASH_BEEN_INDEXED,
    GET_TAGS
} from './queries';
import { REFRESH_TOKEN_MUTATION, CREATE_POST_TYPED_DATA } from './mutations';
import fetch from 'cross-fetch';

//const API_URL = 'https://api-mumbai.lens.dev'
const API_URL = 'https://api.lens.dev'

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

const hasTxHashBeenIndexed = async (request, options = {}) => {
    try {
        const { data } = await client.query({
            query: HAS_TX_HASH_BEEN_INDEXED,
            variables: {
                request,
            },
            fetchPolicy: 'network-only',
            ...options
        });
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
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

const createPostTypedData = async (request, options = {}) => {
    try {
        const { data } = await client.mutate({
            mutation: CREATE_POST_TYPED_DATA,
            variables: {
                request
            },
            ...options
        })
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

const getComments = async (id) => {
    const { data } = await client.query({
        query: GET_POST_COMMENTS,
        variables: {
            publicationsRequest: { commentsOf: id, limit: 50 }
        }
    });
    return data.publications.items;
};

const getTags = async (query) => {
    const { data } = await client.query({
        query: GET_TAGS,
        variables: {
            request: { query: query, type: 'PUBLICATION', limit: 10}
        }
    });
    return data.search.items;
};
export {
    // QUERIES
    getProfile,
    getPublications,
    getPublication,
    getComments,
    hasTxHashBeenIndexed,
    getTags,
    // MUTATIONS
    refresh,
    createPostTypedData
};
