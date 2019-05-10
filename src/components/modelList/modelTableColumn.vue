<template>
  <el-table-column v-if="['index','selection'].includes(options.type)"
                   :label="options.label"
                   :type="options.type"
                   :min-width="columnOpts.minWidth || tableOpts.tableColumnMinWidth"
                   :width="columnOpts.width || tableOpts.tableColumnWidth"
                   :align="columnOpts.align">
  </el-table-column>
  <el-table-column v-else-if="options.type === 'expand'"
                   :label="options.label"
                   :type="options.type"
                   :min-width="columnOpts.minWidth || tableOpts.tableColumnMinWidth"
                   :width="columnOpts.width || tableOpts.tableColumnWidth"
                   :align="columnOpts.align">
    <template slot-scope="scope">
      <slot name="expand"
            :rowData="scope.row"></slot>
    </template>
  </el-table-column>
  <el-table-column v-else-if="options.children && options.children.length"
                   :label="options.label"
                   :type="options.type"
                   :min-width="columnOpts.minWidth || tableOpts.tableColumnMinWidth"
                   :width="columnOpts.width || tableOpts.tableColumnWidth"
                   :align="columnOpts.align">
    <template v-for="(childItem,childIdx) of options.children">
      <model-table-column :options="childItem"
                          :tableOpts="tableOpts"
                          :remoteData="remoteData"
                          :form="form"
                          :label-class-name="childIdx === 0 ? 'mulTableHead firstMulTableHead' : 'mulTableHead'"
                          :currentInputProp="currentInputProp"
                          :key="childItem.prop || childItem.label"></model-table-column>
    </template>
  </el-table-column>
  <el-table-column v-else
                   :label="options.label"
                   :prop="options.prop"
                   :column-key="options.type"
                   :show-overflow-tooltip="true"
                   :min-width="columnOpts.minWidth || tableOpts.tableColumnMinWidth"
                   :width="columnOpts.width || tableOpts.tableColumnWidth"
                   :fixed="columnOpts.fixed"
                   :align="columnOpts.align"
                   :sortable="columnOpts.sortable"
                   :label-class-name="labelClassName || columnOpts.labelClassName"
                   :class-name="className || columnOpts.className"
                   :sort-orders="columnOpts.sortOrders">
    <!-- slot-scope  自定义el-table-column 模板 -->
    <template slot-scope="scope">
      <!-- ////////////////////////////////////////////////////// -->
      <!-- 根据type判断 显示什么 -->
      <!-- 其他情况需自行添加 -->
      <!-- ////////////////////////////////////////////////////// -->
      <!-- action-icons start -->
      <!-- <template v-if="scope.row[options.prop] && scope.row[options.prop].length === 0">
        <span></span>
      </template> -->

      <!-- options.type === 'formItem' || options.prop && scope.row.inputProp && (scope.row.inputProp === options.prop  || scope.row.inputProp.includes(options.prop)) ||  currentInputProp.props && currentInputProp.rows.includes(scope.row) && (currentInputProp.props === 'inputPropsRow' || currentInputProp.props.includes(options.prop)) -->
      <template v-if="inputFlag(scope.row)">
        <el-form @submit.native.prevent>
          <model-form-item :options="Object.assign({},{prop: options.prop},columnOpts)"
                           :remoteData="remoteData"
                           @callback="(...args) => callbackForFormItem(...args,scope.row)"
                           :form="tableOpts.inputProps && tableOpts.inputProps.useForm ? form : scope.row"></model-form-item>
        </el-form>
      </template>

      <template v-else-if="options.type === 'action-icons'">
        <action-icons :data="scope.row"
                      :options="actionIconsOpts(scope.row)"
                      :remoteData="remoteData"
                      @callback="callback"></action-icons>
      </template>
      <!-- action-icons end -->
      <template v-else-if="options.type === 'router-link'">
        <type-router-link :data="scope.row"
                          :options="options"
                          :remoteData="remoteData"
                          @callback="callback"></type-router-link>
      </template>
      <template v-else-if="options.type === 'arr-img-link'">
        <arr-img-link :options="options"
                      :data="scope.row"
                      :remoteData="remoteData"></arr-img-link>
      </template>
      <template v-else-if="options.type === 'link'">
        <type-link :options="options"
                   :data="scope.row"
                   :remoteData="remoteData"
                   @callback="callback"></type-link>
      </template>
      <template v-else-if="options.type === 'img-link'">
        <img-link :options="options"
                  :data="scope.row"
                  :remoteData="remoteData"></img-link>
      </template>
      <!-- date-picker -->
      <template v-else-if="options.type === 'date-picker'">
        <el-date-picker type="date"
                        size="small"
                        :style="'textAlign', options.align || 'left'"
                        v-model="scope.row[options.prop]"
                        placeholder="选择日期">
        </el-date-picker>
      </template>
      <!-- date-picker -->
      <template v-else-if="options.type === 'input-number'">
        <el-input-number type="number"
                         size="small"
                         v-model="scope.row[options.prop]"
                         placeholder="">
        </el-input-number>
      </template>
      <template v-else-if="options.type === 'input'">
        <el-input :type="options.text || 'text'"
                  size="small"
                  v-model="scope.row[options.prop]">
        </el-input>
      </template>
      <!-- select -->
      <template v-else-if="options.type === 'select'">
        <!-- {{scope.row}} -->
        <el-select type="date"
                   size="small"
                   filterable
                   v-model="scope.row[options.prop]"
                   placeholder="请选择">
          <el-option v-for="(option,index) of scope.row.select"
                     :key="index"
                     :value="option.value"
                     :label="option.label"></el-option>
        </el-select>
      </template>
      <!-- switch -->
      <template v-else-if="options.type === 'switch'">
        <el-switch v-model="scope.row[options.prop]"
                   active-value="ON"
                   inactive-value="OFF"
                   :disabled="scope.row.disabled"
                   @change="handleChangeForSwitch(scope.row,scope.row[options.prop],options)"
                   class="text-center column-enclosure">
        </el-switch>
      </template>
      <!-- enclosure start -->
      <template v-else-if="options.type === 'enclosure'">
        <el-upload action=""
                   :show-file-list="false"
                   class="text-center column-enclosure">
          <i class="fa fa-cloud-upload-alt"></i>
          <p class="text">点击上传,或将文件拖拽到此处</p>
        </el-upload>
      </template>
      <!-- enclosure end -->
      <template v-else-if="options.type === 'obj'">
        <type-obj :options="options"
                  :data="scope.row"
                  :remoteData="remoteData"></type-obj>
      </template>
      <template v-else-if="options.type === 'html'">
        <type-html :options="options"
                   :data="scope.row"
                   :remoteData="remoteData"></type-html>
      </template>
      <template v-else>
        <!-- else -->
        <type-default :options="options"
                      :data="scope.row"
                      @callback="handleCallback"></type-default>
      </template>
    </template>
  </el-table-column>
