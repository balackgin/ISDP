<template>
  <ul class="con-box">
    <li class="list-item"
        v-for="(item, index) of data"
        :key="index +''">
      <i class="el-icon-document"></i>
      <span>{{item.name}}</span>
      <span class="download"
            v-if="item.myFileId"
            @click="downloadFile(item)">下载</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'file-link',
  methods: {
    async downloadFile(row) {
      const { myFileId: fileId } = row;
      if(!fileId)  return false;
      const { data } = await this.$store.dispatch('ISDP/projectStart/wbs/downloadTemplate', {
        fileId
      })
      const {originFileName, docUrl } = data;
      if(!originFileName && !docUrl) {
        this.$elTooltip({
          type: 'error',
          message: '未找到上传文件！'
        })
        return false;
      }

      const { data: result } = await this.$store.dispatch('common/download',{
        url: docUrl
      });
      this.$download(result, originFileName);
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    type: true
  }
}
</script>

<style lang="less" scoped>
  .con-box {
    padding: 0 10px;
    border: 1px solid #ddd;
    .list-item {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px dashed #ddd;
      &:last-child {
        border: none;
      }
      .el-icon-document {
        width: 16px;
        height: 16px;
        margin: 0 3px;
        line-height: 30px;
        font-size: 16px;
      }
      .download {
        position: absolute;
        right: 30px;
        height: 40px;
        text-decoration: underline;
        color: #3276ff;
      }
    }
  }
</style>
