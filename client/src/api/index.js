import axios from 'axios'
import jwtDecode from 'jwt-decode'
// import { mapActions } from 'vuex'
import { Notify } from 'quasar'

// const OPEN_PATHS = [
//   '/login'
// ]
export default {
  request (method, url, params, token) {
    let promise = null
    url = process.env.API_URL + url
    let headers = null
    if (token) {
      headers = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }

      // const isExpired = function (token, expirationSeconds) {
      //   let decoded = jwtDecode(token)
      //   let expiresAt = decoded.exp
      //   let timedelta = (Date.now() / 1000) - expiresAt
      //   if (timedelta > expirationSeconds) {
      //     console.log('token expired')
      //     return true
      //   }
      //   else {
      //     console.log('token NOT expired')
      //     return false
      //   }
      // }
      // const refresh (token) {
      //   const refleshUrl = process.env.API_URL + '/token/refresh'
      //   let data = new FormData()
      //   return axios.post(
      //     refleshUrl,
      //     data,
      //     {
      //       headers: {
      //         'Authorization': `Bearer ${refreshToken}`
      //       }
      //     })
      //     .then((response) => {
      //       localStorage.setItem('accessToken', response.data.access_token)
      //       axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
      //       originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token
      //       return axios(originalRequest)
      //     })
      //     .catch(err => {
      //       // refreshTokenも期限切れの場合、ここに来る?
      //       console.log('ERR!!!')
      //       console.log(err)
      //       // alert('refreshTokenも期限切れ?')
      //       return Promise.reject(err)
      //     })
      // }

      // // Request前に行う処理
      // axios.interceptors.request.use(function (config) {
      //   let path = config.url.slice(process.env.API_URL.length)
      //   let tokenRequired = false
      //   if (OPEN_PATHS.indexOf(path) === -1) {
      //     console.log('private path')
      //     tokenRequired = true
      //   }
      //   else {
      //     console.log('open path')
      //     tokenRequired = false
      //   }
      //   if (tokenRequired) {
      //     // console.log('token is set')
      //     // config.headers.Authorization = `Bearer ${token}`;
      //     if (isExpired(localStorage.getItem('accessToken'), process.env.JWT_ACCESS_TOKEN_EXPIRES)) {
      //       console.log('accessToken expired')
      //       if (isExpired(localStorage.getItem('refreshToken'), process.env.JWT_REFRESH_TOKEN_EXPIRES)) {
      //         console.log('refreshToken expired')
      //       }
      //       else {
      //         console.log('refreshToken not expired')
      //
      //         const refreshToken = localStorage.getItem('refreshToken')
      //         const refleshUrl = process.env.API_URL + '/token/refresh'
      //         let data = new FormData()
      //         return axios.post(
      //           refleshUrl,
      //           data,
      //           {
      //             headers: {
      //               'Authorization': `Bearer ${refreshToken}`
      //             }
      //           })
      //           .then((response) => {
      //             localStorage.setItem('accessToken', response.data.access_token)
      //             axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
      //             // originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token
      //             // return axios(originalRequest)
      //             return config
      //           })
      //           .catch(err => {
      //             // refreshTokenも期限切れの場合、ここに来る?
      //             console.log('ERR: failed to refresh before request!!!')
      //             console.log(err)
      //             // alert('refreshTokenも期限切れ?')
      //             return Promise.reject(err)
      //           })
      //       }
      //     }
      //     else {
      //       console.log('accessToken not expired')
      //     }
      //   }
      //   else {
      //     console.log('token is NOT set')
      //     return config
      //   }
      //
      //   return config
      // }, function (error) {
      //   console.log(error)
      // })
      //   if (this.isExpired(token)) {
      //     console.log('expired')
      //   }
      //   else {
      //     console.log('not expired')
      //   }
      //
      //   // // const token = cookie.get(__TOKEN_KEY__);
      //   // const accessToken = localStorage.getItem('accessToken')
      //   // let decoded = jwtDecode(accessToken)
      //   // let expirationTime = decoded.exp
      //   // let timedelta = (Date.now() / 1000) - expirationTime
      //   // if (timedelta > process.env.JWT_ACCESS_TOKEN_EXPIRES) {
      //   //   console.log('access token expired')
      //   //   // return Promise.reject()
      //   // }
      //   return config
      // }, function (error) {
      //   return Promise.reject(error)
      // })

      axios.interceptors.response.use(function (response) {
        return response
      }, function (error) {
        const originalRequest = error.config
        const refreshToken = localStorage.getItem('refreshToken')
        let decoded = jwtDecode(refreshToken)
        let expirationTime = decoded.exp
        let timedelta = (Date.now() / 1000) - expirationTime
        if (timedelta > process.env.JWT_REFRESH_TOKEN_EXPIRES) {
          console.log('refresh token expired')
          return Promise.reject(error)
        }

        // TokenのRefresh
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const refleshUrl = process.env.API_URL + '/token/refresh'
          let data = new FormData()
          return axios.post(
            refleshUrl,
            data,
            {
              headers: {
                'Authorization': `Bearer ${refreshToken}`
              }
            })
            .then((response) => {
              localStorage.setItem('accessToken', response.data.access_token)
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
              originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token
              return axios(originalRequest)
            })
            .catch(err => {
              // refreshTokenも期限切れの場合、ここに来る?
              console.log('ERR!!!')
              console.log(err)
              // alert('refreshTokenも期限切れ?')
              return Promise.reject(err)
            })
        }
        return Promise.reject(error)
      })
    }

    if (method === 'get') {
      if (headers) {
        promise = axios.get(
          url,
          headers,
          { params: params }
        )
      } else {
        promise = axios.get(url, { params: params })
      }
    } else if (method === 'post') {
      if (headers) {
        promise = axios.post(
          url,
          params,
          headers
        )
      } else {
        promise = axios.post(
          url,
          params
        )
      }
    }
    promise.catch(function (error) {
      Notify.create({
        type: 'negative',
        color: 'negative',
        message: error.response.data.message,
        // detail: response.data.message,
        position: 'top-right'
      })
      console.log(error.response.data.message)
      // alert('エラーが発生しました')
      // return alert('エラーが発生しました')
    })
    return promise
  },
  // refleshToken () {
  //   const refreshToken = localStorage.getItem('refreshToken')
  //   const refreshToken = localStorage.getItem('refreshToken')
  //   let decoded = jwtDecode(refreshToken)
  //   let expirationTime = decoded.exp
  //   let timedelta = (Date.now() / 1000) - expirationTime
  //   if (timedelta > process.env.JWT_REFRESH_TOKEN_EXPIRES) {
  //     console.log('refresh token expired')
  //     return Promise.reject(error)
  //   }
  // }
  // isExpired (token, expirationSeconds) {
  //   console.log('isExpired()')
  //   let decoded = jwtDecode(token)
  //   let expiresAt = decoded.exp
  //   let timedelta = (Date.now() / 1000) - expiresAt
  //   if (timedelta > expirationSeconds) {
  //     console.log('token expired')
  //     return true
  //   }
  //   else {
  //     console.log('token NOT expired')
  //     return false
  //   }
  // },

  get (url, params, token) {
    return this.request('get', url, params, token)
  },

  post (url, params, token) {
    return this.request('post', url, params, token)
  }
}
