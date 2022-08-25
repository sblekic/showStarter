import { reactive, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

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

    // ova funkcija stoji ovdje u slučaju da želim nešto isprobati
    async function testFn() {
      console.log("fn call testFn");
    }

    // computed property koja ovisi o stanju chainId property-a objekta state
    // ako korisnik je ulogiran i nije spojen na network aplikacije, na frontu se
    // prikazuje warning
    const isWrongNetwork = computed(() => {
      if (state.chainId !== APP_CHAIN_ID) {
        // kad bude trebalo, napisati network koji će app koristiti
        state.networkError = "Please connect Metamask to Localhost:8545";
        return true;
      } else {
        // reset error state
        state.networkError = undefined;
        return false;
      }
    });

    // s obzirom da isključivo user može odjaviti stranicu iz MM plugina,
    // odjava je simulirana na način da se resetira stanje aplikacije.
    function disconnect() {
      state.isConnected = false;
      state.currAccount = "";
      state.txError = undefined;
      // localStorage.removeItem("wallet");
    }

    window.ethereum.on("accountsChanged", (accounts) => {
      // u else pokrivam slučaj kada user manualno makne app iz connected apps u metamask
      console.log("accountsChanged()");
      if (accounts.length > 0) {
        state.currAccount = accounts[0];
      } else disconnect();
    });

    window.ethereum.on("chainChanged", (id) => {
      console.log("call: chainchanged()");
      state.chainId = id;
      // po metamask dokumentaciji preporučeno je ponovno učitavati stranicu.
      window.location.reload();
    });

    async function changeNetwork() {
      try {
        console.log("call: changeNetwork()");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `${APP_CHAIN_ID}` }],
        });
        state.chainId = APP_CHAIN_ID;
        window.location.reload();
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
        console.error("Greška: wallet_switchEthereumChain", switchError);
      }
    }

    async function connectWallet() {
      console.log("fn call connectWallet");

      // detectEthereumProvider mi pokrije slučaj kada je window.ethereum objekt injected asinkrono; mobile možda?
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

    return {
      state,
      testFn,
      connectWallet,
      changeNetwork,
      disconnect,
      isWrongNetwork,
    };
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
