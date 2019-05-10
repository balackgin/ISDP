<template>
  <model-layout :options="layoutConfig">
    <template slot="main">
      <div class="project-list">
        <model-list :options="listConfig"
                    :data="[]"
                    @callback="callback"></model-list>
      </div>
    </template>
  </model-layout>
</template>
<script>
import modelLayout from '@/components/modelLayout';
import modelList from '@/components/modelList';
import listConfig from './config/list.config';
export default {
  components: {
    modelLayout,
    modelList
  },
  data() {
    return {
      layoutConfig: {
        navs: [
          {
            name: 'outsourcerProjectList',
            text: '项目列表',
            icon: 'fa-project-diagram',
            route: {
              name: 'outsourcerProjectList'
            }
          }
        ]
      },
      listConfig,
      data: []
    };
  },
  async mounted() {
    this.getList({
      porject: {
        contractName: '',
        projectStatus: '',
        projectLevel: '',
        projectManagerNo: ''
      },
      pageCount: 20,
      pageNum: 1
    });
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForSubmit(opts, args) {
      // const { name, data, status } = args;
      // if (opts === 'search') {
      // }
    },
    async getList(args) {
      const { data } = await this.$store.dispatch('outsourcer/project/list', args);
      this.data = data;
    }
  }
};
</script>
