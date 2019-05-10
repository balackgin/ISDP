<template>
  <el-card class="classify-manage">
    <el-header class="roles-header">
      <h2 class="title">所属类别分类</h2>
      <hr>
    </el-header>

    <el-button type="danger"
               size="small"
               class=""
               @click="addRole()">添加</el-button>
    <div class="table-wrap">
      <section>
        <div class="desc">ISDP</div>
        <model-table :options="classifyConfig.table"
                     :form="form"
                     :data="ISDPClassifyData"
                     @callback="callback"></model-table>
      </section>
      <section class="ml-2">
        <div class="desc">外包商管理</div>
        <model-table :options="classifyConfig.table"
                     :form="form"
                     :data="outsoucerClassifyData"
                     @callback="callback"></model-table>
      </section>
    </div>
    <!--删除窗口-->
    <classify-dialog :params.sync="dialogParams"
                     @queryAllCodeClassify="queryAllCodeClassify"></classify-dialog>
    <!--添加角色弹窗-->
  </el-card>
</template>

<script>

import classifyConfig from './config/roles.config';
import modelTable from '@/components/modelList/modelTable';
import outsideDialog from '@/components/outsideDialog';
import classifyDialog from './classifyDialog';
const PLATFORM_MAP = {
  ISDP: 'ISDP',
  outsoucer: '外包商平台'
}
export default {
  name: 'roles',
  data() {
    return {
      // 搜索
      dialogParams: null,
      form: {
        classifyItem: []
      },
      pagination: {
        pageSize: 15,
        pageNum: 1
      },
      classifyConfig,
      remoteData: {},
      ISDPClassifyData: [],
      outsoucerClassifyData: [],
      // 搜索
      pagesize: 20,
      currpage: 1,
      dialogEditForm: false,
      selectGroup: [],
      formEdit: {
        design: '',
        account: ''
      },
      dialogVisible: false,
      dialogMemberVisible: false,
      design: '',
      formAdd: {
        design: '',
        account: ''
      },
      tableActions: {
        rowClassName: (row) => {
          let className = [];
          // row.childrenId && className.push('strong-txt');
          if (
            row.parentId &&
              this.sessionHideRow &&
              this.sessionHideRow.includes(row.parentId)
          ) {
            className.push('hide-row');
          } else {
            className.push('show-row');
          }
          className.push(row.className);
          return className.join(' ');
        },
        cellClassName: (row, column, rowIndex, columnIndex) => {
          let className = [];
          let span = row._span,
            configArr = span && span.config;
          (+row.level === 1 || +row.level === 2) &&
              [ 'jobDescription', 'index' ].includes(column.property) &&
              className.push('strong-txt');
          if (configArr) {
            let index = configArr.findIndex(
              (item) => +item.index === columnIndex
            );
            if (index >= 0) {
              className.push('column-w-100');
              configArr[index].type === 'fold' && className.push('fold-box');
              configArr[index].align &&
                  className.push(`text-${ configArr[index].align }`);
            }
            return className.join(' ');
          }
        },
        deviation(value) {
          if (+value > 0) {
            return `提前${ value }天`;
          } else if (+value < 0) {
            return `延后${ Math.abs(value) }天`;
          } else {
            return value;
          }
        }
      }
    }
  },
  components: {
    classifyDialog,
    modelTable,
    outsideDialog
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    // clickHandleForFold(data, row) {
    //   // console.log(data, row)
    // },
    handleClickForRow() {
    },
    handleBlur(rowForm, opts, val, tableRow) {
      console.log(rowForm, opts, val, tableRow, 'row');
      tableRow ? (tableRow.inputProp = '') : '';
      // console.log(rowForm, opts, val, tableRow);
    },
    handleFocusForSelect(row, value, col) {
      const { prop } = col,
        { contentDTOList = [] } = row;
      let arr = [];
      contentDTOList && contentDTOList.map((item) => {
        arr.push({
          label: item.codeValue,
          value: item.codeKey
        });
      })
      this.form = Object.assign({}, this.form, {
        [prop]: arr
      })
    },
    edit(row, data) {
      this.dialogParams = data;
    },
    remove(data) {
      this.$confirm('确定要删除此条分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { contentDTOList = [] } = data;
        contentDTOList && contentDTOList.map((item) => {
          item.isDel = 1;
          return item;
        })
        data.isDel = 1;
        data.contentDTOList = contentDTOList;
        this.saveCodeClassify(data);
      })
        .catch(() => {
          // this.action = '';
        });

    },
    async saveCodeClassify(params) {
      const { appClassify } = params;
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDP/sys/saveCodeClassify', params)
      if(+resultCode === '200' || resultCode.includes('200')) {
        this.$elMessage({type: 'success', message: resultMessage});
        const str = appClassify === 'ISDP' ? 'ISDP' : 'outsoucer';
        this.queryAllCodeClassify(str);
      }
    },
    async queryAllCodeClassify(appClassify) {
      this[`${ appClassify }ClassifyData`] = [];
      const {data, resultCode = '' } = await this.$store.dispatch('ISDP/sys/queryAllCodeClassify', {
        appClassify: PLATFORM_MAP[appClassify]
      });
      if(resultCode === '200' || resultCode.includes('200')) {
        data && data.forEach((item, index) => {
          let obj = item;
          obj.index = index + 1;
          if(item.contentDTOList && item.contentDTOList.length > 0) {
            obj.classifyItem = item.contentDTOList[0].codeKey;
            obj.select = [];
            item.contentDTOList && item.contentDTOList.map((item) => {
              obj.select.push({
                label: item.codeKey,
                value: item.codeValue
              })
            })
          }
          this[`${ appClassify }ClassifyData`].push(obj);
        })
      }
    },
    addRole() {
      this.dialogParams = {};
    }
  },
  async created() {
    await this.queryAllCodeClassify('ISDP');
    await this.queryAllCodeClassify('outsoucer');

  }
}
</script>

