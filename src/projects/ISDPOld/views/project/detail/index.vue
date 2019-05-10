<template>
  <div class="project-detail-wrap">
    <model-detail-head :options="headConfig"
                       :form="form"
                       :remoteData="remoteData"
                       @callback="callback"></model-detail-head>

    <model-layout :options="layoutOptions"
                  class="mt-0">
      <template slot="main">
        <!-- <step-progress :options="config"></step-progress> -->
        <router-view></router-view>
      </template>
    </model-layout>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import routeConfig from '@/route/config/oldISDP.config';
import modelLayout from '@/components/modelLayout';
import modelDetailHead from '@/components/modelDetail/modelHead';
import stepProgress from '@/components/stepProgress';
import config from './config/step.data.json';
const STATE_MAP = [ '项目启动', '方案设计', '项目实施', '项目收尾' ];
const STATUS_MAP = {
  NORMAL: '正常',
  DELAY: '延期'
}
export default {
  components: {
    stepProgress,
    modelLayout,
    modelDetailHead
  },

  computed: {
    ...mapState({
      projectManager: (state) => state.ISDPOld.project.projectManager,
      projectManagerSuperior: (state) => state.ISDPOld.project.projectManagerSuperior,
      detailData(state) {
        const detail = state.ISDPOld.project.detailData || {};
        const { data = {} } = detail;
        if(data) {
          this.headConfig.select.push({
            label: data.contractName,
            value: data.id
          });
          this.headConfig.value = data.contractName;
          this.form.contractName = data.id;
          this.form.id = data.id;
        }
        return detail;
      },
      layoutOptions(state){
        let {usertype = []} = state.common.userinfo || {},
          detailData = this.detailData,
          resultDetailData = detailData.data || {},
          obj = JSON.parse(JSON.stringify(this.layoutConfig));
        this.headConfig.list = [
          {
            title: '交付等级',
            text: resultDetailData.projectLevel
          },
          {
            title: '交付阶段',
            text: STATE_MAP[resultDetailData.projectPhase]
          },
          {
            title: '交付状态',
            text: STATUS_MAP[resultDetailData.projectStatus] || ''
          },
          {
            title: '项目进度',
            text: (resultDetailData.projectProgress || 0) + '%'
          }
        ];
        if(!usertype.includes('employee')) {
          let arr = [];
          obj.navs.forEach((item) =>{
            switch (item.name) {
            case routeConfig.ProjectManage:
              return;
            case routeConfig.ProjectPlan:
              return;
            case routeConfig.ProjectContract:
              return;
            }
            arr.push(item);
          });
          obj.navs = arr;
          return obj;
        }
        if(resultDetailData.projectModel === 'SMALL' || +resultDetailData.isConfirmProjectModel !== 2 || (!this.projectManager && !this.projectManagerSuperior)){
          let index = obj.navs.findIndex((item) => item.name === routeConfig.projectManage);
          obj.navs.splice(index,1);
        }
        return obj;
      }
    })
  },
  data() {
    const { query,name } = this.$route,
      toQuery = {
        id: query.id
      };
    let routeName = name.includes('Project') ? 'project' : 'colony',
      listName = name.includes('Project') ? routeConfig.projectList : routeConfig.colonyList;

    return {
      config, // 项目进程
      remoteData: {},
      form: {
        val: ''
      },
      headConfig: {
        name: 'project-detail',
        route: {
          name: listName,
          params: {
            type: 'back'
          }
        },
        linkName: '返回项目列表',
        type: 'select',
        prop: 'contractName',
        select: [],
        list: []
      },
      layoutConfig: {
        navs: [
          {
            name: `${ routeConfig[routeName + 'Survey'] }`,
            text: '概况',
            icon: 'fa-eye',
            route: {
              name: `${ routeConfig[routeName + 'Survey'] }`,
              query: toQuery
            }
          },
          {
            name: `${ routeConfig[routeName + 'Whole'] }`,
            text: '整体',
            icon: 'fa-folder',
            route: {
              name: `${ routeConfig[routeName + 'Whole'] }`,
              query: toQuery
            }
          },
          {
            name: `${ routeConfig[routeName + 'Contract'] }`,
            text: '合同',
            icon: 'fa-file-invoice',
            route: {
              name: `${ routeConfig[routeName + 'Contract'] }`,
              query: toQuery
            }
          },
          {
            name: `${ routeConfig[routeName + 'Team'] }`,
            text: '团队',
            icon: 'fa-users',
            route: {
              name: `${ routeConfig[routeName + 'Team'] }`,
              query: toQuery
            }
          },
          {
            name: `${ routeConfig[routeName + 'Plan'] }`,
            text: '计划实施',
            icon: 'fa-project-diagram',
            route: {
              name: `${ routeConfig[routeName + 'Plan'] }`,
              query: toQuery
            }
          },
          {
            name: `${ routeConfig[routeName + 'Manage'] }`,
            text: '设置',
            icon: 'fa-folder',
            route: {
              name: `${ routeConfig[routeName + 'Manage'] }`,
              query: toQuery
            }
          }
        ]
      }
    };
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    changeForSearch(data) {
      this.getList(data)
    },
    async getList(value) {

      let { data } = await this.$store.dispatch(
        'ISDPOld/project/getProjectList',{
          pageCount: 10,
          pageNum: 1,
          obj: {
            contractName: value
          }
        }
      );
      if (data && data.content) {
        let arr = [];
        data.content.forEach((item) => {
          arr.push({
            id: item.id,
            label: item.contractName,
            disabled: true,
            value: item.id
          })
        })
        this.remoteData = Object.assign({}, this.remoteData, { contractName: arr});
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .project-detail-wrap {
    .mt-0 {
      margin-top: 0;
    }
  }
</style>

<style lang="less">
  .project-detail-wrap {
    .detail-title-wrap {
      position: relative;
      .txt {
        position: relative;
        padding-right: 16px;
        z-index: 1;
        font-size: 16px;
        color: #333;
        font-weight: 700;
        background-color: #fff;
      }
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        width: 100%;
        height: 1px;
        display: block;
        background-color: #ddd;
      }
      .txt-more {
        position: relative;
        padding: 0 6px;
        float: right;
        z-index: 1;
        background-color: #fff;
        text-align: center;
        &:hover {
          color: red;
          text-decoration: underline;
        }
      }
    }
  }
</style>
