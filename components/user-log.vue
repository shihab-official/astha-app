<template>
  <div v-if="log" class="log relative" :class="leave">
    <div v-if="log.work">{{log.work.detail}}</div>
    <div v-if="log.leave" class="bg-red-50 text-red-600">{{log.leave.detail}}</div>
  </div>
</template>

<style scoped>
  .log {
    font: 0.8rem/1.5 monospace;
    margin: -5px -9px;
    white-space: pre-line;
  }
  .log>div {
    padding: 5px 9px;
  }
  .leave {
    margin: 0;
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 1px;
    left: 1px;
  }
  .leave>div {
    height: 100%;
  }
</style>

<script>
export default {
  props: ['date', 'id', 'log', 'logs'],
  computed: {
    leave: function() {
      const leaveOption = this.log.leave && this.log.leave.option;
      return leaveOption === 0 ? 'flex flex-col-reverse' : (leaveOption === 1 ? 'flex flex-col' : (leaveOption === 2 ? 'leave' : ''));
    }
  }
};
</script>