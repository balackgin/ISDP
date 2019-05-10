<template>
  <div class="project-configure-wrap">
    <inside-head class="inside-head"
                 :options="headConfig"
                 :form="{projectId}"
                 @callback="callback"></inside-head>
    <div class="pconfigure-content scrollbar">
      <ul class="lists flex lists-body-wrap">
        <li v-for="(item,idx) of listData"
            :key="idx+''">
          <div class="list-head clearfix">
            <span class="title">{{item.name}}</span>
            <div class="float-right">
              <template v-if="item.isSave">
                <el-button key="save"
                           class="btn-save"
                           type="danger"
                           size="small"
                           round
                           plain
                           @click="handleSaveForTitle(item)">保存</el-button>
              </template>
              <template v-else>
                <el-button key="del"
                           class="btn-del"
                           type="text"
                           @click="handleDelForTitle(item)">
                  <img class="is-normal"
                       src="@ISDP/assets/images/common/common_btn_delete_n.png"
                       alt="">
                  <img class="is-hover"
                       src="@ISDP/assets/images/common/common_btn_delete_h.png"
                       alt="">
                </el-button>
              </template>
            </div>
          </div>
          <ol class="inside-lists">
            <li v-for="(childItem,childIdx) of item.list || []"
                :key="idx+'-'+childIdx"
                v-if="!childItem.isDel"
                :class="{'isInput-box': childItem.isInput,'allow-del-box': item.isSave,'not-del-icon': childItem.isMustFill}">
              <el-checkbox class="inside-checkbox"
                           :disabled="!!childItem.isMustFill"
                           v-model="childItem.checked">
                {{childItem.jobName}}
              </el-checkbox>
              <template v-if="childItem.isInput">
                <el-input class="input-box"
                          v-model.trim="childItem.val">
                </el-input>
                <el-button class="btn"
                           type="danger"
                           @click="handleSaveForInput(childItem,item)">保存</el-button>
              </template>
              <i class="icon-del"
                 @click="handleDelForIcon(childItem,item)">
                <img src="@ISDP/assets/images/menu/menu_changyong_btn_close_n.png"
                     alt="">
              </i>
            </li>
            <li class="append-box"
                @click="handleAddForIcon(item)">
              +
            </li>
          </ol>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import insideHead from '@ISDP/components/insideHead';
import headConfig from './config/head.config';
export default {
  components: {
    insideHead
  },
  data(){
    return {
      headConfig,
      listData: [],
      projectId: this.$route.query.id
    }
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    handleDelForTitle(args){
      args.isSave = true;
    },
    handleSaveForTitle(args){
      args.isSave = false;
    },
    handleAddForIcon(pOpts){
      pOpts.list.push({
        val: '',
        checked: true,
        isInput: true,
        isCustom: 1  //是自定义 0/1
      });
    },
    handleSaveForInput(args,parentObj){
      if(!args.val){
        this.$elTooltip({
          message: '请输入名称!',
          type: 'error'
        });
        return false;
      }
      const lists = parentObj.list || [],
        firstItem = lists[0] || {};
      args.isInput = false;
      args.projectModule = parentObj.key;
      args.projectModuleCN = parentObj.name;
      args.jobName = firstItem.jobName;
      args.jobDescription = firstItem.jobDescription;
      args.jobName = args.val;
    },
    handleDelForIcon(args,pOpts){
      if(+args.isMustFill){
        this.$elTooltip({
          message: '必填项不可删除!',
          type: 'error'
        });
        return false;
      }
      const {list} = pOpts;
      if(list){
        // const index = list.findIndex((item) => item === args);
        // list.splice(index,1);
        args.isDel = 1;
      }
    },
    async getProjectConfigure(){
      const {projectId} = this;
      const {data,resultCode} = await this.$store.dispatch('ISDP/project/projectConfigure/getPlanConfigure',{projectId});
      if(data && +resultCode === 200){
        this.listData = data.map((item) => {
          item.isSave = false;
          return item;
        })
      }
    },
    // inside-head
    async configureHeadDownload(){
      const {projectId} = this;
      const {data} = await this.$store.dispatch('ISDP/project/projectConfigure/downloadPlanConfigure',{
        projectId
      });
      data && this.$download(data,'项目配置模板.xlsx')
    },
    onSuccessForUpload(response){
      const {resultMessage,resultCode} = response;
      let type = 'error';
      if(+resultCode === 200){
        type = 'success';
        this.getProjectConfigure();
      }
      this.$elTooltip({
        message: resultMessage,
        type
      });
    },
    async configureHeadSubmit(){
      const {listData,projectId} = this,
        resultData = [];
      listData.forEach((item) => {
        resultData.push(...(item.list || []));
      });
      const {resultCode} = await this.$store.dispatch('ISDP/project/projectConfigure/savePlan',{
        id: projectId,
        planNoteArray: resultData
      });
      if(+resultCode === 200){
        this.getProjectConfigure();
        this.$elTooltip({
          message: '上传已成功,数据已刷新',
          type: 'success'
        });
      }
    }
  },
  created(){
    this.getProjectConfigure();
  }
}
</script>

