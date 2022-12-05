<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useWalletStore } from "@/stores/wallet";
import { ethers } from "ethers";
import contractArtifact from "D:/Documents/Zavrsni/vjezbanje/dapp_demo/backend/artifacts/contracts/EventFactory.sol/EventFactory.json";
import proxyArtifact from "D:/Documents/Zavrsni/vjezbanje/dapp_demo/backend/artifacts/contracts/EventImplementation.sol/EventImplementation.json";
const wallet = useWalletStore();
const { state } = storeToRefs(wallet);

const provider = new ethers.providers.Web3Provider(window.ethereum);

const eventFactory = new ethers.Contract(
  "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  contractArtifact.abi,
  provider.getSigner(0)
);

const eventProxy = new ethers.Contract(
  "0xbf9fBFf01664500A33080Da5d437028b07DFcC55",
  proxyArtifact.abi,
  provider.getSigner(0)
);

const imeEventa = ref("");
const tokenSymbol = ref("");
const cijena = ref();
async function createEvent() {
  console.log(imeEventa.value);
  //   const eventAddr = await eventFactory.createEvent([23, "woodstock"]);
  const regEvent = await eventFactory.getEventById(1);
  console.log(regEvent);

  const tits = await eventProxy.name();
  console.log(tits);
  //   console.log(eventAdd);
}
</script>

<template>
  <form @submit.prevent="createEvent">
    <div class="mb-2">
      <input v-model="imeEventa" placeholder="ime eventa" />
    </div>
    <div class="mb-2">
      <input v-model="tokenSymbol" placeholder="event symbol" />
    </div>
    <div class="mb-2">
      <input v-model="cijena" placeholder="cijena ulaznice" />
    </div>
    <div>
      <button
        class="bg-green-900 inline-flex items-center rounded h-10 p-5 transition hover:scale-110 mt-4 mb-2"
      >
        createEvent()
      </button>
      <p>{{ state.currAccount }}</p>
      <p>{{ eventFactory.address }}</p>
    </div>
  </form>
</template>

<style scoped>
input {
  background: rgb(117, 122, 122);
}
</style>
