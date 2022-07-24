<template>
  <div class="userImage">
    <img :src="userImage" ref="img" class="img" />
    <div class="btn-image">
      <van-button plain hairline type="primary" class="concel-btn"
        >取消</van-button
      >
      <van-button
        plain
        hairline
        type="primary"
        class="confirm-btn"
        @click="confirm"
        >确认</van-button
      >
    </div>
  </div>
</template>
<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { sendEditUserPhoto } from '@/api'
export default {
  name: '',
  data () {
    return {
      myCropper: null
    }
  },
  props: {
    userImage: {
      type: String,
      default: ''
    },
    imageShow: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  computed: {},
  created () {},
  mounted () {
    console.log('userImage', this.userImage)
    const img = this.$refs.img
    this.myCropper = new Cropper(img, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
    })
  },
  methods: {
    // 剪裁自己需要图片
    async confirm () {
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob(function (blob) {
        console.log(this.myCropper)
        fm.append('photo', blob)
        console.log(blob)
      })
      try {
        const res = await sendEditUserPhoto(fm)
        console.log(res)
        // this.$emit('update:imageShow', false)
      } catch (error) {
        console.log(error)
        this.$toast.fail('上传失败')
      }
    }
  },
  watch: {}
}
</script>
<style lang="less" scoped>
.userImage {
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;
  .img {
    width: 100%;
    height: 90%;
    display: inline-block;
  }
  .btn-image {
    display: flex;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99999;
    justify-content: space-around;
    .concel-btn {
      margin-left: 50px;
    }
    .confirm-btn {
      margin-right: 50px;
    }
  }
}
</style>
