<template>
  <div>
    <el-upload
      style="display-block"
      class="upload-demo"
      action="/easywork/api/platform/file/upload"
      :on-preview="handlePreview"
      :before-remove="beforeRemove"
      :on-change="handleChange"
      :show-file-list="false"
      :before-upload="onBeforeUpload"
      name="file"
      :headers="headers"
      :on-success="handleAvatarSuccess"
    >
      <span class="riskUploadBtn">点击上传</span>
    </el-upload>
    <div
      class="fileListClass"
      v-if="riskDetailData.attachmentArray&&riskDetailData.attachmentArray.length>0"
    >
      <p
        class="fileListClass_item"
        v-for="item of riskDetailData.attachmentArray"
        :key="item.fileUploadId"
        v-if="((!item.isDel||(item.isDel==0||item.isDel===null))&&(item.businessType=='risk_input'||!item.businessType))&&riskDetailData.part==1"
      >
        <img class="fujianIcon" src="@ISDP/assets/images/common/common_dialog_icon_fujian.png">
        <span class="fileListClass_item_info">{{item.fileName}}</span>
        <i class="el-icon-circle-close fileDeleteIcon" @click="handleRemove(item.fileUploadId)"></i>
      </p>
      <p
        class="fileListClass_item"
        v-for="item of riskDetailData.attachmentArray"
        :key="item.fileUploadId"
        v-if="((!item.isDel||(item.isDel==0||item.isDel===null))&&(item.businessType=='risk_ongoing'||!item.businessType))&&riskDetailData.part==3"
      >
        <img class="fujianIcon" src="@ISDP/assets/images/common/common_dialog_icon_fujian.png">
        <span class="fileListClass_item_info">{{item.fileName}}</span>
        <i class="el-icon-circle-close fileDeleteIcon" @click="handleRemove(item.fileUploadId)"></i>
      </p>
      <p
        class="fileListClass_item"
        v-for="item of riskDetailData.attachmentArray"
        :key="item.fileUploadId"
        v-if="((!item.isDel||(item.isDel==0||item.isDel===null))&&(item.businessType=='risk_closed'||!item.businessType))&&riskDetailData.part==4"
      >
        <img class="fujianIcon" src="@ISDP/assets/images/common/common_dialog_icon_fujian.png">
        <span class="fileListClass_item_info">{{item.fileName}}</span>
        <i class="el-icon-circle-close fileDeleteIcon" @click="handleRemove(item.fileUploadId)"></i>
      </p>
    </div>
  </div>
</template>
<script>
import store from '@/store';
import proxyElementUi from '@/plugins/proxyElementUi';
const { elLoading } = proxyElementUi;
export default {
  props: ['riskDetailData'],
  data() {
    return {
      headers: {
        token: store.state.common.token
      }
    };
  },
  created() {},
  methods: {
    handleRemove(fileUploadId) {
      let findindex = this.riskDetailData.attachmentArray.findIndex((item) => {
        return item.fileUploadId == fileUploadId;
      });
      if (
        this.riskDetailData.attachmentArray[findindex].isDel == 0 ||
        this.riskDetailData.attachmentArray[findindex].isDel === null
      ) {
        this.$set(this.riskDetailData.attachmentArray[findindex], 'isDel', 1);
      } else {
        this.riskDetailData.attachmentArray.splice(findindex, 1);
      }
    },
    handlePreview(file) {},
    onBeforeUpload(file) {
      const isIMAGE = file.type === 'application/x-msdownload';
      const isLt = file.size / 1024 / 1024 < 20;
      if (isIMAGE) {
        this.$message.error('上传文件格式不对!');
      }
      if (!isLt) {
        this.$message.error('上传文件大小不能超过 20MB!');
      }
      return !isIMAGE && isLt;
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      elLoading();
      if (res.resultCode === 'FS200') {
        elLoading(false);
        this.$elTooltip({
          type: 'success',
          message: res.resultMessage
        });
        this.riskDetailData.attachmentArray.push({
          fileUploadId: res.data.id,
          fileName: res.data.originFileName
        });
      } else {
        this.$elTooltip({
          type: 'error',
          message: res.resultMessage
        });
      }
    },
    beforeRemove(file, fileList) {},
    handleChange(file, fileList) {
      this.fileList = fileList;
    }
  }
};
</script>

<style lang='less' scoped>
.riskUploadBtn {
  position: absolute;
  display: inline-block;
  width: 100px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid #f00000;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #f00000;
  top: 0;
  left: 0;
}
.fileListClass {
  display: inline-block;
  width: 470px;
  border-radius: 4px;
  float: left;
  border: 1px solid rgba(203, 203, 203, 0.66);
  margin-left: 118px;
  padding-left: 7px;
  padding-right: 7px;
  &_item:last-child {
    border: none;
  }
  &_item {
    height: 30px;
    border-bottom: 1px dashed rgba(203, 203, 203, 0.66);
    &_info {
      color: #333333;
      font-size: 14px;
      display: inline-block;
      width: 415px;
    }
    .fileDeleteIcon {
      color: #999999;
      cursor: pointer;
    }
    .fujianIcon {
      display: inline-block;
      margin-right: 5px;
    }
  }
  &_item:hover .fileDeleteIcon {
    background-color: #ff9999;
  }
  &_item:hover .fujianIcon {
    background-color: #ff9999;
  }
}
</style>

