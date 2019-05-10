<template>
  <el-main class="project-detail-other-wrap">
    <div class="detail">
      <header class="detail-header">
        <el-button class="back"
                   @click="goBack">
          <i class="el-icon-back"></i> 返回项目列表
        </el-button>
        <div class="title">{{header.title}}</div>
        <div class="project-status">
          <div class="status-item"
               v-for="(item,index) of header.projectStatus"
               :key="index">
            <span>{{item.title}}</span>
            <span>{{item.content}}</span>
          </div>
        </div>
      </header>
      <model-layout :options="config"
                    class="model-laout">
        <template slot="main">
          <router-view></router-view>
        </template>
      </model-layout>
    </div>
  </el-main>
</template>
<script>
import modelLayout from '@/components/modelLayout';
export default {
  components: {
    modelLayout
  },
  data() {
    return {
      config: {
        navs: [
          {
            name: 'outsourcerProjectDetailPoint',
            text: '点位信息',
            icon: 'fa-address-card',
            route: {
              name: 'outsourcerProjectDetailPoint'
            }
          },
          {
            name: 'outsourcerProjectDetailTask',
            text: '任务',
            icon: 'fa-certificate',
            route: {
              name: 'outsourcerProjectDetailTask'
            }
          },
          {
            name: 'outsourcerProjectDetailDaily',
            text: '日报',
            icon: 'fa-certificate',
            route: {
              name: 'outsourcerProjectDetailDaily'
            }
          }
        ]
      },
      header: {
        title: '南宁市江南分局微卡口系统（一期）',
        projectStatus: [
          {
            title: '项目类型',
            content: '天网'
          },
          {
            title: '项目状态',
            content: '施工中'
          },
          {
            title: '项目经理',
            content: 'XXX'
          },
          {
            title: '项目施工进度',
            content: '25%'
          }
        ]
      }
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
  .detail-header {
    display: flex;
    height: 78px;
    justify-content: flex-start;
    padding: 20px;
    .back {
      width: 150px;
      margin: 0 25px 0 5px;
      border: 1px solid transparent;
      background: transparent;
      &:hover {
        border: 1px solid transparent;
        background: transparent;
      }
    }
    .title {
      display: block;
      float: left;
      line-height: 38px;
      margin: 0 50px 0 15px;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }
    .project-status {
      display: flex;
      justify-content: flex-start;
      .status-item {
        padding: 0 15px;
        span {
          display: block;
          &:first-child {
            height: 12px;
            font-size: 12px;
            font-style: normal;
            margin: 0 0 8px 0;
            color: #999;
          }
          &:last-child {
            height: 14px;
            font-size: 14px;
            font-weight: 700;
            color: #fff;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .project-detail-other-wrap {
    padding: 0;
    background: #0a0a0a url(../../../assets/images/bk.png) top left no-repeat;
    .model-laout {
      .layout-aside {
        width: 170px !important;
        flex-basis: 170px !important;
        a {
          color: #fff !important;
        }
      }
    }
  }
</style>
