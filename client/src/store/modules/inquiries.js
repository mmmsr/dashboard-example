import api from '../../api'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  allInquiries: state => state.all
}

// actions
const actions = {
  getAllInquiries ({ commit }, payload) {
    let data = new FormData()
    api.get('/inquiries', data, payload.accessToken).then(function (response) {
      console.log('response:')
      console.log(response)
      commit('setInquiries', response.data.inquiries)
    }).catch(err => {
      console.log(err)
      // payload.router.push('/login')
      // commit('logout')
      // commit('clearAccessToken')
      // commit('clearRefreshToken')
      // payload.router.push('/login')
    })
  }
}

// mutations
const mutations = {
  setInquiries (state, inquiries) {
    state.all = inquiries
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
