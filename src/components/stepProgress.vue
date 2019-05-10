<template>
  <div class="step-progress model-detail-head flex">
    <div class="steps">
      <div v-for="(step, index) of options.progressItems"
           class="step-item"
           :key="index">
        <div :class="['step-content', !item.complete ? 'disabled' : '', item.level === 2 || item.level === 3 ? 'hanben': '']"
             v-for="(item, idx) of step.steps"
             :key="idx">
          <a v-if="item.complete"
             :href="item.link">{{item.title}}</a>
          <span v-else
                class="gray">{{item.title}}</span>
          <!--  -->
          <el-popover :disabled="!item.complete"
                      trigger="hover">
            <a :href="list.link"
               v-for="(list, listIndex) of item.hoverList"
               :key="listIndex">{{list.txt}}</a>
            <div class="pos"
                 slot="reference">
              <a type="button"
                 class="circle"
                 href="#"
                 :disabled="!item.complete">
                <i class="point"
                   v-if="item.status === 'op' || item.status === 'end'"></i>
                <i v-else
                   class="el-icon-caret-right"></i>
              </a>
              <!--  -->
              <i class="line op"
                 v-if="item.status === 'op'"></i>
              <i class="line normal"
                 v-else-if="item.status === 'normal' && item.level === 1"></i>
              <i class="line normal split"
                 v-else-if="item.status === 'normal' && item.level === 2"></i>
              <i class="line end"
                 v-else-if="item.status === 'end'"></i>
              <!-- 添加遮挡蒙层 -->
              <i class="line mask"
                 v-if="item.status === 'normal' && item.level === 2"></i>
            </div>
          </el-popover>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'stepProgress',
  data() {
    return {};
  },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  }
}
</script>
<style lang="less">
  .step-progress {
    min-height: auto !important;
    margin-bottom: 25px !important;
    .steps {
      display: flex;
      width: 100%;
      justify-content: center;
      height: 120px;
      background-color: #fff;
      .step-item {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        .step-content {
          width: 100%;
          margin: 0 auto;
          text-align: center;
          height: 50%;
          &.hanben {
            overflow: hidden;
          }
          &.disabled {
            > a {
              color: #ccc;
            }
            > .gray {
              color: #ccc;
            }
            .pos {
              .line {
                border-color: #ccc;
                &.normal.split {
                  border: 4px dashed #ccc !important;
                }
              }
              .circle {
                border-color: #ccc;
                background-color: #eee;
                .el-icon-caret-right {
                  color: #ccc;
                }
                .point {
                  background-color: #ccc;
                }
              }
            }
          }
          > a {
            position: relative;
            z-index: 6;
            color: red;
          }
          > .gray {
            position: relative;
            z-index: 6;
            color: red;
          }
          .pos {
            position: relative;
            width: 100%;
            .line {
              position: absolute;
              z-index: 2;
              top: 50%;
              right: 0;
              margin-top: -2px;
              width: 100%;
              height: 0px;
              border: 2px solid red;
              &.op {
                width: 50%;
              }
              &.normal.split {
                height: 50px;
                top: -100%;
                border: 4px solid red;
                border-radius: 25px;
                border-top: 0;
              }

              &.mask {
                height: 50%;
                top: -75%;
                position: absolute;
                z-index: 5;
                background-color: #fff;
                border: none;
              }

              &.end {
                left: 0;
                right: auto;
                width: 50%;
              }
            }
            .circle {
              position: relative;
              z-index: 6;
              display: block;
              height: 30px;
              width: 30px;
              line-height: 30px;
              margin: 0 auto;
              border-radius: 50%;
              border: 2px solid red;
              background-color: #fff;
              .el-icon-caret-right {
                font-size: 16px;
                color: red;
              }
              .point {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                height: 8px;
                width: 8px;
                margin: auto;
                border-radius: 50%;
                background-color: red;
              }
            }
          }
          &:nth-child(2) {
            .pos {
              .line {
                &.normal.split {
                  height: 50px;
                  top: -100%;
                  border: 4px solid red;
                  border-radius: 25px;
                  border-top: 0;
                }
              }
            }
          }
          &:nth-child(1) {
            .pos {
              .line {
                &.normal.split {
                  height: 50px;
                  top: 50%;
                  border: 4px solid red;
                  border-radius: 25px;
                  border-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
