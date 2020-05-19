<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.id == undefined" label="賬戶名" prop="loginName">
              <el-input v-model="form.loginName" placeholder="賬戶名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="歸屬部門" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" placeholder="請選擇歸屬部門" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手機號碼" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="請輸入手機號碼" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="郵箱" prop="email">
              <el-input v-model="form.email" placeholder="請輸入郵箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名" prop="nameChn">
              <el-input v-model="form.nameChn" placeholder="請輸入中文名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名" prop="nameEng">
              <el-input v-model="form.nameEng" placeholder="請輸入英文名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.id == undefined" label="使用者密碼" prop="password">
              <el-input v-model="form.password" placeholder="請輸入使用者密碼" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用戶性別">
              <el-select v-model="form.gender" placeholder="請選擇">
                <el-option
                  v-for="dict in genderOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="狀態">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="請選擇">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="備註">
              <el-input v-model="form.remark" type="textarea" placeholder="請輸入內容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRole, addRole, updateRole } from '@/api/sys/role'
import { treeselect as menuTreeselect, getMenuByRoleId } from '@/api/sys/menu'
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
          if (this.form.id != null) {
            this.form.roleMenus = this.getMenuAllCheckedKeys().map(item => { return { roleId: this.form.id, menuId: item } })
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
            this.form.roleMenus = this.getMenuAllCheckedKeys().map(item => { return { roleId: this.form.id, menuId: item } })
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
