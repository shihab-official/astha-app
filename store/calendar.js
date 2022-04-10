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
      moment: moment(holiday.date)
    }));
  },

  leaves: ({ _leaves }) => {
    return _leaves;
  },
};

export const mutations = {
  LOADING: (state, loadingState) =>
    (state._updatingState = loadingState || false),

  SET_HOLIDAYS: (state, holidays) => (state._holidays = holidays),

  SET_HOLIDAY: (state, holiday) => {
    const index = state._holidays.findIndex((h) => h._id == holiday._id);
    state._holidays.splice(index, 1, holiday);
    const updateIndex = state._updatedHolidays.findIndex((h) => h._id == holiday._id);
    state._updatedHolidays.splice(updateIndex, 1, holiday);
  },

  SET_LEAVE_INFO: (state, leaves) => (state._leaves = leaves),

  ADD_LEAVE_INFO: (state, leave) => {
    const date = moment(leave.date, 'YYYYMMDD').format('DD-MMM-YYYY');
    const obj = state._leaves[date];
    if (!obj) {
      state._leaves[date] = [];
    }
    const idx = state._leaves[date].findIndex(
      (user) => user.id === leave.data.id
    );
    if (idx === -1) {
      state._leaves[date].push(leave.data);
    } else {
      state._leaves[date].splice(idx, 1, leave.data);
    }
  },

  DELETE_LEAVE_INFO: (state, leave) => {
    let index = state._leaves[leave.date].findIndex(
      (user) => user.id === leave.userID
    );
    state._leaves[leave.date].splice(index, 1);
  }
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

  setHolidays({ commit, state }) {
    this.$axios
      .put('/holiday/update', state._updatedHolidays)
      .then((res) => {
        commit('LOADING');
      })
      .catch((error) => {
        console.error(error);
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

  async addLeaveInfo({ commit }, leave) {
    commit('LOADING', true);
    return await this.$axios
      .post('/leave/apply', leave)
      .then((res) => {
        if (res.status == 200) {
          commit('LOADING');
          leave.dates.forEach((date) => {
            if (!date.offDay) {
              commit('ADD_LEAVE_INFO', {
                date: date.code,
                data: {
                  type: 'leave',
                  id: leave.id,
                  label: leave.name,
                  option: leave.option,
                  reason: leave.reason,
                },
              });
            }
          });
        }
        return res.data;
      })
      .catch((error) => {
        commit('LOADING');
        console.error(error);
      });
  },

  deleteLeaveInfo({commit}, leave) {
    commit('DELETE_LEAVE_INFO', leave);
  }
};
