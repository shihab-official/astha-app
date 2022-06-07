import moment from 'moment';

export const state = () => ({
  _updatingState: false,
  _users: [],
  _filteredUsers: null,
  _logs: [],
});

export const getters = {
  loading: ({ _updatingState }) => _updatingState,

  users: ({ _users, _filteredUsers }) => _filteredUsers ?? _users,

  logs: ({ _logs }) => {
    const logs = {};
    _logs.forEach((l) => {
      const log = {};
      if (l.work) {
        log.work = l.work;
      }
      if (l.leave) {
        log.leave = l.leave;
      }
      logs[`${l.user_name}_${moment(l.date).format('YYYYMMDD')}`] = log;
    });
    return logs;
  },
};

export const mutations = {
  LOADING: (state, loadingState) => {
    state._updatingState = loadingState || false;
  },

  SET_USERS: (state, users) => {
    state._users = users || state._users;
  },

  FIND_USERS: (state, key) => {
    state._filteredUsers = !key
      ? null
      : state._users.filter((_user) => {
          const userInfo = `${_user.name}\n${_user.short_name}\n${
            _user.email
          }\n${_user.mobile || ''}\n${_user.dob || ''}\n${
            _user.roles || ''
          }`.toLowerCase();
          return userInfo.indexOf(key.toLowerCase()) !== -1;
        });
  },

  SET_USER: (state, userInfo) => {
    let index = -1;
    let user = state._users.find((u, i) => {
      if (u.user_name === userInfo.user_name) {
        index = i;
        return true;
      } else {
        return false;
      }
    });

    if (user) {
      user = { ...user, ...userInfo };
    }

    state._users.splice(index, 1, user);
  },

  SET_LOGS: (state, logs) => {
    state._logs = logs;
  },
};

export const actions = {
  getLogsByDate({ commit }, dateRange) {
    if (this.$auth.user.admin) {
      commit('LOADING', true);
      dateRange = dateRange.map((m) => m.toDate());
      this.$axios
        .get('log/by-dates', {
          params: {
            range: dateRange,
          },
        })
        .then((res) => {
          commit('SET_LOGS', res.data.logs);
          commit('LOADING');
        })
        .catch((error) => {
          console.error(error);
          commit('LOADING');
          return;
        });
    }
  },

  getUsers({ commit }, active) {
    commit('LOADING', true);
    let params = {};
    if (active === false) {
      params = {active};
    }

    this.$axios
      .get('user/all', {params})
      .then((res) => {
        commit(
          'SET_USERS',
          res.data.map((user) => {
            let roles = '';
            roles += user.show_log ? ' show log' : '';
            roles += user.team_lead ? ' team lead' : '';
            roles += user.manager ? ' manager' : '';
            roles += user.admin ? ' admin' : '';
            user.roles = roles;
            return user;
          })
        );
        commit('LOADING');
      })
      .catch((error) => {
        console.error(error);
        commit('LOADING');
        return;
      });
  },

  findUsers({ commit }, key) {
    commit('FIND_USERS', key);
  },

  setUser({ commit }, user) {
    commit('SET_USER', user);
  },
};
