const IPFS_GATEWAY = 'https://gateway.ipfscdn.io/ipfs/'

const getCleanedProfile = (profile) => {
    let cleanedProfile = { ...profile };
    cleanedProfile = replaceIpfs(cleanedProfile);
    return cleanedProfile;
}

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

module.exports = { getCleanedProfile };