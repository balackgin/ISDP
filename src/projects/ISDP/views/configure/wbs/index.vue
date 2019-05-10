<template>
  <div class="wbsWrap">
    <div class="wbsWrap_left">
      <p class="wbsWrap_left_title">子任务</p>
      <div class="wbsWrap_left_nav scrollbar">
        <el-menu
          class="el-menu-vertical-demo"
          :unique-opened="true"
          :default-openeds="defaultOpeneds"
          :default-active="defaultActive.toString()"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu
            :index="groupItem.key"
            v-for="groupItem of projectNavJson"
            :disabled="groupItem.list && groupItem.list.length<1"
            :key="groupItem.key"
          >
            <template slot="title">
              <span class="arrowIcon" v-if="!groupItem.isSetected">+</span>
              <span class="arrowIcon" v-if="groupItem.isSetected">-</span>
              <span>{{groupItem.name}}</span>
            </template>
            <el-menu-item-group v-for="item of groupItem.list" :key="item.id.toString()">
              <el-menu-item :index="item.id.toString()" @click="getDetailJobTemplate(item)">
                <span v-if="item.jobName.length<16">{{item.jobName}}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="item.jobName.length>15"
                  :content="item.jobName"
                  placement="top-start"
                >
                  <span>{{item.jobName}}</span>
                </el-tooltip>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="wbsWrap_right">
      <p class="wbsWrap_right_title">
        任务详情
        <span
          class="commonBtn commonConfirmBtn releaseBtn"
          @click="releaseBtn2"
          v-if="this.selectedItem.id && permissionBtns.includes('发布')"
        >发布</span>
      </p>
      <div class="wbsWrap_right_details">
        <p class="wbsWrap_right_details_name">子任务：{{detailJobTemplate.jobName}}</p>
        <div class="wbsWrap_right_details_item">
          <span class="wbsWrap_right_details_item_label">编号：&nbsp;&nbsp;</span>
          <span class="wbsWrap_right_details_item_number">{{detailJobTemplate.jobNo}}</span>
          <span class="wbsWrap_right_details_item_label">负责部门：&nbsp;&nbsp;</span>
          <span
            class="wbsWrap_right_details_item_number"
            style="margin-right:0;"
          >{{detailJobTemplate.dutyModuleCN}}</span>
        </div>
        <div class="wbsWrap_right_details_describe">
          <span class="wbsWrap_right_details_describe_label">子任务描述：&nbsp;&nbsp;</span>
          <span class="wbsWrap_right_details_describe_info">{{detailJobTemplate.jobDescription}}</span>
        </div>
      </div>
      <p class="wbsWrap_right_title" style="margin-top:25px;margin-bottom:20px;">
        交付件上传
        <span class="addBtn" @click="addAttachmentBtn">
          <label class="addImg">+</label>
          添加
        </span>
      </p>
      <div class="wbsWrap_right_table">
        <el-table
          highlight-current-row
          :height="windowHeight"
          :row-class-name="tableRowClassName"
          :data="detailJobTemplate.deliverableTemplateDTOList"
          style="width: 100%"
        >
          <el-table-column label="交付件名称" min-width="300">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否必选" prop="isMustFill" width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{attachmentStatus[scope.row.isMustFill]}}</span>
              <el-select v-if="scope.row.isEdit" v-model="scope.row.isMustFill" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="是否按模板反馈" prop="feedbackByTemplate" width="140">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{attachmentStatus[scope.row.feedbackByTemplate]}}</span>
              <el-select
                v-model="scope.row.feedbackByTemplate"
                v-if="scope.row.isEdit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="上传状态" prop="upStatus" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.fileId">已上传</span>
              <span v-if="!scope.row.fileId">未上传</span>
            </template>
          </el-table-column>
          <el-table-column width="140" label="附件">
            <template slot-scope="scope">
              <attachment-upload
                class="attachmentUpBtn attachment"
                :dataItem="scope.row"
                v-if="!scope.row.fileId&&!scope.row.isEdit"
                :saveDeliverableTemplate="saveDeliverableTemplate"
              ></attachment-upload>
              <span
                class="attachment"
                v-if="scope.row.fileId&&!scope.row.isEdit"
                @click="downloadFile(scope.row)"
              >查看</span>
              <span
                class="attachment"
                v-if="scope.row.fileId&&!scope.row.isEdit"
                @click="deleteAttachmentBtn(scope.row)"
              >撤回</span>
            </template>
          </el-table-column>
          <el-table-column width="140" label="操作">
            <template slot-scope="scope">
              <span class="attachment" v-if="!scope.row.isEdit" @click="editBtn(scope.row)">编辑</span>
              <span class="attachment" v-if="!scope.row.isEdit" @click="deleteBtn(scope.row)">删除</span>
              <span
                class="attachment"
                v-if="scope.row.isEdit"
                @click="saveDeliverableTemplate(scope.row)"
              >保存</span>
              <span class="attachment" v-if="scope.row.isEdit" @click="cancleBtn(scope.row)">取消</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <add-attachment
        :selectedItem="selectedItem"
        :getDetailJobTemplate="getDetailJobTemplate"
        :detailJobTemplate="detailJobTemplate"
        v-if="addVisible"
        :addVisible.sync="addVisible"
      ></add-attachment>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url('./style.less');
