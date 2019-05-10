<template>
  <a class="link blue"
     target="_blank"
     :href="data[options.prop] && data[options.prop].link || ''">{{ data[options.prop] && data[options.prop].fileName }}</a>
</template>
<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="less" scoped>
  .link.blue {
    color: #2abae9;
  }
</style>
