import { constantRoutes } from '@/router'
import { getRouters } from '@/api/sys/menu'
import Layout from '@/layout/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      // 向后端请求路由数据
      getRouters().then(res => {
        const accessedRoutes = menuRouterMap(res.data)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

function menuRouterMap(menuList) {
  var routerList = menuList.map(item => {
    // const loadView = () => import(`@/views/${item.component}`)
    return {
      hidden: item.visible !== '1',
      name: item.path,
      path: (item.parentId === '0' ? '/' : '') + item.path,
      component: (item.component == null || item.component.trim() === '' || item.component.trim() === 'Layout') ? Layout : resolve => require([`@/views/${item.component}`], resolve),
      meta: { icon: item.icon, title: item.menuName },
      children: item.children != null && item.children.length > 0 ? menuRouterMap(item.children) : [] }
  })
  return routerList
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
