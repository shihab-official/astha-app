<template>
  <div>
    <div class="flex items-baseline">
      <h3 class="m-0">Apply for Leave</h3>
      <NuxtLink to="/" class="ml-5 text-gray-400 text-sm">
        <a-icon type="double-left" class="text-xs" /> Back to Logs
      </NuxtLink>
    </div>
    <hr />
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <a-form-item label="Date">
        <a-range-picker
          class="range-picker"
          :format="dateFormat"
          :disabled-date="disabledDate"
          @change="onChange"
          v-decorator="[
            'dateRange',
            { rules: [{ required: true, message: 'Please select dates.' }] },
          ]"
        />
        <a-radio-group
          v-if="sameDay"
          :defaultValue="leave.option"
          v-decorator="['leave.option']"
        >
          <a-radio v-for="opt of options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Reason">
        <a-textarea
          placeholder="Reason"
          v-decorator="[
            'leave.reason',
            {
              rules: [
                { required: true, message: 'Please provide the reason.' },
              ],
            },
          ]"
          :auto-size="{ minRows: 4 }"
        />
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
      formLayout: 'vertical',
      form: this.$form.createForm(this),
      dateFormat: 'DD-MMM-YYYY',
      dateRange: [],
      leave: {
        option: 2,
        reason: '',
      },
    };
  },
  computed: {
    options: function () {
      return [
        {
          value: 2,
          label: 'Full day',
        },
        {
          value: 0,
          label: '1st half',
        },
        {
          value: 1,
          label: '2nd half',
        },
      ];
    },
    sameDay: function () {
      if (this.dateRange.length > 0) {
        return this.dateRange[0].isSame(this.dateRange[1], 'day');
      }
      return false;
    },
    datesInRange: function () {
      if (this.dateRange.length > 0) {
        return getDatesInRange(
          this.dateRange[0],
          this.dateRange[1],
          this.dateFormat
        );
      }
      return [];
    },
  },
  mounted: () => {
    document.title = 'Personal Leave';
  },
  methods: {
    disabledDate(current) {
      return current.day() > 4;
    },
    onChange(range) {
      this.dateRange = range;
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios
            .post('/api/leave-application', {
              id: this.$auth.user.id,
              dates: this.datesInRange.map(function (date) {
                return {
                  code: date.code,
                  weekend: date.weekend,
                };
              }),
              option: values.leave.option ?? this.leave.option,
              reason: values.leave.reason,
            })
            .then((res) => {
              if (res.status == 200) {
                this.$router.push(`/`);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    },
  },
};
</script>
