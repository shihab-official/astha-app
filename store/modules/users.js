export default {
  state: () => [
    {
      id: 1,
      name: 'User 1',
    },
    {
      id: 2,
      name: 'User 2',
    },
  ],

  getters: {
    getUsers: (state) => state.users,
  },

  actions: {},

  mutations: {},
};