</style>
<style lang='less'>
//公用弹窗底部按钮
.commonDialog /deep/ .el-dialog__footer {
  padding: 10px 14px 10px 0 !important;
}
.el-textarea__inner:focus {
  border-color: #f00000 !important;
}
.el-input__inner:focus {
  border-color: #f00000 !important;
}
.el-date-table td.available:hover {
  color: #ff3535;
}
//单选框公用样式
.el-radio {
  margin-right: 56px !important;
}
.el-radio /deep/ .el-radio__inner {
  border: 2px solid #7c7c7c;
}
.el-radio /deep/ .el-radio__input.is-checked .el-radio__inner {
  background: #ffffff;
  border-color: red;
}
.el-radio /deep/ .el-radio__input.is-checked .el-radio__inner::after {
  content: '';
  display: block;
  background-color: red;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.el-radio /deep/ .el-radio__label {
  color: #333333 !important;
  font-size: 14px;
}
//el-input样式
.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #f00000 !important;
}
.el-select-dropdown__item.selected {
  color: #f00000;
}
.el-select .el-input__icon {
  line-height: 30px;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #f00000;
}
.el-select .el-input__inner:focus {
  border-color: #f00000;
}
.el-input .el-input__inner {
  height: 30px;
}
</style>


<script>
import addAttachment from './components/addAttachment';
import attachmentUpload from './components/attachmentUpload';
import { mapState } from 'vuex';
import tipImgPath from '@ISDP/assets/images/common/common_dialog_icon_tips.png';
export default {
  components: {
    addAttachment,
    attachmentUpload
  },
  data() {
    return {
      progressIconfont: '+',
      dataItem: {},
      windowHeight: window.innerHeight - 392,
      attachmentStatus: {
        1: '是',
        0: '否'
      },
      defaultOpeneds: [],
      defaultActive: '',
      addVisible: false,
      value: '',
      selectedItem: {},
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      projectNavJson: [],
      detailJobTemplate: {}, //模板详情
      activeName: '1'
    };
  },
  computed: {
    ...mapState({
      permissionBtns(state) {
        const menuData = state.ISDP.common.currentMenu || {};
        return menuData.btns || [];
      }
    })
  },
  created() {
    this.getProjectGroupList();
  },
  methods: {
    //处理数据
    dealData(dataArr, flag, key) {
      let findIndex = dataArr.findIndex((item) => item.key == key);
      for (let item of dataArr) {
        item.isSetected = false;
      }
      if (findIndex != -1) {
        this.$set(dataArr[findIndex], 'isSetected', flag);
      }
      this.projectNavJson = dataArr.toJson();
    },
    handleOpen(key, keyPath) {
      this.dealData(this.projectNavJson, true, key);
    },
    handleClose(key, keyPath) {
      this.dealData(this.projectNavJson, false, key);
    },
    //获取WBS配置计划模板列表
    async getProjectGroupList() {
      const { data, resultCode = '' } = await this.$store.dispatch(
        'ISDP/configure/getProjectGroupList',
        {}
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.projectNavJson = data;
        for (let item of this.projectNavJson) {
          item.isSetected = false;
        }
        this.defaultOpeneds.push(this.projectNavJson[0].key);
        this.defaultActive = this.projectNavJson[0].list[0].id;
        this.getDetailJobTemplate(this.projectNavJson[0].list[0]);
        this.projectNavJson[0].isSetected = true;
      }
    },
    //撤回附件
    async deleteAttachment(item) {
      const { resultMessage, resultCode = '' } = await this.$store.dispatch(
        'ISDP/configure/deleteAttachment',
        {
          id: item.id
        }
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getDetailJobTemplate(this.selectedItem);
      }
    },
    deleteAttachmentBtn(item) {
      this.$confirm(
        '<p class="tips"><img class="tipsIcon" src=' +
          tipImgPath +
          '>是否确认撤回？</p><p class="tipInfo">撤回后将无法恢复，需要重新上传！</p>',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          cancelButtonClass: 'cancelButtonClass',
          confirmButtonClass: 'confirmButtonClass',
          customClass: 'confirmDialog',
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.deleteAttachment(item);
        })
        .catch(() => {
          this.$elTooltip({
            type: 'error',
            message: '已取消'
          });
        });
    },
    // 下载附件
    async downloadFile(row) {
      const { fileId } = row;
      const { data } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/downloadTemplate',
        {
          fileId
        }
      );
      const { originFileName, docUrl } = data;

      const { data: result } = await this.$store.dispatch('common/download', {
        url: docUrl
      });
      this.$download(result, originFileName);
    },
    //模板详情
    async getDetailJobTemplate(item) {
      this.selectedItem = item;
      const { data, resultCode = '' } = await this.$store.dispatch(
        'ISDP/configure/getDetailJobTemplate',
        {
          id: item.id
        }
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.detailJobTemplate = data;
        for (let listItem of this.detailJobTemplate
          .deliverableTemplateDTOList) {
          listItem.isEdit = false;
        }
      }
    },
    //设置表格样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'warning-row';
      }
      return '';
    },
    //删除记录
    async deleteDeliverableTemplate(item) {
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch(
        'ISDP/configure/deleteDeliverableTemplate',
        {
          id: item.id
        }
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getDetailJobTemplate(this.selectedItem);
      }
    },
    deleteBtn(item) {
      this.$confirm(
        '<p class="tips"><img class="tipsIcon" src=' +
          tipImgPath +
          '>是否确认删除？</p><p class="tipInfo">删除后该条记录将无法恢复！</p>',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          cancelButtonClass: 'cancelButtonClass',
          confirmButtonClass: 'confirmButtonClass',
          customClass: 'confirmDialog',
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.deleteDeliverableTemplate(item);
        })
        .catch(() => {
          this.$elTooltip({
            type: 'error',
            message: '已取消删除'
          });
        });
    },
    //修改记录
    editBtn(item) {
      for (let listItem of this.detailJobTemplate.deliverableTemplateDTOList) {
        listItem.isEdit = false;
      }
      item.isEdit = true;
      this.detailJobTemplate = this.detailJobTemplate.toJson();
    },
    //取消
    cancleBtn(item) {
      item.isEdit = false;
    },
    //保存修改
    async saveDeliverableTemplate(item) {
      const addAttachmentdata = {
        name: item.name,
        isMustFill: item.isMustFill,
        feedbackByTemplate: item.feedbackByTemplate,
        id: item.id,
        wbsItemTemplateCode: this.detailJobTemplate.jobNo,
        fileId: item.fileId,
        fileName: item.fileName
      };
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch(
        'ISDP/configure/saveDeliverableTemplate',
        addAttachmentdata
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getDetailJobTemplate(this.selectedItem);
        this.$emit('update:addVisible', false);
      }
    },
    //发布
    releaseBtn2() {
      this.$confirm(
        '<p class="tips"><img class="tipsIcon" src=' +
          tipImgPath +
          '>是否确认发布？</p><p class="tipInfo"></p>',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          cancelButtonClass: 'cancelButtonClass',
          confirmButtonClass: 'confirmButtonClass',
          customClass: 'confirmDialog',
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.releaseBtn();
        })
        .catch(() => {
          this.$elTooltip({
            type: 'error',
            message: '已取消发布'
          });
        });
    },
    async releaseBtn() {
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch('ISDP/configure/issueJobTemplate', {
        id: this.selectedItem.id,
        issue: 1
      });
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$message({
          type: 'success',
          message: resultMessage
        });
        this.getDetailJobTemplate(this.selectedItem);
      }
    },
    //添加
    addAttachmentBtn() {
      this.addVisible = true;
    }
  }
};
</script>
