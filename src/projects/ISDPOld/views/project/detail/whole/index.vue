<template>
  <div class="project-detail-manage">
    <el-tabs type="border-card">
      <el-tab-pane v-for="item of tabs"
                   :label="item.title"
                   :key="item.name">
        <whole-risk></whole-risk>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import wholeRisk from './components/wholeRisk.vue';
export default {
  data() {
    return {
      name: 'manage',
      tabs: [
        {
          name: 'tab1',
          title: '风险及问题'
        }
      ]
    };
  },
  components: {
    wholeRisk
  }
};
</script>
<style lang="less">
  .project-detail-manage {
    padding: 0 !important;
    background-color: transparent !important;
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      color: #000;
    }
    .el-tabs--border-card
      > .el-tabs__header
      .el-tabs__item:not(.is-disabled):hover {
      color: #000;
    }
  }
</style>
