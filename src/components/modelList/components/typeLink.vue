<template>
  <a :target="columnOpts.target"
     :href="data[columnOpts.href || options.prop + 'Href']"
     class="link"
     @click="callback('handleClickForTypeLink',data,options)">
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
  methods: {
    callback(...args){
      this.$callback(...args);
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
