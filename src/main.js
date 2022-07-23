import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入字体图标css
import '@/assets/fonts/iconfont.css'

// 引入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入flexble
import 'amfe-flexible/index.min.js'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')
// 全局过滤器：处理相对时间
Vue.filter('relativeTime', (value) => {
  return dayjs().to(dayjs(value))
})

Vue.config.productionTip = false
Vue.use(Vant)
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
