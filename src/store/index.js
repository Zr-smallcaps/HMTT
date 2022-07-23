import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage'
import { getToken, setToken } from '@/utils'
Vue.use(Vuex)
export default new Vuex.Store({
  // user:{token}
  // user.token
  // null.token 报错
  // {}.token undifined
  state: {
    // 声明token
    user: getToken() || {},
    resultHistory: storage.get('toutiao-histories') || []
  },
  // 修改数据的地方
  mutations: {
    // 修改token
    setUser (state, payload) {
      state.user = payload
      // token放在本地存储
      setToken(payload)
    },
    setData (state, payload) {
      const index = state.resultHistory.indexOf(payload)
      if (index !== -1) {
        state.resultHistory.splice(index, 1)
      }
      state.resultHistory.unshift(payload)
      storage.set('toutiao-histories', state.resultHistory)
      console.log(state.resultHistory)
    }
  }
})
