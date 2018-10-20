<template>
  <nav  id="nav" class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <div class="navbar-item">
          <router-link to="/" exact-active-class="noop" class="navbar-item">
            <h1 class="is-primary">TokenBB</h1>
          </router-link>
        </div>
        <div class="navbar-item">
          <router-link to="/settings" class="navbar-item">
            Settings
          </router-link>
        </div>

        <a role="button" class="navbar-burger" :class="{ 'is-active': menuActive }" aria-label="menu" aria-expanded="false" @click="toggleMenu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': menuActive }">
        <div class="navbar-start">
        </div>

        <div class="navbar-end">
          <div class="navbar-item is-expanded tr">
              <p v-if="$store.state.auth.accessToken" class="tr">
                {{ $store.state.auth.username }} (<a @click="logout">logout</a>)
              </p>

              <p v-if="!$store.state.auth.accessToken" class="tr is-right">
                <a class="button is-info has-text-white" :href="loginURL">
                  Connect
                </a>
              </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import steem from '../services/steem.service'

export default {
  name: 'Navbar',
  data () {
    return {
      loginURL: steem.connect.getLoginURL(),
      menuActive: false
    }
  },
  methods: {
    toggleMenu () {
      this.menuActive = !this.menuActive
    },
    logout () {
      this.$store.commit('auth/logout')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
