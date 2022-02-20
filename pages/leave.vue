<template>
  <div>
    <h1>Personal Leave form</h1>
    <hr />
    <a-form>
      <a-form-item label="Date">
        <a-range-picker
        class="range-picker"
        :disabled-date="disabledDate"
        :allowClear="false"
        :value="dateRange"
        :format="dateFormat"
        @change="onChange"
      />
      </a-form-item>
      <a-form-item label="Reason">
        <a-textarea placeholder="Reason" v-model="log" :rows="4" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="submit()"> Submit </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'PersonalLeave',
  data() {
    return {
      date: moment(new Date()),
      log: '',
    };
  },
  computed: {
    dateFormat: function() {
      return 'DD-MMM-YYYY';
    }
  },
  mounted: () => {
    document.title = 'Personal Leave';
  },
};
</script>
