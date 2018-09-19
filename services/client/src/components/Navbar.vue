<template>
  <nav  id="nav" class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          TokenBB
        </router-link>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-item">
            <router-link to="/settings" class="navbar-item">
              Settings
            </router-link>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item is-expanded tr">
              <p v-if="auth.accessToken !== null" class="tr">
                {{ auth.username }} (<a @click="logout">logout</a>)
              </p>

              <p v-if="auth.accessToken === null" class="tr is-right">
                <a class="button is-primary" :href="auth.loginURL">
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
console.log(steem)

export default {
  name: 'Navbar',
  props: {},
  data: () => ({
    auth: {
      accessToken: null,
      username: '',
      loginURL: steem.connect.getLoginURL()
    }
  })
}
</script>

<style scoped lang="scss">

</style>
