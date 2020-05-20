<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名稱" prop="roleName">
          <el-input v-model="form.roleName" placeholder="請輸入角色名稱" />
        </el-form-item>
        <el-form-item label="角色編碼" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="請輸入角色編碼" />
        </el-form-item>
        <el-form-item label="角色順序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="狀態">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜單權限">
          <el-tree
            ref="menu"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            empty-text="載入中，請稍後"
            :props="defaultProps"
          />
        </el-form-item>
        <el-form-item label="備註">
          <el-input v-model="form.remark" type="textarea" placeholder="請輸入內容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRole, addRole, updateRole, getMenuByRoleId } from '@/api/sys/role'
import { treeselect as menuTreeselect } from '@/api/sys/menu'
export default {
  data() {
    return {
      open: false,
      // 彈出層標題
      title: '',
      form: {},
      // 菜單清單
      menuOptions: [],
      statusOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        roleName: [
          { required: true, message: '角色名稱不能為空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '角色編碼不能為空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '角色順序不能為空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created() {
    this.getDicts('sys_available').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    create() {
      this.reset()
      this.getMenuTreeselect()
      this.open = true
      this.title = '添加角色'
    },
    edit(roleId) {
      this.reset()
      getRole(roleId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改角色'
        this.getMenuTreeselect()
      }).then(response => {
        getMenuByRoleId(roleId).then(response => {
          this.$refs.menu.setCheckedKeys(response.data.map(x => { return x.menuId }))
        })
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.roleMenus = this.getMenuAllCheckedKeys().map(item => { return { roleId: this.form.id, menuId: item } })
          if (this.form.id != null) {
            updateRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.$emit('getList')
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.$emit('getList')
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    // 表單重置
    reset() {
      if (this.$refs.menu != null) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        orderNum: 1,
        status: '1',
        roleMenus: [],
        remark: undefined
      }
      this.resetForm('form')
    },
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data
      })
    },
    // 所有功能表節點資料
    getMenuAllCheckedKeys() {
      // 目前被選中的菜單節點
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半選中的菜單節點
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    }
  }
}

</script>
