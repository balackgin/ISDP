<template>
    <div class="project-detail">
        <el-card class="box-card">
          <model-detail :options="detailConfig"
                        :data="detailData"></model-detail>
        </el-card>
        <el-card class="box-card">
          <section class="group">
            <p class="title">审批记录</p>
              <model-table :options="detailTable"
                            :data="[]"></model-table>
          </section>
        </el-card>
    </div>
</template>
<script>
import modelDetail from '@/components/modelDetail';
import modelTable from '@/components/modelList/modelTable';
import detailConfig from './config/detail.config.json';
import detailData from './config/detail.data.json';

export default {
  components: {
    modelDetail,
    modelTable
  },
  data() {
    return {
      detailConfig: detailConfig.detailForm,
      detailTable: detailConfig.detailTable,
      detailData
    };
  }
};
</script>
<style lang="less" scoped>
.project-detail {
  width: 100%;
  max-width: 960px;
  margin: 30px auto 0;
  .box-card {
    .col-label.flex-auto {
      width: 80px;
      line-height: 32px;
    }
    &:last-child {
      margin: 25px 0;
    }
  }
  .group {
    .title {
      padding: 10px 0;
      font-size: 14px;
    }
  }
}
</style>


