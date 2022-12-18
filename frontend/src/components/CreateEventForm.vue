<script setup>
import { ref } from "vue";
import { ethers } from "ethers";
import contractArtifact from "D:/Documents/Zavrsni/vjezbanje/dapp_demo/backend/artifacts/contracts/EventFactory.sol/EventFactory.json";
import proxyArtifact from "D:/Documents/Zavrsni/vjezbanje/dapp_demo/backend/artifacts/contracts/EventImplementation.sol/EventImplementation.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const eventFactory = new ethers.Contract(
  "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  contractArtifact.abi,
  provider.getSigner(0)
);

// deklarirao sam ga samo da vidim ako radi proxy
const eventProxy = new ethers.Contract(
  "0xbf9fBFf01664500A33080Da5d437028b07DFcC55",
  proxyArtifact.abi,
  provider.getSigner(0)
);

const imeEventa = ref("");
const tokenSymbol = ref("");
const cijena = ref();
async function createEvent() {
  const eventAddr = await eventFactory.createEvent([2, "loolapalooza"]);
  const regEvent = await eventFactory.getEventById(1);
  console.log(regEvent);
  const eventList = await eventFactory.getRegisteredEvents();
  console.log(eventList);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center mt-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-5">Register event</h2>

    <form
      @submit.prevent="createEvent"
      class="flex flex-col items-center justify-center"
    >
      <div class="mb-2">
        <input v-model="imeEventa" placeholder="ime eventa" />
      </div>
      <div class="mb-2">
        <input v-model="tokenSymbol" placeholder="event symbol" />
      </div>
      <div class="mb-2">
        <input v-model="cijena" placeholder="cijena ulaznice" />
      </div>
      <button
        class="bg-green-800 text-white inline-flex items-center rounded h-10 p-5 transition hover:scale-110 mt-4 mb-2"
      >
        createEvent()
      </button>
    </form>
  </div>
</template>

<style scoped>
input {
  /* background: rgb(117, 122, 122); */
  border: 1px solid black;
  text-align: center;
}
</style>
