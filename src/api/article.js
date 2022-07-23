import request from '@/utils/request'
export const getArticlesList = (params) => {
  return request({
    methodL: 'GET',
    url: '/v1_0/articles',
    params
  })
}
/**
 * 获取文章
 */
export const getArticlesById = (articleId) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}
/***
 * 获取文章评论
 *获取文章评论的评论
 */
export const getArticlesComments = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}
/***
 * 收藏此文章
 */
export const addArticlescollections = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: { target }
  })
}
/***
 * 取消此文章的收藏
 */
export const delectArticlescollections = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${id}`
  })
}
/***
 * 对此文章进行评论
 */
export const addArticlesComments = (id, message) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: {
      target: id,
      content: message
    }
  })
}
/***
 * 对此文章的评论进行回复
 */
export const addArticlesCommentsReply = (id, message, artId) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: {
      target: id,
      content: message,
      art_id: artId
    }
  })
}
/***
 * 对此评论进行点赞
 */
export const likingsComments = (id) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: id
    }
  })
}
/**
 *取消对此评论的点赞
 * @param {此评论的id,} id
 * @returns
 */
export const delLikingsComments = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${id}`
  })
}
/**
 * 关注用户
 */
export const followingUser = (id) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: id
    }
  })
}
/**
 * 取消关注用户
 */
export const unFollowingUser = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${id}`
  })
}

/**
 * 对此文章点赞
 * 文章的id
 */
export const likingsArticles = (id) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: id
    }
  })
}

/**
 * 取消对此文章点赞
 * 文章的id
 */
export const unLikingsArticles = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/dislikes/${id}`
  })
}
