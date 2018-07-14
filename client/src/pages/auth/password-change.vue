<template>

  <!-- <q-layout class="layout-padding"> -->
    <q-page
      padding
      class="docs-input row justify-center">
      <div
        style="width: 500px; max-width: 90vw;">

        <q-input
          autocomplete="off"
          color="secondary"
          v-model="currentpassword"
          type="password"
          :float-label="$v.currentpassword.$error ? errorMsg($v.currentpassword, 'Current Password') : 'Current Password'"
          :error="$v.currentpassword.$error"
          @blur="$v.currentpassword.$touch"
        />

        <q-input
          autocomplete="off"
          color="secondary"
          v-model="newpassword"
          type="password"
          :float-label="$v.newpassword.$error ? errorMsg($v.newpassword, 'New Password') : 'New Password'"
          :error="$v.newpassword.$error"
          @blur="$v.newpassword.$touch"
        />
        <q-input
          autocomplete="off"
          color="secondary"

          v-model="newpasswordconf"
          type="password"
          :float-label="$v.newpasswordconf.$error ? errorMsg($v.newpasswordconf, 'Confirm New Password') : 'Confirm New Password'"
          :error="$v.newpasswordconf.$error"
          @blur="$v.newpasswordconf.$touch"
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
          @click="onSubmit()">
            Submit
        </q-btn>

      </div>
    </q-page>

    <!-- <div> -->
    <!-- </div> -->
  <!-- </q-layout> -->
</template>

<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import { errorMsg } from '../../utils/error-msgs'

export default {
  computed: {
    ...mapGetters({
      inquiries: 'allInquiries'
      // authInProcess: 'authInProcess'
    }),
    readyForSubmit: function () {
      let currentPwReady = !this.$v.currentpassword.$invalid
      let newPwReady = !this.$v.newpassword.$invalid
      let newPwConfReady = !this.$v.newpasswordconf.$invalid
      let result = currentPwReady && newPwReady && newPwConfReady
      return result
    }
    // authInProcess: function () {
    //   if (this.$store.getters.authInProcess)
    // }
  },
  data () {
    return {
      // readyForSubmit: false,
      currentpassword: '',
      newpassword: '',
      newpasswordconf: ''
    }
  },
  validations: {
    currentpassword: {
      required
    },
    newpassword: {
      required,
      minLength: minLength(6)
    },
    newpasswordconf: {
      sameAsPassword: sameAs('newpassword')
    }
  },
  methods: {
    ...mapActions('auth', [
      'changePassword'
    ]),
    errorMsg: function (errorObj, itemCaption) {
      return errorMsg(errorObj, itemCaption)
    },
    onSubmit: function () {
      let self = this
      this.$store.dispatch('changePassword', {
        currentpassword: this.$data.currentpassword,
        newpassword: this.$data.newpassword,
        token: this.$store.getters.accessToken,
        router: self.$router
      })
    },
    clearForm () {
      this.$data.currentpassword = ''
      this.$data.newpassword = ''
      this.$data.newpasswordconf = ''
    }
  }
  // created () {
  //   this.$store.dispatch('getAllInquiries', {
  //     accessToken: this.$store.getters.accessToken
  //   })
  // }
}
</script>
