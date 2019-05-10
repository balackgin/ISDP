<template>
  <el-form-item :prop="options.prop"
                :label="options.label"
                :label-width="formItemOpts.labelWidth"
                :required="required"
                :offset="options.offset"
                :class="formItemOpts.className"
                class="model-form-item-wrap model-form-item">
    <!-- className: read-only并且readonly为true 该背景色为白色 -->
    <!-- <template v-if="options.situation && options.situation.type === 'label-question-icon'">
      <div slot="label">
        {{options.label}}
        <el-tooltip :content="options.situation.text + ''"
                    effect="dark"
                    placement="top">
          <i class="fa fa-question-circle-o tooltip-icon"></i>
        </el-tooltip>
      </div>
    </template> -->
    <!-- checkbox-group start -->
    <template v-if="options.type === 'checkbox'">
      <model-checkbox :options="options"
                      :form="form"
                      :remoteData="remoteData"
                      @callback="callback"></model-checkbox>
    </template>
    <!-- checkbox-group end -->
    <!-- input-search start -->
    <template v-else-if="options.type === 'input-search'">
      <model-input-search :options="options"
                          :form="form"
                          :remoteData="remoteData"
                          @callback="callback"></model-input-search>
    </template>
    <!-- input-search end -->
    <!-- select start -->
    <template v-else-if="options.type === 'select'">
      <model-select :options="options"
                    :form="form"
                    :remoteData="remoteData"
                    @callback="callback"></model-select>
    </template>
    <template v-else-if="options.type === 'switch'">
      <model-switch :options="options"
                    :form="form"
                    :remoteData="remoteData"
                    @callback="callback"></model-switch>
    </template>
    <!-- select end -->
    <!-- date-picker start -->
    <template v-else-if="options.type === 'date-picker'">
      <model-date-picker :options="options"
                         :form="form"
                         :remoteData="remoteData"
                         @callback="callback"></model-date-picker>
    </template>
    <!-- date-picker  end -->
    <!-- date-picker -->
    <template v-else-if="options.type === 'input-number'">
      <model-input-number :options="options"
                          :form="form"
                          :remoteData="remoteData"
                          @callback="callback"></model-input-number>
    </template>
    <template v-else-if="options.type === 'date-range'">
      <model-date-range :options="options"
                        :form="form"
                        :remoteData="remoteData"
                        @callback="callback"></model-date-range>
    </template>
    <template v-else-if="options.type === 'text'">
      {{form[options.prop]}}
    </template>
    <template v-else-if="options.type === 'upload-theme2'">
      <model-upload ref="upload"
                    :type="2"
                    :options="options"
                    :form="form"
                    :remoteData="remoteData"
                    @callback="callback"></model-upload>
    </template>
    <template v-else-if="options.type === 'upload-theme3'">
      <model-upload ref="upload"
                    :options="options"
                    :form="form"
                    :remoteData="remoteData"
                    @callback="callback"></model-upload>
    </template>
    <!-- upload-theme1 end -->
    <template v-else>
      <model-default-input :options="options"
                           :form="form"
                           :remoteData="remoteData"
                           @callback="callback"></model-default-input>
    </template>
  </el-form-item>

</template>
<script>
const modelCheckbox = () => import('./components/checkbox'),
  modelSelect = () => import('./components/select'),
  modelSwitch = ()=> import('./components/switch'),
  modelUpload = () => import('./components/upload'),
  modelInputSearch = () => import('./components/inputSearch'),
  modelDatePicker = () => import('./components/datePicker'),
  modelDateRange = () => import('./components/dateRange'),
  modelDefaultInput = () => import('./components/defaultInput');

export default {
  name: 'ModelFormItem',
  components: {
    modelCheckbox,
    modelSelect,
    modelSwitch,
    modelUpload,
    modelInputSearch,
    modelDatePicker,
    modelDateRange,
    modelDefaultInput
  },
  computed: {
    formItemOpts(){
      return this.options.formItemOpts || {};
    },
    required(){
      const {options,remoteData} = this;
      return this.$inputFlag(options,remoteData,'Required');
    }
  },
  methods: {
    callback(...args) {
      this.$callback( ...args);
    },
    clearFiles(){
      this.$nextTick(function(){
        this.$refs.upload && this.$refs.upload.clearFiles();
      });
    }
  },
  props: {
    //该组件需放在el-form中
    options: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    remoteData: {
      type: Object,
      default(){
        return {}
      }
    }
  }
};
</script>
<style lang="less">
  .model-form-item-wrap {
    margin-bottom: 15px;
    &.noMargin {
      margin-bottom: 0;
    }
    .el-form-item__label {
      margin-top: 4px;
      padding-bottom: 6px;
      line-height: 27px;
      color: #333;
      font-size: 16px;
    }
    .el-form-item__content {
      &.is-disabled,
      .is-disabled {
        [class^='el-'] {
          &,
          &:disabled {
            background-color: #eee;
            border-color: #eee;
          }
        }
      }
      .el-input,
      .el-input__inner,
      .el-select {
        width: 100%;
        border-radius: 0;
        .el-range-separator {
          min-width: 24px;
        }
      }
    }
  }
</style>
