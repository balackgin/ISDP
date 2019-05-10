<template>
  <div class="project-report-notice-wrap">
    <p class="notice-head clearfix">
      <span class="title">项目通知</span>
      <a href="#"
         class="link float-right">更多</a>
    </p>
    <ul class="lists">
      <li class="flex"
          v-for="item of 10"
          :key="item">
        <div class="flex-item">
          <a href="#"
             class="tip">[未读]</a>
          <a href="#"
             class="text">dsadsadsdsada</a>
        </div>
        <div class="flex-auto item-info">
          <span class="author">发布人: dsadsa</span>
          <time class="time">2019-03-16</time>
        </div>
      </li>
    </ul>
  </div>
</template>
<style lang="less" scoped>
  .project-report-notice-wrap {
    .notice-head {
      padding-right: 16px;
      .title {
        color: #333;
        font-size: 14px;
        font-weight: 600;
      }
      .link {
        color: #5f93fd;
        font-size: 14px;
        text-decoration: underline;
      }
    }
    .lists {
      margin-top: 20px;
      background-color: #fff;
      & > li {
        padding: 18px 24px;
        color: #333;
        .text,
        .tip {
          font-size: 14px;
          color: #4d4f53;
        }
        .tip {
          margin-right: 15px;
          // #f42020
        }
        &:nth-child(2n) {
          background-color: #f9f9f9;
        }
        // &:last-child {
        //   background-color: #fff;
        // }
        .item-info {
          margin-left: 16px;
          color: #4d4f53;
          font-size: 14px;
          .time {
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>
