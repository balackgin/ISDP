<template>
  <el-submenu v-if="children.length && !options.urlPath"
              :index="indexVal || '0'"
              :show-timeout="0"
              :hide-timeout="0"
              :popper-class="isOther ? 'dialog-menu-children-popper-wrap' : 'dialog-menu-popper-wrap'">
    <template slot="title">{{title}}</template>
    <dialog-menu-item v-for="item of children"
                      :key="item.title"
                      :options="item"
                      :isOther="true"></dialog-menu-item>
  </el-submenu>
  <el-menu-item :index="indexVal"
                v-else>
    {{title}}
  </el-menu-item>
</template>
<script>
export default {
  name: 'dialogMenuItem',
  computed: {
    children(){
      return this.options.children || [];
    },
    title(){
      return this.options.elementName;
    },
    indexVal(){
      const {id} = this.options;
      return id ? id + '' : '';
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    isOther: true
  }
}
</script>
