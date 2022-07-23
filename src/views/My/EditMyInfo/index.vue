<template>
  <div>
    <template>
      <div class="edituserinfo-container">
        <!-- 导航栏 -->
        <van-nav-bar
          class="page-nav-bar"
          title="个人信息"
          left-arrow
          @click-left="$router.back()"
        />
        <input type="file" hidden ref="file" @change="onFileChange" />
        <!-- /导航栏 -->
        <van-cell title="头像" is-link @click="$refs.file.click()">
          <van-image class="avatar" fit="cover" round :src="userPhoto" />
        </van-cell>
        <van-popup></van-popup>
        <!-- 昵称编辑 -->
        <van-cell
          title="昵称"
          :value="sendInfo.name"
          is-link
          @click="isShowName = true"
        ></van-cell>
        <van-popup
          v-model="isShowName"
          position="bottom"
          :style="{ height: '100%' }"
        >
          <van-nav-bar
            title="编辑昵称"
            left-text="取消"
            right-text="确定"
            @click-right="onNameConfirm"
            @click-left="isShowName = false" />
          <div style="padding: 10px">
            <van-field
              v-model.trim="name"
              rows="2"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入新昵称"
              show-word-limit
            /></div
        ></van-popup>
        <!-- 性别编辑 -->
        <van-cell
          title="性别"
          :value="columns[sendInfo.gender]"
          is-link
          @click="isShowGender = true"
        ></van-cell>
        <van-popup
          v-model="isShowGender"
          position="bottom"
          :style="{ height: '40%' }"
        >
          <van-picker
            title="更新性别"
            show-toolbar
            :columns="columns"
            @confirm="onGenderConfirm"
            @cancel="onGenderCancel"
        /></van-popup>
        <!-- 生日编辑 -->
        <van-cell
          title="生日"
          :value="birthday"
          is-link
          @click="isShowBirthdy = true"
        ></van-cell>
        <van-popup
          v-model="isShowBirthdy"
          position="bottom"
          :style="{ height: '40%' }"
        >
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="onBirthdyConfirm"
            @cancel="onBirthdyCancel"
        /></van-popup>
      </div>
    </template>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { getUserProfileInfo, sendEditUserInfo } from '@/api'
export default {
  name: '',
  data () {
    return {
      name: '',
      birthday: '',
      isShowName: false,
      isShowGender: false,
      isShowBirthdy: false,
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      columns: ['男', '女'],
      userPhoto: '',
      sendInfo: {
        name: '',
        gender: 0,
        birthday: '2018-12-20',
        real_name: '',
        intro: ''
      },
      status: 0
    }
  },
  components: {},
  computed: {},
  created () {
    this.getUserProfileInfo()
  },
  mounted () {},
  methods: {
    // 生日的取消和确认
    onBirthdyCancel () {
      this.isShowBirthdy = false
    },
    // 每次当点击确认的时候发送修改请求
    onBirthdyConfirm (value) {
      this.birthday = value
        .toLocaleString()
        .slice(0, 10)
        .replace('/', '-')
        .replace('/', '-')
      // 原来的值相对不发请求
      if (this.sendInfo.birthday === this.birthday) {
        return (this.isShowBirthdy = false)
      } else {
        this.sendEditUserInfo({ birthday: this.birthday })
        this.isShowBirthdy = false
        if (this.status === 200) {
          this.sendInfo.birthday = this.birthday
          Toast.success('修改成功')
        }
      }
    },
    // 修改名字的确认
    onNameConfirm () {
      // 如果编辑信息不为空时
      if (this.name === '') {
        return Toast('内容不能为空')
      } else {
        if (this.sendInfo.name === this.name) {
          return (this.isShowName = false)
        }
        this.sendEditUserInfo({ name: this.name })
        // 发送请求成功了才会修改原来页面的值
        if (this.status === 200) {
          Toast.success('修改成功')
          this.sendInfo.name = this.name
          this.isShowName = false
        }
      }
      this.isShowName = false
    },
    onGenderConfirm (value, index) {
      console.log(value, index)
      // 如果原来跟修改的一样，就不发送请求
      if (index === this.sendInfo.gender) {
        return (this.isShowGender = false)
      } else {
        // 此时修改了不一样的值  发送请求
        this.sendEditUserInfo({ gender: index })
        this.sendInfo.gender = index
        if (this.status === 200) {
          Toast.success('修改成功')
        }
      }
      this.isShowGender = false
    },
    onGenderCancel () {
      this.isShowGender = false
    },
    onCancel () {
      Toast('取消')
    },
    async getUserProfileInfo () {
      const {
        data: { data }
      } = await getUserProfileInfo()
      this.name = data.name
      this.sendInfo.name = data.name
      this.birthday = data.birthday
      this.sendInfo.birthday = data.birthday
      this.userPhoto = data.photo
      this.sendInfo.gender = data.gender
    },
    async sendEditUserInfo (data) {
      try {
        const res = await sendEditUserInfo(data)
        console.log(res)
        this.status = res.status
      } catch (error) {
        this.status = error.status
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file[0]
      // 基于文章对象获取 blob 数据 就是设置图片的src
      const data = window.URL.createObjectURL(file)
      console.log(data)
      /*       const reader = new FileReader()
      reader.onload = (data) => {
        const res = data.target || data.srcElement
        this.sendInfo.photo = res.result
      }
      reader.readAsDataURL(file) */
    }
  },
  watch: {}
}
</script>
<style lang="less" scoped>
.edituserinfo-container {
  .page-nav-bar {
    background-color: dodgerblue;
  }
  .avatar {
    width: 60px;
    height: 60px;
  }
}
</style>
