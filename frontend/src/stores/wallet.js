import { reactive, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import detectEthereumProvider from "@metamask/detect-provider";

export const useWalletStore = defineStore(
  "wallet",
  () => {
    //mijenjam vrijednost varijable umjesto da idem svugdje zamjeniti ručno. trenutno postavljeno na hardhat chainId
    const APP_CHAIN_ID = "0x7a69";

    const state = reactive({
      //frontend; use for v-if blocks, display content if user is logged in
      isConnected: false,
      currAccount: "",
      chainId: "",
      //frontend; ako želim izbaciti warning da je user na krivom bc-u
      networkError: undefined,
      //debugging, možda isto za frontend warning
      txError: undefined,
    });

    async function testFn() {
      console.log("fn call testFn");
    }
    const isWrongNetwork = computed(() => {
      if (state.chainId !== APP_CHAIN_ID) {
        //kad bude trebalo, napisati network koji će app koristiti
        state.networkError = "Please connect Metamask to Localhost:8545";
        return true;
      } else {
        state.networkError = undefined;
        return false;
      }
    });

    function disconnect() {
      state.isConnected = false;
      state.currAccount = "";
      state.txError = undefined;
      localStorage.removeItem("wallet");
    }

    window.ethereum.on("chainChanged", (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      state.chainId = chainId;
      window.location.reload();
    });

    async function changeNetwork() {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `${APP_CHAIN_ID}` }],
        });
        state.chainId = APP_CHAIN_ID;
        window.location.reload();
        console.log("usao u switch network");
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `${APP_CHAIN_ID}`,
                  chainName: "Localhost 8545",
                  rpcUrls: ["http://localhost:8545"],
                },
              ],
            });
            state.chainId = APP_CHAIN_ID;
            window.location.reload();
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
    }

    async function connectWallet() {
      console.log("fn call connectWallet");
      const metamask = await detectEthereumProvider({ mustBeMetaMask: true });
      if (metamask) {
        try {
          console.log("Metamask detected");

          const [accounts] = await metamask.request({
            method: "eth_requestAccounts",
          });
          state.currAccount = accounts;

          state.chainId = await metamask.request({
            method: "eth_chainId",
          });
          //if the try block succeeds, user is logged in
          state.isConnected = true;

          if (state.chainId !== APP_CHAIN_ID) {
            await changeNetwork();
          }
        } catch (error) {
          if (error.code === 4001) {
            console.log("Please connect to Metamask.");
          } else {
            console.error(error);
          }
        }
      } else {
        console.error("Please install Metamask.");
      }
    }

    return { state, testFn, connectWallet, disconnect, isWrongNetwork };
  },
  {
    //piniaPluginPersistedstate - option to enable persisted storage with default settings
    //default settings available at the plugins page. At the moment i'm using the localStorage to
    //persist the login state on refresh
    persist: true,
  }
);

//hot module replacement; changes in store are hot reloaded
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot));
}
