<template>
  <div class="project-detail-team comm">
    <el-row class="btn-group"
            :a="detailData">
      <el-button type="danger"
                 @click.native.prevent="addTeamMember">
        <i class="far fa-save"></i> 保存
      </el-button>
    </el-row>
    <model-list :options="config"
                :fns="fns"
                :pagination="pagination"
                :data="data"
                :form="tableForm"
                :remoteData="remoteData"
                :tableRow="tableRow"
                @callback="handleCallbackForTable"></model-list>
    <outside-dialog :show="outsideDialogShow"
                    :remoteData="remoteData"
                    :options="dialogOptions"
                    @callback="handleCallbackForDialog"></outside-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import dialogConfig from './config/dialog.config.json';
import outsideDialog from '@/components/outsideDialog';
import modelList from '@/components/modelList';
import config from './config/list.config.json';
const regEmail = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
let time = '';
export default {
  components: {
    modelList,
    outsideDialog
  },
  data() {
    return {
      tableForm: {},
      dialogConfig,
      data: [],
      remoteData: {},
      outsideDialogShow: false,
      tableRow: {},
      projectGroup: [], // 职能组成员选择
      projectDupt: [], // 职能部成员选择
      dialogOptions: {},
      config,
      searchData: [],
      pagination: {
        pageSize: 15,
        total: 0,
        pageNum: 1
      },
      action: '', // 点击行为
      sessionRow: [],
      eidtRow: {}, // 编辑信息
      fns: {
        rowClassName: (row) => {
          let className = [];
          // row.childrenId && className.push('strong-txt');
          if (row.parentId && this.sessionRow.includes(row.parentId)) {
            className.push('hide-row');
          } else {
            className.push('show-row');
          }
          return className.join(' ');
        },
        cellClassName: (row,column,rowIndex,columnIndex) => {
          let className = [];
          let span = row._span,
            configArr = span &&  span.config;
          (+row.level === 1 && column.property === 'index' || +row.level === 2 && column.property === 'taskName') && className.push('strong-txt');
          if(configArr){
            let index = configArr.findIndex((item) => +item.index === columnIndex);
            if(index >= 0){
              className.push('column-w-100');
              configArr[index].type === 'fold' && className.push('fold-box');
              configArr[index].align && className.push(`text-${ configArr[index].align }`)
            }
            return className.join(' ');
          }

        }
      }
    };
  },
  computed: {
    ...mapState({
      async detailData(state){
        let result = state.ISDPOld.project.detailData || {},
          {data = {}} = result;
        const { projectModel = '' } = data || {};
        if(projectModel === 'LARGE'){
          this.projectGroup = await this.getRole('T');
          this.projectDupt = await this.getRole('D');
        }else if(projectModel === 'SMALL'){
          this.projectSmall = await this.getRole('S')
        }
        return data;
      },
      projectModel(state) {
        const { detailData } = state.ISDPOld.project || {};
        const { projectModel } = detailData.data || {};
        return projectModel
      }
    })
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    updateCallback(key,data = {}, row = {}){
      const obj = key === 'data' && row || key === 'form' && data || {};
      if(obj.changeAble === false){
        this.$elMessage({
          message: '没有操作权限!',
          type: 'error'
        });
        obj.inputProp = '';
        return false;
      }
      if(obj.inputProp === 'projectRoleName'){

        if(obj.parentId === 'SMALL' || this.detailData.projectModel === 'SMALL') {
          this.remoteData = Object.assign({}, this.remoteData, { projectRoleName: this.projectSmall });
        }else if(+obj.parentId === 0) {
          this.remoteData = Object.assign({}, this.remoteData, { projectRoleName: this.projectGroup });
        }else if(+obj.parentId === 1) {
          this.remoteData = Object.assign({}, this.remoteData, { projectRoleName: this.projectDupt });
        }
      }
      if(key === 'data'){
        this.data = JSON.parse(JSON.stringify(data));
      }else if(key === 'form'){
        this.tableForm = Object.assign({},data);
      }
    },
    // handleClickForPlus(name) {
    //   let obj = this.dialogConfig[name];
    //   if (this.action === 'edit') {
    //     obj.data = Object.assign(
    //       {},
    //       {
    //         ...this.eidtRow,
    //         teamClassify: this.eidtRow.parentId,
    //         _name: 'dialog-projectMembers'
    //       }
    //     );
    //     obj.title = '项目成员信息修改';
    //   }
    //   if (obj) {
    //     this.dialogOptions = obj;
    //     this.dialogForm = Object.assign({}, obj.data);
    //     this.outsideDialogShow = true;
    //   }
    // },
    // 点击表格编辑后回调
    handleChangeForInputInTable(data,opts, value, row) {
      const { prop } = opts;
      const { projectRole, projectRoleName } = row;
      let index = this.data.findIndex((item) => (item === row));
      if(prop === 'staffName') {
        this.remoteData = Object.assign({}, this.remoteData, { staffName: [] });
        this.getEmplyees(value)
      }
      this.data[index] = data;

    },
    // 弹出框提交回调
    outsideDialogSubmit() {
      const { dialogForm } = this,
        args = JSON.parse(JSON.stringify(dialogForm));
      let msg = '';
      let params = {
        teamClassify: args.teamClassify,
        projectRoleName: args.projectRoleName,
        projectRole: args.projectRole,
        staffName: args.staffName,
        projectDuty: args.projectDuty,
        staffTel: args.staffTel,
        staffEmail: args.staffEmail,
        staffNo: args.staffNo,
        memo: args.memo
      };
      if (args._name === 'dialog-projectMembers') {
        switch (true) {
        case !args.teamClassify:
          msg = '请选择项目类型';
          break;
        case !args.projectRoleName:
          msg = '请输入职能';
          break;
        case !args.staffName:
          msg = '请输入姓名';
          break;
        case !args.projectDuty:
          msg = '请输入职责';
          break;
        case !args.staffTel:
          msg = '请输入联系方式';
          break;
        case !regEmail.test(args.staffEmail) || !args.staffEmail:
          msg = '请输入正确的邮箱地址';
          break;
        default:
          break;
        }

        if (msg) {
          this.$elMessage({
            message: msg,
            type: 'error'
          });
          return false;
        }

        if (this.action) {
          this.operateTeamMember(
            this.action,
            {
              ...params
            },
            args.id
          );
        } else {
          this.addTeamMember({
            projectId: this.$route.query.id,
            ...params
          });
        }
      }
    },
    // outside-dialog fn start
    handleCallbackForDialog(fnName, args, obj, event) {
      this[fnName] && this[fnName](args, obj, event);
    },
    beforeClose() {
      this.action = '';
      this.cleanDialogForm();
      this.remoteData = {};
      this.outsideDialogShow = false;
    },
    cleanDialogForm() {
      this.dialogConfig['projectMembers'].data = {
        _name: 'dialog-projectMembers',
        _index: 0,
        id: '',
        staffName: '',
        projectFunction: '',
        teamClassify: '',
        projectDuty: '',
        staffTel: '',
        version: '',
        staffNo: '',
        memo: '',
        staffEmail: ''
      };
    },
    handleCallbackForTable(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    // 点击编辑回调
    edit(data, rowData, ddd, iconOpts) {
      const { name: iconName } = iconOpts;
      if (iconName) {
        let index = data.findIndex(
          (item) =>
            (item.id && item.id === rowData.id) ||
            (item._index && item._index === rowData._index)
        );
        this.eidtRow = data[index];
        this.action = iconName;
        this.handleClickForPlus('projectMembers');
      }
    },
    paginationCallback(num) {
      this.pagination.pageNum = num;
      this.getTeamList();
    },
    // 变更成员信息
    async operateTeamMember(action, args, id) {
      const { resultCode, resultMessage } = await this.$store.dispatch(
        'ISDP/project/operateTeamMember',
        {
          ...args,
          id,
          projectId: this.$route.query.id,
          isDel: action === 'remove' ? 1 : 0
        }
      );
      if (+resultCode == 200) {
        this.data = [];
        this.getTeamList();
        this.outsideDialogShow = false;
        this.action = '';
      }
      this.$elMessage({
        message: resultMessage,
        type: resultCode == 200 ? 'success' : 'error'
      });
    },
    handleDoubleClick() {
    },
    // 选中后改变form的值
    handleChangeForSelect(args){
      clearTimeout(time);
      time = setTimeout(() =>{
        this.getEmplyees(args);
      }, 300)
    },
    handleChangeForSelected(data, opts, value, row){
      const { prop } = opts;
      if(prop === 'staffName') {
        let staffInfo = value.split('$$');
        this.tableForm[prop] = value;
        let index = this.data.findIndex((item) => (row === item));
        let _index = this.searchData.findIndex((item) => (item.FItemNumber === staffInfo[1]));
        this.data[index] = {
          ...this.data[index],
          staffName: staffInfo[0],
          staffNo: staffInfo[1],
          staffEmail: this.searchData[_index].FEmailAddress || '',
          staffTel: this.searchData[_index].FCornet || this.searchData[_index].FCornetFLongTel || '',
          FDeptName: staffInfo[2],
          FDeptNumber: staffInfo[3]
        }
        this.tableForm = {
          ...this.tableForm,
          staffName: staffInfo[0],
          staffNo: staffInfo[1],
          staffEmail: this.searchData[_index].FEmailAddress,
          staffTel: this.searchData[_index].FCornet || this.searchData[_index].FCornetFLongTel || '',
          FDeptName: staffInfo[2],
          FDeptNumber: staffInfo[3]
        }
      } else if (prop === 'projectRoleName') {

        let staffInfo = value.split('-');
        this.tableForm[prop] = value;
        let index = this.data.findIndex((item) => (row === item));
        this.data[index] = {
          ...this.data[index],
          projectRole: staffInfo[0],
          projectRoleName: staffInfo[1],
          FDeptName: staffInfo[2],
          FDeptNumber: staffInfo[3]
        }
        this.tableForm = {
          ...this.tableForm,
          projectRole: staffInfo[0],
          projectRoleName: staffInfo[1],
          FDeptName: staffInfo[2],
          FDeptNumber: staffInfo[3]
        }

      }

    },
    // 搜索员工信息
    async getEmplyees(StrKey) {
      let { data } = await this.$store.dispatch('ISDPOld/project/getEmplyees', {
        StrKey
      })
      if (data) {
        data = data.splice(0,10);
        this.searchData = data;
        this.dealData(data);
      } else {
        this.remoteData = Object.assign({}, this.remoteData, { staffName: [] });
      }
    },
    add(data, rowData, dd, iconOpts) {
      const { name: iconName } = iconOpts;
      const { childrenId } = rowData;

      let arr = [];
      if(iconName === 'add') {
        data.forEach((item, index) => {
          if(childrenId === item.parentId || childrenId === item.childrenId) {
            arr.push(index)
          }
        })
      }
      let addTo = (arr.pop() || 0) + 1;
      const addRow = {
        index: typeof data[addTo - 1].index === 'number' ? data[addTo - 1].index + 1 : 1,
        parentId: childrenId
      }
      this.data.splice(addTo, 0, addRow);
    },
    remove(data, rowData, dd, iconOpts) {
      const { name: iconName } = iconOpts;
      const { parentId,changeAble } = rowData;
      if(iconName === 'remove') {
        if(changeAble === false){
          this.$elMessage({
            message: '没有操作权限!',
            type: 'error'
          });
          return false;
        }
        let _index = data.findIndex((item) => (item === rowData));
        this.data.forEach((item, index) => {
          if(parentId === item.parentId && _index <= index) {
            this.data[index].index = this.data[index].index - 1
          }
        })
        this.data.splice(_index, 1);
      }
    },
    dealData(data) {
      let staffName = [];
      data.forEach((item) => {
        staffName.push({
          value: item.FItemName + '$$' + item.FItemNumber + '$$' + item.FDeptName + '$$' + item.FDeptNumber, // 部门  部门编号
          label: item.FItemName + ' ' + item.FItemNumber
        })
      })
      this.remoteData = Object.assign({}, this.remoteData, { staffName });
    },
    // 添加成员信息
    async addTeamMember() {
      let teamArr = [];
      if(this.projectModel === 'SMALL') {
        this.data.shift();
        this.data.forEach((item) => {
          let obj = {
            id: item.id,
            staffName: item.staffName,
            staffEmail: item.staffEmail,
            staffNo: item.staffNo,
            staffTel: item.staffTel,
            memo: item.memo,
            projectDuty: item.projectDuty,
            projectRoleName: item.projectRoleName,
            projectRole: item.projectRole
          }
          teamArr.push(obj)
        })

      }else {
        this.data.forEach((item) => {
          let obj = {
            id: item.id,
            staffName: item.staffName,
            staffEmail: item.staffEmail,
            staffNo: item.staffNo,
            staffTel: item.staffTel,
            memo: item.memo,
            projectDuty: item.projectDuty,
            projectRoleName: item.projectRoleName,
            projectRole: item.projectRole,
            deptName: item.FDeptName,
            deptNumber: item.FDeptNumber
          };
          if (item.parentId === 0 && item.childrenId === undefined) {
            obj.teamClassify = 0;
            teamArr.push(obj);
          } else if (item.parentId === 1 && item.childrenId === undefined) {
            obj.teamClassify = 1;
            teamArr.push(obj);
          }
        })
      }

      const { resultCode, resultMessage } = await this.$store.dispatch(
        'ISDP/project/addTeamMember',
        {
          id: this.$route.query.id,
          teamMembers: teamArr
        }
      );
      if (resultCode == 200) {
        this.data = [];
        this.getTeamList();
      }
      this.$elMessage({
        message: resultMessage,
        type: resultCode == 200 ? 'success' : 'error'
      });
      this.action = '';
      this.eidtRow = {};
      this.outsideDialogShow = false;
    },
    async getRole(code) {
      const { data } = await this.$store.dispatch('ISDPOld/project/getProjectSelect', {
        type: 'projectRole',
        code
      })
      if(data) {
        let arr = [];
        data.forEach((item) => {
          arr.push({
            value: item.code + '-' + item.value,
            label: item.value
          })
        })
        return arr;
      }
      return []
    },
    // 查询成员列表
    async getTeamList() {
      const { pageNum, pageSize } = this.pagination;
      const { data } = await this.$store.dispatch(
        'ISDPOld/project/getTeamMember',
        {
          projectId: this.$route.query.id,
          pageSize,
          pageNum
        }
      );
      let index = 1;
      if(this.projectModel === 'SMALL') {
        this.data.push({
          index: '项目成员',
          childrenId: this.projectModel,
          id: this.projectModel,
          icons: [
            {
              name: 'add',
              title: '新增',
              className: 'text-green',
              text: '新增'
            }
          ],
          _span: {
            config: [
              {
                index: 0,
                len: 7,
                type: 'merge-row',
                align: 'left'
              }
            ]
          }
        });
        data && data.forEach((res) => {
          let obj = {
            staffNo: res.staffNo,
            projectRoleName: res.projectRoleName || '',
            projectRole: res.projectRole || '',
            staffName: res.staffName || '',
            id: res.id,
            projectDuty: res.projectDuty || '',
            staffEmail: res.staffEmail || '',
            staffTel: res.staffTel || '',
            memo: res.memo || '',
            changeAble: res.changeAble
          }
          if(!res.changeAble) {
            obj.icons = [];
          }
          this.data.push({
            ...obj,
            index: index++,
            parentId: this.projectModel
          });
        });
        return false;
      }
      data &&
        data.forEach((item, index) => {
          this.data.push({
            index: item.name,
            childrenId: index,
            id: item.name,
            icons: [
              {
                name: 'add',
                title: '新增',
                className: 'text-green',
                text: '新增'
              }
            ],
            _span: {
              config: [
                {
                  index: 0,
                  len: 7,
                  type: 'merge-row',
                  align: 'left'
                }
              ]
            }
          });

          let result = item.list && item.list.map((res, i) =>
            Object.assign(res,{index: ++i,parentId: index})
            // const {
            //   staffNo,
            //   projectRoleName = '',
            //   projectRole = '',
            //   staffName = '',
            //   id,
            //   projectDuty = '',
            //   staffEmail = '',
            //   staffTel = '',
            //   memo = '',
            //   changeAble
            // } = res;
            // this.data.push({
            //   index: ++i,
            //   projectRoleName,
            //   projectRole,
            //   staffName,
            //   projectDuty,
            //   staffEmail,
            //   staffTel,
            //   parentId: index,
            //   id,
            //   staffNo,
            //   memo,
            //   changeAble
            // });
          );
          result && this.data.push(...result);

        });
    },
    handleClickForFold(row) {
      row._active = !row._active;
      let idx = this.sessionRow.findIndex((item) => item === row.childrenId);
      if (idx < 0) {
        this.sessionRow.push(row.childrenId);
      } else {
        this.sessionRow.splice(idx, 1);
      }
      this.config.tableConfig = Object.assign({},this.config.tableConfig);
    },
    handleDBLClickForRow(data) {
      this.eidtRow = data;
    }
  },
  async created() {
    const { projectModel } = this.detailData;
    if(projectModel === 'LARGE'){
      this.projectGroup = await this.getRole('T');
      this.projectDupt = await this.getRole('D');
    }else if(projectModel === 'SMALL'){
      this.projectSmall = await this.getRole('S')
    }

    await this.getTeamList();
  }
};
</script>
<style lang="less" scoped>
  .btn-group {
    margin: 20px 0;
  }
</style>
<style lang="less">
  .project-detail-team {
    .btn-group {
      .el-button {
        padding: 8px 10px;
      }
    }
  }
</style>
