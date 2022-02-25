<template>
  <div>
    <h1>Personal Leave form</h1>
    <hr />
    <a-form>
      <a-form-item label="Date">
        <a-range-picker
          class="range-picker"
          :disabled-date="disabledDate"
          :value="dateRange"
          :format="dateFormat"
          @change="onChange"
        />
        <a-radio-group v-if="sameDay" v-model="option" @change="onOptionChange">
          <a-radio
            v-for="option of options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Reason">
        <a-textarea placeholder="Reason" v-model="reason" :auto-size="{ minRows: 4 }" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="submit"> Submit </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.ant-radio-group {
  margin-left: 3rem;
}
</style>

<script>
import { getDatesInRange } from '~/server-middleware/utilities/date';

export default {
  name: 'PersonalLeave',
  data() {
    return {
      dateRange: [],
      option: 3,
      reason: '',
    };
  },
  computed: {
    options: function () {
      return [
        {
          value: 3,
          label: 'Full day',
        },
        {
          value: 1,
          label: '1st half',
        },
        {
          value: 2,
          label: '2nd half',
        },
      ];
    },
    dateFormat: function () {
      return 'DD-MMM-YYYY';
    },
    sameDay: function () {
      if (this.dateRange.length > 0) {
        return this.dateRange[0].isSame(this.dateRange[1], 'day');
      }
      return false;
    },
    datesInRange: function () {
      return getDatesInRange(this.dateRange[0], this.dateRange[1], this.dateFormat);
    },
  },
  mounted: () => {
    document.title = 'Personal Leave';
  },
  methods: {
    disabledDate: function (current) {
      return current && current.day() > 4;
    },
    onChange: function (range) {
      this.dateRange = range;
    },
    onOptionChange: function (option) {
      this.option = option.target.value;
    },
    submit: function () {
      this.$axios
        .post(`/api/leave-application`, {
          email: this.$auth.user.email,
          dates: this.datesInRange.map(function (date) {
            return {
              code: date.code,
              weekend: date.weekend,
            };
          }),
          option: this.options.filter((opt) => {
            return opt.value === this.option;
          })[0].label,
          count: this.dateRange[1].diff(this.dateRange[0], 'days') + 1,
          reason: this.reason,
        })
        .then((res) => {
          if (res.status == 200) {
            this.$router.push('/');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
