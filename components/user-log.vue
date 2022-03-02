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
      <template v-for="(logData, i) in logs[email][date.code]">
        <pre
          :key="i"
          :class="`${logData.reason ? 'leave text-red-600' : ''} ${logs[email][date.code].length === 2 ? 'relative' : ''}`"
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
  font-size: 0.8rem;
  white-space: break-spaces;
  padding: 4px 8px;
  margin: 2px;
}
td pre:nth-child(2) {
    border-top: dashed 1px rgba(0, 0, 0, 0.2);
}
</style>

<script>
export default {
  props: ['date', 'email', 'userLog', 'logs'],
};
</script>
