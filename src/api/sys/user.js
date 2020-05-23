import request from '@/utils/request'
import { praseStrEmpty } from '@/utils'
import FileSaver from 'file-saver'

// 查询用户列表
export function listUser(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/sys/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  console.log(userId)
  return request({
    url: '/sys/user',
    method: 'delete',
    data: userId
  })
}

// 导出用户
export function exportUser(query) {
  request({
    method: 'post',
    url: '/sys/user/export',
    data: query,
    responseType: 'blob'
  }).then(res => {
    const blob = new Blob([res], {
      type: 'application/vnd.ms-excel'
    })
    FileSaver.saveAs(blob, 'test.xlsx')
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  return request({
    url: '/sys/user/resetPwd',
    method: 'put',
    data: { id: userId, password: password }
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  return request({
    url: '/sys/user/changeStatus',
    method: 'put',
    data: { id: userId, status: status }
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/sys/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/sys/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/sys/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

export function getRoleByUserId(userId) {
  return request({
    url: '/sys/user/dept/' + userId,
    method: 'get'
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/sys/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/sys/user/importTemplate',
    method: 'get'
  })
}
