<template>
  <div class="model-detail"
       :class="[{'nISDP-model-detail-wrap': detailOpts.theme === 'isdp'}]">
    <section v-for="(groupItem,groupIdx) of options.detailGroup"
             :key="groupIdx + ''"
             class="group"
             :class="[detailGroupOpts(groupItem).className,{noneLine: detailGroupOpts(groupItem).noneLine}]">
      <!-- v-if start
           groupItem.title
      -->
      <template v-if="groupItem.title">
        <div class="line-text">
          <span class="text">{{groupItem.title}}</span>
        </div>
      </template>
      <!-- v-if end
           groupItem.title
      -->
      <!-- content start -->
      <!-- <el-row> -->
      <template v-if="groupItem.detailItems">
        <model-detail-content :options="groupItem.detailItems"
                              :parentOpts="options"
                              :data="data"
                              :form="form"
                              :remoteData="remoteData"
                              @callback="callback"></model-detail-content>
      </template>
      <!-- </el-row> -->
      <!-- content end -->
    </section>
    <slot name="appendGroup"></slot>
  </div>
</template>
<script>
const modelDetailContent = () => import('./modelRow');
export default {
  name: 'modelDetail',
  components: {
    // modelItem
    modelDetailContent
  },
  computed: {
    detailOpts(){
      return this.options.detailOpts || {};
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    detailGroupOpts(args = {}){
      return args.detailGroupOpts || this.options.detailOpts || {};
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    data: { // 表格渲染的数据
      type: Object,
      required: true
    },
    form: { //
      type: Object,
      default(){
        return {}
      }
    },
    remoteData: {
      type: Object,
      default(){
        return {}
      }
    }
  }
}


/*
props.options:
{
  detailOpts: {
    col: {}
  }, // 公共基础配置
  detailGroup: [{
    detailGroupOpts: {}
    detailItems: [{
      label: "",
      prop: "",
      col: {},
      detailItemOpts: {}
    }]
  }]
}
*/
</script>
<style lang="less" scoped>
  .model-detail {
    .group {
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px solid #ddd;
      &.noneLine {
        border-bottom: 0;
      }
    }
    &.nISDP-model-detail-wrap {
      padding: 40px 50px;
      background-color: #fff;
      .group {
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }
</style>
