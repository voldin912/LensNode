const IPFS_GATEWAY = 'https://gateway.ipfscdn.io/ipfs/'

const getCleanedProfile = async (profile) => {

    let cleanedProfile = { ...profile };
    cleanedProfile = replaceIpfs(cleanedProfile);
    return cleanedProfile;
}

const replaceIpfs = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] !== null) {
            if (typeof obj[key] === 'object') {
                replaceIpfs(obj[key])
            } else {
                if(obj[key] && typeof obj[key] === 'string') {
                    obj[key] = (obj[key])
                    .replace('https://ipfs.io/ipfs/', IPFS_GATEWAY)
                    .replace('ipfs://', IPFS_GATEWAY);
                }
            }
        }
    });
    return obj;
}

module.exports = { getCleanedProfile };