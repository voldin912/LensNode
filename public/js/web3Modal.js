"use strict";

/**
 * Important note, MetaMask requires:
 * - server running on https protocol
 * - browser extension: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related?hl=en
 */

window.onload = () => {
  setTimeout(() => {
    // Unpkg imports
    const Web3Modal = window?.Web3Modal?.default;
    const WalletConnectProvider = window?.WalletConnectProvider?.default;
    const Fortmatic = window?.Fortmatic;
    const evmChains = window?.evmChains;

    // Web3modal instance
    let web3Modal

    // Chosen wallet provider given by the dialog window
    let provider;

    // Address of the selected account
    let address;

    /**
     * Setup the orchestra
     */
    function init() {
      // console.log("WalletConnectProvider is", WalletConnectProvider);
      // console.log("Fortmatic is", Fortmatic);
      // console.log("window.web3 is", window.web3);
      // console.log("window.ethereum is", window.ethereum);

      // Check that the web page is run in a secure context,
      // as otherwise MetaMask won't be available
      // https://ethereum.stackexchange.com/a/62217/620
      if (location.protocol !== 'https:') {
        const alert = document.querySelector("#alert-error-https");
        alert.style.display = "block";
        document.querySelector("#main_login_btn").setAttribute("disabled", "disabled")
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
        cacheProvider: true, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
      });

      console.log("Web3Modal instance is", web3Modal);
    }

    /**
     * Kick in the UI action after Web3modal dialog has chosen a provider
     */
    async function fetchAccountData() {
      // Get a Web3 instance for the wallet
      const web3 = new Web3(provider);

      console.log("Web3 instance is", web3);

      try {
        // Get connected chain id from Ethereum node
        const chainId = await web3.eth.getChainId();
        // Load chain information over an HTTP API
        const chainData = evmChains.getChain(chainId);
        // document.querySelector("#network-name").textContent = chainData.name;

        // Get list of accounts of the connected wallet
        const accounts = await web3.eth.getAccounts();

        // MetaMask does not give you all accounts, only the selected account
        // console.log("Got accounts", accounts);
        address = accounts[0];

        // document.querySelector("#selected-account").textContent = address;

        // Get a handl
        // const template = document.querySelector("#template-balance");
        // const accountContainer = document.querySelector("#accounts");

        // Purge UI elements any previously loaded accounts
        // accountContainer.innerHTML = '';

        // Go through all accounts and get their ETH balance
        const rowResolvers = accounts.map(async (address) => {
          const balance = await web3.eth.getBalance(address);
          // ethBalance is a BigNumber instance
          // https://github.com/indutny/bn.js/
          const ethBalance = web3.utils.fromWei(balance, "ether");
          const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
          // Fill in the templated row and put in the document
          // const clone = template.content.cloneNode(true);
          // clone.querySelector(".address").textContent = address;
          // clone.querySelector(".balance").textContent = humanFriendlyBalance;
          // accountContainer.appendChild(clone);
        });

        // Because rendering account does its own RPC commucation
        // with Ethereum node, we do not want to display any results
        // until data for all accounts is loaded
        await Promise.all(rowResolvers);

        // Display fully loaded UI for wallet data
        // document.querySelector("#prepare").style.display = "none";
        // document.querySelector("#connected").style.display = "block";

        // Try to authenticateToLens
        // await authenticateToLens()
      } catch (error) {
        alert(error)
      }
    }

    /**
     * Fetch account data for UI when
     * - User switches accounts in wallet
     * - User switches networks in wallet
     * - User connects wallet initially
     */
    async function refreshAccountData() {
      // If any current data is displayed when
      // the user is switching acounts in the wallet
      // immediate hide this data
      // document.querySelector("#connected").style.display = "none";
      // document.querySelector("#prepare").style.display = "block";

      // Disable button while UI is loading.
      // fetchAccountData() will take a while as it communicates
      // with Ethereum node via JSON-RPC and loads chain data
      // over an API call.
      // document.querySelector("#main_login_btn").setAttribute("disabled", "disabled")
      await fetchAccountData();
      // document.querySelector("#main_login_btn").removeAttribute("disabled")
    }

    // connect wallet or get address if connected
    async function walletConnect() {
      try {
        const web3 = new Web3(window.ethereum)
        const [account] = await web3.eth.getAccounts()

        if (account) {
          address = account
        } else {
          provider = await web3Modal.connect();

          // subscribe to accounts change
          provider.on("accountsChanged", (accounts) => {
            fetchAccountData();
          });

          // subscribe to chain change
          provider.on("chainChanged", (chainId) => {
            fetchAccountData();
          });

          await fetchAccountData();
        }
      } catch (err) {
        alert(`Could not get a wallet connection: ${err.message}`);
        return;
      }
    }

    /**
     * Disconnect wallet button pressed.
     */
    async function walletDisconnect() {
      console.log("Killing the wallet connection");

      const currentProvider = web3Modal.providerController.injectedProvider
      console.log(currentProvider, '<< currentProvider');

      if (currentProvider) {
        // await currentProvider.close();
        await web3Modal.clearCachedProvider();
        provider = null;
      }

      address = null;

      // Set the UI back to the initial state
      // document.querySelector("#prepare").style.display = "block";
      // document.querySelector("#connected").style.display = "none";
    }

    /**
     * Login user to https://www.lens.xyz/
     * and set accessToken and refreshToken to local storage
     */
    async function authenticateToLens() {
      const LENS_API = 'https://api.lens.dev'

      if (localStorage.getItem('accessToken')) {
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

        const signature = await new Web3(provider).eth.personal.sign(challengeInfo.data.challenge.text, address)

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

        localStorage.setItem('accessToken', authData.data.authenticate.accessToken)
        localStorage.setItem('refreshToken', authData.data.authenticate.refreshToken)

        alert('You are successfully connected to Lens.')
      } catch (err) {
        await walletDisconnect()
        alert(err?.message)
      }
    }

    /**
     * Main entry point.
     */
    init();
    document.querySelector("#main_login_btn").addEventListener("click", walletConnect);
    document.querySelector("#main_disconnect_btn").addEventListener("click", walletDisconnect);
  }, 500);
}