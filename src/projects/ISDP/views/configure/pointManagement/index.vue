<template>
  <div class="pointManagement">
    <div class="pointManagement_seachBox">
      <span class="pointManagement_seachBox_item">
        <label class="pointManagement_seachBox_item_label">辖区：</label>
        <el-input
          placeholder="请输入辖区名称"
          style="width:150px;"
          size="mini"
          v-model="searchData.obj.area"
        ></el-input>
      </span>
      <span class="pointManagement_seachBox_item">
        <label class="pointManagement_seachBox_item_label">点位名称：</label>
        <el-input
          placeholder="请输入点位名称"
          style="width:150px;"
          size="mini"
          v-model="searchData.obj.pointPosition"
        ></el-input>
      </span>
      <span class="commonBtn commonConfirmBtn pointManagementSearch" @click="searchBtn">搜索</span>
      <inside-head
        class="pointManagement_seachBox_btnBox"
        :options="configJson"
        :form="uploadParams"
        @callback="callback"
      ></inside-head>
    </div>
    <div class="pointManagement_content">
      <el-table
        highlight-current-row
        :data="pointData.content"
        style="width: 100%"
        :height="windowHeight"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="序号" prop="serialNumber" width="70"></el-table-column>
        <el-table-column prop="numb" label="编号" width="100"></el-table-column>
        <el-table-column prop="area" label="辖区" width="120"></el-table-column>
        <el-table-column prop="pointPosition" label="点位名称" min-width="180"></el-table-column>
        <el-table-column prop="monitorDirection" label="监控方向" width="120"></el-table-column>
        <el-table-column prop="pointAttribute" label="点位属性" min-width="120"></el-table-column>

        <el-table-column
          prop="name"
          label="点位坐标"
          class="pointCoordinat"
          width="160"
          style="text-align:center;"
        >
          <el-table-column prop="coorLongitude" label="经度" width="110"></el-table-column>
          <el-table-column prop="coorLatitude" label="维度" width="110"></el-table-column>
        </el-table-column>

        <el-table-column prop="laneCondition" label="车道情况" width="120"></el-table-column>
        <el-table-column prop="stoplineDistance" label="停止线距离" width="120"></el-table-column>
        <el-table-column prop="createOrUtilize" label="新建/利旧" width="100"></el-table-column>
        <el-table-column prop="isEffectPp" label="状态" width="80">
          <template slot-scope="scope">
            <span>{{status[scope.row.isEffectPp]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="releaseNo" label="发布次数" width="100"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <span class="handelBtn" v-if="scope.row.isStop!=1" @click="modifyBtn(scope.row)">修改</span>
            <span
              class="handelBtn"
              v-if="scope.row.isStop!=1"
              style="margin-right:0px;"
              @click="disableBtn(scope.row)"
            >停用</span>
            <span class="handelBtn disableBtn" v-if="scope.row.isStop==1">修改</span>
            <span
              class="handelBtn disableBtn"
              style="margin-right:0px;"
              v-if="scope.row.isStop==1"
            >停用</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="model-pagination-wrap nISDP-pagination-wrap" style="text-align:right;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="10"
          layout="total, prev, pager, next, sizes, jumper"
          :total="pointData.totalElements"
        ></el-pagination>
      </div>
    </div>

    <add-point
      v-if="addPointVisible"
      :findByPointPositionAndArea="findByPointPositionAndArea"
      :addPointVisible.sync="addPointVisible"
    ></add-point>
    <modify-point
      v-if="modifyPointVisible"
      :findByPointPositionAndArea="findByPointPositionAndArea"
      :modifyItem="modifyItem"
      :modifyPointVisible.sync="modifyPointVisible"
    ></modify-point>
  </div>
</template>
<script>
import insideHead from '@ISDP/components/insideHead';
import tableData from './config/table.config.json';
import addPoint from './components/addPoint.vue';
import modifyPoint from './components/modifyPoint.vue';
import tipImgPath from '@ISDP/assets/images/common/common_dialog_icon_tips.png';
import { mapState } from 'vuex';
export default {
  components: {
    insideHead,
    addPoint,
    modifyPoint
  },
  data() {
    return {
      windowHeight: window.innerHeight - 235,
      uploadParams: {
        projectId: this.$route.query.id
      },
      status: {
        '0': '未发布',
        '1': '已发布',
        '2': '已发布'
      },
      modifyPointVisible: false,
      currentPage4: 4,
      modifyItem: {},
      multipleTable: [],
      pointData: {},
      addPointVisible: false,
      multipleSelection: [],
      tableData,
      searchData: {
        pageNum: 1,
        pageCount: 10,
        obj: {
          projectId: this.$route.query.id || '288',
          pointPosition: '',
          area: ''
        }
      },
      configJson: {
        title: '',
        btns: [
          {
            text: '线下编辑',
            type: 'dropdown',
            menu: [
              {
                text: '下载模板',
                fnName: 'downLoad'
              },
              {
                text: '上传模板',
                type: 'upload',
                uploadType: -1,
                formItemOpts: {
                  api: '/easywork/api/taskman/pointposition/importExcel',
                  name: 'excel'
                }
              }
            ]
          },
          {
            text: '发布',
            fnName: 'releaseElement'
          },
          {
            text: '新增',
            fnName: 'addElement'
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      insideHeadConfig(state) {
        const { configJson } = this,
          menuData = state.ISDP.common.currentMenu || {};
        configJson.btns = menuData.btns || [];
        return configJson;
      }
    })
  },
  created() {
    this.findByPointPositionAndArea();
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
      //新增点位
      if (fnName == 'addElement') {
        this.addPointVisible = true;
      } else if (fnName == 'releaseElement') {
        this.releaseBtn();
      } else if (fnName == 'downLoad') {
        this.exportPoint();
      }
    },
    onSuccessForUpload(response) {
      const { resultMessage = '', resultCode = '' } = response;
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.findByPointPositionAndArea();
      } else {
        this.$elTooltip({
          type: 'error',
          message: resultMessage
        });
        this.findByPointPositionAndArea();
      }
    },
    //设置表格样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'warning-row';
      }
      return '';
    },
    handleSizeChange(val) {
      this.searchData.pageCount = val;
      this.findByPointPositionAndArea();
    },
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.findByPointPositionAndArea();
    },
    async findByPointPositionAndArea() {
      const { data = '', resultCode = '' } = await this.$store.dispatch(
        'ISDP/range/findByPointPositionAndArea',
        this.searchData
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.pointData = data;
        let that = this;
        this.pointData.content.forEach(function(pointItem, index) {
          pointItem.serialNumber =
            index +
            1 +
            that.searchData.pageCount * (that.searchData.pageNum - 1);
        });
      }
    },
    //查询按钮
    searchBtn() {
      this.searchData.pageNum = 1;
      this.findByPointPositionAndArea();
    },
    //修改按钮
    modifyBtn(item) {
      this.modifyItem = item;
      this.modifyPointVisible = true;
    },

    //停用
    disableBtn(item) {
      this.$confirm(
        '<p class="tips"><img class="tipsIcon" src=' +
          tipImgPath +
          '>此操作将永停用该条记录</p><p class="tipInfo">是否继续?</p>',
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
          this.stopPoint(item);
        })
        .catch(() => {
          this.$elTooltip({
            type: 'info',
            message: '已取消停用'
          });
        });
    },
    async stopPoint(item) {
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch('ISDP/range/stopPoint', {
        ids: item.id,
        projectId: this.$route.query.id
      });
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.findByPointPositionAndArea();
      }
    },
    //导出
    async exportPoint() {
      const params = {
        projectId: this.$route.query.id || '288'
      };
      const result = await this.$store.dispatch(
        'ISDP/range/exportPoint',
        params
      );
      if (result && result.data) {
        this.$download(result.data, '点位管理列表.xlsx');
      }
    },
    //发布
    releaseBtn() {
      this.$confirm(
        '<p class="tips"><img class="tipsIcon" src=' +
          tipImgPath +
          '>此操作将发布点位记录</p><p class="tipInfo">是否继续？</p>',
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
          this.issuePoint();
        })
        .catch(() => {
          this.$elTooltip({
            type: 'info',
            message: '已取消发布'
          });
        });
    },
    async issuePoint() {
      const params = {
        projectId: this.$route.query.id || '288'
      };
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch('ISDP/range/issuePoint', params);
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.findByPointPositionAndArea();
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import url('./pointManagement.less');
</style>
<style lang="less">
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
//el-input样式
.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #f00000 !important;
}
.model-pagination-wrap {
  &.nISDP-pagination-wrap {
    background-color: #fff;
    .el-pagination {
      margin: 0;
      padding: 16px 24px;
      color: #777a80;
      font-size: 14px;
      .el-pagination__total,
      .el-pagination__jump {
        color: #777a80;
        font-size: 14px;
      }
      .el-pagination__jump {
        margin-left: 0;
      }
      .btn-prev,
      .btn-next {
        background-color: #f5f5f5;
        .el-icon {
          color: rgba(164, 164, 164, 0.9);
        }
        &:not([disabled]):hover {
          background-color: #f42020;
          .el-icon {
            color: #fff;
          }
        }
        &[disabled] {
          background-color: #f5f5f5;
          .el-icon {
            color: rgba(205, 205, 205, 0.9);
          }
        }
      }
      .el-pager {
        .number {
          border-radius: 0;
          background-color: transparent;
          color: #777a80;
          font-weight: 500;
          &.active {
            background-color: #f42020;
          }
        }
      }
      .el-pagination__sizes {
        margin: 0 16px 0 11px;
        .el-input {
          width: 88px;
          .el-input__inner {
            height: 24px;
            border: 0;
            background-color: #f5f5f5;
            color: #777a80;
            font-size: 14px;
          }
        }
      }
      .el-pagination__editor {
        .el-input__inner {
          width: 40px;
          height: 24px;
          border: 0;
          background-color: #f5f5f5;
          color: #777a80;
          font-size: 14px;
        }
      }
    }
  }
}
.model-pagination-dropdown {
  min-width: unset;
  width: 88px;
  margin-top: 0;
  border: 0;
  box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.6);
  border-radius: 1px;
  .popper__arrow {
    display: none;
  }
  .el-select-dropdown__list {
    padding: 0;
    .el-select-dropdown__item {
      padding: 0 10px;
      color: #4d4f53;
      font-size: 14px;
      &.hover,
      &.selected,
      &:hover {
        color: #f00000;
        font-weight: 500;
      }
    }
  }
}
</style>
