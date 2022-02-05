<template>
  <button @click="click($event)"><slot /></button>
</template>

<script>
export default {
  methods: {
    click(event) {
      this.$emit('click', event);
    },
  },
};
</script>
