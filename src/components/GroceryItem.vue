<template>
  <div class="flex items-center p-2">
    <div
      class="inline-block w-6 h-6 mr-2 border-2 border-orange-500 rounded-full"
      :class="{ 'bg-orange-500': item.complete }"
      @click="complete"
    ></div>
    <div>
      <span class="mr-2 disabled">{{ item.title }}</span>
      <span class="text-sm text-gray-700">{{ item.quantity ? `${item.quantity}` : "" }}</span>
    </div>
    <span class="ml-auto mr-2">{{ item.price ? `$${item.price}` : "-" }}</span>
    <button class="px-1 text-xs underline" @click="pop">delete</button>
  </div>
</template>

<script>
export default {
  name: "GroceryItem",
  props: ["item"],
  data: function() {
    return {
      editMode: false,
    };
  },
  methods: {
    complete() {
      this.$emit("complete");
    },
    edit() {
      this.editMode = true;
    },
    pop() {
      console.log(`pop()`);
      this.$emit("pop");
    },
  },
  watch: {
    editMode: {
      handler(editMode) {
        console.log(`editMode now ${editMode}`);
      },
    },
  },
};
</script>

<style></style>
