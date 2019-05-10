<template>
  <outside-dialog :show="show"
                  title="任务反馈"
                  class="task-feedback-dialog-wrap"
                  @callback="callback">
    <el-row :gutter="20"
            class="task-feedback-detail">
      <el-col :span="12">
        <span class="tfd-text">
          完成进度:
        </span>
        <div class="box">
          {{detailData.feedbackProgress || 0}}%
        </div>
      </el-col>
      <el-col :span="12">
        <span class="tfd-text">反馈日期:</span>
        <div class="box">
          {{detailData.feedbackDate}}
        </div>
      </el-col>
      <el-col :span="24">
        <span class="tfd-text">任务分解:</span>
        <div class="box">
          <model-table :options="Config.dialogTableConfig"
                       :data="detailData.feedbackItemDTOList || []"></model-table>
        </div>
      </el-col>
      <el-col :span="24">
        <span class="tfd-text">截止到上次任务反馈的所有完成内容:</span>
        <div class="box">
          {{detailData.feedbackAll}}
        </div>
      </el-col>
      <el-col :span="24">
        <span class="tfd-text">本次工作内容:</span>
        <div class="box">
          {{detailData.feedbackContent}}
        </div>
      </el-col>
      <el-col :span="24">
        <span class="tfd-text">困难及问题:</span>
        <div class="box">
          {{detailData.memo}}
        </div>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button size="small"
                 type="primary"
                 @click="callback('beforeClose')">确认</el-button>
      <el-button size="small"
                 @click="callback('beforeClose')">取消</el-button>
    </div>
  </outside-dialog>
</template>
<script>
import Config from './config/planTaskDialog.config';
import outsideDialog from '@/components/outsideDialog';
import modelTable from '@/components/modelList/modelTable';
export default {
  name: 'planTaskItemDialog',
  components: {
    outsideDialog,
    modelTable
  },
  data(){
    return {
      Config
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    detailData: {
      type: Object,
      default(){
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .task-feedback-dialog-wrap {
    .task-feedback-detail {
      .el-col {
        padding: 10px 0;
        display: flex;
        .tfd-text {
          padding-right: 20px;
          white-space: nowrap;
        }
        .box {
          flex: 1;
        }
      }
    }
  }
</style>
