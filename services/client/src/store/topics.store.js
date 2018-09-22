import postService from '@/services/post.service'

export default {
  namespaced: true,
  state: {
    fetching: true,
    topicList: []
  },
  mutations: {
    setFetching (state, fetching) {
      state.fetching = fetching
    },
    updateTopicList (state, topics) {
      state.topicList = topics
    },
    addTopic (state, topic) {
      state.topicList.push(topic)
    }
  },
  actions: {
    createTopic ({ commit }, { title, category, content }) {
      var author = this.state.auth.username

      return postService.createTopic(author, category, title, content)
        .then(topic => {
          commit('addTopic', topic)

          return topic
        })
    },
    fetchAll ({ commit }) {
      commit('setFetching', true)

      postService.listTopics(null)
        .then(topics => {
          commit('updateTopicList', topics)
          commit('setFetching', false)
        })
        .catch(err => {
          commit('setFetching', false)

          console.error(err)
        })
    }
  }
}
