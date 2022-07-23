import request from '@/utils/request'
/**
 * 登录
 * @param {String} mobile 手机号
 * @param {String} code 验证码
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}

/**
 * 发送验证码
 * @param {String} mobile 手机号
 * @returns Promise
 */
export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 请求用户自己的信息
 * @returns Promise
 */
export const getUserInfo = () => {
  // url methods headers
  return request({
    url: '/v1_0/user'
  })
}
/**
 * 获取用户个人生日性别用户名信息
 * @returns Promise
 */
export const getUserProfileInfo = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}
/**
 * 修改用户的生日性别用户名称
 */
export const sendEditUserInfo = (data) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}
/**
 * 修改用户的头像
 */
export const sendEditUserPhoto = (data) => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data
  })
}
