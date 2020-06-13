<template>
  <div class="md:mt-32">
    <div class="flex flex-col w-full max-w-3xl p-8 mx-auto mb-4 border rounded-lg">
      <img alt="Vue logo" src="../assets/shopping_cart.png" class="object-contain h-32" />

      <h1 class="text-3xl">Welcome to Shopping List!</h1>
      <label for>
        Enter a code
        <input type="text" class="border" v-model="code" />
        <button class="px-1 mx-1 border" @click="handleCode">&rarr;</button>
      </label>
      <span>or create a new one!</span>
      <button class="text-white bg-orange-500" @click="handleCreate">New List</button>
    </div>
    <!-- --- -->
    <div class="flex flex-col w-full max-w-3xl p-8 mx-auto border rounded-lg">
      <h1 class="text-3xl leading-loose underline">{{ list.name }}</h1>
      <!-- <code class="break-all bg-gray-200 border">{{ JSON.stringify(list) }}</code> -->
      <div v-for="(item, index) in list.items" :key="item.title" class="flex items-center p-2">
        <div
          class="inline-block w-6 h-6 mr-2 border-2 border-orange-500 rounded-full"
          :class="{ 'bg-orange-500': item.complete }"
          @click="markComplete(index)"
        ></div>
        <div>
          <span class="mr-2 text-xl">{{ item.title }}</span>
          <span class="text-sm text-gray-700">{{ item.quantity ? `x${item.quantity}` : "" }}</span>
        </div>

        <span class="ml-auto">{{ item.price ? `$${item.price}` : "-" }}</span>
      </div>
      <div class="flex mt-2">
        <input type="text" placeholder="New item..." v-model="newItem.title" class="border" />
        <input type="text" placeholder="Quantity..." v-model="newItem.quantity" class="border" />
        <input type="text" placeholder="Price..." v-model="newItem.price" class="border" />
        <button class="px-1 mx-1 border" @click="addNewItem">&rarr;</button>
      </div>
    </div>
    <!-- --- -->
  </div>
</template>

<script>
import { db } from "../db/db";
const lists = db.collection("grocery-lists");

export default {
  name: "HomePage",
  data: function() {
    return {
      //   code: "Dyu8GaEC1MwyAiwXl1hE",
      code: "test",
      list: {},
      newItem: {
        title: "",
        quantity: "",
        price: "",
      },
    };
  },
  //   firestore: {
  //     documents: db.collection("grocery-lists").doc(),
  //   },
  watch: {
    code: {
      // call it upon creation too
      immediate: true,
      handler(code) {
        this.$bind("list", lists.doc(code));
      },
    },
  },
  methods: {
    handleCode() {
      console.log(`handling code ${this.code}`);
      console.log(`go to list page...`);
    },
    handleCreate() {
      console.log(`go to new list page...`);
      //   this.$firestoreRefs.cities.add({
      //     name: "Paris",
      //     slogan: "La Ville lumière",
      //   });
    },
    markComplete(index) {
      this.list.items[index].complete = !this.list.items[index].complete;

      this.$firestoreRefs.list.set(this.list).then(() => {
        console.log("list updated!");
      });
    },
    addNewItem() {
      this.list.items.push(this.newItem);

      this.$firestoreRefs.list.set(this.list).then(() => {
        console.log(`added ${this.newItem.title}!`);
        this.newItem = {
          title: "",
          quantity: "",
          price: "",
        };
      });
    },
  },
};
</script>

<style></style>
