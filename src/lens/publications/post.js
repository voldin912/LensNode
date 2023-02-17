import { BigNumber, utils } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { PUBLICATION_MAIN_FOCUS } from '../../constants/lens';
import { createPostTypedData } from '../../apis/apolloClient'
import { uploadIpfs } from '../../services/ipfs.service'
import { signedTypeData, splitSignature } from '../../services/ethers.service';
import { getLensHub } from '../hub';
import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed'

const _signCreatePostTypedData = async (request, accessToken) => {
  const options = {
    context: {
      headers: {
        "x-access-token": accessToken
      }
    },
  }

  const result = await createPostTypedData(request, options);

  const { typedData } = result.createPostTypedData;

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);

  return { result, signature };
};

export const createPost = async (address = '', profileId = '', accessToken = '') => {
  if (!address || !profileId || !accessToken) {
    throw new Error('Must provide all parameters to run this')
  }

  const ipfsResult = await uploadIpfs({
    version: '2.0.0',
    mainContentFocus: PUBLICATION_MAIN_FOCUS.TEXT_ONLY,
    metadata_id: uuidv4(),
    description: 'Description',
    locale: 'en-US',
    content: 'Content',
    external_url: null,
    image: null,
    imageMimeType: null,
    name: 'Name',
    attributes: [],
    tags: ['using_api_examples'],
    appId: 'api_examples_github',
  });

  // const ipfsResult = {
  // path: 'QmZohMAEA8VzU2BJTxgHcx1SzJSoCfXXRGyshq29jJKRd3',
  // cid: CID(QmZohMAEA8VzU2BJTxgHcx1SzJSoCfXXRGyshq29jJKRd3),
  // size: 323
  // }

  const createPostRequest = {
    profileId,
    contentURI: `ipfs://${ipfsResult.path}`,
    collectModule: {
      freeCollectModule: { followerOnly: true },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  };

  const signedResult = await _signCreatePostTypedData(createPostRequest, accessToken);

  const typedData = signedResult?.result?.createPostTypedData?.typedData;

  const lensHub = getLensHub(address)
  const { v, r, s } = splitSignature(signedResult.signature);

  const tx = await lensHub.postWithSig({
    profileId: typedData.value.profileId,
    contentURI: typedData.value.contentURI,
    collectModule: typedData.value.collectModule,
    collectModuleInitData: typedData.value.collectModuleInitData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleInitData: typedData.value.referenceModuleInitData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });

  // {
  //   type: 2,
  //   chainId: 80001,
  //   nonce: 0,
  //   maxPriorityFeePerGas: BigNumber { _hex: '0x59682f00', _isBigNumber: true },
  //   maxFeePerGas: BigNumber { _hex: '0x59682f20', _isBigNumber: true },
  //   gasPrice: null,
  //   gasLimit: BigNumber { _hex: '0x61f4', _isBigNumber: true },
  //   to: '0x26dedF8Ade10EdfFDce8945f5c52ffDbeF413e2e',
  //   value: BigNumber { _hex: '0x00', _isBigNumber: true },
  //   data: '0x3b50813200000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000006c2400000000000000000000000000000000000000000000000000000000000001400000000000000000000000000be6bd7092ee83d44a6ec1d949626fee48cab30c00000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000001c0016d83ba7992ac3909c21122d7b6ab893800ffc7929886cd0547cf2392d7f6126e3aeea8210f63d40923b2c63422c11b07f6939dfd106cf319ba6dd61642dbd0000000000000000000000000000000000000000000000000000000063ee31ba0000000000000000000000000000000000000000000000000000000000000035697066733a2f2f516d57393961444d786a746a5548373252743570567377367759376276596d4c5239523379686d705438785441530000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
  //   accessList: [],
  //   hash: '0x15563e555536ad67ef44dd0e0034ba67935632232d3038f2236a020f85c981c0',
  //   v: 0,
  //   r: '0x044a1bbb8b3ded3b7b049b201484ab1cf61bd8481373c0cbe3b668043a12b055',
  //   s: '0x36e60addb23b84eed04153f3d54d70aa1a05fcd7c62c9d1b3e10040afc422101',
  //   from: '0x26dedF8Ade10EdfFDce8945f5c52ffDbeF413e2e',
  //   confirmations: 0,
  //   wait: [Function (anonymous)]
  // }

  console.log('create post: poll until indexed');
  const indexedResult = await pollUntilIndexed({ txHash: tx.hash }, accessToken);
  // {
  //   hasTxHashBeenIndexed: {
  //     __typename: 'TransactionIndexedResult',
  //     indexed: false,
  //     txReceipt: {
  //       __typename: 'TransactionReceipt',
  //       to: '0x26dedF8Ade10EdfFDce8945f5c52ffDbeF413e2e',
  //       from: '0x26dedF8Ade10EdfFDce8945f5c52ffDbeF413e2e',
  //       contractAddress: null,
  //       transactionIndex: 1,
  //       root: null,
  //       gasUsed: '0x6200',
  //       logsBloom: '0x00000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000800000000000000000000100000000004000000000000000000000000000000000000000000000000080080000000000000000000000000000000000000000000000000000000080000000000000000000200000000000000000000000000000000000000000000000000000000000004000000000000000000001000000000000000000000000000000100040000000000000000000000020000000000000000000000000000000000000000000100000',
  //       blockHash: '0x710ccc03ef55e9750f83f927051d837299edf0cd5121cf03facdaa32ff80c240',
  //       transactionHash: '0x680095f749c7e9536d1bd3f08da43a2ff66d6181406f3dd91bc3482d477a0256',
  //       blockNumber: 32110668,
  //       confirmations: 1,
  //       cumulativeGasUsed: '0x025a7a',
  //       effectiveGasPrice: '0x59682f10',
  //       byzantium: true,
  //       type: 2,
  //       status: 1,
  //       logs: [Array]
  //     },
  //     metadataStatus: null
  //   }
  // }

  console.log('create post: profile has been indexed');

  const logs = indexedResult.hasTxHashBeenIndexed.txReceipt.logs;

  console.log('create post: logs', logs);

  const topicId = utils.id(
    'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
  );
  console.log('topicid we care about', topicId);

  const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
  console.log('create post: created log', profileCreatedLog);

  let profileCreatedEventLog = profileCreatedLog?.topics;
  console.log('create post: created event logs', profileCreatedEventLog);

  // const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog?.[2])?.[0];

  // console.log('create post: contract publication id', BigNumber.from(publicationId)?.toHexString());
  // console.log(
  //   'create post: internal publication id',
  //   profileId + '-' + BigNumber.from(publicationId)?.toHexString()
  // );
};
