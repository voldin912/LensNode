const IPFS_GATEWAY = 'https://gateway.ipfscdn.io/ipfs/';
const createURL = (urlString) => {
    if (!/^https?:\/\//i.test(urlString)) {
        urlString = 'http://' + urlString;
    }
    return new URL(urlString);
};

const getCleanedProfile = (profile) => {
    let cleanedProfile = { ...profile };
    cleanedProfile = replaceIpfs(cleanedProfile);
    let attributes = Object.entries(cleanedProfile.attributes).map(([_, value]) => value);

    return {
        ...cleanedProfile,
        location: attributes?.find((atr)=> { return atr.key === 'location'})?.value,
        website: attributes?.find((atr)=> { return atr.key === 'website'})?.value ? createURL(attributes?.find((atr)=> { return atr.key === 'website'}).value).hostname: null,
        websiteAddress: attributes?.find((atr)=> { return atr.key === 'website'})?.value ? createURL(attributes?.find((atr)=> { return atr.key === 'website'}).value): null,
        dateJoined: attributes?.find((atr)=> { return atr.key === 'dateJoined'})?.value
    }
};

const replaceIpfs = (obj) => {
    const copy = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const type = typeof value;
        if (type === "string") {
            copy[key] = value                
                .replace(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}`)
                .replace('https://ipfs.io/ipfs/', IPFS_GATEWAY)
                .replace('ipfs://', IPFS_GATEWAY);
        } else if (type === "object" && value) {
            copy[key] = replaceIpfs(value);
        } else {
            copy[key] = value;
        }
    }
    return copy;
};

export { getCleanedProfile, replaceIpfs };