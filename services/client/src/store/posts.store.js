import postService from '@/services/post.service'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    editPost ({ commit }, { post, content }) {
      return postService.editPost(post, content)
    }
  }
}
