<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名稱">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="角色編碼">
          <el-input v-model="form.roleCode" :disabled="true" />
        </el-form-item>
        <el-form-item label="權限範圍">
          <el-select v-model="form.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.dataScope === '2'" label="數據權限">
          <el-tree
            ref="dept"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            node-key="id"
            empty-text="載入中，請稍後"
            :props="defaultProps"
          />
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
import { getRole } from '@/api/sys/role'
import { updateDataScope } from '@/api/sys/role'
import { deptTree as deptTreeselect, getDeptByRoleId } from '@/api/sys/dept'
export default {
  data() {
    return {
      open: false,
      // 彈出層標題
      title: '',
      form: {},
      // 部門列表
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 資料範圍選項
      dataScopeOptions: [
        {
          value: '1',
          label: '全部資料許可權'
        },
        {
          value: '2',
          label: '自定數據許可權'
        },
        {
          value: '3',
          label: '本部門資料許可權'
        },
        {
          value: '4',
          label: '本部門及以下資料許可權'
        },
        {
          value: '5',
          label: '僅本人資料許可權'
        }
      ],
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

  },
  methods: {
    edit(roleId) {
      this.reset()
      getRole(roleId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '分配數據權限'
        this.getDeptTreeselect()
      }).then(response => {
        getDeptByRoleId(roleId).then(response => {
          this.$refs.dept.setCheckedKeys(response.data.map(x => { return x.deptId }))
        })
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    submitForm: function() {
      if (this.form.id != null) {
        if (this.form.dataScope !== '2') {
          this.$refs.dept.setCheckedKeys([])
        }
        this.form.roleDepts = this.getAllCheckedKeys().map(item => { return { roleId: this.form.id, deptId: item } })
        updateDataScope(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.open = false
            this.$emit('getList')
          } else {
            this.msgError(response.msg)
          }
        })
      }
    },
    // 表單重置
    reset() {
      if (this.$refs.menu != null) {
        this.$refs.dept.setCheckedKeys([])
      }
      this.form = {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        orderNum: 0,
        status: '0',
        roleMenus: [],
        remark: undefined
      }
      this.resetForm('form')
    },
    getDeptTreeselect(roleId) {
      deptTreeselect(roleId).then(response => {
        this.deptOptions = response.data
      })
    },
    // 所有功能表節點資料
    getAllCheckedKeys() {
      // 目前被選中的部門節點
      const checkedKeys = this.$refs.dept.getCheckedKeys()
      // 半選中的部門節點
      const halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    }
  }
}

</script>
