import moment from 'moment';

export const state = () => ({
  _updatingState: false,
  _holidays: [],
  _leaves: []
});

export const getters = {
  loading: ({ _updatingState }) => _updatingState,

  holidays: ({ _holidays }) => {
    return _holidays.map((holiday) => ({
      ...holiday,
      moment: moment(holiday.date, 'DD-MMM-YYYY'),
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
    const index = state._holidays.findIndex(h => h.id == holiday.id);
    state._holidays.splice(index, 1, holiday);
  },

  SET_LEAVE_INFO: (state, leaves) => state._leaves = leaves
};

export const actions = {
  getHolidays({ commit }) {
    commit('LOADING', true);
    this.$axios
      .get('api/holidays')
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

  setHoliday({commit}, holiday) {
    commit('SET_HOLIDAY', holiday);
  },

  setHolidays({commit, state}) {
    this.$axios
      .post('api/holidays', state._holidays)
      .then((res) => {
        commit('LOADING');
      })
      .catch((error) => {
        console.error(error);
        commit('LOADING');
        return;
      });
  },

  getLeaveInfo({commit}) {
    this.$axios
      .get('api/leave-info')
      .then((res) => {
        commit('SET_LEAVE_INFO', res.data);
        commit('LOADING');
      })
      .catch((error) => {
        console.error(error);
        commit('LOADING');
        return;
      });
  }
};
