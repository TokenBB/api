import apiService from '@/services/api.service'

export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryList: [],
    categoriesById: {}
  },
  mutations: {
    setFetching (state, fetching) {
      state.fetching = fetching
    },
    updateCategoryList (state, categories) {
      state.categoryList = categories
      categories.forEach(category => {
        state.categoriesById[category.id] = category
      })
    }
  },
  actions: {
    fetchAll ({ commit }) {
      commit('setFetching', true)

      apiService.listCategories()
        .then(categories => {
          commit('updateCategoryList', categories)
          commit('setFetching', false)
        })
        .catch(err => {
          commit('setFetching', false)

          console.error(err)
        })
    }
  }
}
