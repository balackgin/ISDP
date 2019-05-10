<template>
  <div class="inline-text"
       :class="{'text-left': dataOpts.type === 'fold'}">
    <i class="text-danger"
       @click="handleClickForFold(data,options)"
       v-if="dataOpts.hasStarIcon">* </i>
    <span :class="data && data.class && data.class[options.prop] || ''">{{ data[options.prop] }}</span>
  </div>
</template>
<script>
export default {
  computed: {
    dataOpts(){
      return this.data.dataOpts || {};
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    handleClickForFold(...args){
      this.callback('handleClickForFold',...args);
    }
  },
  props: {
    options: {
      type: [ Object ],
      required: true
    },
    data: {
      type: [ Object,Array ],
      required: true
    }
  }
}
</script>
