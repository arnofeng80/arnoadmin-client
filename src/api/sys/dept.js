import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/sys/dept/list',
    method: 'post',
    data: query
  })
}

export function fetchAll(query) {
  return request({
    url: '/sys/dept/all',
    method: 'post',
    data: query === undefined ? {} : query
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/sys/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function deptTree() {
  return request({
    url: '/sys/dept/deptTree',
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/sys/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/sys/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/sys/dept/' + deptId,
    method: 'delete'
  })
}

