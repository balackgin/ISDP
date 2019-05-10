<template>
  <div class="configuration-role-wrap">
    <div class="flex role-group">
      <section class="role-section role-box">
        <inside-tabs :data="headConfig.role"
                     @callback="callback"></inside-tabs>
        <model-table ref="refTable"
                     :options="tableConfig"
                     :data="tableData"
                     :remoteData="tableRemoteData"
                     @callback="callback"></model-table>
      </section>
      <section class="configuration-section flex-item role-box">
        <inside-head :options="headConfig.power"
                     @callback="callback"></inside-head>
        <div class="con-box scrollbar">
          <inside-checkbox :data="item"
                           @callback="callback"
                           v-for="(item, index) of listConfig"
                           :key="index + ''"></inside-checkbox>
          <!-- <el-tree :data="listConfig"
                   show-checkbox
                   node-key="id"
                   ref="tree"
                   :indent="24"
                   :check-strictly="true"
                   :default-checked-keys="ids"
                   :default-expanded-keys="[]"
                   :default-expand-all="true"
                   :highlight-current="false"
                   @check="handleChangeForCheck"
                   :props="{label: 'elementName', class: 'elementType'}"
                   :expand-on-click-node="false"></el-tree> -->
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import modelTable from '@/components/modelList/modelTable';
import insideHead from '@ISDP/components/insideHead';
import tableConfig from './config/role.table.config';
import headConfig from './config/head.config';
import insideTabs from './components/insideTab';
import insideCheckbox from './components/insideCheckbox';

const actionIcons = (text, type) => [
  {
    name: type + 'Table',
    text,
    className: 'text-danger'
  },
  {
    name: 'tableDel',
    text: '删除',
    className: 'text-danger'
  }
];
export default {
  components: {
    insideTabs,
    modelTable,
    insideHead,
    insideCheckbox
  },
  data() {
    return {
      headConfig,
      tableConfig,
      tableRemoteData: {
        displayName: []
      },
      roleType: 'g',
      ids: new Set([]),
      delIds: [],
      tableData: [],
      listConfig: [],
      allIds: new Set([]),
      isStrictly: true
    };
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForRow(row) {
      if (this.currentRowType === row.roleClassify || !row.roleClassify) return;
      this.currentRowType = row.roleClassify;
      this.getElements();
    },

    // lists handle start
    getCheckedKeys() {
      let delIds = this.allIds;
      // console.log(Array.from(this.ids), this.allIds, 'sdfdsfds')
      this.ids.forEach((idsItem) => {
        delIds.delete(idsItem);
      })
      this.delIds = Array.from(delIds);
    },
    // table handle start
    editTable(row) {
      // console.log(row);
      this.$refs.refTable.changeInputProps({
        rows: [ row ],
        props: [ 'roleName', 'roleClassify' ],
        icons: actionIcons('保存', 'save')
      });
    },
    saveTable(row) {
      this.saveRoles(row);
    },
    handleChangeForCheck() {
      // this.isStrictly = false;
      // console.log(row, status, current, 'sdfsdf');
      // this.checkedNodeChildren(row, status)/
    },
    checkedNodeChildren(data, status) {
      let { children = [] } = data;
      data.select = status;
      (children || []).forEach((item) => {
        this.checkedNodeChildren(item, status);
      })
    },
    handleClickForTabs(tab) {
      const { name } = tab,
        { roleType } = this;
      if(name === roleType) return;
      this.roleType = name;
      this.currentRowType = '';
      this.ids = new Set([]);
      this.allIds = new Set([]);
      this.delIds = [];
      this.getRoleList();
    },
    tableDel(args) {
      const { id, version } = args;
      if (id) {
        this.$confirm('该操作继续下去将会删除该条数据', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.deleteRole({ id, version });
        });
      } else {
        let idx = this.tableData.findIndex((item) => item === args);
        this.tableData.splice(idx, 1);
      }
    },
    tableForm(data) {
      let arr = [];
      data &&
        data.forEach((item) => {
          let obj = {
            label: item.roleName,
            value: item.roleName + '$$' + item.roleClassify
          };
          arr.push(obj);
        });
      this.tableRemoteData = Object.assign({}, this.tableRemoteData, {
        displayName: arr
      });
    },
    addNewRow() {
      let tableRow = {
        roleType: this.roleType,
        roleName: '',
        roleClassify: ''
      };
      this.tableData.push(tableRow);
      this.$refs.refTable.changeInputProps({
        rows: [ tableRow ],
        props: [ 'roleName', 'roleClassify' ],
        icons: actionIcons('保存', 'save')
      });
    },
    // 树形数据选中id和置灰id分类
    elementTree(data) {
      this.allIds = new Set([]);
      this.ids = new Set([]);
      this.listConfig = Object.assign([], this.listConfig,  data);
      // this.initTreeData(this.listConfig);
      (this.listConfig || []).forEach((item) => {
        this.initTreeData(item);
      })
      // this.styleInit(this.listConfig);
      // this.isStrictly = false;
      // console.log(this.list, 'tree');


      // this.$nextTick(() => {
      //   let tree = this.$refs.tree.$el;
      //   // console.log(this.$refs.tree.getNode(25), 'sdfsdfsd');
      //   this.findNode(tree);
      // });
    },
    initTreeData(data) {
      let flag = true,
        { children: parentArr = [], id: parentId } = data;
      this.allIds.add(parentId);
      if(data.select) this.ids.add(parentId);
      (parentArr || []).forEach((item) => {
        let { children = [], id: parentId, select } = item;
        this.allIds.add(parentId);
        if(select) this.ids.add(parentId)
        if(children) {
          flag = false;
          this.initTreeData(item);
        }
      });
      if(flag) {
        data.className = 'flex-checkbox';
      }
    },

    // 添加或修改角色
    async saveRoles(row) {
      const {
        resultCode = '',
        resultMessage = ''
      } = await this.$store.dispatch('ISDP/configure/saveRoles', row);
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getRoleList();
      }
    },
    handleChangeForCheckbox(node, status) {
      // console.log(...args)
      this.changeCheckStatus(node, status);
    },
    changeCheckStatus(node, status) {
      let { children = [], id: parentId } = node;
      if(status) {
        this.ids.add(parentId);
        (children || []).forEach((item) => {
          let { children = [] , id} = item;
          this.ids.add(id);
          item.select = status;
          if(children) {
            this.changeCheckStatus(item, status);
          }
        })
      }else {
        this.ids.delete(parentId);
        (children || []).forEach((item) => {
          let { children = [], id } = item;
          item.select = status;
          this.ids.delete(id);
          if(children) {
            this.changeCheckStatus(item, status);
          }
        })
      }
    },
    // 获取角色列表
    async getRoleList() {
      const { roleType } = this;
      const { data, resultCode = '' } = await this.$store.dispatch(
        'ISDP/configure/getRoleList',
        {
          roleType
        }
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        if (!this.currentRowType) {
          this.currentRowType = data[0].roleClassify;
          this.getElements();
        }
        this.tableData = data;
        this.tableForm(data);
      }
    },
    // 删除角色
    async deleteRole(params) {
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/configure/deleteRole', params);
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getRoleList();
      }
    },
    // 获取树形权限数据
    async getElements() {
      const { data, resultCode = '' } = await this.$store.dispatch( 'ISDP/configure/getElements',{
        roles: this.currentRowType,
        roleType: this.roleType
      });
      if (+resultCode === 200 || resultCode.includes('200')) {
        // this.isStrictly = true;
        this.elementTree(data);
      }
    },
    // 保存树形数据
    async saveElement() {
      this.getCheckedKeys();
      const { ids, delIds, currentRowType, roleType } = this;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/configure/saveElement', {
        ids: Array.from(ids),
        delIds,
        roleType,
        roleClassify: currentRowType
      });
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.isStrictly = true;
        this.getElements();
      }
    }
  },
  async created() {
    await this.getRoleList();
  }
};
</script>

