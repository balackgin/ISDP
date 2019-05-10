<template>
  <div class="table-column-type-html"
       v-html="data[options.prop]"></div>
</template>
<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    },
    data: {
      type: [ Object,Array ],
      required: true
    },
    remoteData: {
      type: Object,
      default(){
        return {}
      }
    }
  }
}
</script>
