<!-- <template>

  <q-layout class="layout-padding">
    <div>
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
  </q-layout>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
// import { mapGetters, mapActions } from 'vuex'
import {
  QLayout,
  QInput,
  QBtn,
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QIcon
} from 'quasar'

export default {
  components: {
    QLayout,
    QInput,
    QBtn,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QIcon
  },
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
      currentemail: '',
      newemail: '',
      password: ''
    }
  },
  validations: {
    currentemail: { required, email },
    newemail: { required, email },
    password: {
      required
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
        currentemail: this.$data.currentemail,
        newemail: this.$data.newemail,
        password: this.$data.password,
        token: this.$store.getters.accessToken,
        router: self.$router
      })
    },
    clearForm () {
      this.$data.currentpassword = ''
      this.$data.newpassword = ''
      this.$data.newpasswordconf = ''
    }

    // displayDatetime: function (datetime) {
    //   return makeDateDisplayStr(datetime) + makeTimeDisplayStr(datetime)
    // }
  },
  created () {
    this.$store.dispatch('getAllInquiries', {
      accessToken: this.$store.getters.accessToken
    })
  }
}
</script> -->
