<template>
  <div class="addAttachmentDialog commonDialog">
    <el-dialog
      title="添加"
      :visible.sync="addPointVisible"
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
            <el-input size="mini" v-model="addPointParams.numb" placeholder="请输入编号"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">
            <label class="requireIcon">*</label>点位名称：
          </span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addPointParams.pointPosition" placeholder="请输入点位名称"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">辖区：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addPointParams.area" placeholder="请输入辖区"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">经度：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input
              :change="longChange(addPointParams.coorLongitude)"
              v-model="addPointParams.coorLongitude"
              placeholder="请输入经度"
            ></el-input>
          </div>
          <p class="errorTips" v-if="longErroeTips">经度范围应为-180~180，最多为六位小数</p>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">纬度：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input
              v-model="addPointParams.coorLatitude"
              :change="latChange(addPointParams.coorLatitude)"
              placeholder="请输入纬度"
            ></el-input>
          </div>
          <p class="errorTips" v-if="latErroeTips">纬度范围应为-90~90，最多为六位小数</p>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">监控方向：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addPointParams.monitorDirection" placeholder="请输入监控方向"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">点位属性：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addPointParams.pointAttribute" placeholder="请输入点位属性"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">车道情况：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addPointParams.laneCondition" placeholder="请输入车道情况"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">停止线距离：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addPointParams.stoplineDistance" placeholder="请输入停止线距离"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="padding-left:13px;">新建/利旧：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-select v-model="addPointParams.createOrUtilize" size="mini" style="width:100%;">
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
        <span @click="savePoint" class="commonConfirmBtn commonBtn">确 定</span>
      </span>
    </el-dialog>
  </div>
</template> 
<script>
export default {
  props: ['addPointVisible', 'findByPointPositionAndArea'],
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
      addPointParams: {
        projectId: this.$route.query.id || '288',
        area: '',
        createOrUtilize: '',
        pointPosition: '',
        monitorDirection: '',
        pointAttribute: '',
        coorLongitude: '',
        coorLatitude: '',
        laneCondition: '',
        stoplineDistance: '',
        numb: ''
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
      this.$emit('update:addPointVisible', false);
    },
    async savePoint() {
      if (this.longErroeTips || this.latErroeTips) {
        return;
      }
      if (!this.addPointParams.numb || !this.addPointParams.pointPosition) {
        this.$message.error('请输入必填项！');
      } else {
        const {
          resultMessage = '',
          resultCode = ''
        } = await this.$store.dispatch(
          'ISDP/range/savePoint',
          this.addPointParams
        );
        if (+resultCode === '200' || resultCode.includes('200')) {
          this.$elTooltip({
            type: 'success',
            message: resultMessage
          });
          this.findByPointPositionAndArea();
          this.$emit('update:addPointVisible', false);
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url('./addPoint.less');
</style>
