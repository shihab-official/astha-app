import $axios from '@nuxtjs/axios';

export const state = () => ({
  users: [],
});

export const getters = {
  userCount: (state) => state.users.length,
};

export const actions = {
  setUsers({commit}, users) {
    commit('SET_USERS', users);
  },
  // addUser: ({ commit }, user) => {
  //   commit('ADD_USER', user);
  // },
};

export const mutations = {
  SET_USERS: (state, users) => state.users = users,
  // ADD_USER: (state, user) => state.users.push(user),
};
