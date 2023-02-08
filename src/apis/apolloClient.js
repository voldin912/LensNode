import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { QUERY_PROFILE_BY_ID } from './queries';
import fetch from 'cross-fetch';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: 'https://api.lens.dev', fetch })
});

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

export { getProfile };