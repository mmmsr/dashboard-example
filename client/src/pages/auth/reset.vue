<template>
  <div
    class="layout-padding"
    style="
    width: 500px;
    max-width: 100vw;
    ">

    <!-- reset request -->
    <transition name="fade">
      <q-card
        v-if="requestMode"
        flat
        class="smoke"
      >
        <q-card-title
          style="color:white;">
          Dashboard Proto: password reset request
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          <q-input
            color="secondary"
            dark
            v-model="email"
            type="email"
            :float-label="$v.email.$error ? errorMsg($v.email, 'email') : 'Email'"
            :error="$v.email.$error"
            @blur="$v.email.$touch"
          />
          <br>
          <q-btn
            outline
            :disable="!readyForRequest"
            style="
            width: 100%;
            max-width: 90vw;
            margin-top: 0px;"
            color="secondary"
            @click="onSendRequest()">
              Send request
          </q-btn>
        </q-card-main>
        <q-card-separator />
        <q-card-main
          style="color:white;">
          <q-btn
            flat
            style="
            max-width: 90vw;
            margin-top: 0px;"
            color="primary"
            @click="onCancelRequest()">
              Cancel
          </q-btn>
        </q-card-main>
      </q-card>
    </transition>

    <!-- reset confirmation -->
    <transition name="fade">
      <q-card
        v-if="confirmMode"
        flat
        class="smoke"
      >
        <q-card-title
          style="color:white;">
          V9 Admin Dashboard: password reset confirm
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          <q-input
            color="secondary"
            dark
            v-model="email"
            type="email"
            :float-label="$v.email.$error ? errorMsg($v.email, 'email') : 'Email'"
            :error="$v.email.$error"
            @blur="$v.email.$touch"
          />
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
          <q-input
            autocomplete="off"
            color="secondary"
            dark
            v-model="passwordconf"
            type="password"
            :float-label="$v.passwordconf.$error ? errorMsg($v.passwordconf, 'Password') : 'Confirm Password'"
            :error="$v.passwordconf.$error"
            @blur="$v.passwordconf.$touch"
          />
          <br>
          <q-btn
            outline
            :disable="!readyForConfirm"
            style="
            width: 100%;
            max-width: 90vw;
            margin-top: 0px;"
            color="secondary"
            @click="onConfirm()">
              Confirm
          </q-btn>
        </q-card-main>
      </q-card>
    </transition>
  </div>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import { errorMsg } from '../../utils/error-msgs'
import { getUrlParams } from '../../utils/get-url-params'

export default {
  data () {
    return {
      email: '',
      password: '',
      passwordconf: '',
      token: '',
      requestMode: false,
      confirmMode: false
    }
  },
  validations: {
    email: { required, email },
    password: {
      required,
      minLength: minLength(6)
    },
    passwordconf: {
      sameAsPassword: sameAs('password')
    }
  },
  computed: {
    readyForRequest: function () {
      let result =
        !this.$v.email.$invalid
      return result
    },
    readyForConfirm: function () {
      let result =
        !this.$v.email.$invalid &&
        !this.$v.password.$invalid &&
        !this.$v.passwordconf.$invalid
      return result
    }
  },
  methods: {
    ...mapActions('auth', [
      'requestPasswordReset',
      'confirmPasswordReset'
    ]),
    errorMsg: function (errorObj, itemCaption) {
      return errorMsg(errorObj, itemCaption)
    },
    onSendRequest: function () {
      this.$store.dispatch('requestPasswordReset', {
        email: this.$data.email
      })
    },
    onConfirm: function () {
      let self = this
      this.$store.dispatch('confirmPasswordReset', {
        email: this.$data.email,
        password: this.$data.password,
        token: this.$data.token,
        router: self.$router
      })
    },
    onCancelRequest: function () {
      this.$router.push('/login')
    },
    checkParam () {
      let param = getUrlParams()
      if (!!param && param.token) {
        this.$data.token = param.token
        this.toggleView('confirm')
      } else {
        this.toggleView('request')
      }
    },
    toggleView (mode) {
      this.requestMode = false
      this.confirmMode = false
      switch (mode) {
        case 'request':
          this.requestMode = true
          break
        case 'confirm':
          this.confirmMode = true
          break
        default:
          break
      }
    }
  },
  mounted () {
    this.checkParam()
  }
}
</script>
