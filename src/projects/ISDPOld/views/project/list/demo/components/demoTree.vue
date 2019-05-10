<template>
  <div class="demo-box">
    <i class="line up"
       v-if="treeData.parent"></i>
    <div class="title block">
      <span class="label"
            @dblclick.prevent.stop="changeForInput(treeData)"
            @contextmenu.prevent.stop="rightMenu($event,treeData)">{{treeData.title}}:
        <model-select v-if="treeData.edit"
                      size="small"
                      class="default-input"
                      :options="{prop: 'nickname',formItemOpts}"
                      :remoteData="remoteData"
                      :form="treeData"
                      @callback="callback"></model-select>
        <i class="username"
           v-else>{{treeData.nickname}}</i></span>
    </div>
    <div class="block">
      <i class="line down"
         v-if="treeData.child && treeData.child.length > 1"></i>
    </div>
    <div class="block">
      <i class="line middle"
         :style="{width: (treeData.child.length -1) / treeData.child.length * 100 + '%', marginLeft: 0.5 / treeData.child.length * 100 + '%'}"
         v-if="treeData.child && treeData.child.length > 1"></i>
    </div>
    <!-- 调用自身组件 -->
    <demo-tree v-for="(child, idx) of treeData.child"
               :treeData="child"
               :index="idx"
               :key="idx +''">
    </demo-tree>
  </div>
</template>

<script>
import config from '../config/demo.config';
import modelSelect from '@/components/modelFormGroup/components/select';
import { mapState } from 'vuex';

export default {
  name: 'demoTree',
  components: {
    modelSelect
  },
  data(){
    return {
      config,
      showRightMenu: false,
      currentName: '',
      currentIndex: null,
      remoteData: {
        nickname: []
      },
      formItemOpts: {
        filterable: true,
        remote: true,
        clearable: true,
        select: []
      }
    }
  },
  computed: {
    ...mapState({
      originData(state) {
        return state.ISDP.project.treeData || [];
      }
    }),
    parentId: {
      get() {
        return this.$store.state.ISDP.project.treeParams && this.$store.state.ISDP.project.treeParams.parentId || null;
      },
      set(val) {
        this.$store.state.ISDP.project.treeParams.parentId = val;
      }
    }
  },
  props: {
    treeData: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: Number
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    changeForInput(row) {
      const { id } = row;
      this.parentId = id;
      this.$store.dispatch('ISDP/project/setTreeParams', {
        parentId: id
      })
      this.changeOrigin(this.originData, 'edit', true);
    },
    rightMenu(e, row) {
      const { clientX, clientY } = e,
        { id, name } = row;
      this.$store.dispatch('ISDP/project/setTreeParams', {
        parentId: id,
        currentName: name,
        showMenu: true,
        position: { clientX, clientY}
      });
      e.preventDefault();
    },
    handleBlur(){
      setTimeout(() => {
        this.changeOrigin(this.originData, 'edit', false);
      },200);
    },
    handleChangeForSelected(data) {
      let nickArr = data.nickname.split('$$');
      this.changeOrigin(this.originData, 'nickname', nickArr[0] + ' ' + nickArr[1]);
    },
    handleChangeForSelect(args) {
      this.getEmplyees(args);
    },
    dealData(data = []) {
      let nickname = data.map((item) => Object.assign({},item,{
        value: item.FItemName + '$$' + item.FItemNumber + '$$' + item.FDeptName + '$$' + item.FDeptNumber, // 部门  部门编号
        label: item.FItemName + ' ' + item.FItemNumber
      }))
      this.remoteData = Object.assign({}, this.remoteData, { nickname });
    },
    async getEmplyees (StrKey) {
      let { data } = await this.$store.dispatch('ISDP/project/getEmplyees', {StrKey});

      if(data) {
        data = data.splice(0, 10);
        this.dealData(data);
      }else {
        this.remoteData = Object.assign({}, this.remoteData, { nickname: data });
      }
    },
    changeOrigin(data, prop, val) { // 查找节点改变属性值
      const { parentId } = this;
      for(let i = 0; i < data.length; i++) {
        const item = data[i],
          { child = [], id = '' } = item;
        if(parentId === id) {
          if(prop === 'edit') {
            this.handleChangeForSelect();
          }
          item[prop] = val;
          return ;
        } else {
          this.changeOrigin(child, prop, val);
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @wid: 50%;
  .demo-box {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin: 8px 0;
    flex: 1;
    .line {
      position: relative;
      margin-top: 0;
      display: block;
      width: 3px;
      height: 8px;
      background-color: lightblue;
      margin: 0 auto;
      &.up {
        margin-top: -8px;
        transform: translateX(1px);
      }
      &.down {
        margin-top: 0;
        transform: translateX(1px);
      }
      &.middle {
        height: 3px;
        margin-top: 0;
      }
    }
    &:last-child {
      > .line.up {
        transform: translateX(-2px);
      }
    }
    .block {
      width: 100%;
      text-align: center;
      .default-input {
        width: 120px;
        margin: 0 auto;
      }
    }
    .title {
      position: relative;
      height: 64px;
      text-align: center;

      .label {
        display: inline-block;
        padding: 0 10px;
        height: 64px;
        font-size: 18px;
        line-height: 64px;
        margin: 0 auto;
        cursor: pointer;
        background-color: lightblue;
        input {
          vertical-align: middle;
        }
      }
    }
  }
</style>
