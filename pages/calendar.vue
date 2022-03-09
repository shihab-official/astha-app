<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="m-0">Calendar</h3>
      <span
        @click="add()"
        class="text-sm h-fit py-1 px-3 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white rounded cursor-pointer"
        >Add</span
      >
    </div>
    <hr>
    <pre>
      {{users}}
    </pre>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'calendar',
  computed: {
    ...mapState('user', ['users']),
    ...mapGetters('user', ['userCount']),
  },
  methods: {
    ...mapActions('user', ['addUser']),
    add() {
      this.addUser({ id: Date.now(), name: `User ${Date.now()}` });
    },
  },
};
</script>
