<template>
  <div
    class="layout-padding"
    style="
    width: 500px;
    max-width: 100vw;
    ">
    <!-- login用 -->
    <transition name="fade">
      <q-card
        v-if="panelVisible"
        flat
        class="smoke"
      >
        <q-card-title
          style="color:white;">
          Dashboard Proto: Account Confirmation
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          <q-input
            color="secondary"
            dark
            v-model="username"
            :float-label="$v.username.$error ? errorMsg('required', 'ID') : 'ID'"
            :error="$v.username.$error"
            @blur="$v.username.$touch"
          />
          <q-input
            autocomplete="off"
            color="secondary"
            dark
            v-model="password"
            type="password"
            :float-label="$v.password.$error ? errorMsg('required', 'Password') : 'Password'"
            :error="$v.password.$error"
            @blur="$v.password.$touch"
          />
          <br>
          <q-btn
            outline
            :disable="!readyForSubmit"
            style="
            width: 100%;
            max-width: 90vw;
            margin-top: 0px;"
            color="secondary"
            @click="onFirstLogin()">
              Confirm Account
          </q-btn>
        </q-card-main>
      </q-card>
    </transition>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import { errorMsg } from '../../utils/error-msgs'
import { getUrlParams } from '../../utils/get-url-params'

export default {
  data () {
    return {
      username: '',
      password: '',
      panelVisible: false
    }
  },
  validations: {
    username: { required },
    password: { required }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    }),
    readyForSubmit: function () {
      let result =
        !this.$v.username.$invalid &&
        !this.$v.password.$invalid
      return result
    }
  },
  methods: {
    ...mapActions('auth', [
      'confirm'
    ]),
    onFirstLogin: function () {
      let self = this
      console.log('token')
      console.log(this.$data.token)
      this.$store.dispatch('confirm', {
        username: this.$data.username,
        password: this.$data.password,
        token: this.$data.token,
        router: self.$router
      })
    },
    errorMsg: function (errorObj, itemCaption) {
      return errorMsg(errorObj, itemCaption)
    },
    checkParam () {
      let param = getUrlParams()
      if (!!param && param.token) {
        this.$data.token = param.token
      } else {
        // alert('No token')
        this.$q.notify({
          type: 'negative',
          color: 'negative',
          message: 'No token'
        })
        this.$router.push('/login')
      }
    }
  },
  mounted () {
    this.checkParam()
    this.panelVisible = true
  }
}
</script>
