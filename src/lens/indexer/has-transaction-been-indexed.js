import { hasTxHashBeenIndexed } from '../../apis/apolloClient'

export const pollUntilIndexed = async (input, accessToken) => {
  while (true) {
    const options = {
      context: {
        headers: {
          "x-access-token": accessToken
        }
      },
    }

    const response = await hasTxHashBeenIndexed(input, options);
    console.log('pool until indexed: result', response);

    if (response.hasTxHashBeenIndexed.__typename === 'TransactionIndexedResult') {
      console.log('pool until indexed: indexed', response.hasTxHashBeenIndexed.indexed);
      console.log('pool until metadataStatus: metadataStatus', response.hasTxHashBeenIndexed.metadataStatus);

      console.log(response.hasTxHashBeenIndexed.metadataStatus);
      if (response.hasTxHashBeenIndexed.metadataStatus) {
        if (response.hasTxHashBeenIndexed.metadataStatus.status === 'SUCCESS') {
          return response;
        }

        if (response.hasTxHashBeenIndexed.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response.hasTxHashBeenIndexed.metadataStatus.status);
        }
      } else {
        if (response.hasTxHashBeenIndexed.indexed || response.hasTxHashBeenIndexed.txReceipt) {
          return response;
        }
      }

      console.log('pool until indexed: sleep for 1500 milliseconds then try again');
      // sleep for a second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      // it got reverted and failed!
      throw new Error(response.reason);
    }
  }
};

