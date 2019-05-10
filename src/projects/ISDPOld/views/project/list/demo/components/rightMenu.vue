<template>
  <ul class="right-menu"
      :style="{'left': position.clientX + 'px', 'top': position.clientY + 'px'}"
      @contextmenu="(()=> false)">
    <li class="el-menu-item"
        v-for="(item, index) of (currentName && config[currentName] || [])"
        :key="index">{{item.label}} <i @click="handleForClick('add', item.value)">新增</i></li>
    <li class="el-menu-item"><i @click="handleForClick('remove', currentName)">删除</i></li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';
import config from '../config/demo.rightMenu.js';
export default {
  name: 'right-menu',
  data() {
    return {
      config,
      menuList: [
        {
          title: '新增',
          name: 'insert'
        },
        {
          title: '删除',
          name: 'remove'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      treeNode(state) {
        return state.ISDP.project.treeNode || [];
      },
      currentName(state){
        return state.ISDP.project.treeParams && state.ISDP.project.treeParams.currentName || '';
      },
      parentName(state) {
        return state.ISDP.project.treeParams && state.ISDP.project.treeParams.parentName || '';
      },
      treeData(state) {
        return state.ISDP.project.treeData || {};
      },
      treeParams(state) {
        return state.ISDP.project.treeParams || {};
      }
    })
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleForClick(action, prop) {
      const { treeData } = this;
      switch(action) {
      case 'add':
        this.addChildNode(treeData, prop);
        return;
      case 'remove':
        this.removeChildNode(treeData);
      }
    },
    addChildNode(data, newChild) {
      const { parentId, currentName } = this.treeParams;
      let obj = {
        id: new Date().getTime(),
        name: newChild,
        title: newChild,
        child: [],
        edit: true,
        username: '',
        nickname: '',
        parent: currentName
      }
      for(let i = 0; i < data.length; i++) {
        const item = data[i],
          { child = [], id = null } = item;
        if(id !== parentId) {
          this.addChildNode(child, newChild);
        } else {
          item.child.push(obj);
          this.$store.dispatch('ISDP/project/setTreeParams', {
            showMenu: false,
            parentId: obj.id
          });
          return ;
        }
      }
    },
    removeChildNode(data) {
      const {parentId } = this.treeParams;
      for(let i = 0; i < data.length; i++) {
        const item = data[i],
          { child = [], id = null } = item;
        if(id === parentId) {
          data.splice(i, 1);
          this.$store.dispatch('ISDP/project/setTreeParams', {
            showMenu: false
          });
          return ;
        } else {
          this.removeChildNode(child);

        }
      }
    },
    changeOrigin(data, prop, val) { // 查找节点改变属性值
      const { parentId } = this;
      for(let i = 0; i < data.length; i++) {
        const item = data[i],
          { child = [], id = '' } = item;
        if(parentId === id) {
          item[prop] = val;
          return ;
        } else {
          this.changeOrigin(child, prop, val);
        }
      }
    }
  },
  props: {
    position: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .right-menu {
    position: fixed;
    width: 120px;
    border: 1px solid #ccc;
    background-color: #fff;
    .el-menu-item {
      position: relative;
      height: 42px;
      padding: 5px;
      line-height: 32px;
      border-bottom: 1px solid #f1f1f1;
      &:last-child(1) {
        border: none;
      }
      > i {
        position: absolute;
        right: 15px;
        color: red;
      }
    }
  }
</style>
