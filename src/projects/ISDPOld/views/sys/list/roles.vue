<template>
  <el-card class="roles-wrap">
    <el-header class="roles-header">
      <h2 class="title">角色管理</h2>
      <hr>
    </el-header>

    <section class="form-wrap">
      <el-form :model="form"
               ref="model"
               @submit.native.prevent="getRoleList">
        <el-col :span="10">
          <el-form-item label="角色名称："
                        label-width="90px">
            <el-input placeholder="请输入角色名称/用户名/工号..."
                      v-model="form.rolesname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1"
                :offset="1">
          <el-button type="danger"
                     size="small"
                     @click="getRoleList">搜索</el-button>

        </el-col>
      </el-form>
    </section>

    <div class="table-wrap">
      <section>
        <el-button type="danger"
                   size="small"
                   class=""
                   @click="addRole()">添加</el-button>
        <model-table :options="rolesConfig.tableConfig"
                     :remoteData="remoteData"
                     :data="rolesMember"
                     @callback="callback"></model-table>
      </section>
      <section class="ml-2">
        <el-button type="danger"
                   size="small"
                   class=""
                   @click="addMember">添加</el-button>
        <model-table :options="rolesListConfig.tableConfig"
                     :remoteData="rolesRemoteData"
                     :data="rolesData"
                     @callback="callback"></model-table>
      </section>

    </div>
    <!--删除窗口-->

    <!--添加角色弹窗-->
    <outside-dialog :options="dialogOptions.rolesDialog"
                    :form="dialogRolesAddForm"
                    :remoteData="rolesAddRemoteData"
                    :show="dialogVisible"
                    @callback="dialogCallback"></outside-dialog>
    <!--添加成员弹窗-->
    <outside-dialog :options="dialogOptions.rolesMemberDialog"
                    :form="dialogMemberAddForm"
                    :remoteData="memberAddRemoteData"
                    :show="dialogMemberVisible"
                    @callback="memberDialogCallback"></outside-dialog>
  </el-card>
</template>

<script>

