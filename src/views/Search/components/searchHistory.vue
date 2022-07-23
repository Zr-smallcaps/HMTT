<template>
  <div class="">
    <!-- 历史记录 -->
    <van-cell title="历史记录">
      <template v-if="delShow">
        <span @click="dele">全部删除</span>
        &nbsp;&nbsp;
        <span @click="delShow = false">完成</span>
      </template>
      <van-icon v-else name="delete" @click="delShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistoryList"
      :key="index"
      @click="resultShow(item)"
    >
      <van-icon name="close" @click="del(index)"></van-icon>
    </van-cell>
    <!-- /历史记录 -->
  </div>
</template>
<script>
import storage from '@/utils/storage'
export default {
  name: 'SearchHistory',
  props: {},
  data () {
    return {
      searchHistoryList: [],
      delShow: false
    }
  },
  methods: {
    del (index) {
      console.log(index)
      const data = storage.get('toutiao-histories')
      data.splice(index, 1)
      console.log(data)
      storage.set('toutiao-histories', data)
      this.searchHistoryList = storage.get('toutiao-histories')
    },
    dele () {
      storage.set('toutiao-histories', [])
    },
    resultShow (item) {
      this.$emit('resultShow', item)
    }
  },
  created () {
    this.searchHistoryList = storage.get('toutiao-histories')
  },
  mounted () {},
  watch: {},
  computed: {},
  components: {}
}
</script>
<style scoped lang="less"></style>
