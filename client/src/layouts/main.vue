<template>
  <q-layout view="lHh Lpr lFf">
  <!-- <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  > -->
  <q-layout-header>
    <q-toolbar
      color="v9-theme"
    >
      <q-btn
        flat
        dense
        round
        @click="leftDrawerOpen = !leftDrawerOpen"
        aria-label="Menu"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        Dashboard Proto
        <div slot="subtitle">Example of chart rendering</div>
      </q-toolbar-title>
    </q-toolbar>
  </q-layout-header>

  <q-layout-drawer
    v-model="leftDrawerOpen"
    :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
  >
    <q-list
      no-border
      link
      inset-delimiter
    >
      <q-list-header>Menu</q-list-header>
      <!-- <q-item @click="onSecretAccess"> -->
      <q-item to="chart01">
        <q-item-side icon="show_chart" />
        <q-item-main label="Chart Examples" />
      </q-item>
      <q-item to="search">
        <q-item-side icon="search" />
        <q-item-main label="Search Examples" />
      </q-item>

      <q-item @click.native="launch('https://github.com/mmmsr/dashboard-example')">
        <q-item-side icon="ion-logo-github" />
        <q-item-main label="Source Code" />
      </q-item>

      <!-- <q-item to="emailchange">
        <q-item-side icon="account box" />
        <q-item-main label="Email Change" />
      </q-item> -->
      <!-- <q-item to="password-change">
        <q-item-side icon="account box" />
        <q-item-main label="Password Change" />
      </q-item> -->
      <!-- <q-item @click="onSecretAccess">
        <q-item-side icon="chat" />
        <q-item-main label="SecretAccess" />
      </q-item> -->
      <!-- <q-item @click.native="onLogout">
        <q-item-side icon="exit to app" />
        <q-item-main label="Logout" />
      </q-item> -->
    </q-list>
  </q-layout-drawer>
    <!-- <div slot="left"> -->
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->

    <!-- </div> -->
    <q-page-container>
      <transition>
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script>

// import { mapGetters, mapActions } from 'vuex'
import { openURL } from 'quasar'

export default {
  name: 'index',

  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    // ...mapGetters({
    //   loggedIn: 'loggedIn',
    //   accessToken: 'accessToken',
    //   refreshToken: 'refreshToken'
    // })
  },
  methods: {
    // ...mapActions('auth', [
    //   'logout', ''
    // ]),
    launch (url) {
      openURL(url)
    }
    // onLogout: function () {
    //   console.log('onLogout')
    //   let self = this
    //   this.$store.dispatch('logout', {
    //     accessToken: this.$store.getters.accessToken,
    //     refreshToken: this.$store.getters.refreshToken,
    //     router: self.$router
    //   })
    // },
    // onSecretAccess: function () {
    //   let self = this
    //   this.$store.dispatch('secretAccess', {
    //     accessToken: this.$store.getters.accessToken,
    //     refreshToken: this.$store.getters.refreshToken,
    //     router: self.$router
    //   })
    // }
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
.bg-v9-theme
  background linear-gradient(-135deg, #36d1dc, #5b86e5)
.smoke
  background-color rgba(54, 69, 73, 0.5)
</style>
