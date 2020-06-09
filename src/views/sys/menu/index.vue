<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="菜单名称">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      border
      fit
      highlight-current-row
      :stripe="true"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160" />
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60" />
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
      <el-table-column prop="visible" label="顯示" align="center" sortable="custom" width="80">
        <template slot-scope="scope">
          {{ visibleMap[scope.row.visible] }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" sortable="custom" width="80">
        <template slot-scope="scope">
          {{ statusMap[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="250">
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
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleCopy(scope.row)"
          >複製</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <edit
      ref="editor"
      :status-options="statusOptions"
      :visible-options="visibleOptions"
      @getList="getList"
    />
  </div>
</template>

<script>
import Edit from '@/views/sys/menu/components/edit'
import { fetchAll, delMenu } from '@/api/sys/menu'

export default {
  name: 'Menu',
  components: { Edit },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 显示状态数据字典
      visibleOptions: [],
      visibleMap: {},
      // 菜单状态数据字典
      statusOptions: [],
      statusMap: {},
      // 查询参数
      queryParams: {
        sortColumn: 'orderNum',
        menuName: undefined,
        visible: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_show_hide').then(response => {
      this.visibleOptions = response.data
      this.visibleMap = Object.fromEntries(response.data.map(item => { return [item.dictValue, item.dictLabel] }))
    })
    this.getDicts('sys_available').then(response => {
      this.statusOptions = response.data
      this.statusMap = Object.fromEntries(response.data.map(item => { return [item.dictValue, item.dictLabel] }))
    })
  },
  methods: {
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      fetchAll(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data)
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.$refs['editor'].create(row.id)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs['editor'].edit(row.id)
    },
    handleCopy(row) {
      this.$refs['editor'].copy(row.id)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMenu(row.id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
