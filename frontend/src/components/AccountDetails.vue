<script setup>
import { storeToRefs } from "pinia";
import { useWalletStore } from "@/stores/wallet";
const wallet = useWalletStore();
const { state, isWrongNetwork } = storeToRefs(wallet);
const { connectWallet, changeNetwork, disconnect } = useWalletStore();
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <!-- stavio sam u button i anchor zbog vizualnih efekata, vj se sve to može postaviti sa tailwind -->
    <button>
      <a
        class="text-xl mb-2"
        v-if="isWrongNetwork && state.isConnected"
        @click="changeNetwork"
      >
        <!-- (na vrhu ekrana kao warning) -->
        {{ state.networkError }}
      </a>
    </button>
    <button
      class="bg-green-900 text-white inline-flex items-center rounded h-10 p-5 transition hover:scale-110 mb-4"
      v-on:click="connectWallet"
      v-if="!state.isConnected"
    >
      Connect to Metamask
    </button>

    <button
      class="bg-green-900 text-white inline-flex items-center rounded h-10 p-5 transition hover:scale-110 mt-4 mb-2"
      v-on:click="disconnect"
      v-else
    >
      Disconnect
    </button>
  </div>
</template>
