<template>
  <q-page class="flex flex-center">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <!-- <q-input
      color="secondary"
      dark
      v-model="email"
      type="email"
      :float-label="$v.email.$error ? errorMsg($v.email, 'email') : 'Email'"
      :error="$v.email.$error"
      @blur="$v.email.$touch"
    /> -->
    <q-input
      color="secondary"
      v-model="email"
      type="email"
      @blur="$v.email.$touch"
      :error="$v.email.$error"
    />
  </q-page>
</template>

<style>
</style>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  validations: {
    email: { required, email }
  }
  // name: 'PageIndex'
}
</script>
