<template>
  <el-submenu :index="options.id + ''"
              v-if="editFlag || !options.urlPath"
              :popper-class="isOther ? 'dialog-menu-children-popper-wrap' : 'dialog-menu-popper-wrap'">
    <template slot="title">
      <template v-if="options.iconStyle">
        <i class="menu-item-icon icon-default"
           :style="options.iconStyle"></i>
        <i class="menu-item-icon icon-hover"
           :style="options.iconHoverStyle"></i>
        <i class="menu-item-icon icon-active"
           :style="options.iconActiveStyle"></i>
      </template>
      {{title}}
    </template>
    <template>
      <menu-item v-for="(item,idx) of editFlag ?  [{type: 'edit',urlPath: true}] : children"
                 :options="item"
                 :key="title+idx"
                 :isOther="true"
                 v-if="['menu'].includes(item.elementType) && item.select || editFlag"
                 :data="data"></menu-item>
    </template>
  </el-submenu>
  <el-menu-item class="inside-last-menu-item"
                :class="[{noAction: options.type},options.className]"
                :index="options.id + ''"
                v-else>
    <menu-item-content :data="data"
                       :options="options"></menu-item-content>
  </el-menu-item>

</template>
<script>
import menuItemContent from './menuItemContent';
export default {
  name: 'menu-item',
  components: {
    menuItemContent
  },
  computed: {
    children(){
      return this.options.children || [];
    },
    title(){
      return this.options.elementName;
    },
    editFlag(){
      return this.options.elementType === 'edit';
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    data: {
      type: Array
    },
    isOther: true
  }
};
</script>
