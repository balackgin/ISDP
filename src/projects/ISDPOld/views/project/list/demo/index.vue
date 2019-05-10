<template>
  <div class="demo-tree">
    <demo-tree :treeData="item"
               :index="index"
               v-for="(item, index) of treeData"
               :key="index + ''">

    </demo-tree>
    <!-- 右键菜单组件 -->
    <right-menu :rightData="[]"
                v-if="showRightMenu"
                :position="position"></right-menu>
    {{treeParams}} {{position}}
  </div>
</template>

<script>
import { mapState } from 'vuex';
import demoTree from './components/demoTree';
import rightMenu from './components/rightMenu';
export default {
  components: {
    demoTree,
    rightMenu
  },
  data(){
    return {}
  },
  computed: {
    ...mapState({
      treeParams(state) {
        return state.ISDP.project.treeParams || {};
      },
      showRightMenu(state) {
        return state.ISDP.project.treeParams && state.ISDP.project.treeParams.showMenu || false;
      },
      position(state) {
        return state.ISDP.project.treeParams && state.ISDP.project.treeParams.position || {};
      },
      treeData(state) {
        return state.ISDP.project.treeData || [];
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .demo-tree {
    > .demo-box {
      display: flex;
    }
  }
</style>
