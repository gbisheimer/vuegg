import types from '@/store/types'

const tagGetters = {
/**
 * Finds an tag index (from the selected tags array) by a given id
 *
 * @param {string} id : Selected tag's id
 * @return {object} : Element index
 */
  [types.getTagById]: (state, getters) => (id) => {
    let index = state.tags.findIndex(el => el.id === id)
    return index >= 0 ? state.tags[index] : null
  },

/**
 * Finds an tag path (from the selected tags array) by a given id
 *
 * @param {string} id : Selected tag's id
 * @return {object} : Element path
 */
  [types.getTagByPath]: (state, getters) => (path) => {
    let index = state.tags.findIndex(el => el.path === path)
    return index >= 0 ? state.tags[index] : null
  }
}

export default tagGetters
