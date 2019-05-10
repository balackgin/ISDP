<template>
  <div class="inside-dropdown-wrap"
       :class="[{'active': active},...className]"
       @click.stop>
    <el-button type="text"
               size="small"
               class="drop-btn"
               :icon="btnConfig.icon"
               @click.prevent="btnClick"
               @blur.native="btnBlur">
      <slot name="prev"></slot>
      {{btnConfig.text}}
      <i v-if="btnConfig.appendIcon"
         class="el-icon-caret-bottom"></i>
    </el-button>
    <div class="inside-dropdown-menu-wrap">
      <i v-if="dropOpts.menuIcon"
         class="el-icon-caret-top"></i>
      <ul class="lists">
        <li class="drop-item"
            v-for="(item,idx) of menuConfig"
            :key="idx+''"
            @click="callback(item.fnName,item)">{{ item[propsOpts.value || 'text'] }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      active: false,
      timer: null
    }
  },
  computed: {
    dropOpts(){
      return this.options.opts || {};
    },
    btnConfig(){
      return this.options.btn || {};
    },
    menuConfig(){
      return this.options.menu || {}
    },
    propsOpts(){
      return this.options.props || {};
    },
    className(){
      const {dropOpts} = this,
        {theme,trigger} = dropOpts;
      return [ theme && `theme-${ theme }`,{
        'is-hover': !trigger || trigger === 'hover',
        'is-click': trigger === 'click'
      }  ]
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    btnClick(){
      const {trigger} = this.dropOpts;
      if(trigger === 'click'){
        this.active = !this.active;
      }
    },
    btnBlur(){
      this.timer = setTimeout(() => {
        this.active = false;
      },300);
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
  .inside-dropdown-wrap {
    position: relative;
    .drop-btn {
      padding: 0;
      color: #fff;
      font-size: 14px;
      .el-icon-caret-bottom {
        margin-left: 8px;
      }
    }
    .inside-dropdown-menu-wrap {
      position: absolute;
      top: 100%;
      left: 0;
      display: none;
      z-index: 101;
      .el-icon-caret-top {
        position: absolute;
        top: -9px;
        right: 0;
        left: 0;
        text-align: center;
        color: #fff;
      }
      .lists {
        border-radius: 1px;
        box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.6);
        background: #fff;
        white-space: nowrap;
        .drop-item {
          padding: 10px 22px;
          color: #4d4f53;
          cursor: pointer;
          &:hover {
            box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.4);
            color: #f00000;
          }
          &:active {
            color: #f00000;
            box-shadow: 0px 0px 8px 0px rgba(216, 213, 213, 0.4);
          }
        }
      }
    }
    &.is-hover:hover {
      .inside-dropdown-menu-wrap {
        display: block;
      }
    }
    &.active {
      .inside-dropdown-menu-wrap {
        display: block;
      }
    }
    &.theme-layout-head {
      .inside-dropdown-menu-wrap {
        left: auto;
        right: -28px;
      }
    }
  }
</style>
