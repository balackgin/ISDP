<template>
  <div class="test-tree-wrap">
    <section class="flex tree-section"
             v-for="(item,idx) of config"
             :key="idx+''">
      <tree-box :options="item"
                :index="idx"></tree-box>
    </section>
    <!-- <section class="flex tree-section">
      <div class="tree-box">
        <div class="box">PM</div>
        <section class="flex tree-section">
          <div class="tree-box">
            <div class="box">PM</div>
            <section class="flex tree-section">
              <div class="tree-box">
                <div class="box">PM</div>
              </div>
              <div class="tree-box">
                <div class="box">PM</div>
              </div>
              <div class="tree-box">
                <div class="box">PM</div>
              </div>
            </section>
          </div>
          <div class="tree-box">
            <div class="box">PM</div>
            <section class="flex tree-section">
              <div class="tree-box">
                <div class="box">PM</div>
              </div>
              <div class="tree-box">
                <div class="box">PM</div>
              </div>
            </section>
          </div>
          <div class="tree-box">
            <div class="box">PM</div>
            <section class="flex tree-section">
              <div class="tree-box">
                <div class="box">PM</div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </section> -->
    <model-echart :options="echartOpts"></model-echart>
  </div>
</template>
<script>
import modelEchart from '@/components/modelEchart';
import config from './config/tree.config.json';
import treeBox from './components/treeBox';
import echartOpts from './config/echart.config';
export default {
  name: 'tree-item',
  components: {
    treeBox,
    modelEchart
  },
  data(){
    return {
      config,
      first: [],
      second: [],
      echartOpts
    }
  }
}
</script>

<style lang="less">
  @disHei: 10px;
  .test-tree-wrap {
    .tree-section {
      padding-top: @disHei;
      justify-content: center;
      .tree-box {
        position: relative;
        padding: 0 10px;
        width: 100%;
        z-index: 1;
        &.first-box {
          &::before,
          &::after {
            content: none;
          }
        }
        &::after,
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          top: -@disHei - 4px;
          width: 50%;
          height: @disHei;
          @borderLine: 4px solid red;
          border-top: @borderLine;
          border-left: @borderLine;
        }
        &::before {
          border-left-color: transparent;
          left: 0;
        }
        &:first-child {
          &::before {
            content: none;
          }
        }
        &:last-child {
          &::after {
            border-top-color: transparent;
          }
        }
        // & ~ .tree-box {
        //   margin-left: 20px;
        // }
        .box {
          position: relative;
          z-index: 1;
          width: 100px;
          height: 50px;
          margin: 0 auto 20px;
          background-color: #ddd;
          &.last-level {
            &::after {
              content: none;
            }
          }
          &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            width: 4px;
            height: 20px;
            background-color: red;
          }
        }
      }
    }
  }
</style>
