<template>
  <span>
    {{value}}
  </span>
</template>
<script>
export default {
  computed: {
    value(){
      const  {options,data} = this,
        { columnOpts = {} } = options,
        {obj} = columnOpts;
      return obj ? obj[data[options.prop]] : '';
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