import rolesConfig from './config/roles.config';
import rolesListConfig from './config/roles.list.config';
import modelTable from '@/components/modelList/modelTable';
import outsideDialog from '@/components/outsideDialog';
import dialogOptions from './config/roles.add.dialog';
let time = null;
export default {
  data() {
    return {
      // 搜索
      form: {
        rolesname: '',
        username: '',
        timer: null,
        roleId: ''
      },
      pagination: {
        pageSize: 15,
        pageNum: 1
      },
      // 搜索
      // 角色信息
      rolesMember: [],
      rolesData: [],
      rolesConfig: JSON.parse(JSON.stringify(rolesConfig)),
      rolesListConfig: JSON.parse(JSON.stringify(rolesListConfig)),
      dialogOptions: JSON.parse(JSON.stringify(dialogOptions)),
      dialogRolesAddForm: {
        roleName: ''
      },
      dialogMemberAddForm: {
        username: '',
        nickname: ''
      },
      remoteData: {},
      rolesRemoteData: {},
      rolesAddRemoteData: {},
      memberAddRemoteData: {},
      // 角色信息
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
    modelTable,
    outsideDialog
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    dialogCallback(fnName, ...args) {
      this[fnName + 'InDialog'] && this[fnName + 'InDialog'](...args);
    },
    memberDialogCallback(fnName, ...args) {
      this[fnName + 'AddMember'] && this[fnName + 'AddMember'](...args);
    },
    // clickHandleForFold(data, row) {
    //   // console.log(data, row)
    // },
    handleClickForRow(rowData, dd, row) {
      // console.log(rowData, row);
      const { id } = rowData,
        { property } = row;
      if(id === this.form.roleId || property === 'displayName' || property === 'userName' || property === 'roleOperate'){
        return false;
      }
      this.form.roleId = id;
      this.getRoleList();
    },
    handleBlur(rowForm, opts, val, tableRow) {
      tableRow ? (tableRow.inputProp = '') : '';
      // console.log(rowForm, opts, val, tableRow);
    },
    // handleChange(rowForm, opts, val, tableRow) {
    //   // console.log(rowForm, opts, val, tableRow);
    // },
    updateCallback(action, arr) {
      if (action === 'data') {
        this.rolesData = arr;
      }
    },
    async getRoleList() {
      this.rolesData = [];
      let { pageNum: pageIndex = 1 , pageSize = 15 } = this.pagination,
        { rolesname: content, roleId } = this.form;
      const { data, resultCode = '' } = await this.$store.dispatch('sys/sys/getRoleList', {
        content,
        pageSize,
        pageIndex,
        roleId
      });
      if(resultCode === 'UR200' || resultCode.includes('200')) {
        this.rolesData = data.content;
      }
    },
    async getRoleMember() {
      this.rolesMember = [];
      const { data, resultCode = '' } = await this.$store.dispatch('sys/sys/getRoleMember', {});
      if(resultCode === 'UR200' || resultCode.includes('200')) {
        this.form.roleId = data.length !== 0 ? data[0].id : '';
        data && data.forEach((item, index) => {
          item.index = index + 1;
          this.rolesMember.push(item);
        })
      }
    },
    async addRoleMember() {
      // console.log(this.dialogMemberAddForm, 'form');
      const { roleId } = this.form;
      const {nickname, username} = this.dialogMemberAddForm;
      let { resultCode = '', resultMessage } = await this.$store.dispatch('sys/sys/addRoleMember', {
        username,
        nickname: nickname.split('$$')[0],
        roleDTOList: [ {
          id: roleId
        } ]
      })
      if(resultCode === 'UR200' || resultCode.includes('200')) {
        this.$elMessage({
          type: 'success',
          message: resultMessage
        })
        this.getRoleList();
      }else {
        this.$elMessage({
          type: 'error',
          message: resultMessage
        })
      }
      this.memberAddRemoteData = Object.assign({}, this.memberAddRemoteData, {nickname: []});
      this.dialogMemberAddForm = Object.assign({}, this.dialogMemberAddForm, {nickname: '', username: ''});
      this.dialogMemberVisible = false;
    },
    async addRoles() {
      const { roleName } = this.dialogRolesAddForm;
      let { resultCode, resultMessage } = await this.$store.dispatch('sys/sys/addRole', {
        roleName
      });
      if(resultCode === 'UR200' || resultCode.includes('200')) {
        this.$elMessage({
          type: 'success',
          message: resultMessage
        })
        this.getRoleMember();
      }else {
        this.$elMessage({
          type: 'error',
          message: resultMessage
        })
      }
      this.dialogRolesAddForm = Object.assign({}, this.dialogRolesAddForm, {roleName: ''});
      this.dialogVisible = false;
    },
    remove(row) {
      const { id } = row,
        {roleId} = this.form;
      if(id !== roleId) return false;
      this.$confirm('是否确定刪除角色？', '提示', {
        confirmButtonText: '确定',
        cancelButotnText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRole(id);
      }).catch(() => {

      })
    },
    removeRoles(row) {
      // console.log(d, dd, ddd, dddd, 'removeRole');
      const { id } = row;
      this.$confirm('是否确定刪除角色成员信息？', '提示', {
        confirmButtonText: '确定',
        cancelButotnText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRoleMember(id);
      }).catch(() => { })
    },
    handleChangeForSelectAddMember(args) {
      clearTimeout(time);
      time = setTimeout(() =>{
        this.getEmplyees(args);
      }, 300)
    },
    handleChangeForSelectedAddMember(data, col, colData) {
      if(colData) {
        let username = colData.split('$$');
        this.dialogMemberAddForm.username = username[1];
      }
    },
    // 搜索员工信息
    async getEmplyees(StrKey) {
      let { data } = await this.$store.dispatch('ISDPOld/project/getEmplyees', {
        StrKey
      });
      if (data) {
        data = data.splice(0,10);
        this.dealData(data);
      } else {
        this.memberAddRemoteData = Object.assign({}, this.memberAddRemoteData, { nickname: [] });
      }
    },
    dealData(data = []) {
      let nickname = data.map((item) => Object.assign({},item,{
        value: item.FItemName + '$$' + item.FItemNumber + '$$' + item.FDeptName + '$$' + item.FDeptNumber, // 部门  部门编号
        label: item.FItemName + ' ' + item.FItemNumber
      }))
      this.memberAddRemoteData = Object.assign({}, this.memberAddRemoteData, { nickname });
    },
    async deleteRole(id) {
      let {resultCode = '', resultMessage} = await this.$store.dispatch('sys/sys/deleteRole', {
        id
      })
      if(resultCode === 'UR200' || resultCode.includes('200')) {
        this.$elMessage({
          type: 'success',
          message: resultMessage
        })
        await this.getRoleMember();
        this.getRoleList();
        return false;
      }
      this.$elMessage({
        type: 'error',
        message: resultMessage
      })
    },
    async deleteRoleMember(id) {
      let { resultCode = '', resultMessage } = await this.$store.dispatch('sys/sys/deleteRoleMember', {
        id
      })
      if(resultCode === 'UR200' || resultCode.includes('200')) {
        this.$elMessage({
          type: 'success',
          message: resultMessage
        })
        this.getRoleList();
        return false;
      }
      this.$elMessage({
        type: 'error',
        message: resultMessage
      })
    },
    addRole() {
      this.dialogVisible = true;
    },
    addMember() {
      this.dialogMemberVisible = true;
    },
    beforeCloseInDialog() {
      this.dialogRolesAddForm = Object.assign({}, this.dialogRolesAddForm, {roleName: ''});
      this.dialogVisible = false;
    },
    beforeCloseAddMember() {
      this.memberAddRemoteData = Object.assign({}, this.memberAddRemoteData, {nickname: []});
      this.dialogMemberAddForm = Object.assign({}, this.memberAddRemoteData, {nickname: '', username: ''});
      this.dialogMemberVisible = false;
    },
    outsideDialogSubmitInDialog() {
      this.addRoles();
    },
    outsideDialogSubmitAddMember() {
      this.addRoleMember();
    }
  },
  async created() {
    await this.getRoleMember();
    if(this.form.roleId) {
      this.getRoleList();
    }

  }
}
</script>

<style lang="less" scoped>
  .roles-wrap {
    padding: 5px 20px 20px 20px;
    box-shadow: none;

    .title {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 5px;
      color: #4f5f6f;
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
          width: 50%;
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
      width: 80%;
      margin-top: 10px;
      section {
        width: 50%;
        .model-table {
          margin-top: 12px;
          &:last-child {
            margin-left: -1px;
          }
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