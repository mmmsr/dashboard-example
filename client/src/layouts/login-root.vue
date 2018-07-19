<!-- <template>
  <q-layout
    class="login-bg"
    :class="randomBg"
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <router-view></router-view>
  </q-layout>
</template>

<script>
import {
  QLayout
} from 'quasar'

const BG_CLASSES = [
  'login-bg01',
  'login-bg02',
  'login-bg03',
  'login-bg04',
  'login-bg05',
  'login-bg06',
  'login-bg07',
  'login-bg08',
  'login-bg09',
  'login-bg10'
]

export default {
  components: {
    QLayout
  },
  data () {
    return {
      randomBg: ''
    }
  },
  methods: {
    pickBg () {
      // this.randomBg = BG_CLASSES[0]
      this.randomBg = BG_CLASSES[Math.floor(Math.random() * BG_CLASSES.length)]
    }
  },
  mounted () {
    this.pickBg()
  }
}
</script>

<style lang="stylus">
.logo-container
  width 255px
  height 242px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
.v9-theme
  background linear-gradient(-135deg, #36d1dc, #5b86e5)
.smoke
  background-color rgba(54, 69, 73, 0.8)
.login-bg
  background-size cover
.login-bg01
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg01.jpg")
.login-bg02
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg02.jpg")
.login-bg03
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg03.jpg")
.login-bg04
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg04.jpg")
.login-bg05
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg05.jpg")
.login-bg06
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg06.jpg")
.login-bg07
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg07.jpg")
.login-bg08
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg08.jpg")
.login-bg09
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg09.jpg")
.login-bg10
  background linear-gradient(-45deg, rgba(22, 34, 42, .4), rgba(58, 94, 115, .4)), url("../assets/bg10.jpg")

.fade-enter-active, .fade-leave-active
  transition opacity .9s
.fade-enter, .fade-leave-to
  opacity 0

</style> -->
