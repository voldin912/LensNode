import fs from 'fs'
import path from 'path'
import { ethers } from 'ethers';
import { fileURLToPath } from 'url';
import { getSigner } from '../services/ethers.service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileLensHub = fs.readFileSync(
  path.join(__dirname, 'abis/lens-hub-contract-abi.json'),
  'utf8'
);

// lens contract info can all be found on the deployed
// contract address on polygon.
export const getLensHub = (address = '') => {
  return new ethers.Contract(address, JSON.parse(fileLensHub), getSigner())
};
