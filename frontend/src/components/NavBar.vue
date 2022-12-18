<script setup>
import { storeToRefs } from "pinia";
import { useWalletStore } from "@/stores/wallet";
const wallet = useWalletStore();
const { state, isWrongNetwork } = storeToRefs(wallet);
const { connectWallet, disconnect, changeNetwork } = useWalletStore();
</script>

<template>
  <!-- alert koji usmjerava usera na promjenu chaina -->
  <div
    v-if="isWrongNetwork && state.isConnected"
    id="alert-border-1"
    class="flex p-4 mb-4 bg-blue-100 border-t-4 border-blue-500 dark:bg-blue-200"
    role="alert"
  >
    <div class="ml-auto text-sm font-medium text-blue-700">
      For the app to function as intended, please connect to the
      <a
        href="#"
        @click="changeNetwork"
        class="font-semibold underline hover:text-blue-800"
        >Polygon network</a
      >
    </div>
    <button
      type="button"
      class="ml-auto -mx-1.5 -my-1.5 bg-blue-100 dark:bg-blue-200 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 dark:hover:bg-blue-300 inline-flex h-8 w-8"
      data-dismiss-target="#alert-border-1"
      aria-label="Close"
    >
      <span class="sr-only">Dismiss</span>
      <svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
  </div>
  <nav
    class="fixed bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600"
  >
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <RouterLink :to="{ name: 'Home' }" class="flex items-center"
        ><img
          src="https://placeholder.pics/svg/32x33/4FFF3B-3969FF"
          class="h-6 mr-3 sm:h-9"
          alt="Showstarter Logo"
        />
        <span
          class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
          >ShowStarter</span
        >
      </RouterLink>
      <div class="flex md:order-2">
        <button
          v-on:click="connectWallet"
          v-if="!state.isConnected"
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Get started
        </button>
        <button
          v-on:click="disconnect"
          v-else
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {{ state.currAccount }}
        </button>

        <button
          data-collapse-toggle="navbar-sticky"
          type="button"
          class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-sticky"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-sticky"
      >
        <ul
          class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <RouterLink
              :to="{ name: 'CreateEvent' }"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >Create Event</RouterLink
            >
          </li>
          <li>
            <RouterLink
              :to="{ name: 'Home' }"
              class="block py-2 pl-3 pr-4 text-gray-700 bg-blue-700 md:hover:text-blue-700 rounded md:bg-transparent md:p-0 dark:text-white"
              aria-current="page"
              >Events</RouterLink
            >
          </li>

          <!-- <li>
            <RouterLink
              :to="{ name: 'Eventi' }"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >Eventi</RouterLink
            >
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
nav a.router-link-exact-active {
  color: rgb(26 86 219 / var(--tw-text-opacity));
}
</style>
