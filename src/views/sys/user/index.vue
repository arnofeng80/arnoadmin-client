<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部門資料-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="請輸入部門名稱"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--使用者資料-->
      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="登入名" prop="loginName">
            <el-input
              v-model="queryParams.loginName"
              placeholder="請輸入登入名"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="中文名" prop="nameChn">
            <el-input
              v-model="queryParams.nameChn"
              placeholder="請輸入中文名"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="英文名" prop="nameEng">
            <el-input
              v-model="queryParams.nameEng"
              placeholder="請輸入英文名"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="狀態" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="使用者狀態"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="創建時間">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >刪除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
            >導入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >匯出</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="登入名" align="center" prop="loginName" />
          <el-table-column label="中文名" align="center" prop="nameChn" :show-overflow-tooltip="true" />
          <el-table-column label="英文名" align="center" prop="nameEng" :show-overflow-tooltip="true" />
          <el-table-column label="部門" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.deptId }}
            </template>
          </el-table-column>
          <el-table-column label="內線號碼" align="center" prop="internalPhone" width="120" />
          <el-table-column label="狀態" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="創建時間" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >刪除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
              >重置</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改參數配置對話方塊 -->
    <edit
      ref="editor"
      :dept-options="deptOptions"
      :status-options="statusOptions"
      @getList="getList"
    />
    <!-- 用戶導入對話方塊 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx,.xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          將文件拖到此處，或
          <em>點擊上傳</em>
        </div>
        <div slot="tip" class="el-upload__tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已經存在的使用者資料
          <el-link type="info" style="font-size:12px" @click="importTemplate">下載範本</el-link>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red">提示：僅允許導入“xls”或“xlsx”格式檔！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">確 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Edit from '@/views/sys/user/components/edit'
import { listUser, delUser, exportUser, resetUserPwd, changeUserStatus, importTemplate } from '@/api/sys/user'
import { getToken } from '@/utils/auth'
import { deptTree } from '@/api/sys/dept'

export default {
  name: 'User',
  components: { Edit },
  data() {
    return {
      // 遮罩層
      loading: true,
      // 選中陣列
      ids: [],
      // 非單個禁用
      single: true,
      // 非多個禁用
      multiple: true,
      // 總條數
      total: 0,
      // 使用者表格資料
      userList: null,
      // 部門樹選項
      deptOptions: undefined,
      // 是否顯示彈出層
      open: false,
      // 部門名稱
      deptName: undefined,
      // 日期範圍
      dateRange: [],
      // 狀態資料字典
      statusOptions: [],
      // 表單參數
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 用戶導入參數
      upload: {
        // 是否顯示彈出層（使用者導入）
        open: false,
        // 彈出層標題（用戶導入）
        title: '',
        // 是否禁用上傳
        isUploading: false,
        // 是否更新已經存在的使用者資料
        updateSupport: 0,
        // 設置上傳的請求頭部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上傳的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      // 查詢參數
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        loginName: undefined,
        nameChn: undefined,
        nameEng: undefined,
        status: undefined,
        deptId: undefined
      }
    }
  },
  computed: {

  },
  watch: {
    // 根據名稱篩選部門樹
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
    this.getDicts('sys_available').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查詢用戶列表 */
    getList() {
      this.loading = true
      listUser(this.addDateRange(this.queryParams, this.dateRange, 'createTime')).then(response => {
        this.userList = response.data.rows
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    /** 查詢部門下拉樹結構 */
    getTreeselect() {
      deptTree().then(response => {
        if (response.data != null && response.data.length > 0) {
          this.clearLeafChild(response.data)
        }
        this.deptOptions = response.data
      })
    },
    clearLeafChild(child) {
      child.forEach(item => {
        if (item.children.length === 0) {
          item.children = undefined
        } else {
          this.clearLeafChild(item.children)
        }
      })
    },
    // 篩選節點
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 節點按一下事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    // 使用者狀態修改
    handleStatusChange(row) {
      console.log(row.status)
      const text = row.status === '1' ? '啟用' : '停用'
      this.$confirm('確認要"' + text + '"' + row.loginName + '用戶嗎?', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.id, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    /** 搜索按鈕操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重新開機按鈕操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多選框選中數據
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按鈕操作 */
    handleAdd() {
      this.$refs['editor'].create()
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      const userId = row.id || this.ids
      this.$refs['editor'].edit(userId)
    },
    /** 重置密碼按鈕操作 */
    handleResetPwd(row) {
      this.$prompt('請輸入"' + row.loginName + '"的新密碼', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        resetUserPwd(row.id, value).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功，新密碼是：' + value)
          } else {
            this.msgError(response.msg)
          }
        })
      }).catch(() => {})
    },
    /** 刪除按鈕操作 */
    handleDelete(row) {
      const userIds = row.id != null ? [row.id] : this.ids
      this.$confirm('是否確認刪除?', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delUser(userIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('刪除成功')
      }).catch(function() {})
    },
    /** 匯出按鈕操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否確認匯出所有用戶資料項目?', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportUser(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {})
    },
    /** 導入按鈕操作 */
    handleImport() {
      this.upload.title = '用戶導入'
      this.upload.open = true
    },
    /** 下載範本操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg)
      })
    },
    // 文件上傳中處理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 檔上傳成功處理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '導入結果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上傳文件
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>
