<template>
  <model-table :options="config.tableConfig"
               @callback="handleCallback"
               :fns="fns"
               :data="data"></model-table>
</template>

<script>
import modelTable from '@/components/modelList/modelTable';
export default {
  components: {
    modelTable
  },
  data() {
    return {
      sessionRow: [],
      fns: {
        rowClassName: (row) => {
          if (row.parentId && this.sessionRow.includes(row.parentId)) {
            return 'hide-row';
          } else {
            return 'show-row';
          }
        }
      }
    };
  },
  methods: {
    handleClickForFold(row) {
      row._active = !row._active;
      let idx = this.sessionRow.findIndex((item) => item === row.childrenId);
      if (idx < 0) {
        this.sessionRow.push(row.childrenId);
      } else {
        this.sessionRow.splice(idx, 1);
      }
    },
    handleCallback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    }
  },
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    data: {
      type: 'array',
      default() {
        return [];
      }
    }
  }
};
</script>
