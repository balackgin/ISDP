<template>
  <div class="model-table-wrap"
       :class="[tableOpts.theme,{'theme-isdp-wrap': tableOpts.theme && tableOpts.theme.includes('isdp'),'model-table-default-wrap': !tableOpts.theme}]"
       :id="tableId">
    <!-- tableOpts.theme isdp -->
    <!-- useing: contract -->
    <!-- el-table :attr 传值  options从父组件传的值 -->
    <el-table class="model-table"
              :data="data"
              :ref="tableOpts.ref || 'elTable'"
              :class="[tableOpts.tableClassName,{noPadding: tableOpts.noPadding}]"
              :border="tableOpts.border"
              :height="tableOpts.height || tableHei"
              :max-height="tableOpts.maxHeight"
              :highlight-current-row="tableOpts.highlightCurrentRow"
              :empty-text="tableOpts.emptyText || ' '"
              :default-sort="tableOpts.defaultSort"
              :fit="true"
              :row-key="tableOpts.rowKey || 'id'"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName "
              :span-method="spanMethod"
              @cell-click="handleCellClick"
              @cell-dblclick="handleCellDBLClick"
              @row-click="handleRowClick"
              @row-dblclick="handleDBLClick"
              @sort-change="sortChange"
              @header-dragend="headerDragend"
              @select="headleselectionChange"
              @select-all="headleselectionChange"
              @expand-change="expandChange">
      <!-- "descending 降序","ascending 升序" -->
      <!-- 循环el-table-column -->
      <!-- <el-table-column type="index"
                       label="行号"></el-table-column> -->
      <template v-for="(item) of optionsTableConfig">
        <!-- 给el-table-column属性绑定值 -->
        <model-table-column :key="item.prop || item.label"
                            :options="item"
                            :form="form"
                            :tableOpts="tableOpts"
                            :currentInputProp.sync="currentInputProp"
                            :remoteData="remoteData"
                            @callback="callback"
                            @handleCallback="handleCallback"></model-table-column>
      </template>
    </el-table>
    <span ref="eleText"
          class="eleText"></span>
    <pagination :options="pagination"
                @callback="callback"></pagination>
  </div>
</template>
<script>
const modelTableColumn = () => import('./modelTableColumn'),
  pagination = () => import('./components/pagination');

