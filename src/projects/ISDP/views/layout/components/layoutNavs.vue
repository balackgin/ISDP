<template>
  <el-menu :collapse="false"
           :unique-opened="true"
           :default-active="defaultActive"
           mode="vertical"
           class="layout-navs-wrap">
    <sub-menu v-for="(item,idx) of menuData"
              :options="item"
              :key="idx+''"
              :data="menuData"
              v-if="['menu','edit'].includes(item.elementType) && item.select"></sub-menu>
  </el-menu>
</template>
<script>
// import navConfig from './config/navs'
// import spriteImg from '@ISDP/assets/images/menuSprite.png';
// import spriteConfig from '@ISDP/assets/images/menuSprite';
import { mapState } from 'vuex';
// import subMenu from './components/menuItem';
const subMenu = () => import('./components/menuItem');

export default {
  components: {
    subMenu
  },
  computed: {
    ...mapState({
      menuData: (state) => state.ISDP.common.menuData || [],
      menuObj: (state) => state.ISDP.common.menuObj || {}
    }),
    defaultActive(){
      const {$route,menuObj} = this,
        {name: routeName,query} = $route,
        arr = menuObj[routeName],
        result = arr ? arr[arr.length - 1] : {id: ''};

      result.btns =  [];
      result.dialogBtns = [];

      (result.children || []).forEach((item) => {  //当前菜单children
        const {select,elementName,elementType} = item;
        if(elementName && select){
          elementType === 'btn' &&  result.btns.push(elementName.trim());
          elementType === 'dialogForAdd' && result.dialogBtns.push(elementName.trim());
        }
      });

      this.$store.commit('ISDP/common/setCurrentMenuData',Object.assign({},result,{
        insideMenuData: arr
      }));
      this.$store.commit('ISDP/project/SET_PROJECT_ID',query.id);
      return  result.id + '';
    }
  },
  methods: {
    async getMenuList(){
      await this.$store.dispatch('ISDP/common/getMenuList',{
        projectId: this.$route.query.id || 0
      });
    }
  },
  created(){
    this.getMenuList();
  }
}
//  2019/5/8
// 1、	ISDP菜单调整，一级菜单请设计好图标，具体如下：
// （例：一级菜单——二级菜单）
// 我的项目（原：全部项目）
// 我的任务（原：我的任务）；
// 默认项目（原：默认项目）；
// 项目立项（原：项目立项）；
// 项目团队管理（原：无，新建一级）——团队配置（原：项目团队）、临时人员配置（原：临时人员配置）；
// WBS管理（原：WBS管理）——WBS状态（原：WBS状态浏览）、WBS配置（原：WBS配置）、WBS制定派发（原：WBS维护）、WBS任务反馈（原：WBS任务）；
// 范围管理——点位管理；
// 进度与实施管理——整体进度浏览、外场计划制定派发（原：外场实施子计划）、外场任务反馈（原：外场子计划接收及反馈）；
// 问题与风险管理——问题与风险维护；
// 经营管理——项目预算（问题与风险跟踪页面变更为页签展示）；




// 2、 顶部的状态栏下方需要添加一行，用于展示项目名称，请将展示设计美观。

</script>
<style lang="less">
  @distance: 64px;
  .layout-navs-wrap {
    height: 100%;
    border-right: 0;
    padding: 12px 0 0;
    box-shadow: 2px 0px 14px 0px rgba(224, 217, 217, 0.2);

    &.el-menu {
      // 文字颜色、icon控制 start
      .menu-link,
      .el-submenu__title,
      .el-menu-item {
        .menu-item-icon {
          @wid: 16px;
          width: @wid;
          height: @wid;
          margin-right: 8px;
          display: inline-block;
          vertical-align: middle;
          background: transparent url(../../../assets/images/menuSprite.png)
            no-repeat;
        }
        .icon-hover,
        .icon-active {
          display: none;
        }
        &:hover {
          // background-color: #f6f6f6;
          background-color: transparent;
          color: #f00000;
          .el-submenu__icon-arrow {
            color: #f00000;
          }
          .icon-default {
            display: none;
          }
          .icon-hover {
            display: inline-block;
          }
        }
      }

      // 文字颜色、icon控制 end

      //  第一级
      & > .el-submenu {
        & > .el-submenu__title {
          @hei: 52px;
          height: @hei;
          padding-left: @distance !important;
          line-height: @hei;
        }

        & > .el-menu {
          @borderLine: 1px solid #ededed;
          border-top: @borderLine;
          border-bottom: @borderLine;
          // background-color: rgba(225, 225, 225, 0.84);
          background-color: #fafafa;

          // 第二级
          .inside-last-menu-item:not(.noAction) {
            border-left: 4px solid transparent;
          }
          & > .el-menu-item {
            // 第二级
            padding-left: @distance + 20px !important;
            &.noAction {
              padding: 0 !important;
              height: auto;
              line-height: 1.5;
              cursor: default;
            }
            &.inside-last-menu-item {
              // 第二级同时是最后一级
              padding: 0 !important;
              .link {
                padding-left: @distance + 20px;
              }
              // 第二级 选中
              &:hover,
              &.is-active {
                border-left-color: #f42020;
                background-color: #f6f6f6;
              }
            }
          }
          & > .el-submenu {
            //第二级  li
            & > .el-submenu__title {
              padding-left: @distance + 20px !important;
            }
            & > .el-menu {
              //第三级
              @borderLine: 1px solid #e3e3e3;
              border-top: @borderLine;
              border-bottom: @borderLine;
              background-color: #f2f2f2;
              & > .el-menu-item {
                padding-left: @distance + 36px !important;
                &.inside-last-menu-item {
                  padding: 0 !important;
                  .link {
                    padding-left: @distance + 36px;
                  }
                  // 第三级 选中
                  &:hover,
                  &.is-active {
                    border-left-color: #f42020;
                    background-color: rgba(225, 225, 225, 0.54);
                  }
                }
              }
            }
          }
        }
      }
      // 第一级 也是最后一级
      & > .el-menu-item {
        padding: 0 !important;
        .menu-link {
          padding-left: 64px;
        }
        &.inside-last-menu-item {
          border-left: 4px solid transparent;
          &.is-active {
            border-left-color: #f42020;
            background-color: rgba(225, 225, 225, 0.54);
          }
        }
      }
    }
  }
</style>