<style lang="less" scoped>
  .configuration-role-wrap {
    height: 100%;
    .role-head {
      margin-bottom: 20px;
      .title {
        color: #333;
        font-size: 16px;
      }
      .fa-plus {
        color: #7c7c7c;
        font-size: 16px;
        line-height: 20px;
        cursor: pointer;
      }
    }
    .role-group {
      height: 100%;
      .role-box {
        height: 100%;
      }
      .role-section {
        @wid: 360px;
        flex-basis: @wid;
        width: 50%;
        max-width: @wid;
        /deep/ .model-table-wrap {
          height: -ms-calc(100% - 46px);
          height: -webkit-calc(100% - 46px);
          height: -moz-calc(100% - 46px);
          height: calc(100% - 46px);
          .el-table {
            height: 100%;
            .el-table__body-wrapper {
              height: -ms-calc(100% - 46px);
              height: -webkit-calc(100% - 46px);
              height: -moz-calc(100% - 46px);
              height: calc(100% - 46px);
            }
          }
        }
      }
    }
    .configuration-section {
      margin-left: 28px;
      min-width: 50%;
      .role-head {
        margin-bottom: 10px;
      }
      .con-box {
        height: -ms-calc(100% - 46px);
        height: -webkit-calc(100% - 46px);
        height: -moz-calc(100% - 46px);
        height: calc(100% - 46px);
        overflow: auto;
        padding: 32px 34px;
        background-color: #fff;
      }
    }
  }
</style>
<style lang="less">
  .configuration-role-wrap {
    .configuration-section {
      .con-box {
        .el-tree {
          .is-indeterminate {
            > .el-checkbox__inner {
              background-color: #fff !important;
              border-color: red !important;
              &::before {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 6px;
                height: 6px;
                -webkit-transform: none;
                transform: none;
                display: block;
                background-color: #f81b1b;
              }
            }
          }
          // div[role='treeitem'] > div[role='group'] {
          //   display: flex;
          //   padding: 0 45px;
          // }

          > div[type='treeitem'].is-current {
            background-color: transparent;
            outline: none;
          }
          .el-tree-node {
            // &:focus {
            //   > .el-tree-node__content {
            //     background-color: #fff;
            //   }
            // }

            .el-tree-node__content {
              margin-bottom: 20px !important;
              // &:hover,
              // &:focus {
              //   background-color: transparent;
              // }
              .el-tree-node {
                &:focus {
                  .el-tree-node__content {
                    background-color: #fff;
                  }
                }
                &:hover {
                  background-color: #fff;
                }
              }
              > .el-tree-node__expand-icon {
                display: none;
              }
            }
          }
        }
      }
    }
  }
</style>
