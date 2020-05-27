<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="角色名稱" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="請輸入角色名稱"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="角色編碼" prop="roleCode">
          <el-input
            v-model="queryParams.roleCode"
            placeholder="請輸入角色編碼"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="角色狀態"
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
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >匯出</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table v-loading="loading" :data="roleList" border highlight-current-row :stripe="true" :default-sort="queryParams.sort" @selection-change="handleSelectionChange" @sort-change="sortChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色名稱" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="角色編碼" prop="roleCode" sortable="custom" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="排序" prop="orderNum" sortable="custom" width="100" />
      <el-table-column label="狀態" align="center" prop="status" sortable width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="創建時間" align="center" prop="createTime" sortable="custom" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleDataScope(scope.row)"
          >數據權限</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >刪除</el-button>
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

    <!-- 添加或修改角色配置對話方塊 -->
    <edit
      ref="editor"
      @getList="getList"
    />
    <data-scope
      ref="dataScope"
      @getList="getList"
    />
  </div>
</template>

<script>
import Edit from '@/views/sys/role/components/edit'
import DataScope from '@/views/sys/role/components/dataScope'
import { listRole, delRole, exportRole, changeRoleStatus } from '@/api/sys/role'

export default {
  name: 'Role',
  components: { Edit, DataScope },
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
      // 角色表格資料
      roleList: [],
      // 日期範圍
      dateRange: [],
      // 狀態資料字典
      statusOptions: [],
      // 查詢參數
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleCode: undefined,
        sortColumn: 'orderNum',
        sortType: 'ascending',
        status: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_available').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查詢角色列表 */
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParams, this.dateRange, 'createTime')).then(
        response => {
          this.roleList = response.data.rows
          this.total = response.data.totalCount
          this.loading = false
        })
    },
    sortChange(column) {
      this.queryParams.sortColumn = column.prop
      this.queryParams.sortType = column.order
      this.getList()
    },
    // 角色狀態修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '停用' : '啟用'
      this.$confirm('確認要' + text + '角色[' + row.roleName + ']嗎?', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.id, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    /** 搜索按鈕操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按鈕操作 */
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
      const roleId = row.id || this.ids
      this.$refs['editor'].edit(roleId)
    },
    /** 分配資料許可權操作 */
    handleDataScope(row) {
      const roleId = row.id || this.ids
      this.$refs['dataScope'].edit(roleId)
    },
    /** 刪除按鈕操作 */
    handleDelete(row) {
      const roleIds = row.id != null ? [row.id] : this.ids
      this.$confirm('是否確認刪除?', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('刪除成功')
      }).catch(function() {})
    },
    /** 匯出按鈕操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否確認匯出所有角色資料項目?', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportRole(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {})
    }
  }
}
</script>
