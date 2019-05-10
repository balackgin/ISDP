<template>
  <div class="model-list">
    <template v-if="options.search">
      <model-search :options="options.search"
                    :form="searchForm"
                    :remoteData="remoteData"
                    @callback="callback"></model-search>
    </template>

    <model-table :options.sync="options.table"
                 :data="data"
                 :form="tableForm"
                 :pagination="pagination"
                 :remoteData="remoteData"
                 class="mt-1"
                 @callback="callback"></model-table>
  </div>
</template>
<script>
import modelTable from './modelTable';
import modelSearch from './modelSearch';

export default {
  name: 'modelList',
  components: {
    modelTable,
    modelSearch
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
    searchForm: {
      type: Object,
      default(){
        return {}
      }
    },
    tableForm: {
      type: Object
    },
    remoteData: {
      type: Object
    },
    pagination: {
      type: Object
    },
    data: {
      type: Array,
      required: true
    }
  }
}

/*
  //  props.options
  {
    search: {
      formItems: [{
        label: '',
        prop: '',
        type: '',
        formItemOpts: {}
      }]
    },
    table: {
      tableOpts: {},
      columns: [{
        label: '',
        prop: '',
        type: '',
        columnOpts: {}
      }]
    }
  }
*/
</script>
