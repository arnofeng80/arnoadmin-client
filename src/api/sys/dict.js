import request from '@/utils/request'

export function listData(query) {
  return request({
    url: '/sys/dict/list',
    method: 'post',
    data: query
  })
}

export function getData(dictCode) {
  return request({
    url: '/sys/dict/' + dictCode,
    method: 'get'
  })
}

export function getDicts(dictCode) {
  return request({
    url: '/sys/dict/dictCode/' + dictCode,
    method: 'get'
  })
}

export function addData(data) {
  return request({
    url: '/sys/dict',
    method: 'post',
    data: data
  })
}

export function updateData(data) {
  return request({
    url: '/sys/dict',
    method: 'put',
    data: data
  })
}

export function delData(dictId) {
  return request({
    url: '/sys/dict',
    method: 'delete',
    data: dictId
  })
}

export function exportData(query) {
  return request({
    url: '/sys/dict/export',
    method: 'get',
    params: query
  })
}
