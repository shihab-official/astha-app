const moment = require('moment');

module.exports = {
  getDatesInRange: function (start, end, dateFormat) {
    const dates = [],
      diff = end.diff(start, 'days');

    for (let n = 0; n <= diff; n++) {
      const date =
        n === 0
          ? start
          : n === diff
          ? end
          : start.clone().add(n, 'day');
      dates.push({
        moment: date,
        formatted: date.format(dateFormat || 'DD-MMM-YYYY'),
        code: date.format('YYYYMMDD'),
        today: moment().isSame(date, 'day'),
        weekend: date.day() > 4,
      });
    }
    return dates;
  },
};
