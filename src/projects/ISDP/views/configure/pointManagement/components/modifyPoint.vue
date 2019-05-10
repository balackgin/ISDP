<template>
  <div class="addAttachmentDialog commonDialog">
    <el-dialog
      title="修改"
      :visible.sync="modifyPointVisible"
      width="40%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="addAttachmentDialog_content">
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">
            <label class="requireIcon">*</label>编号：
          </span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input disabled v-model="modifyPointParams.numb" placeholder="请输入编号"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">
            <label class="requireIcon">*</label>点位名称：
          </span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="modifyPointParams.pointPosition" placeholder="请输入点位名称"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">辖区：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="modifyPointParams.area" placeholder="请输入辖区"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">经度：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input
              v-model="modifyPointParams.coorLongitude"
              :change="longChange(modifyPointParams.coorLongitude)"
              placeholder="请输入经度"
            ></el-input>
          </div>
          <p class="errorTips" v-if="longErroeTips">经度范围应为-180~180，最多为六位小数</p>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">维度：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input
              v-model="modifyPointParams.coorLatitude"
              :change="latChange(modifyPointParams.coorLatitude)"
              placeholder="请输入维度"
            ></el-input>
          </div>
          <p class="errorTips" v-if="latErroeTips">纬度范围应为-90~90，最多为六位小数</p>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">监控方向：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input
              size="mini"
              v-model="modifyPointParams.monitorDirection"
              placeholder="请输入监控方向"
            ></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">点位属性：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="modifyPointParams.pointAttribute" placeholder="请输入点位属性"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">车道情况：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="modifyPointParams.laneCondition" placeholder="请输入车道情况"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">停止线距离：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="modifyPointParams.stoplineDistance" placeholder="请输入停止线距离"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">新建/利旧：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-select v-model="modifyPointParams.createOrUtilize" size="mini" style="width:100%;">
              <el-option
                v-for="item in oldOrNew"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span @click="handleClose" class="commonCancelBtn commonBtn">取 消</span>
        <span @click="updatePoint" class="commonConfirmBtn commonBtn">确 定</span>
      </span>
    </el-dialog>
  </div>
</template> 
<style lang="less" scoped>
.addAttachmentDialog /deep/ .el-dialog {
  width: 512px !important;
}
.addAttachmentDialog /deep/ .el-dialog__body {
  padding: 20px 0 4px 0px !important;
}
.addAttachmentDialog /deep/ .el-dialog__header {
  padding: 0 0 0 14px;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(#ffffff, #ffffff);
  background-blend-mode: normal, normal;
  box-shadow: 0px 1px 10px 0px rgba(216, 213, 213, 0.5);
  border-radius: 2px;
  height: 44px;
  line-height: 44px;
  /deep/ .el-dialog__headerbtn {
    top: 12px;
  }
  /deep/ .el-dialog__title {
    font-size: 14px;
    color: #333333;
  }
}
.addAttachmentDialog {
  .errorTips {
    color: #f00000;
    font-size: 12px;
    padding-left: 100px;
  }
  &_content {
    padding-left: 74px;
    border-bottom: 1px solid #e3e3e3;
    padding-bottom: 35px;
    &_item {
      margin-top: 15px;
      &_radioBox {
        margin-left: 36px;
      }
      &_label {
        display: inline-block;
        width: 100px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #777a80;
        .requireIcon {
          margin-right: 5px;
          color: red;
        }
      }
      &_selectBox {
        width: 250px;
        display: inline-block;
        /deep/ .el-input__icon {
          line-height: 30px;
        }
        /deep/ .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .contentIpt {
      padding-left: 10px;
      width: 250px;
      height: 30px;
      background-image: linear-gradient(#ffffff, #ffffff),
        linear-gradient(#ffffff, #ffffff);
      background-blend-mode: normal, normal;
      border-radius: 1px;
      border: solid 1px rgba(203, 203, 203, 0.66);
    }
  }
}
</style>

<script>
export default {
  props: ['modifyPointVisible', 'modifyItem', 'findByPointPositionAndArea'],
  data() {
    return {
      longErroeTips: false,
      latErroeTips: false,
      oldOrNew: [
        {
          label: '利旧',
          value: '利旧'
        },
        {
          label: '新建',
          value: '新建'
        }
      ],
      modifyPointParams: {
        area: this.modifyItem.area,
        numb: this.modifyItem.numb,
        pointPosition: this.modifyItem.pointPosition,
        monitorDirection: this.modifyItem.monitorDirection,
        pointAttribute: this.modifyItem.pointAttribute,
        coorLongitude: this.modifyItem.coorLongitude,
        coorLatitude: this.modifyItem.coorLatitude,
        laneCondition: this.modifyItem.laneCondition,
        stoplineDistance: this.modifyItem.stoplineDistance,
        id: this.modifyItem.id,
        createOrUtilize: this.modifyItem.createOrUtilize,
        projectId: this.$route.query.id || 123
      }
    };
  },
  created() {},
  methods: {
    longChange(val) {
      let longreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
      if (val && !longreg.test(val)) {
        this.longErroeTips = true;
      } else {
        this.longErroeTips = false;
      }
    },
    latChange(val) {
      let latreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
      if (val && !latreg.test(val)) {
        this.latErroeTips = true;
      } else {
        this.latErroeTips = false;
      }
    },
    handleClose() {
      this.$emit('update:modifyPointVisible', false);
    },
    async updatePoint() {
      if (this.longErroeTips || this.latErroeTips) {
        return;
      }
      if (
        !this.modifyPointParams.numb ||
        !this.modifyPointParams.pointPosition
      ) {
        this.$message.error('请输入必填项！');
      } else {
        const {
          resultMessage = '',
          resultCode = ''
        } = await this.$store.dispatch(
          'ISDP/range/updatePoint',
          this.modifyPointParams
        );
        if (+resultCode === '200' || resultCode.includes('200')) {
          this.$elTooltip({
            type: 'success',
            message: resultMessage
          });
          this.findByPointPositionAndArea();
          this.$emit('update:modifyPointVisible', false);
        }
      }
    }
  }
};
</script>

