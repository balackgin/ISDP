<template>
  <div class="daily">
    <el-button type="danger"
               @click="addMsg"
               size="small">新增</el-button>
    <model-list :options="listConfig"
                :data="[]"></model-list>
  </div>
</template>
<script>
import modelList from '@/components/modelList';
import listConfig from '../config/detail.config.json';
export default {
  components: {
    modelList
  },
  data() {
    return {
      listConfig
    };
  },
  methods: {
    addMsg() {
      this.$confirm('', '新增日报', {
        distinguishCancelAndClose: true,
        confirmButtonText: '保存',
        cancelButtonText: '取消'
      }).then(() => {
        // TO DO
      });
    }
  }
};
</script>
<style lang="less" scoped>
.daily {
  .el-button--danger {
    background-color: #d50000;
  }
}
</style>
