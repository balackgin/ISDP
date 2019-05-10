      <template>
  <div class="settings-roles-common">
    <div class="role-list">
      <inside-head :options="headConfig.roleList"></inside-head>
      <model-table :options="listConfig"
                   class="new-table-style"
                   :form="{}"
                   :data="rolelist"
                   @callback="callback"></model-table>
    </div>
    <div class="role-member">
      <inside-head :options="headConfig.roleEdit"
                   @callback="callback"></inside-head>
      <model-table ref="refTable"
                   :options="config"
                   :data="rolemember"
                   :form="tableForm"
                   :remoteData="remoteData"
                   :pagination="pagination"
                   @callback="callback"></model-table>
    </div>
  </div>
</template>

<script>
import modelTable from '@/components/modelList/modelTable';
import config from './config/role.common';
import listConfig from './config/role.list';
import headConfig from './config/head.config.json';
import insideHead from '@ISDP/components/insideHead';
import outsideDialog from '@/components/outsideDialog';
const actionIcons = (action, text, type) => ({
  name: action + type,
  text,
  className: 'text-danger'
})
let time = null;
export default {
  name: 'settings-roles-common',
  components: {
    modelTable,
    insideHead,
    outsideDialog
  },
  data() {
    return {
      tableForm: {
        displayName: '',
        userName: '',
        tel: '',
        depName: '',
        email: ''
      },
      headConfig,
      config: config.table,
      listConfig: listConfig.table,
      listFrom: {
        rolename: ''
      },
      remoteData: {
        displayName: ''
      },
      currentRoleClassify: null,
      currentRoleId: null,
      pagination: {
        theme: 'isdp',
        pageNum: 1,
        pageCount: 15,
        total: 0,
        layout: 'total,prev,pager,next,sizes,jumper'
      },
      rolelist: [],
      rolemember: []
    };
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForRow(row) {
      const { roleClassify, id } = row;
      if (roleClassify && roleClassify !== this.currentRoleClassify) {
        this.currentRoleClassify = roleClassify;
        this.currentRoleId = id;
        this.getMemberList();
      }
    },
    paginationCallback(num) {
      this.pagination.pageNum = num;
      this.getMemberList();
    },
    pagiantionSizeChange(num){
      this.pagination.pageCount = num;
      this.pagination.pageNum = 1;
      this.getMemberList();
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
      this.tableForm = {
        displayName,
        userName,
        email,
        tel,
        depName
      };
      this.remoteData = Object.assign({}, this.remoteData, {
        displayName,
        email,
        userName,
        tel,
        depName
      });
    },
    dealData(data = []) {
      let displayName = data.map((item) =>
        Object.assign({}, item, {
          value:
              item.FItemName +
              '$$' +
              item.FItemNumber +
              '$$' +
              item.FEmailAddress +
              '$$' +
              item.FCornet +
              '$$' + item.FDeptName, // 部门  部门编号
          label: item.FItemName + ' ' + item.FItemNumber
        })
      );
      this.remoteData = Object.assign({}, this.remoteData, { displayName });
    },
    async getEmplyees(StrKey) {
      let { data } = await this.$store.dispatch('ISDP/project/getEmplyees', {
        StrKey
      });
        // console.log(data);
      if (data) {
        // console.log(data);
        data = data.splice(0,10);
        this.dealData(data);
      } else {
        this.remoteData = Object.assign({}, this.remoteData, {
          displayName: data
        });
      }
    },
    // 编辑
    editForMember(row) {
      this.tableForm = Object.assign({},this.tableForm,{
        displayName: row.displayName,
        tel: row.tel,
        email: row.email,
        userName: row.userName,
        depName: row.depName
      })
      this.$refs.refTable.changeInputProps({
        rows: [ row ],
        props: [ 'displayName','email','tel', 'depName', 'userName' ],
        icons: [ actionIcons('save', '保存', 'ForMember'), actionIcons('cancle', '取消', 'ForMember') ]
      })
    },
    // 取消
    cancleForMember(row) {
      this.tableForm = Object.assign({},this.tableForm,{
        displayName: '',
        tel: '',
        email: '',
        userName: '',
        depName: ''
      })
      if(row.displayName.includes('&&')) row.displayName = '';
      this.$refs.refTable.changeInputProps({
        rows: [ row ],
        props: [ ],
        icons: [ actionIcons('edit', '编辑', 'ForMember'), actionIcons('remove', '删除', 'ForMember') ]
      })
    },
    // 保存
    saveForMember(row) {
      // console.log(row);
      const { displayName, tel, email, depName, userName } = this.tableForm,
        { id, version } = row,
        // console.log(this.)
        { currentRoleId: roleId } = this;
      this.saveMember({
        id,
        displayName,
        userName,
        depName,
        tel,
        email,
        version,
        roleId
      });
      this.remoteData = Object.assign({}, this.remoteData, {
        displayName: []
      })
      this.tableForm = Object.assign({}, this.tableForm, {})
    },
    removeForMember(row) {
      const { id, version } = row;
      this.$confirm('该操作继续下去将会删除该条数据', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        if (id) {
          this.deleteMember({ id, version });
        } else {
          let index = this.rolemember.findIndex((item) => item === row);
          this.rolemember.splice(index, 1);
        }
      })
    },
    async deleteMember(params) {
      const {resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/configure/deleteMember', params);
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getMemberList();
      }
    },
    async getRoleList() {
      const { data, resultCode = '' } = await this.$store.dispatch(
        'ISDP/configure/getRoleList',
        { roleType: 'g' }
      );
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.rolelist = data;
        if (!this.currentRowId) {
          this.currentRoleId =
              this.rolelist && this.rolelist[0] && this.rolelist[0].id;
          this.currentRoleClassify =
              this.rolelist && this.rolelist[0] && this.rolelist[0].roleClassify;
          this.getMemberList();
        }
      }
    },
    async getMemberList() {
      const { pageNum, pageCount } = this.pagination,
        { currentRoleClassify: roleClassify } = this;
      const { data, resultCode = '' } = await this.$store.dispatch(
        'ISDP/configure/getMemberList',
        {
          argsMap: {
            roleClassify,
            roleType: 'g',
            sort: ''
          },
          pageNum,
          pageCount
        }
      );
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.rolemember = data.content;
        this.pagination = Object.assign({}, this.pagination, {
          total: data.totalElements
        });
      }
    },
    async saveMember(params) {
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch(
        'ISDP/configure/saveMember',
        params
      );
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getMemberList();
      }
    },
    addRole() {
      const obj = {
        index: this.rolelist.length + 1,
        rolename: ''
      };
      this.rolelist.push(obj);
    },
    addNewRow() {
      const obj = {
        index: this.rolemember.length + 1,
        displayName: '',
        userName: '',
        tel: '',
        email: ''
      };
      this.tableForm = obj;
      this.rolemember.push(obj);
      this.$refs.refTable.changeInputProps({
        rows: [ obj ],
        props: [ 'displayName', 'email', 'tel', 'userName', 'depName' ],
        icons: [ actionIcons('save', '保存', 'ForMember'), actionIcons('cancle', '取消', 'ForMember') ]
      });
    }
  },
  created() {
    this.getRoleList();
  }
};
</script>

