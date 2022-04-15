export const state = () => ({
  _updatingState: false,
  _users: [],
  _filteredUsers: null,
});

export const getters = {
  loading: ({ _updatingState }) => _updatingState,

  users: ({ _users, _filteredUsers }) => _filteredUsers ?? _users,

  logs({ _users }) {
    const userIDs = {};
    _users.forEach((user) => {
      if (user.show_log) {
        const logCodes = Object.keys(user.log || {});
        const userLogs = {};

        logCodes.forEach((code) => {
          const userLog = user.log[code];
          const newLog = [];
          const keys = Object.keys(userLog);
          if (keys.length === 1) {
            newLog.push(userLog[keys[0]]);
          } else if (keys.length === 2) {
            newLog.push(userLog.work);
            newLog.splice(userLog.leave.option, 0, userLog.leave);
          }
          userLogs[code] = newLog;
        });
        userIDs[user.user_id] = userLogs;
      }
    });
    return userIDs;
  },
};

export const mutations = {
  LOADING: (state, loadingState) =>
    (state._updatingState = loadingState || false),

  SET_USERS: (state, users) => {
    state._users = users || state._users;
  },

  FIND_USERS: (state, key) => {
    state._filteredUsers = !key
      ? null
      : state._users.filter((_user) => {
          const userInfo = `${_user.name}\n${_user.short_name}\n${_user.email}\n${_user.mobile || ''}\n${_user.dob || ''}`.toLowerCase();
          return userInfo.indexOf(key) !== -1;
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
};

export const actions = {
  getUsersWithLogs({ commit }, datesInRange) {
    if (this.$auth.user.admin) {
      commit('LOADING', true);
      this.$axios
        .get('/log/by-dates', {
          params: {
            range: datesInRange.map(function (date) {
              return date.code;
            }),
          },
        })
        .then((res) => {
          const users = res.data.sort(function (a, b) {
            const nameA = a.short_name.toLowerCase(),
              nameB = b.short_name.toLowerCase();
            return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
          });

          commit('SET_USERS', users);
          commit('LOADING');
        })
        .catch((error) => {
          console.error(error);
          commit('LOADING');
          return;
        });
    }
  },

  getUsers({ commit }) {
    commit('LOADING', true);
    this.$axios
      .get('/user/all')
      .then((res) => {
        const users = res.data.sort(function (a, b) {
          const nameA = a.short_name.toLowerCase(),
            nameB = b.short_name.toLowerCase();
          return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
        });

        commit('SET_USERS', users);
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
