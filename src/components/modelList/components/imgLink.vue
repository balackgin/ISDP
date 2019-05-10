<template>
  <a :href="data[columnOpts.fileUrl || 'url']"
     :target="columnOpts.target || '_blank'"
     class="link img-link">
    {{data[options.prop]}}
  </a>
</template>
<script>
export default {
  computed: {
    columnOpts(){
      return this.options.columnOpts || {};
    }
  },
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
