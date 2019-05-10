<template>
  <el-row class="model-detail-content-wrap"
          :gutter="rowOpts.gutter"
          type="flex">
    <template v-for="(item,idx) of options"
              v-if="item.label || item.prop">
      <content-col :key="idx+''"
                   :options="item"
                   :parentsOpts="parentOpts"
                   :data="data"
                   :form="form"
                   :remoteData="remoteData"
                   @callback="callback"></content-col>
    </template>
  </el-row>
</template>

<script>
import contentCol from './modelCol';

export default {
  components: {
    contentCol
  },
  computed: {
    rowOpts(){
      const {detailGroupOpts = {}} = this.options,
        {detailOpts = {} } = this.parentOpts;
      return detailGroupOpts.row || detailOpts.row || {}
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    }
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    parentOpts: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    form: {
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
</script>
<style lang="less" scoped>
  .model-detail-content-wrap {
    flex-wrap: wrap;
  }
</style>
