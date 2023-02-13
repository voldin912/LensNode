"use strict";

/**
 * Important note, MetaMask requires:
 * - server running on https protocol (you can run https in root server.js)
 * - browser extension: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related?hl=en
 */

const LENS_API = 'https://api.lens.dev'

window.onload = () => {
  setTimeout(() => {
    const Web3Modal = window?.Web3Modal?.default;
    const WalletConnectProvider = window?.WalletConnectProvider?.default;
    const Fortmatic = window?.Fortmatic;

    // Web3modal instance
    let web3Modal
    // Chosen wallet provider given by the dialog window
    let provider;
    // Address of the selected account
    let address = window.ethereum?.selectedAddress

    function init() {
      // Check that the web page is run in a secure context,
      // as otherwise MetaMask won't be available
      // https://ethereum.stackexchange.com/a/62217/620
      if (location.protocol !== 'https:') {
        alert('Run https connection in order for MetaMask to work')
        return;
      }

      // Tell Web3modal what providers we have available.
      // Built-in web browser provider (only one can exist as a time)
      // like MetaMask, Brave or Opera is added automatically by Web3modal
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            // Mikko's test key - don't copy as your mileage may vary
            infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
          }
        },
        fortmatic: {
          package: Fortmatic,
          options: {
            // Mikko's TESTNET api key
            key: "pk_test_391E26A3B43A3350"
          }
        }
      };

      web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
      });
    }

    async function fetchAccountData() {
      const web3 = new Web3(provider);

      try {
        const [account] = await web3.eth.getAccounts();
        address = account;
      } catch (err) {
        alert(err?.message ?? err)
        return
      }
    }

    // connect wallet or get address if connected
    async function walletConnect() {
      console.log(window.ethereum, '<< WINDOW ETHEREUM');

      try {
        console.log(window.ethereum?.selectedAddress, '<< SELECTED ADDRESS BEFORE CONNECT');

        if (window.ethereum?.selectedAddress) {
          address = window.ethereum.selectedAddress

          if (!localStorage.getItem('accessToken')) {
            triggerModalById('#lens-connect-modal')
          }
        } else {
          provider = await web3Modal.connect();

          provider.on("accountsChanged", () => {
            console.log('accountsChanged EVENT TRIGGERED');
            fetchAccountData();
          });

          provider.on("chainChanged", () => {
            console.log('chainChanged EVENT TRIGGERED');
            fetchAccountData();
          });

          address = window.ethereum.selectedAddress

          // call modal on UI for user
          triggerModalById('#lens-connect-modal')
        }
      } catch (err) {
        alert(`Could not get a wallet connection: ${err?.message ?? err}`);
        return;
      }
    }

    // disconnect wallet
    async function walletDisconnect() {
      console.log("Killing the wallet connection");

      const { currentProvider } = window.ethereum

      if (currentProvider) {
        // await currentProvider.close();
        await web3Modal.clearCachedProvider();
        provider = null;
      }

      address = null;
    }

    // graphql Profiles request to lens
    async function getProfiles() {
      const Profiles = JSON.stringify({
        query: `
        query Profiles($ownedBy: [EthereumAddress!]) {
          profiles(request: { ownedBy: $ownedBy, limit: 10 }) {
            items {
              id
              name
              bio
              attributes {
                displayType
                traitType
                key
                value
              }
              followNftAddress
              metadata
              isDefault
              picture {
                ... on NftImage {
                  contractAddress
                  tokenId
                  uri
                  verified
                }
                ... on MediaSet {
                  original {
                    url
                    mimeType
                  }
                }
                __typename
              }
              handle
              coverPicture {
                ... on NftImage {
                  contractAddress
                  tokenId
                  uri
                  verified
                }
                ... on MediaSet {
                  original {
                    url
                    mimeType
                  }
                }
                __typename
              }
              ownedBy
              dispatcher {
                address
                canUseRelay
              }
              stats {
                totalFollowers
                totalFollowing
                totalPosts
                totalComments
                totalMirrors
                totalPublications
                totalCollects
              }
              followModule {
                ... on FeeFollowModuleSettings {
                  type
                  amount {
                    asset {
                      symbol
                      name
                      decimals
                      address
                    }
                    value
                  }
                  recipient
                }
                ... on ProfileFollowModuleSettings {
                 type
                }
                ... on RevertFollowModuleSettings {
                 type
                }
              }
            }
            pageInfo {
              prev
              next
              totalCount
            }
          }
        }
        `,
        variables: { ownedBy: [address] }
      })

      const profiles = await fetch(
        LENS_API,
        {
          method: 'POST',
          body: Profiles,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Profiles.length
          },
        }
      ).then(res => res.json());

      return profiles?.data?.profiles?.items
    }

    /**
     * Login user to https://www.lens.xyz/
     * and set accessToken and refreshToken to local storage
     */
    async function authenticateToLens() {
      const cookies = parseCookies(document.cookie)

      if (cookies['accessToken']) {
        alert('You are connected to Lens.')
        return
      }

      try {
        const Challenge = JSON.stringify({
          query: `
            query Challenge($address: EthereumAddress!) {
              challenge(request: { address: $address }) {
                text
              }
            }
          `,
          variables: { address }
        });

        const challengeInfo = await fetch(
          LENS_API,
          {
            method: 'POST',
            body: Challenge,
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Challenge.length
            },
          }
        ).then(res => res.json());

        const signature = await window.ethereum?.request({
          method: "personal_sign",
          params: [challengeInfo.data.challenge.text, address],
        });

        const Authenticate = JSON.stringify({
          query: `
            mutation Authenticate(
              $address: EthereumAddress!
              $signature: Signature!
            ) {
              authenticate(request: {
                address: $address,
                signature: $signature
              }) {
                accessToken
                refreshToken
              }
            }
          `,
          variables: { address, signature }
        });

        const authData = await fetch(
          LENS_API,
          {
            method: 'POST',
            body: Authenticate,
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Authenticate.length
            },
          }
        ).then(res => res.json());

        if (authData.data?.authenticate?.accessToken && authData.data?.authenticate?.refreshToken) {
          document.cookie = `accessToken=${authData.data?.authenticate?.accessToken}`
          document.cookie = `refreshToken=${authData.data?.authenticate?.refreshToken}`

          document.querySelector("#lens-connect-modal").classList.remove('show')

          await checkLensProfiles()
        } else {
          document.querySelector("#lens-connect-modal").classList.remove('show')
        }
      } catch (err) {
        document.querySelector("#lens-connect-modal").classList.remove('show')
        alert(err?.message ?? err)
      }
    }

    async function checkLensProfiles() {
      const profiles = await getProfiles()

      if (!profiles?.length) {
        triggerModalById('#lens-claim-modal')
      }
    }

    function triggerModalById(modalId = '') {
      const lensConnectModal = document.querySelector(modalId)
      lensConnectModal.classList.add("show")
      lensConnectModal.insertAdjacentHTML('afterbegin', '<div class="ct_modal_overlay"></div>');
      lensConnectModal.querySelector('.ct_modal_overlay').addEventListener('click', function () {
        this.closest('.ct_modal').classList.remove('show');
      })
    }

    function parseCookies(cookies = '') {
      if (!cookies) {
        return {}
      }

      return cookies.split('; ').reduce((map, cookie) => {
        const [key, value] = cookie.split('=')

        map[key] = value

        return map
      }, {})
    }

    function redirectToPath(path = '') {
      return window?.location?.replace(`${window.location.origin}/{path}`)
    }


    // initialise
    init();

    // set on click events for buttons
    document.querySelector("#main_login_btn").addEventListener("click", walletConnect);
    document.querySelector("#lens-connect").addEventListener("click", authenticateToLens);
    // document.querySelector("#main_disconnect_btn").addEventListener("click", getProfiles);
  }, 500);
}