<template>
  <el-col :span="colOpts.span"
          :offset="colOpts.offset"
          :lg="colOpts.lg"
          :md="colOpts.md"
          :sm="colOpts.sm"
          class="model-col">
    <template v-if="options.type === 'only-col'">
    </template>
    <template v-else>
      <model-form-item ref="formItem"
                       :options="options"
                       :form="form"
                       :remoteData="remoteData"
                       @callback="callback"></model-form-item>
    </template>
  </el-col>
</template>
<script>
// import ModelFormItem from './modelFormItem';
const ModelFormItem = () => import('./modelFormItem');
export default {
  name: 'modelCol',
  components: {
    ModelFormItem
  },
  computed: {
    colOpts(){
      const { parentOpts,options} = this;
      return options.formItemOpts && options.formItemOpts.col || parentOpts.col || {}
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    clearFiles(){
      this.$nextTick(function(){
        this.$refs.formItem.clearFiles();
      })
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    parentOpts: {
      default(){return {}}
    },
    form: {
      default(){return {}},
      required: true,
      type: Object
    },
    remoteData: {
      type: Object
    }
  }
}
</script>
