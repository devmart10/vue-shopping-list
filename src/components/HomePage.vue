<template>
  <div class="md:mt-32">
    <div class="flex flex-col w-full max-w-3xl p-8 mx-auto mb-4 border rounded-lg">
      <div class="flex items-start">
        <h1 class="text-3xl leading-loose">Welcome to Shopping List!</h1>
        <img alt="Vue logo" src="../assets/shopping_cart.png" class="object-contain h-32 ml-auto" />
      </div>
      <div class="flex mb-2 leading-loose">
        <span class="mr-2">Room code:</span>
        <span class="font-bold tracking-wider">{{code}}</span>
      </div>
      <hr class="mb-2" />
      <div class="flex mb-2">
        <span class="mr-2">Enter a room code</span>
        <input type="text" class="px-2 mr-2 border" v-model="userCode" />
        <button
          class="px-1 mr-2 font-bold text-orange-500 border border-orange-500"
          @click="handleCode"
        >Go</button>
        <!-- <button
          class="px-1 text-sm font-bold text-gray-500 underline border-orange-500"
          @click="handleCopy"
        >Copy</button>-->
      </div>
      <div class="flex">
        <span class="mr-2">or create a new one!</span>
        <button class="px-2 text-white bg-orange-500" @click="handleCreate">New List</button>
      </div>
    </div>
    <!-- --- -->
    <div class="flex flex-col w-full max-w-3xl p-8 mx-auto border rounded-lg">
      <div class="flex items-baseline px-2 leading-loose">
        <h2 class="mr-2 text-3xl underline">{{ list.name }}</h2>
        <span class="text-gray-500">{{ `(${total.completed}/${total.len} complete)` }}</span>
      </div>
      <GroceryItem
        v-for="(item, index) in list.items"
        :key="item.title"
        :item="item"
        @complete="markComplete(index)"
        @pop="remove(index)"
      />
      <div class="flex items-center px-2 leading-loose border-t">
        <h2 class="ml-auto mr-2">Est. Total: ${{ total.total }}</h2>
        <span class="text-sm text-gray-500">{{ `(${total.scored}/${total.len})` }}</span>
      </div>
      <div class="flex flex-wrap mt-2 md:flex-col">
        <input
          type="text"
          placeholder="New item..."
          v-model="newItem.title"
          class="w-auto px-2 mb-2 border md:w-50"
          @focus="toggleFocus"
          @blur="toggleFocus"
        />
        <button
          class="flex-grow px-1 mb-2 font-bold text-orange-500 border border-orange-500 md:w-50"
          @click="addNewItem"
        >Add Item</button>
        <div v-if="newItemFocus" class="flex">
          <input
            type="text"
            placeholder="Amount"
            v-model="newItem.quantity"
            class="w-full px-2 mb-2 border md:w-50"
          />
          <input
            type="text"
            placeholder="Price"
            v-model="newItem.price"
            class="w-full px-2 mb-2 border md:w-50"
          />
        </div>
      </div>
    </div>
    <!-- --- -->
  </div>
</template>

<script>
import { db } from "../db/db";
const lists = db.collection("grocery-lists");

import GroceryItem from "./GroceryItem";

export default {
  name: "HomePage",
  components: {
    GroceryItem
  },
  data: function() {
    return {
      userCode: "",
      code: "test",
      list: {},
      newItem: {
        title: "",
        quantity: "",
        price: ""
      },
      newItemFocus: false
    };
  },
  computed: {
    total() {
      // total price only including those with price
      const total = this.list.items.reduce((acc, cur) => {
        return cur.price ? Number(Number(acc) + Number(cur.price)) : acc;
      }, 0);
      // total that have a price TODO: combine into `total` reducer
      const scored = this.list.items.filter(item => {
        return item.price && item.price !== "";
      }).length;
      // total completed
      const completed = this.list.items.filter(item => {
        return item.complete;
      }).length;
      let len = this.list.items.length;
      return { total, scored, completed, len };
    }
  },
  watch: {
    code: {
      // call it upon creation too
      immediate: true,
      handler(code) {
        // add error handling for bad codes
        this.$bind("list", lists.doc(code));
      }
    }
  },
  methods: {
    handleCopy() {
      console.log(`copying...`);
      // document.execCommand("copy");
    },
    toggleFocus() {
      //   this.newItemFocus = !this.newItemFocus;
      this.newItemFocus = true;
    },
    remove(index) {
      this.list.items.splice(index, 1);
      this.$firestoreRefs.list.set(this.list).then(() => {});
    },
    handleCode() {
      this.code = this.userCode;
    },
    async handleCreate() {
      const ref = await lists.add({
        name: "New List",
        items: []
      });
      this.code = ref.Pc.path.segments[1];
      this.userCode = "";
    },
    markComplete(index) {
      this.list.items[index].complete = !this.list.items[index].complete;
      this.$firestoreRefs.list.set(this.list).then(() => {});
    },
    addNewItem() {
      this.list.items.push(this.newItem);
      this.$firestoreRefs.list.set(this.list).then(() => {
        this.newItem = {
          title: "",
          quantity: "",
          price: ""
        };
      });
    }
  }
};
</script>

<style></style>
