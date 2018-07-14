import api from '../../api'
import { Notify } from 'quasar'

const state = {
  loggedIn: localStorage.getItem('loggedIn'),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  authInProcess: false
}

const getters = {
  loggedIn: state => state.loggedIn,
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken,
  authInProcess: state => state.authInProcess
}

const mutations = {
  initiateProcess (state) {
    state.authInProcess = true
  },
  login (state, payload) {
    localStorage.setItem('loggedIn', true)
    state.loggedIn = true
    localStorage.setItem('accessToken', payload.accessToken)
    state.accessToken = payload.accessToken
    localStorage.setItem('refreshToken', payload.refreshToken)
    state.refreshToken = payload.refreshToken
    state.authInProcess = false
  },
  updateToken (state, newToken) {
    localStorage.setItem('accessToken', newToken)
    state.accessToken = newToken
  },
  logout (state) {
    localStorage.removeItem('loggedIn')
    state.loggedIn = false
  },
  clearAccessToken (state) {
    localStorage.removeItem('accessToken')
    state.accessToken = null
  },
  clearRefreshToken (state) {
    localStorage.removeItem('refreshToken')
    state.refreshToken = null
  }
}

const actions = {
  register ({ commit }, payload) {
    let data = new FormData()
    data.append('username', payload.username)
    data.append('password', payload.password)
    data.append('email', payload.email)
    api.post('/register', data).then(function (response) {
      payload.accessToken = response.data.access_token
      payload.refreshToken = response.data.refresh_token
      Notify.create({
        type: 'positive',
        color: 'positive',
        message: 'メールを送信しました',
        detail: 'メールの確認用リンクからログインしてください。',
        position: 'top-right'
      })
    })
  },
  confirm ({ commit }, payload) {
    let data = new FormData()
    data.append('username', payload.username)
    data.append('password', payload.password)
    data.append('token', payload.token)
    api.post('/confirm', data).then(function (response) {
      payload.accessToken = response.data.access_token
      payload.refreshToken = response.data.refresh_token
      commit('login', payload)
      Notify.create({
        type: 'positive',
        color: 'positive',
        message: response.data.message,
        // detail: response.data.message,
        position: 'top-right'
      })
      // ログイン後、リダイレクト
      payload.router.push('/main/inquiries')
    }).catch(function (error) {
      console.log(error)
      alert(error)
    })
  },

  login ({ commit }, payload) {
    let data = new FormData()
    data.append('username', payload.username)
    data.append('password', payload.password)
    console.log('before login')
    api.post('/login', data, null).then(function (response) {
      payload.accessToken = response.data.access_token
      payload.refreshToken = response.data.refresh_token
      commit('login', payload)
      Notify.create({
        type: 'positive',
        color: 'positive',
        message: response.data.message,
        // detail: response.data.message,
        position: 'top-right'
      })
      // ログイン後、リダイレクト
      payload.router.push('/main/inquiries')
    })
  },

  changePassword ({ commit }, payload) {
    let data = new FormData()
    data.append('currentpassword', payload.currentpassword)
    data.append('newpassword', payload.newpassword)
    data.append('token', payload.token)
    api.post('/password/change', data).then(function (response) {
      payload.accessToken = response.data.access_token
      payload.refreshToken = response.data.refresh_token
      commit('login', payload)
      Notify.create({
        type: 'positive',
        color: 'positive',
        message: 'パスワードの変更完了',
        // detail: '再度ログインしてください。',
        position: 'top-right'
      })
      payload.router.push('/main/inquiries')
    })
  },

  requestPasswordReset ({ commit }, payload) {
    let data = new FormData()
    data.append('email', payload.email)
    api.post('/password/reset/request', data).then(function (response) {
      Notify.create({
        type: 'positive',
        color: 'positive',
        message: 'メール送信',
        detail: 'パスワードリセット用のメールを送りました。メールを確認してください。',
        position: 'top-right'
      })
    })
  },

  confirmPasswordReset ({ commit }, payload) {
    let data = new FormData()
    data.append('password', payload.password)
    data.append('email', payload.email)
    data.append('token', payload.token)
    api.post('/password/reset/confirm', data).then(function (response) {
      Notify.create({
        type: 'positive',
        color: 'positive',
        message: 'パスワードの変更完了',
        detail: '再度ログインしてください。',
        position: 'top-right'
      })
      payload.router.push('/login')
    })
  },

  secretAccess ({ commit }, payload) {
    let data = new FormData()
    api.post('/secret', data, payload.accessToken).then(function (response) {
      console.log('response:')
      console.log(response)
    }).catch(err => {
      console.log(err)
      commit('logout')
      commit('clearAccessToken')
      commit('clearRefreshToken')
      payload.router.push('/login')
    })
  },

  logout ({ commit }, payload) {
    let data = new FormData()
    // access tokenの無効化
    api.post('/logout/access', data, payload.accessToken).then(function (response) {
      commit('clearAccessToken')
    })
    // refresh tokenの無効化
    api.post('/logout/refresh', data, payload.refreshToken).then(function (response) {
      commit('clearRefreshToken')
    })
    // トークン無効化のレスポンスを待たずにログイン画面にリダイレクト
    commit('logout')
    payload.router.push('/login')
  }
}

export default {
  // namespaced: true, // 追加
  state,
  getters,
  actions,
  mutations
}