<style lang="less" scoped>
  .settings-roles-common {
    max-width: 100%;
    height: 100%;
    display: flex;
    .role-list {
      width: 50%;
      max-width: 350px;
      .model-head-wrap {
        height: 32px;
      }
      /deep/ .model-table-wrap {
        height: -ms-calc(100% - 48px);
        height: -webkit-calc(100% - 48px);
        height: -moz-calc(100% - 48px);
        height: calc(100% - 48px);
        .el-table {
          height: 100%;
          .el-table__body-wrapper {
            height: -ms-calc(100% - 60px);
            height: -webkit-calc(100% - 60px);
            height: -moz-calc(100% - 60px);
            height: calc(100% - 60px);
          }
        }
      }
    }
    .role-member {
      flex-grow: 1;
      margin-left: 28px;
      min-width: 50%;
      /deep/ .model-table-wrap {
        height: -ms-calc(100% - 46px);
        height: -webkit-calc(100% - 46px);
        height: -moz-calc(100% - 46px);
        height: calc(100% - 46px);
        .el-table {
          height: -ms-calc(100% - 60px);
          height: -webkit-calc(100% - 60px);
          height: -moz-calc(100% - 60px);
          height: calc(100% - 60px);
          .el-table__body-wrapper {
            height: -ms-calc(100% - 60px);
            height: -webkit-calc(100% - 60px);
            height: -moz-calc(100% - 60px);
            height: calc(100% - 60px);
          }
        }
      }
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
