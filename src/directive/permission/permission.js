import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = '*:*:*'
    const super_admin = 'admin'
    const permissions = store.getters && store.getters.permissions
    const roles = store.getters && store.getters.roles

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      let hasPermissions = roles.some(role => {
        return super_admin === role
      })

      if (!hasPermissions) {
        hasPermissions = permissions.some(permission => {
          return all_permission === permission || permissionFlag.includes(permission)
        })
      }

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permissions! Like v-permission="['perm1','perm2']"`)
    }
  }
}
