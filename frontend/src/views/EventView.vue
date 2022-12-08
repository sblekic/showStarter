<script setup>
import { reactive, onBeforeMount } from "vue";
import { ethers } from "ethers";
import contractArtifact from "D:/Documents/Zavrsni/vjezbanje/dapp_demo/backend/artifacts/contracts/EventFactory.sol/EventFactory.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const eventFactory = new ethers.Contract(
  "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  contractArtifact.abi,
  provider.getSigner(0)
);

// ako ne stavim u reactive onda mi se ne azurira dom
// zbog asinkronosti fetch funkcije
let eventList = reactive({
  list: [],
});

async function getEvents() {
  let data = await eventFactory.getRegisteredEvents();
  console.log("getEvents()");
  console.log(data);
  for (let d of data) {
    let temp = {
      eventName: d.eventName,
      proxy: d.proxyAddress,
    };
    console.log("value in data ", temp);
    eventList.list.push(temp);
  }
}

onBeforeMount(() => {
  getEvents();
});

const stockImg = "https://via.placeholder.com/256";
</script>

<template>
  <div class="bg-gray-100">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
        <h2 class="text-2xl font-bold text-gray-900">Registered Events</h2>

        <div
          class="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0"
        >
          <div
            v-for="event in eventList.list"
            :key="event.proxy"
            class="group relative"
          >
            <div
              class="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
            >
              <img
                :src="stockImg"
                alt="Stock image with size text"
                class="h-full w-full object-cover object-center"
              />
            </div>
            <p class="mt-6 text-base font-semibold text-gray-900">
              {{ event.eventName }}
            </p>
            <h3 class="text-sm text-gray-500">
              <a href="#">
                <span class="absolute inset-0" />
                {{ event.proxy }}
              </a>
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
main {
  margin: 5vh;
}
</style>