<style lang="less" scoped>
  .classify-manage {
    padding: 5px 20px 20px 20px;
    box-shadow: none;

    .title {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 5px;
      color: #4f5f6f;
    }
    .desc {
      height: 32px;
      line-height: 32px;
      font-size: 18px;
    }

    hr {
      margin: 10px 0;
      border: none;
      background-color: #d7dde4;
      height: 1px;
    }

    .roles-form {
      .roles-item {
        margin-bottom: 5px;

        .roles-input {
          width: 100%;
        }

        .roles-query {
          width: 64px;
          height: 33px;
          padding: 6px 15px;
          border-radius: 0;
          background-color: #59c2e6;
          border-color: #59c2e6;

          &:hover {
            border-color: #2db2df;
            background-color: #2db2df;
          }
        }
      }
    }
    .form-wrap {
      height: 60px;
    }
    .table-wrap {
      display: flex;
      width: 100%;
      margin-top: 10px;
      section {
        width: 50%;
        .model-table {
          margin-top: 12px;
        }
      }
      .table-add {
        width: 50px;
        height: 22px;
        font-size: 12px;
        text-align: center;
        padding: 0;
      }

      .table-header {
        height: 27px;
        line-height: 27px;
        font-size: 12px;
        font-weight: 600;
        color: #666666;
        padding: 0 10px;
        background-color: #e4ecf7;
      }

      .handle-button {
        font-size: 12px;
        padding: 0;
        color: #000;
        border: none;
        width: 40px;
        height: 20px;
        background-color: #d7dde4;

        &:hover {
          color: #33be85;
        }
      }

      .roles-pagination {
        background-color: #e4ecf7;
      }
    }

    .edit-wrap,
    .add-wrap {
      .edit-select {
        width: 80%;
      }
    }
  }
</style>
<style lang="less">
  .el-form-item__content {
    height: 33px;

    .el-input__inner {
      height: 33px;
      border-radius: 0;
      border-color: #ccc;

      &:focus {
        border-color: #4bcf99;
      }
    }

    .el-textarea__inner {
      border-radius: 0;
      border-color: #ccc;

      &:focus {
        border-color: #4bcf99;
      }
    }
  }

  .roles-table {
    .cell {
      font-size: 12px;
      text-align: center;
    }

    .el-table__header th,
    el-table__header tr {
      padding: 1px;
      background-color: #eeeeee;
      color: #666666;
    }

    .el-table__body td,
    el-table__body th {
      padding: 1px;
      color: #333333;
    }
  }

  .edit-table {
    .el-table__header th,
    el-table__header tr {
      background-color: #ffffff;
      color: #666666;
      text-align: center;
    }
  }

  .edit-dialog,
  .add-dialog {
    .el-dialog__body {
      background: #edeeee;
    }
  }
</style>