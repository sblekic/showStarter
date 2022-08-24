<script setup>
import { storeToRefs } from "pinia";
import { useWalletStore } from "@/stores/wallet";
const wallet = useWalletStore();
const { state, isWrongNetwork } = storeToRefs(wallet);
const { connectWallet, disconnect } = useWalletStore();
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <p class="text-xl mb-2" v-if="isWrongNetwork && state.isConnected">
      <!-- (na vrhu ekrana kao warning) -->
      {{ state.networkError }}
    </p>
    <button
      class="bg-green-900 inline-flex items-center rounded h-10 p-5 transition hover:scale-110 mb-4"
      v-on:click="connectWallet"
      v-if="!state.isConnected"
    >
      Connect to Metamask
    </button>

    <button
      class="bg-green-900 inline-flex items-center rounded h-10 p-5 transition hover:scale-110 mt-4 mb-2"
      v-on:click="disconnect"
      v-else
    >
      Disconnect
    </button>

    <p class="text-xl mb-2">Shitty dashboard sa osnovnim podacima o accountu</p>
    <div>
      <p class="">Connection status: {{ state.isConnected }}</p>
      <p>Address: {{ state.currAccount }}</p>
      <p>Chain id: {{ state.chainId }}</p>
      <p>Network Error: {{ state.networkError }}</p>
    </div>
  </div>
</template>
