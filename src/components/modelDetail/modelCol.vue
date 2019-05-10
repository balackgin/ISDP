<template>
  <el-col :lg="commonCol.lg"
          :span="commonCol.span"
          :md="commonCol.md"
          :sm="commonCol.sm"
          class="model-detail-item-wrap"
          :class="[commonOpts.className,{'nISDP-model-detail-item-wrap': detailOpts.theme === 'isdp'}]">
    <!-- label start -->
    <span class="col-label flex-auto"
          v-if="options.label"
          :class="[commonOpts.labelClassName]"
          :style="[commonOpts.labelStyle]">
      {{options.label}}
    </span>
    <!-- label end -->
    <!-- content start -->
    <div class=" flex-item"
         @click="handleClickForContent(options)"
         @dblclick="handleDBLClickForContent(options)">
      <!-- type: list start -->
      <template v-if="itemType.includes('formItem') || editFlag || remoteData.inputProps && remoteData.inputProps.includes(options.prop)">
        <el-form @submit.native.prevent>
          <model-form-group :options="Object.assign({},{prop: options.prop},detailItemOpts)"
                            :form="inputProps.useForm ? form : data"
                            @callback="callback"></model-form-group>
        </el-form>
      </template>
      <template v-else-if="itemType.includes('list')">
        <content-list :data="contentValue || []"
                      :type="itemType"></content-list>
      </template>
      <!-- type: list end -->
      <!-- type: fileLink  start -->
      <template v-else-if="itemType.includes('fileLink')">
        <file-link :options="options"
                   :data="data"></file-link>
      </template>
      <!-- type: fileLink  end -->

      <!-- type: fileLink  start -->
      <template v-else-if="itemType.includes('fileList')">
        <file-list :options="options"
                   :data="contentValue || []"></file-list>
      </template>
      <!-- type: fileLink  end -->
      <template v-else>
        <default-type :contentValue="contentValue"
                      :commonOpts="commonOpts"
                      :parentsOpts="detailOpts"></default-type>
      </template>
    </div>
    <!-- content end -->
  </el-col>
</template>
<script>
const modelFormGroup = () => import('../modelFormGroup/modelFormItem'),
  contentList = () => import('./components/list'),
  fileList = () => import('./components/fileList.vue'),
  fileLink = () => import('./components/fileLink'),
  defaultType = () => import('./components/defaultType');
export default {
  components: {
    modelFormGroup,
    contentList,
    fileLink,
    fileList,
    defaultType
  },
  data(){
    return {
      editFlag: false
    }
  },
  computed: {
    detailOpts(){
      return this.parentsOpts.detailOpts || {};
    },
    detailItemOpts(){
      const {detailItemOpts = {}} = this.options;
      return detailItemOpts;
    },
    inputProps(){
      return this.detailItemOpts.inputProps || {};
    },
    commonCol(){
      const {parentsOpts = {},detailItemOpts = {}} = this;
      return detailItemOpts && detailItemOpts.col || parentsOpts.detailOpts && parentsOpts.detailOpts.col || {};
    },
    commonOpts(){
      const {parentsOpts = {},options = {}} = this;
      // return options.detailItemOpts || parentsOpts.detailOpts || {};
      return Object.assign({},parentsOpts.detailOpts,options.detailItemOpts);
    },
    contentValue(){
      const {options = {},detailItemOpts = {},data = {}} = this,
        value = data[detailItemOpts.prop || options.prop],
        {objData} = detailItemOpts;
      return objData ? objData[value] : value;
    },
    itemType(){
      return this.options.type || [];
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    turnFormItem(args,type){
      const {commonOpts} = this,
        {inputProps} = commonOpts,
        {props = [],target = [],type: inputPropsType} = inputProps || {};
      if(inputProps && args.prop && props.includes(args.prop) && target.includes(type)){
        inputPropsType === 'callback' ? this.callback('turnFormItem', args) : this.editFlag = true;
      }
    },
    handleClickForContent(args){
      this.turnFormItem(args,'click');
    },
    handleDBLClickForContent(args){
      this.turnFormItem(args,'dblclick');
    }
  },
  props: {
    options: {
      required: true
    },
    data: {
      required: true,
      type: Object
    },
    parentsOpts: {
      type: Object,
      default(){
        return {}
      }
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
  .model-detail-item-wrap {
    @hei: 46px;
    min-height: @hei;
    padding: 14px 14px 0;
    word-break: break-all;
    display: flex;

    @hei: 32px;
    .col-label {
      flex-basis: 100px;
      text-align: left;
      color: #999;
      font-size: 12px;
      line-height: @hei;
      &.warn-txt {
        color: red;
      }
    }

    .col-txt {
      .el-form-item {
        margin-bottom: 0;
      }
    }
    &.nISDP-model-detail-item-wrap {
      .col-label {
        font-size: 14px;
        color: #777a80;
      }
    }
  }
</style>
<style lang="less">
  .table-tooltip {
    max-width: 800px;
  }
  .model-detail-item-wrap {
    .el-input--small .el-input__inner {
      height: auto;
    }
  }
</style>
