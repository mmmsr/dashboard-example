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
          Dashboard Proto
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          <q-input
            color="secondary"
            dark
            v-model="username"
            :float-label="$v.username.$error ? errorMsg($v.username, 'Username') : 'Username'"
            :error="$v.username.$error"
            @blur="$v.username.$touch"
          />
          <br/>
          <q-input
            autocomplete="off"
            color="secondary"
            dark
            v-model="password"
            type="password"
            :float-label="$v.password.$error ? errorMsg($v.password, 'Password') : 'Password'"
            :error="$v.password.$error"
            @blur="$v.password.$touch"
          />
          <br/>
          <q-btn
            outline
            style="
            width: 100%;
            max-width: 90vw;
            margin-top: 0px;"
            color="secondary"
            @click="onLogin()">
              Login
          </q-btn>

        </q-card-main>
        <q-card-separator />
        <q-card-main
          style="color:white;">

          Don't have an account?
          <q-btn
            flat
            style="
            max-width: 90vw;
            margin-top: 0px;"
            color="primary"
            @click="onStartRegister()"
          >
            Register
          </q-btn>
          <br/>

          Forgot password?
          <q-btn
            flat
            style="
            max-width: 90vw;
            margin-top: 0px;"
            color="primary"
            @click="onStartReset()">
              Reset password
          </q-btn>

        </q-card-main>
      </q-card>
    </transition>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import { errorMsg } from '../../utils/error-msgs'

export default {
  data () {
    return {
      username: '',
      password: '',
      panelVisible: false
    }
  },
  validations: {
    email: { required, email },
    username: { required },
    newusername: { required },
    password: { required },
    newpassword: {
      required,
      minLength: minLength(6)
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    })
  },
  methods: {
    ...mapActions('auth', [
      'login'
    ]),
    onLogin: function () {
      let self = this
      this.$store.dispatch('login', {
        username: this.$data.username,
        password: this.$data.password,
        router: self.$router
      })
    },
    errorMsg: function (errorObj, itemCaption) {
      return errorMsg(errorObj, itemCaption)
    },
    onStartRegister () {
      this.$router.push('/register')
    },
    onStartReset () {
      this.$router.push('/reset')
    }
  },
  mounted () {
    this.panelVisible = true
  }
}
</script>
