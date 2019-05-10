<template>
  <div class="model-upload-wrap">
    <template v-if="type === -1">
      <el-upload
        class="upload-theme1"
        multiple
        :action="formItemOpts.api"
        ref="upload"
        :headers="{token}"
        :data="Object.assign({creator},form)"
        :auto-upload="formItemOpts.autoUpload"
        :name="formItemOpts.name"
        :show-file-list="!!formItemOpts.showFileList"
        :limit="formItemOpts.limit"
        :before-upload="beforeUpload"
        :on-preview="onPreview"
        :on-success="onSuccess"
        :on-remove="onRemove"
        :on-exceed="onExceed"
        :on-progress="onProgress"
        :on-error="onError"
        :on-change="onChange"
      >{{options.text || '上传附件'}}</el-upload>
    </template>
    <template v-else-if="type === 1">
      <el-upload
        class="upload-theme1"
        multiple
        action="/easywork/api/platform/file/upload"
        ref="upload"
        :headers="{token}"
        :data="{creator}"
        :auto-upload="formItemOpts.autoUpload"
        :name="formItemOpts.name"
        :show-file-list="formItemOpts.showFileList"
        :limit="formItemOpts.limit"
        :before-upload="beforeUpload"
        :on-preview="onPreview"
        :on-success="onSuccess"
        :on-remove="onRemove"
        :on-exceed="onExceed"
        :on-progress="onProgress"
        :on-error="onError"
        :on-change="onChange"
      >{{options.text || '上传附件'}}</el-upload>
    </template>
    <template v-else-if="type === 2">
      <el-upload
        class="upload-theme2"
        multiple
        action="/easywork/api/platform/file/upload"
        ref="upload"
        :headers="{token}"
        :data="{creator}"
        :auto-upload="formItemOpts.autoUpload"
        :name="formItemOpts.name"
        :show-file-list="formItemOpts.showFileList"
        :limit="formItemOpts.limit"
        :before-upload="beforeUpload"
        :on-preview="onPreview"
        :on-success="onSuccess"
        :on-remove="onRemove"
        :on-exceed="onExceed"
        :on-error="onError"
        :on-change="onChange"
      >
        <el-button type="danger" class="upload-label">
          <i class="fa fa-cloud-upload"></i>
          上传附件
        </el-button>
        <div slot="tip" class="el-upload__tip">{{options.file && options.file.message}}</div>
      </el-upload>
    </template>
    <template v-else>
      <div class="upload-theme3-wrap flex">
        <el-upload
          class="upload-theme3"
          multiple
          action="/easywork/api/platform/file/upload"
          ref="upload"
          :headers="{token}"
          :data="{creator}"
          :auto-upload="formItemOpts.autoUpload"
          :name="formItemOpts.name"
          :show-file-list="formItemOpts.showFileList"
          :limit="formItemOpts.limit"
          :before-upload="beforeUpload"
          :on-preview="onPreview"
          :on-success="onSuccess"
          :on-remove="onRemove"
          :on-exceed="onExceed"
          :on-progress="onProgress"
          :on-error="onError"
          :on-change="onChange"
        >
          <el-button type="danger" class="upload-label">
            <i class="fa fa-cloud-upload"></i>
            上传附件
          </el-button>
        </el-upload>
        <ul class="upload-theme3-list flex-item flex">
          <li
            class="flex"
            v-for="fileItem of form[options.prop]"
            :key="fileItem.id"
            v-if="fileItem.isDel !== 1"
          >
            <a
              class="flex-item link"
              href="#"
              @click.prevent="download3(fileItem)"
            >{{fileItem.fileName || fileItem.originFileName}}</a>
            <i class="fas fa-times" @click="handleClickForRemove3(form[options.prop],fileItem)"></i>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      token: (state) => state.common.token,
      creator: (state) => {
        let userinfo = state.common.userinfo || {};
        return (
          userinfo.nickname +
          ((userinfo.username && ' (' + (userinfo.username || '') + ')') || '')
        );
      }
    }),
    formItemOpts() {
      return this.options.formItemOpts || {};
    }
  },
  methods: {
    callback(...args) {
      this.$callback(...args);
    },
    beforeUpload(file) {
      const { formItemOpts = {} } = this.options,
        { size, format, sizeErrMsg, formatErrMsg } = formItemOpts.file || {};
      if (format && format.includes(file.type.repeat('image/', ''))) {
        this.$elTooltip({
          message: formatErrMsg || '文件格式不正确!',
          type: 'error'
        });
        return false;
      } else if (size && file.size > size) {
        this.$elTooltip({
          message:
            sizeErrMsg ||
            `文件不能超过${Number.parseInt(size / 1024 / 1024)}M!`,
          type: 'error'
        });
        return false;
      }
    },
    onSuccess(...args) {
      //response,file,filelist
      this.$elLoading(false);
      this.callback('onSuccessForUpload', ...args, this.options);
    },
    onPreview(...args) {
      //response,file,filelist
      this.callback('onPreviewForUpload', ...args, this.options);
    },
    onExceed(...args) {
      //response,file,filelist
      this.callback('onExceedForUpload', ...args, this.options);
    },
    onChange(...args) {
      //response,file,filelist
      this.callback('onChangeForUpload', ...args, this.options);
    },
    onRemove(...args) {
      //file filelist
      this.callback('onRemoveForUpload', ...args, this.options);
    },
    onProgress() {
      this.$elLoading(true);
    },
    onError() {
      this.$elLoading(false);
      this.$elTooltip({
        type: 'error',
        message: this.formItemOpts.api || ''
      });
    },
    handleClickForRemove3(data, args) {
      if (args.id) {
        args.isDel = 1;
      } else {
        const index = data.findIndex((item) => item === args);
        data.splice(index, 1);
      }
    },
    async download3(args) {
      let result = await this.$store.dispatch('common/download', {
        url: location.origin + '/' + (args.url || args.docUrl)
      });
      if (result && result.data) {
        this.$download(result.data, args.originFileName || args.fileName);
      }
    },
    clearFiles() {
      this.$nextTick(function() {
        this.$refs.upload.clearFiles();
      });
    }
  },
  props: {
    type: true,
    options: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    remoteData: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

<style lang="less">
.model-upload-wrap {
  .upload-label {
    border-radius: 2px;
    background-color: #d50000;
    .upload-input {
      display: none;
    }
    // .upload-theme2 {
    //   .el-upload-list {
    //     max-height: 100px;
    //     overflow: auto;
    //   }
    // }
  }
  .upload-theme1 {
    .el-upload {
      &:focus {
        color: unset;
      }
    }
  }
  .upload-theme3-wrap {
    .upload-theme3-list {
      // padding-left: 16px;
      flex-wrap: wrap;
      line-height: 16px;
      & > li {
        padding: 0 8px;
        flex-basis: 50%;
        .fas {
          cursor: pointer;
        }
        .link {
          word-break: break-all;
        }
      }
    }
  }
}
</style>
