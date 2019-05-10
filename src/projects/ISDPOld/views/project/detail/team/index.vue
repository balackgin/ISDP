<template>
  <div class="project-detail-team comm">
    <el-row class="btn-group">
      <el-button type="danger"
                 v-if="projectManager  && +detailData.isConfirmProjectModel === 2"
                 @click="addTeamMember">
        <i class="far fa-save"></i> 保存
      </el-button>
    </el-row>
    <model-list :options="Config"
                :data="listData"
                :remoteData="remoteData"
                @callback="callback"></model-list>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import modelList from '@/components/modelList';
import Config from './config/team.config.json';
let time = '';

const actionIcons = (bool,isProjectManager) => {
  let iconArr = [ {
    name: 'stopBtn',
    text: bool ? '启用' : '停用',
    className: 'text-danger'
  }, {
    name: 'remove',
    title: '删除',
    className: 'text-danger',
    text: '删除'
  } ];
  !isProjectManager && iconArr.shift();
  return  iconArr;
};
export default {
  components: {
    modelList
  },
  data() {
    // T 0   职能组成员选择
    // D 1   职能部成员选择
    // S  SMALL
    return {
      listData: [],
      remoteData: {}
    };
  },
  computed: {
    ...mapState({
      teamSelectObj: (state) => state.ISDPOld.project.teamObj || {},
      projectModel: (state) => {
        let detailData = state.ISDPOld.project.detailData || {};
        return  detailData.data && detailData.data.projectModel;
      },
      detailData: (state) => state.ISDPOld.project.detailData && state.ISDPOld.project.detailData.data || {},
      projectManager: (state)=>state.ISDPOld.project.projectManager
    }),
    Config(){
      let arr = JSON.parse(JSON.stringify(Config)),
        projectManager  = this.projectManager;
      !projectManager && arr.table.columns.pop();
      return arr;
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    beforeTurnInput(row,column,callback) {
      const { projectManager,teamSelectObj,remoteData } = this,
        {projectRole,projectRoleName,parentId,changeAble,isStop} = row,
        {property} = column,
        isProjectManager = projectRole === 'PM' || projectRoleName === '项目经理（PM）';
      if(!projectManager){
        return false;
      }
      if(changeAble === false && (isProjectManager || property === 'staffName')){
        this.$elMessage({
          message: isProjectManager && '项目经理不能编辑或删除，如果项目经理发生变更，请新建项目经理并停用原项目经理!' || '该人员已经在WBS计划中被引用，不能修改',
          type: 'error'
        });
        return false;
      }else if(+isStop === 1){
        this.$elMessage({
          message: '停用状态下不能编辑用户信息!',
          type: 'error'
        });
        return false;
      }

      if(property === 'projectRoleName'){
        const {S = {},D = {},T = {}} = teamSelectObj || {};
        if(parentId === 'SMALL') {
          this.remoteData = Object.assign({}, remoteData, { projectRoleName: S && S.data || []});
        }else if(+parentId === 0) {
          this.remoteData = Object.assign({}, remoteData, { projectRoleName: T && T.data || [] });
        }else if(+parentId === 1) {
          this.remoteData = Object.assign({}, remoteData, { projectRoleName: D && D.data || [] });
        }
      }
      callback(true);
    },
    // updateCallback(key,data = {}, row = {},column = {}){
    //   if(!this.projectManager){
    //     row.inputProp = '';
    //     return false;
    //   }
    //   const obj = key === 'data' && row || key === 'form' && data || {},
    //     rowData = key === 'form' && data || row,
    //     isProjectManager = rowData.projectRole === 'PM' || rowData.projectRoleName === '项目经理（PM）';
    //   if(obj.changeAble === false && (isProjectManager || column.property === 'staffName')){
    //     this.$elMessage({
    //       message: isProjectManager && '项目经理不能编辑或删除，如果项目经理发生变更，请新建项目经理并停用原项目经理!' || '该人员已经在WBS计划中被引用，不能修改',
    //       type: 'error'
    //     });
    //     obj.inputProp = '';
    //     return false;
    //   }else if(+rowData.isStop === 1){
    //     this.$elMessage({
    //       message: '停用状态下不能编辑用户信息!',
    //       type: 'error'
    //     });
    //     obj.inputProp = '';
    //     return false;
    //   }

    //   if(obj.inputProp === 'projectRoleName'){
    //     const {S = {},D = {},T = {}} = this.teamSelectObj || {};
    //     if(obj.parentId === 'SMALL') {
    //       this.remoteData = Object.assign({}, this.remoteData, { projectRoleName: S && S.data || []});
    //     }else if(+obj.parentId === 0) {
    //       this.remoteData = Object.assign({}, this.remoteData, { projectRoleName: T && T.data || [] });
    //     }else if(+obj.parentId === 1) {
    //       this.remoteData = Object.assign({}, this.remoteData, { projectRoleName: D && D.data || [] });
    //     }
    //   }
    //   if(key === 'data'){
    //     this.listData = JSON.parse(JSON.stringify(data));
    //   }
    // },
    // 选中后改变form的值
    handleChangeForSelect(args){
      clearTimeout(time);
      time = setTimeout(() =>{
        this.getEmplyees(args);
      }, 300)
    },
    handleChangeForSelected(data, opts, value, row){
      const { prop } = opts,
        searchData = this.remoteData.staffName || [],
        { listData = [],projectModel } = this;
      row.inputProp = '';
      if(prop === 'staffName') {
        let staffInfo = value.split('$$');

        if(projectModel === 'SMALL'){
          let bool = listData.some((item) => item !== row && item.projectRole === row.projectRole && item.staffNo === staffInfo[1]);
          if(bool){
            row.staffName = '';
            row.staffNo = '';
            row.staffTel = '';
            row.staffEmail = '';

            this.$elMessage({
              message: '当前信息已存在,请勿重复添加!',
              type: 'error'
            });
            return false;
          }
        }

        let index = listData.findIndex((item) => (row === item));
        let _index = searchData.findIndex((item) => (item.FItemNumber === staffInfo[1]));
        this.listData[index] = Object.assign({},listData[index],{
          staffName: staffInfo[0],
          staffNo: staffInfo[1],
          staffEmail: searchData[_index].FEmailAddress || '',
          staffTel: searchData[_index].FCornet || searchData[_index].FCornetFLongTel || '',
          deptName: staffInfo[2],
          deptNumber: staffInfo[3]
        });
      } else if (prop === 'projectRoleName') {
        let staffInfo = value.split('-');
        if(projectModel === 'SMALL'){
          let bool = listData.some((item) => item !== row && item.projectRole === staffInfo[0] && item.staffNo === row.staffNo);
          if(bool){
            row.projectRole = '';
            row.projectRoleName = '';
            this.$elMessage({
              message: '当前信息已存在,请勿重复添加!',
              type: 'error'
            });
            return false;
          }
        }
        let index = listData.findIndex((item) => (row === item));
        this.listData[index] = Object.assign({},listData[index],{
          projectRole: staffInfo[0],
          projectRoleName: staffInfo[1]
        })
      }
    },
    // 搜索员工信息
    async getEmplyees(StrKey) {
      let { data } = await this.$store.dispatch('ISDPOld/project/getEmplyees', {
        StrKey
      })
      if (data) {
        data = data.splice(0,10);
        this.dealData(data);
      } else {
        this.remoteData = Object.assign({}, this.remoteData, { staffName: [] });
      }
    },
    add(rowData) {
      const { childrenId } = rowData,
        {listData} = this;

      let arr = [];
      listData.forEach((item, index) => {
        if(childrenId === item.parentId || childrenId === item.childrenId) {
          arr.push(index)
        }
      })
      let addTo = (arr.pop() || 0) + 1;
      const addRow = {
        index: typeof listData[addTo - 1].index === 'number' ? listData[addTo - 1].index + 1 : 1,
        parentId: childrenId
      }
      this.listData.splice(addTo, 0, addRow);
    },
    remove(rowData) {
      const { parentId,changeAble,projectRoleName,projectRole } = rowData;
      if(changeAble === false){
        this.$elMessage({
          message: (projectRoleName === '项目经理（PM）' || projectRole === 'PM') && '项目经理不能编辑或删除，如果项目经理发生变更，请新建项目经理并停用原项目经理!' || '该人员已经在WBS计划中被引用，不能删除!',
          type: 'error'
        });
        return false;
      }
      this.$elMsgBox({
        title: '提示',
        message: '该操作会删除该团队成员, 是否继续？',
        confirm: true,
        callback: async (action) => {
          if(action === 'confirm'){
            const {listData} = this;
            let _index = listData.findIndex((item) => (item === rowData));

            listData.forEach((item, index) => {
              if(parentId === item.parentId && _index <= index) {
                listData[index].index = listData[index].index - 1
              }
            })
            this.listData.splice(_index, 1);
          }
        }
      });

    },
    async stopBtn(rowData){
      const bool = +rowData.isStop,
        {projectManager} = this;
      if(!projectManager){
        this.$elMessage({
          message: '没有操作权限!',
          type: 'error'
        });
        return false;
      }
      this.$elMsgBox({
        title: '提示',
        message: `是否确认${ bool ? '启用' : '停用' }该人员`,
        callback: async (action) => {
          if(action === 'confirm'){
            let {resultCode} = await this.$store.dispatch('ISDP/project/stopTeamMember',{
              id: rowData.id,
              isStop: bool ? 0 : 1,
              projectId: this.$route.query.id
            });
            if(+resultCode === 200 || resultCode && resultCode.includes('200')){
              this.$elMessage({
                message: '操作成功!',
                type: 'success'
              });
              this.getTeamList();
            }
          }
        }
      })
    },
    dealData(data = []) {
      let staffName = data.map((item) => Object.assign({},item,{
        value: item.FItemName + '$$' + item.FItemNumber + '$$' + item.FDeptName + '$$' + item.FDeptNumber, // 部门  部门编号
        label: item.FItemName + ' ' + item.FItemNumber
      }))

      this.remoteData = Object.assign({}, this.remoteData, { staffName });
      // console.log(this.remoteData, 'staffName');
    },
    // 添加成员信息
    async addTeamMember() {
      let teamArr = [];
      const {listData,projectModel,$route} = this;
      if(projectModel === 'SMALL') {
        listData.shift();
        listData.forEach((item) => {
          const bool = teamArr.some((childItem) =>  childItem.projectRole === item.projectRole && childItem.staffNo === item.staffNo );
          if(bool){
            return false;
          }
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
            deptName: item.deptName,
            deptNumber: item.deptNumber
          }
          teamArr.push(obj)
        });
      }else {
        listData.forEach((item) => {
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
            deptName: item.deptName,
            deptNumber: item.deptNumber
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
          id: $route.query.id,
          teamMembers: teamArr
        }
      );
      if (resultCode == 200) {
        this.listData = [];
        this.getTeamList();
      }
      this.$elMessage({
        message: resultMessage,
        type: resultCode == 200 ? 'success' : 'error'
      });
      this.outsideDialogShow = false;
    },
    async getRole(code) {
      const data = await this.$store.dispatch('ISDPOld/project/getProjectTeam', {
        type: 'projectRole',
        code
      });
      return data || [];
    },
    // 查询成员列表
    async getTeamList() {
      const { data } = await this.$store.dispatch(
        'ISDPOld/project/getTeamMember',
        {
          projectId: this.$route.query.id
        }
      );
      let index = 1,
        {projectModel,projectManager} = this,
        resultData = [];
      if(projectModel === 'SMALL') {
        resultData.push({
          index: '项目成员',
          childrenId: projectModel,
          id: projectModel,
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
                len: 9,
                type: 'merge-row',
                align: 'left'
              }
            ]
          }
        });
        data && data.forEach((res) => {
          let obj = res;
          // if(!obj.changeAble) {
          //   obj.icons = [];
          // }
          resultData.push(Object.assign({},obj,{
            index: index++,
            parentId: projectModel,
            icons: actionIcons(+obj.isStop,projectManager)
          }));
        });
        this.listData = resultData;
        return false;
      }
      data &&
        data.forEach((item, index) => {
          resultData.push({
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
                  len: 9,
                  type: 'merge-row',
                  align: 'left'
                }
              ]
            }
          });

          let result = item.list && item.list.map((res, i) =>
            Object.assign(res,{
              index: ++i,
              parentId: index,
              icons: actionIcons(+res.isStop,projectManager)
            })
          );
          result && resultData.push(...result);
        });

      this.listData = resultData;
      // console.log(this.listData, 'sss');
    }
  },
  async created() {
    await this.getTeamList();
    if(!this.projectModel || this.projectModel === 'LARGE'){
      this.getRole('T');
      this.getRole('D');
    }
    if(!this.projectModel || this.projectModel === 'SMALL'){
      this.getRole()
    }

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
