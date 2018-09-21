import postService from '@/services/post.service'

export default {
  namespaced: true,
  state: {
    fetching: false
  },
  mutations: {
    setFetching (state, fetching) {
      state.fetching = fetching
    }
  },
  actions: {
    submitReply ({ commit }, { parent, content }) {
      commit('setFetching', true)

      var author = this.state.auth.username

      return postService.createReply(parent, author, content)
        .then(reply => {
          commit('setFetching', false)

          return reply
        })
        .catch(err => {
          commit('setFetching', false)

          console.error(err)
        })
    }
  }
}