export default {
  name: 'modelTable',
  components: {
    modelTableColumn,
    pagination
  },
  data() {
    return {
      currentInputProp: {},
      tableHei: undefined,
      tableId: ''
    };
  },
  computed: {
    optionsTableConfig() {
      return this.options.columns;
    },
    tableOpts() {
      return this.options.tableOpts || {};
    },
    inputProps() {
      return this.tableOpts.inputProps || {};
    }
  },
  methods: {
    callback(...args) {
      return this.$callback(...args);
    },
    handleCallback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    //  table callback start
    //  table callback start
    //  table callback start
    rowClassName({ row, rowIndex }) {
      const rowClassName = this.remoteData.rowClassName;
      switch (typeof rowClassName) {
      case 'array':
        return rowClassName.join(' ');
      case 'function':
        return rowClassName(row, rowIndex);
      default:
        return rowClassName;
      }
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      const cellClassName = this.remoteData.cellClassName;
      switch (typeof cellClassName) {
      case 'array':
        return cellClassName.join(' ');
      case 'function':
        return cellClassName(row, column, rowIndex, columnIndex);
      default:
        return cellClassName;
      }
    },
    spanMethod({ row, columnIndex }) {
      if (row._type === 'merge-row' || row._type === 'fold') {
        // column.minWidth = '100%';
        // column.align = row._align;  //死循环
        if (row._len === 'all') {
          return columnIndex === 0 && [ 1, this.optionsTableConfig.length ];
        } else {
          return [ 1, +row._len ];
        }
      } else if (row._span && row._span.config) {
        const spanObj = row._span,
          configLength = this.optionsTableConfig.length,
          sectionIndex = spanObj.config.findIndex(
            (item) =>
              columnIndex > item.index && columnIndex < +item.index + +item.len
          ),
          startIndex = spanObj.config.findIndex(
            (item) => columnIndex === +item.index
          );

        if (startIndex >= 0) {
          // column.minWidth = '100%';
          let spanItem = spanObj.config[startIndex];
          return {
            rowspan: 1,
            colspan: +spanItem.len || configLength - spanItem.index
          };
        } else if (sectionIndex >= 0) {
          return {
            rowspan: 1,
            colspan: 0
          };
        }
      }
    },
    handleCellClick(row, column, cell, event) {
      //  单击cell长度不够 自动扩展 start
      if (!this.currentInputProp || this.currentInputProp.isNull()) {
        const ele = event.target,
          text = ele.innerText,
          eleText = this.$refs.eleText,
          realWidth = column.realWidth || ele.offsetWidth;
          // childWid = ele.children[0].clientWidth;
        let tdTarget = '';
        switch ('TD') {
        case ele.nodeName:
          tdTarget = ele;
          break;
        case ele.parentNode.nodeName:
          tdTarget = ele.parentNode;
          break;
        case ele.parentNode.parentNode.nodeName:
          tdTarget = ele.parentNode.parentNode;
          break;
        case ele.parentNode.parentNode.parentNode.nodeName:
          tdTarget = ele.parentNode.parentNode.parentNode;
          break;
        case ele.parentNode.parentNode.parentNode.parentNode.nodeName:
          tdTarget = ele.parentNode.parentNode.parentNode.parentNode;
          break;
        default:
          break;
        }
        eleText.innerText = text;
        const cellTarget = tdTarget.children[0],
          wid = eleText.clientWidth,
          addWid = (this.tableOpts.theme ? 48 : 0) +  30 + (tdTarget.clientWidth - cellTarget.clientWidth),
          resultWid = wid + addWid;
        if (resultWid > realWidth) {
          const { options } = this,
            { columns } = options,
            resultArr = columns.map((item) => {
              if (item.label === column.label) {
                const { columnOpts = {} } = item;

                if (resultWid < columnOpts.width) {
                  return item;
                }
                if (columnOpts.width) {
                  columnOpts.width = resultWid;
                } else {
                  columnOpts.minWidth = resultWid;
                }
                item.columnOpts = columnOpts;
              }
              return item.toJson();
            });
          options.columns = resultArr;
          this.$emit('update:options', options);
        }
      }
      //  单击cell长度不够 自动扩展 end

      // 单击变成输入框
      // const {inputProps = {}} = this.tableOpts;
      // inputProps.target && inputProps.target.includes('click') && this.turnInput(row,column);
      this.beforeTurnInput(row, column, 'click');
    },
    beforeTurnInput(row, column, handleTarget) {
      const { inputProps = {} } = this.tableOpts,
        { type, target } = inputProps;
      if (target && target.includes(handleTarget)) {
        if (type === 'callback') {
          this.callback('beforeTurnInput', row, column, (bool) => {
            bool && this.turnInput(row, column);
          });
        } else {
          this.turnInput(row, column);
        }
      }
    },
    turnInput(row, column) {
      /* tableOpts.inputProps

                                   props: []
                                   target: ["click","dblclick"]
                                   type: single/multiple/row/callback
                                   useForm: {}
                                */

      const { props: propsInOpts = [], type } = this.inputProps,
        { property } = column,
        { rows = [], props = [] } = this.currentInputProp;
      if (type === 'row') {
        this.currentInputProp = Object.assign(
          {},
          {
            props: 'inputPropsRow',
            rows: [ row ]
          }
        );
      } else if (propsInOpts.includes(property)) {
        this.currentInputProp = Object.assign(
          {},
          {
            props: [ ...(type === 'multiple' ? props : []), property ],
            rows: [ ...(type === 'multiple' ? rows : []), row ]
          }
        );
      }
    },
    handleCellDBLClick(row, column) {
      //row,column,cell,event
      // const {inputProps = {}} = this.tableOpts;
      // inputProps.target && inputProps.target.includes('dblclick') && this.turnInput(row,column);
      this.beforeTurnInput(row, column, 'dblclick');
    },
    handleRowClick(...args) {
      this.callback('handleClickForRow', ...args);
    },
    async handleDBLClick(...args) {
      this.callback('handleDBLClickForRow', ...args);
    },
    sortChange(...args) {
      this.callback('handleChangeForSort', ...args);
    },
    headerDragend(afterWid, beforeWid, args) {
      let { property } = args;
      let arr = this.optionsTableConfig.map((item) => {
        if (item.prop === property) {
          item.width = afterWid;
        }
        return item;
      });
      this.$emit('tableColumnChangeWidth', arr);
    },
    headleselectionChange(...args) {
      this.callback('headleselectionChange', ...args);
    },
    expandChange(...args) {
      this.callback('handleChangeForExpand', ...args);
    },
    async handleClickForFold(row, item) {
      await this.callback('handleClickForFold', row, item);
      // this.$refs.elTable.doLayout();
    },
    doLayout() {
      const refTable = this.$refs[this.tableOpts.ref || 'elTable'];

      refTable && refTable.doLayout();
    },
    // table callback end
    // table callback end
    // table callback end
    // formItemCallback(fnName,...args){
    //   this[fnName] && this[fnName](...args) || this.callback(fnName,...args);
    // },
    // handleChange(...args){
    //   this.callback('handleChangeForInputInTable',...args);
    // },
    handleChangeForSwitch(...args) {
      this.callback('handleChangeForSwitch', ...args);
    },
    changeInputProps(args) {
      // <model-table ref="tableRef"></model-table>
      // this.$refs.tableRef.changeInputProps({rows: [ rowData ],props: [ 'person','startTime','endTime' ],[options.prop]: {icons: []},icons: true})
      this.currentInputProp = Object.assign({}, this.changeInputProps, args);
    },
    autoHeight(){
      const bodyHei = document.body.clientHeight,
        ele = document.getElementById(this.tableId),
        oTop = ele && ele.offsetTop || 0,
        pagHei = this.pagination ? 60 : 0,
        resultHei = bodyHei - oTop - 32 - pagHei,
        tableHei =  resultHei < 200 ? undefined : resultHei;

      this.tableHei = tableHei;

      this.doLayout();
    }
  },
  mounted(){
    this.tableOpts.autoHeight  && setTimeout(() => {
      this.autoHeight();
      let timer = '';
      window.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(()=> {
          this.autoHeight();
        },100);
      }
    },100);
  },
  created(){
    this.tableId  = 'table' +  Date.now();
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    pagination: {
      type: Object
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    form: {
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
    }
  }
};
/*
                            // props.options
                            {
                              tableOpts: {},
                              columns: [{     // *
                                label: '',
                                prop: '',     // *
                                type: '',
                                columnOpts: {}
                              }]
                            }
                          */
</script>
<style lang="less" scoped>
  @import url('./assets/tableDefault');
  @import url('./assets/tableISDP');
  .model-table-wrap {
    .eleText {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      visibility: hidden;
      font-size: 14px;
    }
  }
</style>