</template>
<script>
const modelFormItem = () => import('@/components/modelFormGroup/modelFormItem'),
  actionIcons = () => import('./components/actionIcons'),
  typeRouterLink = () => import('./components/typeRouterLink'),
  arrImgLink = () => import('./components/arrImgLink'),
  typeLink = () => import('./components/typeLink'),
  imgLink = () => import('./components/imgLink'),
  typeObj = () => import('./components/typeObj'),
  typeDefault = () => import('./components/typeDefault'),
  typeHtml = () => import('./components/typeHtml');

export default {
  name: 'modelTableColumn',
  components: {
    modelFormItem,
    actionIcons,
    typeRouterLink,
    arrImgLink,
    typeLink,
    imgLink,
    typeObj,
    typeDefault,
    typeHtml
  },
  computed: {
    columnOpts() {
      return this.options.columnOpts || {};
    }
  },
  methods: {
    callback(...args) {
      this.$callback(...args);
    },
    callbackForFormItem(fnName, ...args) {
      const { inputProps = {} } = this.tableOpts;
      if (fnName.includes('Blur') && inputProps.type === 'single') {
        // input 失去焦点隐藏input; change事件未处理
        this.$emit('update:currentInputProp', {});
      }
      this.callback(fnName, ...args);
    },
    handleCallback(...args){
      this.$emit('handleCallback',...args);
    },
    inputFlag(row){
      const {options,currentInputProp = {}} = this,
        {rows: currentRows = [],props: currentProps = []} = currentInputProp;
      if(options.prop){
        return options.type === 'formItem' || currentRows && currentProps && currentRows.includes(row) && currentProps.includes(options.prop);
      }
      return false;
    },
    actionIconsOpts(row){
      const {currentInputProp,options} = this,
        {icons,rows = []} = currentInputProp,
        prop = options.prop;
      return icons && rows.includes(row) ? currentInputProp[prop] || currentInputProp :  options[prop] || options;
    }

  },
  props: {
    options: {
      type: Object,
      required: true
    },
    tableOpts: {
      type: Object,
      default() {
        return {};
      }
    },
    remoteData: {
      type: Object,
      default() {
        return {};
      }
    },
    form: {
      type: Object,
      default() {
        return {};
      }
    },
    currentInputProp: {
      type: [ Object ],
      default() {
        return {};
      }
    },
    labelClassName: true,
    className: true
  }
};
</script>