<style lang="less" scoped>
  .project-configure-wrap {
    height: 100%;
    margin: 0 -42px;
    .inside-head {
      margin-right: 42px;
    }
    .pconfigure-content {
      position: relative;
      height: -ms-calc(100% - 28px);
      height: -webkit-calc(100% - 28px);
      height: -moz-calc(100% - 28px);
      height: calc(100% - 28px);
      width: 100%;
      padding-left: 42px;
      margin-top: 28px;
      overflow: auto;
      .lists {
        margin-left: -12px;
        & > li {
          @wid: 188px;
          flex: 1;
          width: @wid;
          flex-basis: @wid;
          max-width: @wid;
          min-width: @wid;
          margin-left: 12px;
          &:last-child {
            padding-right: 42px;
            width: @wid + 42px;
            flex-basis: @wid + 42px;
            max-width: @wid + 42px;
            min-width: @wid + 42px;
          }
          .list-head {
            height: 24px;
            margin-bottom: 34px;
            .btn-save {
              @hei: 24px;
              height: @hei;
              line-height: @hei;
              padding: 0 13px;
              border-radius: 12px;
              color: #f00000;
              border-color: #f42323;
              &,
              &:hover {
                background-color: transparent;
              }
            }
            .btn-del {
              height: auto;
              line-height: normal;
              padding: 0;
              img {
                @wid: 20px;
                width: @wid;
                display: none;
                &.is-normal {
                  display: inline-block;
                }
              }
              &:hover {
                img {
                  display: none;
                  &.is-hover {
                    display: inline-block;
                  }
                }
              }
            }
            .title {
              font-size: 16px;
              color: #333;
              font-weight: 600;
            }
          }

          .inside-lists {
            & > li {
              position: relative;
              padding: 14px 16px;
              margin-bottom: 12px;
              display: flex;
              background-color: #fff;
              .el-checkbox {
                margin-right: 0;
                display: inline-flex;
                white-space: normal;
                .el-checkbox__label,
                .el-checkbox__input {
                  line-height: 18px;
                }
              }
              &.append-box {
                padding: 5px 16px;
                display: block;
                text-align: center;
                color: #7c7c7c;
                font-size: 26px;
                font-weight: 500;
                line-height: 1;
                cursor: pointer;
                &:hover {
                  color: #f42020;
                }
              }
              .icon-del {
                position: absolute;
                right: -4px;
                top: -4px;
                @wid: 14px;
                width: @wid;
                height: @wid;
                display: none;
                cursor: pointer;
              }
              &.not-del-icon {
                .icon-del {
                  display: none !important;
                }
              }
              &.allow-del-box {
                &:hover {
                  .icon-del {
                    display: block;
                  }
                }
              }
              &.isInput-box {
                @hei: 48px;
                padding: 0 0 0 16px;
                border: 1px solid rgba(255, 89, 89, 0.66);
                .inside-checkbox {
                  margin-top: 12px;
                }
                .btn {
                  position: absolute;
                  left: 100%;
                  top: -1px;
                  bottom: -1px;
                  height: @hei;
                  line-height: @hei;
                  display: block;
                  z-index: 10;
                }
                // .icon-del {
                //   display: none !important;
                // }
                &:hover {
                  .icon-del {
                    display: none;
                  }
                }
                .input-box {
                  /deep/ input {
                    height: @hei - 2px;
                    line-height: @hei - 2px;
                    padding: 0;
                    border: 0;
                    background-color: transparent;
                  }
                }
                /deep/ .el-checkbox__input {
                  top: 5px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
