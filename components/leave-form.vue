<template>
  <div>
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
      </a-form-item>
      <a-form-item  v-if="sameDay">
        <a-radio-group
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
      <a-form-item style="margin-bottom: 0">
        <a-button type="primary" @click="submit"> Submit </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getDatesInRange } from '~/server-middleware/utilities/date';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'PersonalLeaveForm',
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
    ...mapGetters('calendar', ['holidays']),
    approvedHolidays: function () {
      return this.holidays
        .filter((holiday) => holiday.approved)
        .map((holiday) => holiday.date);
    },
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
        return getDatesInRange({
          start: this.dateRange[0],
          end: this.dateRange[1],
          format: this.dateFormat,
          holidays: this.holidays,
        });
      }
      return [];
    },
  },
  methods: {
    ...mapActions('calendar', ['addLeaveInfo']),
    disabledDate(current) {
      return current.day() > 4 || this.approvedHolidays.includes(current.format('DD-MMM-YYYY'));
    },
    onChange(range) {
      this.dateRange = range;
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.addLeaveInfo({
            id: this.$auth.user.id,
            name: this.$auth.user.short_name,
            dates: this.datesInRange.map((date) => {
              return {
                code: date.code,
                offDay: date.weekend || date.holiday,
              };
            }),
            option: values.leave.option ?? this.leave.option,
            reason: values.leave.reason,
          }).then(() => {
            this.$emit('leaveApplied');
            this.$router.push(`/`);
          });
        }
      });
    },
  },
};
</script>
