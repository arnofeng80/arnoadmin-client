<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx,.xls"
        :headers="headers"
        :action="url + '?updateSupport=' + updateSupport"
        :disabled="isUploading"
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
          <el-checkbox v-model="updateSupport" />是否更新已經存在的使用者資料
          <el-link type="info" style="font-size:12px" @click="importTemplate">下載範本</el-link>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red">提示：僅允許導入“xls”或“xlsx”格式檔！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">確 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { importTemplate } from '@/api/sys/user'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
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
      url: process.env.VUE_APP_BASE_API + '/sys/user/importData'
    }
  },
  methods: {
    /** 導入按鈕操作 */
    handleImport() {
      this.title = '用戶導入'
      this.open = true
    },
    /** 下載範本操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg)
      })
    },
    // 文件上傳中處理
    handleFileUploadProgress(event, file, fileList) {
      this.isUploading = true
    },
    // 檔上傳成功處理
    handleFileSuccess(response, file, fileList) {
      this.open = false
      this.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '導入結果', { dangerouslyUseHTMLString: true })
      this.$emit('getList')
    },
    // 提交上傳文件
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>
