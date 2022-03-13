<template>
  <td
    class="log-content relative"
    :class="`${date.formatted}
            ${
              date.weekend
                ? 'weekend text-center align-middle text-gray-400 bg-gray-50'
                : ''
            }`"
  >
    <template v-if="userLog[date.code]">
      <template v-for="(logData, i) of logs[id][date.code]">
        <pre
          :key="i"
          :class="`${logData.reason ? 'leave text-red-600' : ''} ${logs[id][date.code].length === 2 ? 'relative' : ''}`"
          >{{ logData.content || logData.reason }}</pre
        >
      </template>
    </template>
  </td>
</template>

<style scoped>
td {
  white-space: normal;
  min-height: 34px;
  padding: 0;
}
.log-content:not(.weekend) {
  min-width: 350px;
  max-width: 350px;
}
.log-content {
  vertical-align: top;
}
td.weekend:before {
  content: 'Weekend';
  font-size: 75%;
  letter-spacing: 0.5px;
  display: block;
  padding: 8px;
}
td pre {
  font-size: 90%;
  white-space: break-spaces;
  padding: 4px 8px;
  margin: 2px;
}
td pre.leave {
  margin: 0;
}
td pre.leave:before {
  content: '';
  background-color: rgb(255 0 0 / 10%);
  position: absolute;
  top: 2px;
  right: 2px;
  bottom: 2px;
  left: 2px;
}
</style>

<script>
export default {
  props: ['date', 'id', 'userLog', 'logs'],
};
</script>
