<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="部门名称">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptList"
      border
      fit
      highlight-current-row
      :stripe="true"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
    >
      <el-table-column prop="deptName" label="部门名称" width="300" />
      <el-table-column prop="orderNum" label="排序" sortable="custom" align="center" width="100" />
      <el-table-column prop="status" label="状态" align="center" sortable="custom" width="100">
        <template slot-scope="scope">
          {{ statusMap[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="createTime" width="200">
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <edit
      ref="editor"
      :status-options="statusOptions"
      @getList="getList"
    />
  </div>
</template>

<script>
import Edit from '@/views/sys/dept/components/edit'
import { fetchAll, delDept } from '@/api/sys/dept'

export default {
  name: 'Dept',
  components: { Edit },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 状态数据字典
      statusOptions: [],
      statusMap: {},
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined,
        sortColumn: 'orderNum',
        sortType: 'ascending'
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_available').then(response => {
      this.statusOptions = response.data
      this.statusMap = Object.fromEntries(response.data.map(item => { return [item.dictValue, item.dictLabel] }))
    })
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true
      fetchAll(this.queryParams).then(response => {
        console.log(response.data)
        this.deptList = this.handleTree(response.data)
        this.loading = false
      })
    },
    sortChange(column) {
      this.queryParams.sortColumn = column.prop
      this.queryParams.sortType = column.order
      this.getList()
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.deptName,
        children: node.children
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 新增按鈕操作 */
    handleAdd(row) {
      this.$refs['editor'].create(row.id)
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.$refs['editor'].edit(row.id)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDept(row.id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
