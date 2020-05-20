<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col v-if="form.id == undefined" :span="12">
            <el-form-item label="賬戶名" prop="loginName">
              <el-input v-model="form.loginName" placeholder="賬戶名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="歸屬部門" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" placeholder="請選擇歸屬部門" />
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
            <el-form-item label="內線電話" prop="internalPhone">
              <el-input v-model="form.internalPhone" placeholder="請輸入內線電話" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手機號碼" prop="mobile">
              <el-input v-model="form.mobile" placeholder="請輸入手機號碼" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="郵箱" prop="email">
              <el-input v-model="form.email" placeholder="請輸入郵箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.id == undefined" :span="12">
            <el-form-item label="用戶密碼" prop="password">
              <el-input v-model="form.password" placeholder="請輸入用戶密碼" type="password" />
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
                  :disabled="item.status === '0'"
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
import { getUser, addUser, updateUser, getRoleByUserId } from '@/api/sys/user'
import { getRoles } from '@/api/sys/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    deptOptions: {
      type: Array,
      default() {
        return []
      }
    },
    statusOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      open: false,
      title: '',
      initPassword: undefined,
      form: {},
      genderOptions: [],
      roleOptions: [],
      rules: {
        loginName: [{ required: true, message: '登入名不能為空', trigger: 'blur' }],
        nameChn: [{ required: true, message: '中文名不能為空', trigger: 'blur' }],
        nameEng: [{ required: true, message: '英文名不能為空', trigger: 'blur' }],
        deptId: [{ required: true, message: '歸屬部門不能為空', trigger: 'blur' }],
        password: [{ required: true, message: '使用者密碼不能為空', trigger: 'blur' }],
        email: [
          { required: true, message: '郵箱位址不能為空', trigger: 'blur' },
          {
            type: 'email',
            message: "'請輸入正確的郵箱位址",
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {

  },
  created() {
    this.getDicts('sys_gender').then(response => {
      this.genderOptions = response.data
    })
    this.getConfigKey('sys.user.initPassword').then(response => {
      this.initPassword = response.data[0].configValue
    })
    getRoles().then(response => {
      this.roleOptions = response.data
    })
  },
  methods: {
    create() {
      this.reset()
      this.open = true
      this.title = '添加用戶'
      this.form.password = this.initPassword
    },
    edit(userId) {
      this.reset()
      getUser(userId).then(response => {
        var formdata = response.data
        getRoleByUserId(userId).then(response => {
          formdata.roleIds = response.data.map(item => { return item.roleId })
          formdata.password = ''
          this.form = formdata
          this.open = true
          this.title = '修改用戶'
          console.log(formdata)
        })
      }).then(response => {
        console.log('then respone', response)
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.userRoles = this.form.roleIds.map(item => { return { roleId: item, userId: this.form.id } })
          if (this.form.id != null) {
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.$emit('getList')
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addUser(this.form).then(response => {
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
      this.form = {
        id: undefined,
        deptId: undefined,
        loginName: undefined,
        nameChn: undefined,
        nameEng: undefined,
        userType: undefined,
        email: undefined,
        internalPhone: undefined,
        mobile: undefined,
        gender: undefined,
        status: '1',
        remark: undefined,
        roleIds: []
      }
      this.resetForm('form')
    }
  }
}

</script>
