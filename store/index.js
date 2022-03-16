export const state = () => {
  return {
    personal_leaves: 14
  }
};

export const getters = {
  personalLeaves: ({personal_leaves}) => personal_leaves
}

export const mutations = {
  SET_PERSONAL_LEAVE: (state, leaveCount) => state.personal_leaves = leaveCount
}

export const actions = {
  setPersonalLeave: ({commit}, leaveCount) => {
    commit('SET_PERSONAL_LEAVE', leaveCount);
  }
}