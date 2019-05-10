<template>
  <div class="project-default-report-wrap">
    <div v-for="(item,idx) of reportConfig"
         :key="'group'+idx"
         class="report-group">
      <p class="title abcasd"
         v-if="item.title">{{item.title}}</p>
      <el-row :gutter="24">
        <el-col :span="item.col || 8"
                v-for="(reportItem,reportIdx) of item.reportGroup"
                :key="'reportItem'+reportIdx">
          <div class="box">
            <div>
              <model-echart :options="reportItem"
                            :remoteData="remoteData"></model-echart>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
// import reportConfig from './config/report.config';
const modelEchart = () => import('@/components/modelEchart');
export default {
  components: {
    modelEchart
  },
  computed: {
    reportConfig() {
      return this.options
    }
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    remoteData: {
      type: Object,
      default(){
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .project-default-report-wrap {
    .report-group {
      .title {
        margin-bottom: 20px;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
      .box {
        margin-bottom: 20px;
        padding: 16px 30px;
        background-color: #fff;
        /deep/ .echart-title {
          font-size: 15px;
          color: #666;
        }
      }
    }
  }
</style>
