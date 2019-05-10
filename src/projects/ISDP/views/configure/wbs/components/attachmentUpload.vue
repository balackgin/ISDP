<template>
  <div>
    <el-upload
      action="/easywork/api/platform/file/upload"
      :on-preview="handlePictureCardPreview"
      name="file"
      accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .text, .PDF, .xlsx, .xls, .doc, .ppt"
      :headers="headers"
      :show-file-list="false"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
    >
      <!-- <i class="el-icon-plus"></i> -->
      <span>上传</span>
    </el-upload>
    <!-- <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>-->
  </div>
</template>
<script>
import store from '@/store';
export default {
  props: ['dataItem', 'saveDeliverableTemplate'],
  data() {
    return {
      dialogImageUrl: '',
      headers: {
        token: store.state.common.token
      }
    };
  },
  created() {},
  methods: {
    handleRemove(file, fileList) {},
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
    },
    handleAvatarSuccess(res, file) {
      if (res.resultCode === 'FS200') {
        this.dataItem.fileName = res.data.originFileName;
        this.dataItem.fileId = res.data.id;
        this.saveDeliverableTemplate(this.dataItem);
      }
    }
  }
};
</script>

