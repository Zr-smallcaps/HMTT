<template>
  <div>
    <van-cell title="历史记录">
      <van-icon name="delete" @click="isShow = true" />
      <div v-if="isShow">
        <span @click="$emit('allDelte')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isShow = false">完成</span>
      </div>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistorys"
      :key="index"
      @click="clickFn(item, index)"
    >
      <van-icon name="close" v-show="isShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'searchHistorys',
  data () {
    return {
      isShow: false
    }
  },
  props: {
    searchHistorys: {
      type: Array,
      required: true
    }
  },
  methods: {
    clickFn (item, index) {
      if (this.isShow) {
        this.$emit('delOneHistory', index)
      } else {
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style></style>
