import { ethers, Wallet, utils } from 'ethers';
import omitDeep from 'omit-deep';

// ethers package must be version "^5.7.2", otherwise it won't work
const ETHERS_PROVIDERS = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today');

export const getSigner = () => {
  return new Wallet(String(process.env.WALLET_PRIVATE_KEY), ETHERS_PROVIDERS);
};

export const signedTypeData = (
  domain,
  types,
  value
) => {
  const signer = getSigner();
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  );
};

export const omit = (object, name) => {
  return omitDeep(object, name);
};

export const splitSignature = (signature = '') => {
  return utils.splitSignature(signature);
};
