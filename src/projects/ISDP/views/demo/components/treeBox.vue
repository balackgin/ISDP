<template>
  <div class="tree-box"
       :class="{'first-box': !flag}">
    <div class="box"
         :class="{'last-level': !(options.children && options.children.length)}">{{options.title}}</div>
    <section class="flex tree-section"
             v-if="options.children && options.children.length">
      <tree-box-item v-for="(item,idx) of options.children"
                     :key="index + '-'+idx"
                     :options="item"
                     :flag="true"></tree-box-item>
    </section>
  </div>
</template>
<script>
export default {
  name: 'tree-box-item',
  props: {
    options: {
      type: Object,
      required: true
    },
    index: true,
    flag: true
  }
}
</script>
