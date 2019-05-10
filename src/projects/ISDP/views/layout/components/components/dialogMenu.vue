<template>
  <div class="dialog-menu-wrap clearfix"
       @click.native.stop>
    <el-menu class="dialog-menu"
             mode="horizontal"
             :unique-opened="true"
             menu-trigger="hover"
             ref="dialogMenu"
             @select="handleSelectForMenu">
      <dialog-menu-item v-for="item of menuConfig"
                        :key="item.title"
                        :options="item"></dialog-menu-item>
    </el-menu>
  </div>
</template>
<script>
import dialogMenuItem from './dialogMenuItem';
// import menuConfig from '../config/navs';
// menuConfig.shift();
export default {
  components: {
    dialogMenuItem
  },
  computed: {
    menuConfig(){
      let data = this.data.toJson();
      data.shift();
      return [ {
        title: '',
        children: data
      } ];
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    async handleSelectForMenu(index){ // indexPath
      await this.$store.dispatch('ISDP/common/saveMenu',[ {
        businessType: 'm',
        businessId: index
      } ]);
      this.callback('selectMenu');
    },
    open(){
      this.$refs.dialogMenu.open('0');
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  }

}
</script>

<style lang="less" scoped>
  .dialog-menu-wrap {
    .dialog-menu {
      background-color: transparent;
      /deep/ .el-submenu {
        & > .el-submenu__title {
          height: auto;
          padding: 0;
          border-bottom: 0;
          line-height: 1;
          background-color: transparent;
          i {
            display: none;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .dialog-menu-popper-wrap,
  .dialog-menu-children-popper-wrap {
    .el-menu--popup {
      min-width: 162px;
      box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.6);
      border-radius: 1px;
      .el-submenu__title,
      .el-menu-item {
        @hei: 30px;
        height: @hei;
        line-height: @hei;
        color: #4d4f53;
        &:hover {
          color: #f00000;
          .el-submenu__icon-arrow {
            color: #f42020;
          }
        }
      }
      .el-submenu__title {
        .el-submenu__icon-arrow {
          color: #bdbdbd;
        }
      }
      .el-submenu.is-opened {
        & > .el-submenu__title {
          color: #f00000;
          .el-submenu__icon-arrow {
            color: #f42020;
          }
        }
      }
      .el-menu--popup-right-start {
        margin: 0;
      }
    }
  }
  .dialog-menu-children-popper-wrap {
    .el-menu--popup {
      min-width: 134px;
    }
  }
</style>
