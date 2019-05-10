<template>
  <div class="settings-roles-common">
    <div class="role-member">
      <div class="title-wrap">
        <span class="title">临时人员配置</span>
        <div class="btn-group">
          <el-button type="danger"
                     size="small"
                     @click="addNewRow">新增</el-button>
        </div>
      </div>
      <model-table :options="config"
                   class="new-table-style"
                   ref="temporaryrole"
                   :data="rolemember"
                   :form="memberForm"
                   :remoteData="remoteData"
                   :pagination="pagination"
                   @callback="callback"></model-table>
    </div>
    <outside-dialog :show="showDialog"
                    :options="dialogConfig.dialogForm"
                    :form="dialogForm"
                    :remoteData="remoteData"
                    @callback="callback"></outside-dialog>
  </div>
</template>

<script>
import outsideDialog from '@/components/outsideDialog';
import modelTable from '@/components/modelList/modelTable';
import modelSearch from '@/components/modelList/modelSearch';

import config from './config/role.common';
import listConfig from './config/role.list';
import scahma from './config/data.role.common';
import dialogConfig from './config/dialog.config.json';
const actionIcons = (action, text, type) => ({
  name: action + type,
  text,
  className: 'text-danger'
});
let time = null;
export default {
  name: 'settings-roles-common',
  components: {
    modelTable,
    modelSearch,
    outsideDialog
  },
  data() {
    return {
      dialogConfig,
      config: config.table,
      listConfig: listConfig.table,
      dialogForm: {
        displayName: '',
        userName: '',
        tel: '',
        email: '',
        roleName: '临时'
      },
      showDialog: false,
      dialogRemote: {},
      remoteData: {},
      tableRemoteData: {},
      memberForm: {
        displayName: '',
        status: '',
        tel: '',
        email: '',
        role: ''
      },
      pagination: {
        theme: 'isdp',
        pageNum: 1,
        pageCount: 10,
        total: 0,
        layout: 'total,prev,pager,next,sizes,jumper'
      },
      roleId: '',
      rolelist: scahma.rolelist,
      rolemember: []
    };
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForRow(row) {
      // console.log(row, 'row');
    },
    handleChangeForSelect(args) {
      clearTimeout(time);
      time = setTimeout(() => {
        this.getEmplyees(args);
      }, 300);
    },
    handleChangeForSelected(data, form, val) {
      const personInfoArr = val.split('$$'),
        displayName = personInfoArr[0],
        userName = personInfoArr[1],
        email = personInfoArr[2],
        tel = personInfoArr[3],
        depName = personInfoArr[4];

      this.remoteData = Object.assign({}, this.remoteData, {
        depName,
        userName,
        tel,
        email
      })
      // console.log(this.remoteData)
      if(this.showDialog) {
        this.dialogForm = Object.assign({}, this.dialogForm, {
          displayName,
          email,
          tel,
          depName,
          userName
        })
      } else {
        this.memberForm = Object.assign({}, this.memberForm, {
          displayName,
          email,
          tel,
          depName,
          userName
        })
        console.log(this.memberForm,'memberForm');
      }
    },
    paginationCallback(num) {
      this.pagination.pageNum = num;
      this.getMemberList();
    },
    dealData(data = []) {
      let nickname = data.map((item) =>
        Object.assign({}, item, {
          value:
              item.FItemName +
              '$$' +
              item.FItemNumber +
              '$$' +
              item.FEmailAddress +
              '$$' +
              item.FCornet +
              '$$' + item.FDeptName,
          label: item.FItemName + ' ' + item.FItemNumber
        })
      );
      this.remoteData = Object.assign({}, this.remoteData, { displayName: nickname });
    },
    outsideDialogSubmit() {
      this.saveMember();
    },
    beforeClose() {
      this.showDialog = false;
      this.clearForm();
    },
    async deleteTemporary(args) {
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/configure/deleteMember', args);
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.getMemberList();
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        })
      }
    },
    async getEmplyees(StrKey) {
      let { data } = await this.$store.dispatch('ISDP/project/getEmplyees', {
        StrKey
      });
        // console.log(data);
      if (data) {
        data = data.splice(0, 10);
        this.dealData(data);
      } else {
        this.remoteData = Object.assign({}, this.remoteData, {
          [this.selectName]: data
        });
      }
    },
    editForMember(row) {
      // this.rolemember.forEach((item) => {
      //   item.inputProp  = [];
      //   item.icons = actionIcons('edit', '编辑', 'ForMember');
      // })
      this.memberForm = Object.assign({}, this.memberForm, {
        displayName: row.displayName,
        userName: row.userName,
        tel: row.tel,
        email: row.email,
        depName: row.depName,
        id: row.id
      })
      this.$refs.temporaryrole.changeInputProps({
        rows: [ row ],
        props: [ 'displayName','email','tel' ],
        icons: [ actionIcons('save', '保存', 'ForMember'), actionIcons('cancel', '取消', 'ForMember') ]
      });
    },
    cancelForMember(row) {
      this.$refs.temporaryrole.changeInputProps({
        rows: [ row ],
        props: [],
        icons: [ actionIcons('edit', '编辑', 'ForMember'), actionIcons('remove', '删除', 'ForMember') ]
      })
    },
    saveForMember() {
      // row.inputProp = [];
      // let index = this.rolemember.findIndex((item) => item.index === row.index);
      // this.rolemember[index] = Object.assign({}, this.rolemember[index], {
      //   icons: actionIcons('edit', '编辑', 'ForMember')
      // });
      // this.dialogForm = Object.assign({}, this.dialogForm, this.rolemember[index]);
      this.saveMember();
    },
    removeForMember(row) {
      const { id, version } = row;
      this.$confirm('确定要删除该人员吗', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        if (id) {
          this.deleteTemporary({ id, version });
        } else {
          let index = this.rolemember.findIndex((item) => item === row);
          this.rolemember.splice(index, 1);
        }
      })
    },
    addNewRow() {
      this.showDialog = true;
    },
    clearForm() {
      this.dialogForm = {
        displayName: '',
        id: '',
        tel: '',
        userName: '',
        depName: '',
        email: ''
      }
    },
    async getMemberList() {
      const { pageCount, pageNum } = this.pagination;
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/configure/getMemberList', {
        argsMap: {
          roleClassify: 'tmp',
          roleType: 'pd',
          projectId: this.$route.query.id || '',
          sort: ''
        },
        pageNum,
        pageCount
      });
      if(+resultCode === 200 || resultCode.includes('200')) {
        // console.log(data);
        const {totalElements, content = [] } = data;
        this.rolemember = content;
        this.pagination.total = totalElements;
      }
    },
    async getRoleList() {
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/configure/getRoleList', { roleType: 'pd'});
      if(+resultCode === 200 || resultCode.includes('200')) {
        data && data.forEach((item) => {
          const { roleClassify, id } = item;
          if(roleClassify === 'tmp') {
            this.roleId = id;
          }
        })
      }
    },
    async saveMember() {
      const { roleId } = this,
        { userName, displayName, tel, email, id, depName } = this.showDialog && this.dialogForm || this.memberForm || {};
      const { resultMessage = '', resultCode = '' } = await this.$store.dispatch('ISDP/configure/saveMember', { projectId: this.$route.query.id, roleId, userName, displayName, tel, email, id, depName });
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.showDialog = false;
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.clearForm();
        this.getMemberList();
      }
    }
  },
  created() {
    this.getRoleList();
    this.getMemberList();
  }
};
</script>

