const { ApolloClient, InMemoryCache, HttpLink } = require('@apollo/client/core');
const { QUERY_PROFILE_BY_ID } = require('./queries');
const { fetch } = require('cross-fetch');

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: 'https://api.lens.dev', fetch })
});

const getProfile = async (handle) => {
    try {
        const data = (await client.query({
            query:QUERY_PROFILE_BY_ID,
            variables:{
                profileRequest:{ handle: handle}
            }
        })).data;    
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { getProfile }