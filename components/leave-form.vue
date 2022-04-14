<template>
  <div>
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <div class="flex justify-between">
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
        <div class="text-center mb-auto">
          <div
            class="px-2 py-1 bg-red-100 border border-solid border-red-300 border-b-0 rounded-t-md"
          >
            Remaining
          </div>
          <h2
            class="p-1 mb-0 bg-red-100 border border-solid border-red-300 rounded-b-md"
          >
            {{ remainingLeaves }}
          </h2>
        </div>
      </div>
      <a-form-item v-if="sameDay">
        <a-radio-group
          v-decorator="['leave.option', {initialValue: leave.option}]"
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
            'leave.detail',
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
        detail: '',
      },
    };
  },
  computed: {
    ...mapGetters(['remainingLeaves']),
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
      let datesInRange = [];
      if (this.dateRange.length > 0) {
        datesInRange = getDatesInRange({
          start: this.dateRange[0].startOf('day'),
          end: this.dateRange[1].startOf('day'),
          format: this.dateFormat,
          holidays: this.holidays,
        });
        datesInRange = datesInRange.filter(date => {
          return !date.weekend && !date.holiday;
        });
      }
      return datesInRange;
    },
  },
  methods: {
    ...mapActions('calendar', ['addLeaveInfo']),
    disabledDate(current) {
      return (
        current.day() > 4 ||
        this.approvedHolidays.includes(current.format('DD-MMM-YYYY'))
      );
    },
    onChange(range) {
      this.dateRange = range;
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.addLeaveInfo({
            _id: this.$auth.user._id,
            // user_id: this.$auth.user.user_id,
            // name: this.$auth.user.short_name,
            dates: this.datesInRange.map((date) => {
              return date.moment.toDate();
            }),
            leave: {
              option: values.leave.option ?? this.leave.option,
              detail: values.leave.detail,
            }
          }).then((leaveCount) => {
            const user = this.$auth.user;
            const leaves_taken = user.leaves_taken + (leaveCount || 0);
            this.$auth.setUser({ ...user, leaves_taken });
            this.$emit('leaveApplied');
            this.$router.push(`/`);
          });
        }
      });
    },
  },
};
</script>
