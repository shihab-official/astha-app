import moment from 'moment';

export const state = () => ({
  _updatingState: false,
  _holidays: [],
  _updatedHolidays: [],
  _leaves: [],
});

export const getters = {
  loading: ({ _updatingState }) => _updatingState,

  holidays: ({ _holidays }) => {
    return _holidays.map((holiday) => ({
      ...holiday,
      utc_date: holiday.date,
      date: moment(holiday.date).format('DD-MMM-YYYY'),
      moment: moment(holiday.date),
    }));
  },

  leaves: ({ _leaves }) => {
    const leaves = {},
      keys = Object.keys(_leaves).map((k) => ({
        raw: k,
        formatted: moment(k).format('DD-MMM-YYYY'),
      }));

    keys.forEach((k) => {
      leaves[k.formatted] = _leaves[k.raw];
    });
    return leaves;
  },
};

export const mutations = {
  LOADING: (state, loadingState) =>
    (state._updatingState = loadingState || false),

  SET_HOLIDAYS: (state, holidays) => (state._holidays = holidays),

  SET_HOLIDAY: (state, holiday) => {
    const index = state._holidays.findIndex((h) => h._id == holiday._id);
    state._holidays.splice(index, 1, holiday);
    const updateIndex = state._updatedHolidays.findIndex(
      (h) => h._id == holiday._id
    );
    if (updateIndex == -1) {
      state._updatedHolidays.push(holiday);
    } else {
      state._updatedHolidays.splice(updateIndex, 1, holiday);
    }
  },

  CLEAR_UPDATED_HOLIDAYS: (state) => {
    state._updatedHolidays = [];
  },

  SET_LEAVE_INFO: (state, leaves) => (state._leaves = leaves),

  ADD_LEAVE_INFO: (state, leave) => {
    const date = moment(leave.date).format('DD-MMM-YYYY');
    const obj = state._leaves[date];
    if (!obj) {
      state._leaves[date] = [];
    }
    const idx = state._leaves[date].findIndex(
      (user) => user.user_id === leave.data.user_id
    );
    if (idx === -1) {
      state._leaves[date].push(leave.data);
    } else {
      state._leaves[date].splice(idx, 1, leave.data);
    }
  },

  DELETE_LEAVE_INFO: (state, leave) => {
    let index = state._leaves[leave.date].findIndex(
      (user) => user.user_id === leave.user_id
    );
    state._leaves[leave.date].splice(index, 1);
  },
};

export const actions = {
  getHolidays({ commit }) {
    commit('LOADING', true);
    this.$axios
      .get('/holiday/all')
      .then((res) => {
        commit('SET_HOLIDAYS', res.data);
        commit('LOADING');
      })
      .catch((error) => {
        console.error(error);
        commit('LOADING');
        return;
      });
  },

  setHoliday({ commit }, holiday) {
    commit('SET_HOLIDAY', holiday);
  },

  updateHolidays({ commit, state }, showSuccess, showError) {
    this.$axios
      .put('/holiday/update', state._updatedHolidays)
      .then((res) => {
        showSuccess(res.data.message);
        commit('CLEAR_UPDATED_HOLIDAYS');
        commit('LOADING');
      })
      .catch((error) => {
        console.error(error);
        showError('Holiday list could not be updated. You can try again. For detail about the error, please check log.');
        commit('LOADING');
        return;
      });
  },

  getLeaveInfo({ commit }) {
    this.$axios
      .get('/leave/all')
      .then((res) => {
        commit('SET_LEAVE_INFO', res.data);
        commit('LOADING');
      })
      .catch((error) => {
        console.error(error);
        commit('LOADING');
        return;
      });
  },

  addLeaveInfo({ commit }, leaveInfo) {
    commit('LOADING', true);
    leaveInfo.dates.forEach((date) => {
      commit('ADD_LEAVE_INFO', {
        date: date,
        data: {
          user_id: leaveInfo.user_id,
          user_name: leaveInfo.user_name,
          name: leaveInfo.name,
          ...leaveInfo.leave,
        },
      });
    });
  },

  deleteLeaveInfo({ commit }, leave) {
    commit('DELETE_LEAVE_INFO', leave);
  },
};
