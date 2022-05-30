import moment from 'moment';

moment.fn.startOfDay = function () {
  return new Date(this.format('YYYY-MM-DD') + ' 00:00:00');
};

export default moment;
