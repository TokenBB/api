<template>
  <div id="app">
    <Navbar></Navbar>
    <section class="section">
      <router-view/>
    </section>
  </div>
</template>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #8c67ef;
$primary-invert: findColorInvert($primary);
$twitter: #4099FF;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  data () {
    return {

    }
  },
  mounted () {
    this.$nextTick(function () {
      if (this.$route.query.access_token) this.storeSession()

      this.loadSession()
      this.fetchTopics()
      this.fetchCategories()
    })
  },
  methods: {
    storeSession () {
      this.$store.commit('auth/storeSession')
    },
    loadSession () {
      this.$store.commit('auth/loadSession')
    },
    fetchTopics () {
      this.$store.dispatch('topics/fetchAll')
    },
    fetchCategories () {
      this.$store.dispatch('categories/fetchAll')
    }
  }
}
</script>
