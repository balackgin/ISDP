<template>
  <div class="projectStart-team-wrap">
    <!-- 树状结构 -->
    <el-tabs class="team-nav"
             v-model="isOpen">
      <el-tab-pane label="项目组"
                   name="pg"
                   class="scrollbar">
        <inside-head :options="headConfig.power"
                     @callback="callback"></inside-head>
        <!-- Sponsor -->
        <div class="team-tree-warp">
          <div class="custom-tree-node custom-tree-sponsor"
               v-if="sponsor.roleName">
            <div class="custom-tree-position"
                 :style="{paddingTop:sponsor.displayName?'20px':'30px'}">Sponsor</div>
            <div class="custom-tree-name"
                 v-if="sponsor.displayName">{{sponsor.displayName}}</div>
            <div class="custom-tree-line" />
            <div class="hover-warp">
              <div class="custom-tree-red"
                   v-if="permissionBtns.includes('编辑')"
                   @click='redact(sponsor)' />
              <div class="custom-tree-add"
                   v-if="permissionBtns.includes('新建')"
                   @click='noRemove(sponsor)' />
              <div class="custom-tree-del"
                   v-if="permissionBtns.includes('删除')"
                   @click="noRemove(sponsor)" />
            </div>
          </div>

          <!-- 整体组长/项目经理 -->
          <div class="custom-tree-node custom-tree-pm"
               v-if="tl.roleName">
            <div class="custom-tree-position"
                 :style="{paddingTop:tl.displayName?'20px':'30px'}">{{tl.roleName}}</div>
            <div class="custom-tree-name">{{tl.displayName}}</div>
            <div class="custom-tree-line"
                 :style="{height:pgModel.length?'208px':'68px'}" />
            <span class="custom-tree-point" />
            <div class="hover-warp">
              <div class="custom-tree-red"
                   v-if="permissionBtns.includes('编辑')"
                   @click='redact(tl)' />
              <div class="custom-tree-add"
                   v-if="permissionBtns.includes('新建')"
                   @click='append(tl,pgModel)' />
              <div class="custom-tree-del"
                   v-if="permissionBtns.includes('删除')"
                   @click="noRemove(tl,[],0)" />

            </div>
          </div>

          <!-- 助理 -->
          <div class="custom-tree-node custom-tree-aid"
               :style="{opacity: aid.roleName?1:0}">
            <div class="custom-tree-position"
                 :style="{paddingTop:aid.displayName?'20px':'30px'}">{{aid.roleName}}</div>
            <div class="custom-tree-name">{{aid.displayName}}</div>
            <div class="custom-tree-line" />
            <span class="custom-tree-point" />
            <div class="hover-warp">
              <div class="custom-tree-red"
                   v-if="permissionBtns.includes('编辑')"
                   @click='redact(aid)' />
              <div class="custom-tree-add"
                   v-if="permissionBtns.includes('新建')"
                   @click='noRemove(aid)' />
              <div class="custom-tree-del"
                   v-if="permissionBtns.includes('删除')"
                   @click="noRemove(aid)" />
            </div>
          </div>
          <!-- 各部门负责人 -->
          <div class="custom-head-warp"
               v-if="pgModel.length">
            <div class="custom-tree-head-line"
                 :style="{width:(pgModel.length-1)/pgModel.length*100 + '%',maxWidth:(pgModel.length-1)*340 + 'px'}"></div>
            <div class="custom-tree-node custom-tree-head"
                 v-for="(item,index) in pgModel"
                 :key="index">
              <div class="custom-tree-position"
                   :style="{paddingTop:item.displayName?'20px':'30px'}">{{item.roleName}}</div>
              <div class="custom-tree-name">{{item.displayName}}</div>
              <div class="custom-tree-line" />
              <span class="custom-tree-point" />
              <div class="hover-warp">
                <div class="custom-tree-red"
                     v-if="permissionBtns.includes('编辑')"
                     @click='redact(item)' />
                <div class="custom-tree-add"
                     v-if="permissionBtns.includes('新建')"
                     @click='append(item)' />
                <div class="custom-tree-del"
                     v-if="permissionBtns.includes('删除')"
                     @click="remove(item,pgModel,index)" />
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目部"
                   name="pd"
                   class="scrollbar">
        <inside-head :options="headConfig.power"
                     @callback="callback"></inside-head>
        <!-- Sponsor -->
        <div class="team-tree-warp">

          <!-- 整体组长/项目经理 -->
          <div class="custom-tree-node custom-tree-pm">
            <div class="custom-tree-position"
                 :style="{paddingTop:pm.displayName?'20px':'30px'}">{{pm.roleName}}</div>
            <div class="custom-tree-name">{{pm.displayName}}</div>
            <div class="custom-tree-line"
                 :style="{height:aid2.roleName&&pdModel.length?'208px':'68px'}" />
            <div class="hover-warp">
              <div class="custom-tree-red"
                   v-if="permissionBtns.includes('编辑')"
                   @click='noRemove(pm)' />
              <div class="custom-tree-add"
                   v-if="permissionBtns.includes('新建')"
                   @click='append(pm,pdModel)' />
              <div class="custom-tree-del"
                   v-if="permissionBtns.includes('删除')"
                   @click="noRemove(pm)" />
            </div>
          </div>

          <!-- 助理 -->
          <div class="custom-tree-node custom-tree-aid"
               v-if="aid2.roleName">
            <div class="custom-tree-position"
                 :style="{paddingTop:aid2.displayName?'20px':'30px'}">{{aid2.roleName}}</div>
            <div class="custom-tree-name">{{aid2.displayName}}</div>
            <div class="custom-tree-line" />
            <span class="custom-tree-point" />
            <div class="hover-warp">
              <div class="custom-tree-red"
                   v-if="permissionBtns.includes('编辑')"
                   @click='redact(aid2)' />
              <div class="custom-tree-add"
                   v-if="permissionBtns.includes('新建')"
                   @click='noRemove(aid2)' />
              <div class="custom-tree-del"
                   v-if="permissionBtns.includes('删除')"
                   @click="noRemove(aid2)" />
            </div>
          </div>
          <!-- 各部门负责人 -->
          <div class="custom-head-warp"
               v-if="pdModel.length">
            <div class="custom-tree-head-line"
                 :style="{width:(pdModel.length-1)/pdModel.length*100 + '%',maxWidth:(pdModel.length-1)*340 + 'px'}"></div>
            <div v-for="(item,index) in pdModel"
                 :key="index"
                 style="width:164px;margin:0 4px 50px">

              <div class="
                 custom-tree-node
                 custom-tree-head"
                   style="width:100%;margin:84px 0 32px">
                <div class="custom-tree-position"
                     :style="{paddingTop:item.displayName?'20px':'30px'}">{{item.roleName}}</div>
                <div class="custom-tree-name">{{item.displayName}}</div>
                <div class="custom-tree-line" />
                <span class="custom-tree-point" />
                <div class="hover-warp">
                  <div class="custom-tree-red"
                       v-if="permissionBtns.includes('编辑')"
                       @click='redact(item)' />
                  <div class="custom-tree-add"
                       v-if="permissionBtns.includes('新建')"
                       @click='append(item,item.children)' />
                  <div class="custom-tree-del"
                       v-if="permissionBtns.includes('删除')"
                       @click="remove(item,pdModel,index)" />
                </div>
              </div>
              <div class="custom-tree-node custom-tree-children"
                   v-if="item.children&&item.children.length"
                   style="width:100%;margin:80px 0 0">
                <div class="custom-tree-position"
                     :style="{paddingTop:item.children[0].displayName?'20px':'30px'}">{{item.children[0].roleName}}</div>
                <div class="custom-tree-name">{{item.children[0].displayName}}</div>
                <div class="custom-tree-line"
                     style="top:0;transform:translate(-50%, -100%);height:80px" />
                <span class="custom-tree-point" />
                <div class="hover-warp">
                  <div class="custom-tree-red"
                       v-if="permissionBtns.includes('编辑')"
                       @click='redact(item.children[0])' />
                  <div class="custom-tree-add"
                       v-if="permissionBtns.includes('新建')"
                       @click='append(item.children[0],[])' />
                  <div class="custom-tree-del"
                       v-if="permissionBtns.includes('删除')"
                       @click="remove(item.children[0],item.children[0],0)" />
                </div>
              </div>
              <template v-for="(v,i) in item.children&&item.children.slice(1)">
                <div class="custom-tree-node custom-tree-children"
                     :key="i"
                     v-if="item.children&&item.children.length>1"
                     style="width:100%;min-height:24px;line-height:24px;height:24px;margin-bottom:0">

                  <div class="custom-tree-name">{{v.displayName||'编辑姓名'}}</div>
                  <div class="hover-warp">
                    <div class="custom-tree-red"
                         v-if="permissionBtns.includes('编辑')"
                         @click='redact(v)'
                         style="width:22px;height:22px;min-width:22px" />
                    <!-- <div class="custom-tree-add"
                       v-if="permissionBtns.includes('新建')"
                       @click='append(item.children[0],[])' /> -->
                    <div class="custom-tree-del"
                         v-if="permissionBtns.includes('删除')"
                         @click="remove(v,item.children,i+1)"
                         style="width:22px;height:22px;min-width:22px" />
                  </div>

                </div>
              </template>
            </div>
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>
    <!-- 弹窗 -->
    <el-dialog :title="form.type?'人员编辑':'新建下级'"
               :visible.sync="dialogTableVisible"
               :close-on-click-modal="false">
      <el-form :model="form"
               size="small">
        <el-form-item label="姓名 :"
                      v-if="form.type"
                      :label-width="form.labelWidth">
          <el-autocomplete v-model="form.displayName"
                           :fetch-suggestions="querySearchAsync"
                           @select="headleSelect"
                           placeholder="请输入姓名">
            <template slot-scope="props">
              {{props.item.FItemName}}
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="工号 :"
                      v-if="form.type"
                      :label-width="form.labelWidth">
          <el-autocomplete v-model="form.userName"
                           :fetch-suggestions="querySearchAsync"
                           placeholder="请输入工号"
                           :disabled="true"
                           @select="headleSelect">
            <template slot-scope="props">
              {{props.item.FItemName}}
            </template>
          </el-autocomplete>

        </el-form-item>
        <el-form-item label="角色 :"
                      :label-width="form.labelWidth"
                      v-else>
          <el-select v-model="form.selectName"
                     placeholder="请选择角色"
                     @change="selectChange">
            <el-option v-for="(item,i) in selectList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="i">
            </el-option>

          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="()=>{dialogTableVisible=false}">取消</el-button>
        <el-button @click="distributeChildPlan">确认</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗END -->
  </div>
