import moment from 'moment';

export default {
  startOfDay: (date, format) => {
    return new Date(
      (format ? moment(date, format) : moment(date)).format('YYYY-MM-DD') +
        ' 00:00:00'
    );
  },
  // Find the all the dates between two dates.
  getDatesInRange: function ({ start, end, format, holidays }) {
    start = moment(start.format('DD-MMM-YYYY'));
    end = moment(end.format('DD-MMM-YYYY'));

    const dates = [],
      diff = end.diff(start, 'days');

    for (let n = 0; n <= diff; n++) {
      const date =
        n === 0 ? start : n === diff ? end : start.clone().add(n, 'day');

      const dateObject = {
        moment: date,
        formatted: date.format(format || 'DD-MMM-YYYY'),
        code: date.format('YYYYMMDD'),
        today: moment().isSame(date, 'day'),
        weekend: date.day() > 4,
      };

      if (holidays?.length > 0) {
        dateObject.holiday =
          holidays.findIndex(
            (day) => day.approved && day.date === date.format('DD-MMM-YYYY')
          ) !== -1;
      }

      dates.push(dateObject);
    }
    return dates;
  },
};
