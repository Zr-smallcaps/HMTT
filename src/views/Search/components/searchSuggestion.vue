<template>
  <div>
    <van-cell
      v-for="(item, index) in hightData"
      :key="index"
      @click="$emit('item', List[index])"
    >
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      List: []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  methods: {
    async getSearchSugges () {
      try {
        const { data } = await getSearchSuggestion(this.keywords)
        // console.log(data.data.options);
        if (data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.List = data.data.options.filter(Boolean)
      } catch (error) {}
    }
  },
  watch: {
    keywords: {
      immediate: true,
      handler () {
        this.getSearchSugges()
      }
    }
  },
  computed: {
    hightData () {
      const reg = new RegExp(this.keywords, 'ig')
      return this.List.map((str) =>
        str.replace(reg, (match) => `<span style='color:red'>${match}</span>`)
      )
    }
  }
}
</script>

<style scoped lang="less">
.search-icon {
  padding-top: 10px;
}
</style>
