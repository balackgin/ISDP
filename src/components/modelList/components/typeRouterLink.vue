<template>
  <router-link :to="nextRouteName"
               :target="columnOpts.target"
               class="router-link link">
    {{data[options.prop]}}
  </router-link>
</template>
<script>
export default {
  computed: {
    columnOpts(){
      return this.options.columnOpts || {};
    },
    nextRouteName(){
      const {options,data = {},remoteData = {}} = this,
        {columnOpts = {},prop} = options,
        {name,query} = columnOpts;
      if(name){
        const queryObj = {};
        Object.keys(query).forEach((item) => {
          const key = query[item],
            val = data[key];
          queryObj[item] = val || key;
        });
        return {
          name,
          query: queryObj
        }
      }
      const remoteRoute = remoteData[prop + 'Route'];
      return typeof remoteRoute === 'function' ? remoteRoute(options,data) || '#' : remoteRoute || '#';
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
