<template>
  <div class="model-tabs">
    <el-tabs v-model="activeName"
             class="model-tabs"
             @tab-click="handleClickForTabs">
      <el-tab-pane v-for="(item, idx) of tabs"
                   :label="item.label"
                   :name="item.value"
                   :key="idx+''">
      </el-tab-pane>

    </el-tabs>

    <el-button class="iconAdd"
               type="text"
               icon="el-icon-plus"
               v-if="data && data.btn"
               @click="callback(data.btn.fnName)">{{data.btn.text}}</el-button>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  computed: {
    activeName: {
      get() {
        return this.tabs && this.tabs[0].value || '';
      },
      set(val) {
        return val;
      }
    },
    tabs() {
      return this.data && this.data.tabs || [];
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args)
    },
    handleClickForTabs(tabs, event) {
      this.callback('handleClickForTabs', tabs, event);
    }
  },
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="less">
  .model-tabs {
    position: relative;
    height: 48px;
    .el-tabs__item {
      height: 48px;
      line-height: 48px;
      &:hover {
        color: #e20000;
      }
    }
    .el-button.iconAdd {
      position: absolute;
      top: 12px;
      right: 0;
      padding: 0;
      color: #999;
    }
    .el-tabs__item.is-active {
      color: #e20000;
    }
    .el-tabs__active-bar {
      background-color: #e20000;
    }
  }
</style>
