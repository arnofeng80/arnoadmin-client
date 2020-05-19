import request from '@/utils/request'

// 查询角色列表
export function listRole(data) {
  return request({
    url: '/sys/role/list',
    method: 'post',
    data: data
  })
}

export function getRoles() {
  return request({
    url: '/sys/role/all',
    method: 'get'
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/sys/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/sys/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function updateDataScope(data) {
  return request({
    url: '/sys/role/updateDataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  return request({
    url: '/sys/role/changeStatus',
    method: 'put',
    data: {
      id: roleId,
      status
    }
  })
}

// 删除角色
export function delRole(roleId) {
  console.log(roleId)
  return request({
    url: '/sys/role',
    method: 'delete',
    data: roleId
  })
}

export function batchDelDept(ids) {
  return request({
    url: '/sys/role',
    method: 'delete',
    data: ids
  })
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/sys/role/export',
    method: 'get',
    params: query
  })
}