</template>

<script>
import insideHead from '../../../components/insideHead';
import { mapState } from 'vuex';

import headConfig from './config/head.config';
export default {
  data() {
    return {
      headConfig,
      form: {
        projectId: this.$route.query.id || this.$route.query.projectId,
        displayName: null,
        userName: null,
        depName: '',
        id: null,
        parentId: null,
        roleId: null,
        roleName: '',
        tel: '',
        email: '',
        type: 0,
        labelWidth: '55px',
        selectName: '',
        selectListPg: [],
        selectListPd: []
      },
      selectList: [],
      dialogTableVisible: false,
      dialogTableVisibleData: null,
      dialogTableVisibleType: 0,
      isOpen: 'pg',
      tree: [],
      peopletree: [],
      sponsor: {},
      group: {},
      pm: {},
      tl: {},
      aid: {},
      aid2: {},
      pgModel: [],
      pdModel: [],
      times: 0,
      addData: {}
    };
  },
  components: {
    insideHead
  },
  computed: {
    ...mapState({
      permissionBtns(state) {
        const menuData = state.ISDP.common.currentMenu || {};
        return menuData.btns || [];
      }
    })
  },
  async created() {
    //职位列表
    await this.getRoleList('pg', 'selectListPg');
    await this.getRoleList('pd', 'selectListPd');
    // 树结构(组)
    await this.getProjectStartPeopleTree(
      {
        roleType: 'pg',
        projectId:
            this.$route.query.id ||
            this.$route.query.projectId ||
            this.form.projectId
      },
      'peopletree'
    );
    // 树结构(部)
    await this.getProjectStartPeopleTree(
      {
        roleType: 'pd',
        projectId:
            this.$route.query.id ||
            this.$route.query.projectId ||
            this.form.projectId
      },
      'tree'
    );
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    //确认按钮
    async distributeChildPlan() {
      //编辑人员
      if (this.dialogTableVisibleType == 1) {
        if (!this.form.displayName || !this.form.userName) {
          this.$elTooltip({ message: '请选择人员', type: 'warning' });
          return;
        }
        this.dialogTableVisibleData.displayName = this.form.displayName;
        this.dialogTableVisibleData.userName = this.form.userName;
        if (this.form.displayName && this.form.userName) {
          if (this.dialogTableVisibleData) {
            this.dialogTableVisibleData.tel = this.form.tel;
            this.dialogTableVisibleData.depName = this.form.depName;
            this.dialogTableVisibleData.email = this.form.email;
            this.dialogTableVisibleData.projectId = this.form.projectId;
          }
          // await this.saveMember(this.dialogTableVisibleData);
          const data = await this.saveMember(this.dialogTableVisibleData);
          data && (this.dialogTableVisibleData.id = data.id);
          data && (this.dialogTableVisibleData.userId = data.userId);
        }
        //新增下级
      } else if (this.dialogTableVisibleType == 2) {
        this.addData && (this.addData.projectId = this.form.projectId);
        if (this.isOpen == 'pg') {
          if (this.addData.roleName == '整体组副组长') {
            this.addData && (this.aid = this.addData.toJson());
          } else if (this.addData.roleName == 'Sponsor') {
            this.addData && (this.aid = this.addData.toJson());
          } else if (this.addData.roleName) {
            this.pgModel.push(this.addData);
          }
        } else {
          if (this.addData.roleName == '项目经理助理') {
            this.addData && (this.aid2 = this.addData.toJson());
          } else if (this.addData.roleName) {
            this.dialogTableVisibleData &&
                this.dialogTableVisibleData.push(this.addData);
          }
        }
      }
      this.addData = {};
      this.form.selectName = '';
      this.dialogTableVisible = false;
      this.dialogTableVisibleData = [];
      this.dialogTableVisibleType == 0;
    },
    //获取团队成员数据
    async getProjectStartPeopleTree(params, text) {
      const { data } = await this.$store.dispatch(
        'ISDP/projectStart/getProjectStartPeopleTree',
        params
      );
      this.$set(this, text, data.toJson());
      if (params.roleType == 'pg' && data) {
        this.pgModel = [];
        this.setTreeData(data);
      } else if (params.roleType == 'pd' && data) {
        this.pdModel = [];
        this.setTreeDataPd(data);
      }
    },
    //设置树数据(组)
    setTreeData(arr) {
      // this.pgModel = [];
      arr.forEach((item) => {
        if (item.roleName == 'Sponsor') {
          this.sponsor = item.toJson();
          item.children && this.setTreeData(item.children);
        } else if (item.roleName == '整体组组长') {
          this.tl = item.toJson();
          item.children && (this.pgModel = item.children.toJson());
          // item.children && this.setTreeData(item.children);
        } else if (item.roleName == '整体组副组长') {
          this.aid = item.toJson();
          // item.children && this.setTreeData(item.children);
        }
      });
    },
    //设置树数据(部)
    setTreeDataPd(arr) {
      arr.forEach((item) => {
        if (item.roleName == '45216' || item.roleName == '项目经理') {
          this.pm = item.toJson();
          item.children && (this.pdModel = item.children.toJson());
        } else if (item.roleName == '项目经理助理') {
          this.aid2 = item.toJson();
        }
        // else if (item.roleName == '项目临时人员') {
        //   setTimeout(() => {
        //     this.pdModel.push(item);
        //   }, 0);
        // }
      });
    },
    //员工查询
    async getEmplyees(queryString, cd) {
      const { data } = await this.$store.dispatch('ISDP/project/getEmplyees', {
        StrKey: queryString
      });
      const datas = (data && data.slice(0, 10)) || [];
      cd(datas);
      if (data && data.length == 1) {
        this.headleSelect(data[0]);
      }
    },
    //员工结构设置
    querySearchAsync(queryString, cd) {
      this.form.userName = '';
      if (!queryString) {
        this.form.displayName = '';
        this.form.userName = '';
      } else {
        clearTimeout(this.times);
        this.times = setTimeout(() => {
          this.getEmplyees(queryString, cd);
        }, 500);
      }
    },
    //人员选择框
    headleSelect(e) {
      this.form.displayName = e.FItemName;
      this.form.userName = e.FItemNumber;
      this.form.tel = e.FCornet;
      this.form.email = e.FEmailAddress;
      this.form.depName = e.FDeptName;
    },
    //修改/设置人员
    redact(data) {
      this.form.type = 1;
      this.dialogTableVisibleData = data;
      this.dialogTableVisibleType = 1;
      this.form.displayName = data.displayName;
      this.form.userName = data.userName;
      this.dialogTableVisible = true;
    },
    //添加子组织
    append(data, datas) {
      this.form.parentId = data.id;
      this.form.selectName = '';
      this.dialogTableVisibleData = datas;
      this.dialogTableVisibleType = 2;
      this.form.type = 0;
      this.selectList = [];
      if (this.isOpen == 'pg') {
        this.form.selectListPg.forEach((item) => {
          if (item.roleName == '项目经理') {
            console.log(item);
            this.pgModel.find((option) => option.roleName == '项目经理') ||
                this.selectList.push(item);
          } else if (item.proleId != null && item.proleId == data.roleId) {
            this.selectList.push(item);
          }
        });
      } else {
        this.form.selectListPd.forEach((item) => {
          if (item.proleId != null && item.proleId == data.roleId) {
            this.selectList.push(item);
          } else if (
            item.roleName == '项目临时人员' &&
              data.roleName == '项目经理'
          ) {
            this.selectList.push(item);
          }
        });
      }
      this.dialogTableVisible = true;
    },
    //新建下属时点击选项选项事件
    selectChange(eve) {
      this.addData = this.selectList[eve].toJson();
      this.addData.parentId = this.form.parentId;
    },
    //删除
    async remove(item, arr, i) {
      if (item.id) {
        const resultCode = await this.deleteMember(item);
        resultCode == 200 && arr.splice(i, 1);
      } else {
        arr.splice(i, 1);
      }
    },
    aidRemove(data) {
      if (data.id) {
        this.deleteMember(data);
      }
      data.roleName = '';
      data.displayName = '';
    },
    noRemove() {
      this.$elTooltip({ message: '禁止操作', type: 'warning' });
    },
    //增加/修改成员
    async saveMember({
      userName, //工号
      displayName, //姓名
      id, //id
      roleId, //本级职务id
      parentId, //上级ID
      projectId, //项目id
      email, //邮箱
      tel, //短号
      depName, //部门
      userId
    }) {
      const { data } = await this.$store.dispatch(
        'ISDP/projectStart/treeSave',
        {
          userName,
          displayName,
          roleId,
          parentId,
          id,
          projectId,
          email,
          tel,
          depName,
          userId
        }
      );
      return data;
    },
    //删除
    async deleteMember({ id }) {
      const { resultMessage, resultCode } = await this.$store.dispatch(
        'ISDP/projectStart/treeDel',
        {
          id
        }
      );
      resultMessage &&
          this.$elTooltip({ message: resultMessage, type: 'warning' });
      return resultCode;
    },
    // 组织结构(项目职位)获取...
    async getRoleList(type, selectList) {
      const { data } = await this.$store.dispatch(
        'ISDP/configure/getRoleList',
        { roleType: type }
      );
      data &&
          data.forEach((item) => {
            let itemJson = JSON.stringify(item);
            itemJson = JSON.parse(itemJson);
            let { id, parentId } = itemJson;
            itemJson.roleId = id;
            itemJson.id = null;
            !itemJson.children && (itemJson.children = []);
            itemJson.proleId = parentId;
            itemJson.parentId = null;
            this.form[selectList].push(itemJson);
          });
    },
    //获取 表格
    async getTeamTreeExport() {
      const result = await this.$store.dispatch(
        'ISDP/projectStart/getTeamTreeExport',
        { projectId: this.form.projectId }
      );
      if (result.resultCode == 500) {
        this.$elTooltip({ message: result.resultMessage, type: 'error' });
      } else {
        let str = result.headers['content-disposition']
          .split('=')[1]
          .split('"')[1]
          .split('.');
        let name = decodeURI(str[0]) + '.' + str[1];
        this.$download(result.data, name);
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .projectStart-team-wrap {
    text-align: center;
    .team-nav {
      font-size: 14px;
      color: #777a80;
      .scrollbar {
        overflow: auto;
      }
    }
    .team-tree-warp {
      text-align: center;
      display: inline-block;
      .el-tree {
        background: none;
      }
      .custom-tree-node {
        border-radius: 2px;
        position: relative;
        margin: 0 auto;
        background-color: #fff;
        width: 164px;
        min-height: 76px;
        padding-bottom: 10px;
        margin-bottom: 74px;
        .custom-tree-position {
          font-size: 14px;
          line-height: 14px;
          padding-top: 20px;
          padding-bottom: 12px;
        }
        .custom-tree-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 100%);
          width: 2px;
          height: 74px;
          background-color: #e5e5e5;
        }
        .custom-tree-point {
          width: 10px;
          height: 10px;
          border-radius: 1px;
          background-color: #c3c3c3;
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 2;
          transform: translate(-50%, -50%);
        }
        .custom-tree-name {
          color: #3a3b3d;
        }
        &.custom-tree-aid {
          transform: translateX(260px);
          margin-bottom: 58px;
          .custom-tree-point {
            top: 30px;
            left: 0;
            transform: translate(-50%, 0);
          }
          .custom-tree-line {
            bottom: 40px;
            left: 0;
            transform: translate(-100%, 0);
            width: 178px;
            height: 2px;
            background-color: #e5e5e5;
          }
        }
        &.custom-tree-head {
          margin: 84px 4px 50px;
          .custom-tree-line {
            top: 0;
            left: 50%;
            transform: translate(-50%, -100%);
            width: 2px;
            height: 84px;
            background-color: #e5e5e5;
          }
        }
        &:hover > .hover-warp {
          // padding-top: 32px;
          display: flex;
        }
        .hover-warp {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          // display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 2px;
          div {
            min-width: 32px;
            width: 32px;
            height: 32px;
            display: block;
            border-radius: 50%;
            background-color: #fff;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            background-position: center;
          }
          .custom-tree-red {
            background-image: url(../../../assets/images/projectTeam/team_btn_editor_n.png);
          }
          .custom-tree-red:hover {
            background-color: #f32020;
            background-image: url(../../../assets/images/projectTeam/team_btn_editor_h.png);
          }
          .custom-tree-add {
            background-image: url(../../../assets/images/projectTeam/team_btn_delete_n.png);
          }
          .custom-tree-add:hover {
            background-color: #f32020;
            background-image: url(../../../assets/images/projectTeam/team_btn_add_h.png);
          }
          .custom-tree-del {
            background-image: url(../../../assets/images/projectTeam/team_、btn_delete_n.png);
          }
          .custom-tree-del:hover {
            background-color: #f32020;
            background-image: url(../../../assets/images/projectTeam/team_btn_delete_h.png);
          }
        }
      }
      .custom-head-warp {
        display: flex;
        position: relative;
        justify-content: center;
        .custom-tree-head-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          margin: 0 auto;
          height: 2px;
          background: #e5e5e5;
        }
      }
      .expanded {
        display: none;
      }
      .el-tree-node__content {
        display: inline-block;
        height: 100%;
      }
      .el-tree-node {
        background: none;
      }
    }
  }
</style>

<style lang="less">
  .projectStart-team-wrap {
    .team-nav {
      font-size: 14px;
      color: #777a80;
      .is-top.el-tabs__item {
        line-height: 16px;
        width: 96px;
        text-align: center;
        color: #777a80;
      }
      .el-tabs__nav-wrap {
        margin-bottom: 18px;
      }
      .el-tabs__item.is-active {
        color: #f00;
      }
      .el-tabs__active-bar {
        height: 3px;
        background-color: #f00;
      }
    }
    .mb-1 {
      margin-bottom: 0;
    }

    .el-dialog {
      width: 460px;
      margin-top: 25vh !important;
      .el-dialog__header {
        width: 460px;
        height: 44px;
        padding: 0;
        text-align: left;
        background-image: linear-gradient(#ffffff, #ffffff),
          linear-gradient(#ffffff, #ffffff);
        background-blend-mode: normal, normal;
        box-shadow: 0px 1px 10px 0px rgba(216, 213, 213, 0.5);
        border-radius: 2px;
        line-height: 14px;
        font-size: 14px;
        overflow: hidden;
        .el-dialog__title {
          display: inline-block;
          padding: 16px 0 0 14px;
          line-height: 14px;
          font-size: 14px;
        }
        .el-dialog__headerbtn {
          top: 10px;
        }
      }
      .el-dialog__body {
        padding-top: 55px;
        padding-bottom: 0;
        .el-form {
          width: 315px;
          margin: 0 auto;
          .el-form-item {
            display: flex;
            width: 315px;
            margin-bottom: 16px;
            &:last-child {
              margin-bottom: 0px;
            }
            .el-input,
            .el-input__inner {
              border-radius: 1px;
              outline: none;
              width: 260px;
              height: 30px;
            }
            .el-form-item__content {
              margin-left: 0 !important;
            }
            .el-form-item__label {
              width: 55px !important;
            }
            .el-form-item__content {
              width: 260px;
              .checkLi {
                width: 30%;
              }
            }
          }
        }
      }
      .el-dialog__footer {
        border-top: 1px solid #e5e5e5;
        padding: 14px;
        margin-top: 55px;
        button.el-button {
          color: #e5e5e5;
          &:last-child {
            background-color: #f42020;
          }
        }
      }
    }
  }
</style>
