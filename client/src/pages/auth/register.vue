<template>
  <div
    class="layout-padding"
    style="
    width: 500px;
    max-width: 100vw;
    ">

    <!-- register -->
    <transition name="fade">
      <q-card
        v-if="panelVisible"
        flat
        class="smoke"
      >
        <q-card-title
          style="color:white;">
          Dashboard Proto: register
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
            color="secondary"
            dark
            v-model="username"
            type="email"
            :float-label="$v.username.$error ? errorMsg($v.username, 'ID') : 'ID'"
            :error="$v.username.$error"
            @blur="$v.username.$touch"
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
            :disable="!readyForSubmit"
            style="
            width: 100%;
            max-width: 90vw;
            margin-top: 0px;"
            color="secondary"
            @click="onRegister()">
              Register
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
            @click="onCancelRegister()">
              Cancel
          </q-btn>
        </q-card-main>
      </q-card>
    </transition>

  </div>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
// import {
//   QCard,
//   QCardMain,
//   QCardTitle,
//   QCardSeparator,
//   QInput,
//   QBtn
// } from 'quasar'
import { mapActions } from 'vuex'
import { errorMsg } from '../../utils/error-msgs'

export default {
  // components: {
  //   QCard,
  //   QCardMain,
  //   QCardTitle,
  //   QCardSeparator,
  //   QInput,
  //   QBtn
  // },
  data () {
    return {
      email: '',
      username: '',
      password: '',
      passwordconf: '',
      panelVisible: false
    }
  },
  validations: {
    email: { required, email },
    username: { required },
    password: {
      required,
      minLength: minLength(6)
    },
    passwordconf: {
      sameAsPassword: sameAs('password')
    }
  },
  computed: {
    readyForSubmit: function () {
      let result =
        !this.$v.email.$invalid &&
        !this.$v.username.$invalid &&
        !this.$v.password.$invalid &&
        !this.$v.passwordconf.$invalid
      return result
    }
  },
  methods: {
    ...mapActions('auth', [
      'login'
    ]),
    errorMsg: function (errorObj, itemCaption) {
      return errorMsg(errorObj, itemCaption)
    },
    onRegister: function () {
      let self = this
      this.$store.dispatch('register', {
        email: this.$data.email,
        username: this.$data.username,
        password: this.$data.password,
        router: self.$router
      })
    },
    onCancelRegister: function () {
      this.$router.push('/login')
    }
  },
  mounted () {
    this.panelVisible = true
  }
}
</script>
