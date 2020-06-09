import permission from './permission'
import role from './role'

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.directive('role', role)
}

if (window.Vue) {
  window['permission'] = permission
  window['role'] = role
  Vue.use(install); // eslint-disable-line
}

export default install
