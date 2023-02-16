import { create } from 'ipfs-http-client';

const { INFURA_PROJECT_ID, INFURA_SECRET } = process.env

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(`${INFURA_PROJECT_ID}:${INFURA_SECRET}`, 'utf-8').toString('base64')}`,
  },
});

export const uploadIpfs = async (data) => {
  const result = await client.add(JSON.stringify(data));

  console.log('upload result ipfs', result);
  return result;
};
