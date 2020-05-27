import request from '@/utils/request'

// 查询菜单列表
export function fetchAll(query) {
  return request({
    url: '/sys/menu/all',
    method: 'post',
    data: query === undefined ? {} : query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/sys/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/sys/menu/treedata',
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/sys/menu/' + menuId,
    method: 'delete'
  })
}

export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