<style lang="less" scoped>
  .settings-roles-common {
    display: flex;
    justify-content: space-between;
    .role-member {
      width: 100%;
    }
    .title-wrap {
      display: flex;
      height: 30px;
      margin: 25px 0 12px;
      line-height: 30px;
      justify-content: space-between;
      > .title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
      .el-icon-plus {
        height: 30px;
        width: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 18px;
        border-radius: 50%;
        &:hover {
          background-color: rgba(20, 0, 0, 0.1);
        }
      }
      .btn-group {
        .el-button--danger {
          background-color: rgb(244, 32, 32);
          border-radius: 0;
          padding-left: 24px;
          padding-right: 24px;
          &:hover {
            background-color: rgba(244, 32, 32, 0.7);
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .settings-roles-common {
    .outsode-dialog {
      .el-dialog {
        .el-dialog__header {
          background-color: #fff;
          box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
        }
        .el-dialog__body {
          padding: 36px 20px 25px;
        }
        .model-form-item-wrap {
          margin-bottom: 9px;
        }
        .el-dialog__footer {
          background-color: #fff;
          border-top: 1px solid #e3e3e3;
          .el-button--default {
            &:hover {
              background-color: #f42020;
              color: #fff;
            }
          }
        }
      }
    }
    .model-table.new-table-style {
      border-color: transparent !important;
      .el-table td,
      .el-table th.is-leaf {
        border: none;
      }
      .clearfix {
        background-color: #fff;
      }
      .mt-1 {
        margin: 0.067708rem /* 13/192 */;
      }
      .el-table th,
      .el-table tr {
        height: 48px;
        &:nth-child(2n + 1) {
          background-color: #f9f9f9;
        }
      }
      .model-table {
        border: none;
      }
      .el-table__header-wrapper .el-table__header thead tr th,
      .model-table-wrap
        .model-table
        .el-table__fixed-header-wrapper
        .el-table__header
        thead
        tr
        th {
        text-align: left;
        border: none;
        background-color: #fff !important;
        color: #777a80;
        .cell {
          height: 50px;
          line-height: 50px;
          padding-left: 25px;
          font-size: 14px;
          font-weight: 500;
        }
      }
      .el-table__body-wrapper .el-table__body tbody tr td .cell,
      .model-table-wrap
        .model-table
        .el-table__fixed-body-wrapper
        .el-table__body
        tbody
        tr
        td
        .cell {
        padding: 3px 5px 0 25px;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #f81b1b;
      }
    }
  }
</style>
