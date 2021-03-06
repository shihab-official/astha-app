<template>
  <div>
    <a-form :layout="formLayout" :form="form" @submit="submit">
      <div class="flex justify-between">
        <div class="flex">
          <a-form-item label="Start Date">
            <a-date-picker
              style="width: 128px"
              ref="startDate"
              :format="dateFormat"
              :disabled-date="disabledDate"
              :allow-clear="false"
              v-model="startDate"
              placeholder="Start"
              @change="onDateChange('start', $event)"
            />
          </a-form-item>
          <a-form-item label="End Date" style="margin-left: 10px">
            <a-date-picker
              style="width: 128px;"
              ref="endDate"
              :format="dateFormat"
              :disabled-date="disabledDate"
              :allow-clear="false"
              v-model="endDate"
              placeholder="End"
              :open="endOpen"
              @openChange="handleEndOpenChange"
              @change="onDateChange('end', $event)"
            />
          </a-form-item>
        </div>
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
          v-decorator="['leave.option', { initialValue: leave.option }]"
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
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { startOfDay, getDatesInRange } from '~/helpers/date-helper';

export default {
  name: 'PersonalLeaveForm',
  props: ['start'],
  data() {
    return {
      startDate: this.start,
      endDate: this.start,
      endOpen: false,
      formLayout: 'vertical',
      form: this.$form.createForm(this),
      dateFormat: 'DD-MMM-YYYY',
      dateRange: [this.start, this.start],
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
          start: startOfDay(this.dateRange[0]),
          end: startOfDay(this.dateRange[1]),
          format: this.dateFormat,
          holidays: this.holidays,
        });
        datesInRange = datesInRange.filter((date) => {
          return !date.weekend && !date.holiday;
        });
      }
      return datesInRange;
    },
  },
  created() {
    setTimeout(() => {
      this.endOpen = true;
    }, 400);
  },
  methods: {
    ...mapActions('calendar', ['getLeaveInfo']),
    disabledDate(current) {
      return (
        current.day() > 4 ||
        this.approvedHolidays.includes(current.format('DD-MMM-YYYY')) ||
        current.isBefore(moment().add(-2, 'week'))
      );
    },
    onChange(range) {
      this.dateRange = range;
    },
    handleEndOpenChange(open) {
      if (this.startDate) {
        this.endOpen = open;
      }
    },
    onDateChange(type, moment) {
      let startDate = type == 'start' ? moment : this.$refs['startDate'].value;
      let endDate = type == 'end' ? moment : this.$refs['endDate'].value;

      if (endDate.isBefore(startDate)) {
        this.startDate = endDate;
        this.endDate = startDate;
      } else {
        this.startDate = startDate;
        this.endDate = endDate;
      }
      this.onChange([this.startDate, this.endDate]);
    },
    submit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const leaveData = {
            user_id: this.$auth.user._id,
            user_name: this.$auth.user.user_name,
            name: this.$auth.user.short_name,
            dates: this.datesInRange.map((date) => {
              return date.moment.toDate();
            }),
            leave: {
              option: values.leave.option ?? this.leave.option,
              detail: `<p>${values.leave.detail}</p>`,
            },
          };
          this.$axios
            .post('leave/apply', leaveData)
            .then((res) => {
              this.getLeaveInfo(leaveData);
              const user = this.$auth.user;
              this.$auth.setUser({ ...user, leaves_taken: res.data });
              this.$emit('leaveApplied');
              this.$router.push(`/`);
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
