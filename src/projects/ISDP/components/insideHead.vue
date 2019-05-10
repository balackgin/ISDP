<template>
  <div class="model-head-wrap clearfix mb-1">
    <span class="title">{{options.title}}</span>
    <div class="btns float-right">
      <slot name="tooltip"></slot>
      <template v-for="(btnItem,btnIdx) of options.btns || []">
        <template v-if="btnItem.type === 'dropdown'">
          <div class="dropdown-box"
               :key="btnIdx+''">
            <el-button class="dropdown-btn"
                       size="small"
                       type="danger">
              {{btnItem.text}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <div class="dropdown-menu-wrap">
              <ul class="lists">
                <li v-for="(dropItem,dropIdx) of btnItem.menu"
                    :key="dropIdx+''"
                    @click="dropdownItemCallback(dropItem)">
                  <!-- <template v-if="dropItem.type === 'upload'">
                    <model-upload
                      :options="dropItem"
                      :form="form"
                      :type="dropItem.uploadType || 1"
                      @callback="callback"
                    ></model-upload>
                  </template>
                  <template v-else>
                    <span class="drop-link">{{dropItem.text}}</span>
                  </template> -->
                  <span class="drop-link">{{dropItem.text}}</span>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template v-else-if="btnItem.type === 'iconAdd'">
          <el-button class="iconAdd"
                     type="text"
                     :key="btnIdx+''"
                     icon="el-icon-plus"
                     @click="callback(btnItem.fnName)">{{btnItem.text}}</el-button>
        </template>
        <template v-else>
          <el-button class="btn"
                     size="small"
                     type="danger"
                     :key="btnIdx+''"
                     @click="callback(btnItem.fnName,btnItem)">{{btnItem.text}}</el-button>
        </template>
      </template>
    </div>

    <inside-dialog :show="uploadShow"
                   :options="{title: '提示'}">
      <div class="tooltip-text"
           slot="content">
        <img class="tooltip-img"
             src="@ISDP/assets/images/common/common_dialog_icon_tips.png"
             alt="">
        该操作会覆盖原有内容，是否覆盖?</div>
      <div slot="footer">
        <el-button plain
                   type="danger"
                   size="small"
                   @click="uploadDialogForCancel">取消</el-button>
        <el-button type="danger"
                   size="small"
                   @click="uploadDialogForConfirm">
          确认
        </el-button>
      </div>
    </inside-dialog>
    <model-upload v-show="false"
                  :id="uploadID"
                  :options="Object.assign({},uploadOpts,{text: ' '})"
                  :form="form"
                  :type="uploadOpts.uploadType || 1"
                  @callback="callback"></model-upload>
  </div>
</template>
<script>
import modelUpload from '@/components/modelFormGroup/components/upload';
import insideDialog from './insideDialog';
export default {
  components: {
    modelUpload,
    insideDialog
  },
  data(){
    return {
      uploadOpts: {},
      uploadShow: false,
      uploadID: 'upload' + Date.now()
    }
  },
  methods: {
    callback(...args) {
      this.$callback(...args);
    },
    dropdownItemCallback(opts){
      this.callback(opts.fnName,opts);
      if(opts.type === 'upload' ){
        this.uploadOpts = opts;
        this.uploadShow = true;
      }
    },
    uploadDialogForCancel(){
      this.uploadShow = false;
    },
    uploadDialogForConfirm(){
      const ele = document.querySelector(`#${ this.uploadID } .el-upload__input`);
      ele && ele.click();
      this.uploadShow = false;
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};

// {
//   "title": "",
//   "btns": [
//     {
//       "text": "线下编辑",
//       "type": "dropdown",
//       "menu": [
//         {
//           "text": "下载模板",
//           "fnName": "download"
//         },
//         {
//           "text": "导入模板",
//           "fnName": "exportModel"
//         }
//       ]
//     },
//     {
//       "text": "编辑",
//       "fnName": "edit"
//     }
//   ]
// }
</script>

<style lang="less" scoped>
  .model-head-wrap {
    .title {
      margin-top: 6px;
      display: inline-block;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    .btns {
      .btn {
        margin-left: 14px;
      }
      .el-icon-plus {
        font-size: 18px;
        cursor: pointer;
      }
      .dropdown-box {
        position: relative;
        display: inline-block;
        .el-icon-caret-bottom {
          position: relative;
          transition: all 0.3s ease-out;
        }
        .dropdown-menu-wrap {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          width: 100%;
          display: none;
          z-index: 100;
          background-color: #fff;
          .lists {
            & > li {
              border-radius: 1px;
              font-size: 14px;
              color: #4d4f53;
              background-color: #fff;

              cursor: pointer;
              &:hover,
              &:active {
                position: relative;
                box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.4);
                color: #f00000;
                z-index: 1;
              }
              &:active {
                box-shadow: 0px 0px 8px 0px rgba(216, 213, 213, 0.4);
              }
              .drop-link {
                padding: 8px 14px 8px 20px;
                display: block;
              }
            }
          }
        }
        &:hover {
          .dropdown-menu-wrap {
            display: block;
          }
          .el-icon-caret-bottom {
            transform: rotate(180deg);
          }
        }
      }
      .iconAdd {
        margin-top: 4px;
        color: #777a80;
        font-size: 14px;
      }
    }
  }
</style>
<style lang="less">
  .model-head-wrap {
    .btns {
      .iconAdd {
        .el-icon-plus {
          color: #7c7c7c;
          font-weight: 600;
        }
      }
    }
    .dropdown-menu-wrap {
      .lists {
        & > li {
          .model-upload-wrap {
            // padding: 8px 14px 8px 20px;
            .el-upload {
              padding: 8px 14px 8px 20px;
              display: block;
              text-align: left;
            }
          }
        }
      }
    }
  }
</style>
