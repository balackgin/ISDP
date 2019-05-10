/*
 * @Author: xia_wenxing/90111
 * @Date: 2019-04-15 15:47:57
 * @Last Modified by: xia_wenxing/90111
 * @Last Modified time: 2019-05-08 16:18:54
 */

<template>
  <div class="projectStart-wbs-maintain-wrap">
    <inside-head :options="headConfig"
                 :form="queryObj"
                 @callback="callback"></inside-head>
    <model-table ref="tableRef"
                 class="wbs-maintain-table"
                 :options="tableConfig"
                 :pagination="pagination"
                 :data="tableData"
                 :form="tableForm"
                 :remoteData="remoteData"
                 @callback="callback"></model-table>
    <inside-dialog :options="taskConfig"
                   :show="dialogTestShow"
                   @callback="callback">
      <template slot="content">
        <model-detail :options="dialogConfig"
                      :data="taskInfo"></model-detail>
      </template>
    </inside-dialog>
  </div>
</template>
<script>
import modelTable from '@/components/modelList/modelTable';
import insideHead from '@ISDP/components/insideHead';
import insideDialog from '@ISDP/components/insideDialog';
import modelDetail from '@/components/modelDetail';
import headOpts from './config/head.config';
import tableConfig from './config/table.config';
import dialogConfig from './config/dialog.config';
import { mapState } from 'vuex';
export default {
  components: {
    insideHead,
    modelTable,
    insideDialog,
    modelDetail
  },
  data() {
    return {
      tableConfig,
      tableData: [],
      tableForm: {
        dutyPersonName: '',
        planEndDate: ''
      },
      remoteData: {},
      queryObj: {
        projectId: ''
      },
      pagination: {
        theme: 'isdp',
        pageNum: 1,
        pageCount: 20,
        total: 20,
        layout: 'total,prev,pager,next,sizes,jumper'
      },

      // dialog
      taskConfig: {
        width: '790px',
        title: ''
      },
      currentTaskId: '',
      dialogTestShow: false,
      dialogConfig,
      taskInfo: {}
    };
  },
  computed: {
    ...mapState({
      headConfig: (state) => {
        const menuData = state.ISDP.common.currentMenu || {},
          { btns = [] } = menuData,
          resultData = headOpts.toJson();

        resultData.btns = resultData.btns.filter((item) =>
          btns.includes(item.text)
        );
        return resultData;
      }
    })
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForRow(row, colmun = {}) {
      const { id } = row,
        { property } = colmun;
      if (property === 'jobName') {
        this.currentTaskId = id;
        this.getSubTaskDetail();
      }
    },
    beforeClose() {
      this.dialogTestShow = false;
    },
    async getSubTaskDetail() {
      const { currentTaskId: id } = this;
      const { data, resultCode = '' } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/getSubTaskDetail',
        {
          id
        }
      );
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.taskInfo = data || {};
        this.taskConfig.title = '子任务：' + data.jobName;
        this.dialogTestShow = true;
      }
    },
    onSuccessForUpload({ resultCode, resultMessage }) {
      let msg = '导入成功!',
        type = 'success';

      if (+resultCode === 200) {
        this.getMaintainForMore();
      } else {
        msg = '导入失败!';
        type = 'error';
      }
      this.$elTooltip({
        message: resultMessage || msg,
        type
      });
    },
    // inside-head start
    async wbsMaintainDownload() {
      const { data } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/wbsMaintainStateDownload',
        this.queryObj
      );
      data && this.$download(data, 'wbs维护模板.xlsx');
    },
    async wbsMaintainSubmit() {
      const { resultCode, resultMessage } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/issuePlan',
        {
          id: this.queryObj.projectId
        }
      );
      if (+resultCode === 200) {
        this.$elTooltip({
          message: resultMessage,
          type: 'success'
        });
      }
      this.getMaintainForMore();
    },
    // inside-head end

    async getMaintainForMore() {
      // planStatus
      // UNALLOCATED("0", "未派发"),
      // ALLOCATED("1", "已派发"),
      // ACCEPTED("2", "已接受"),
      // FEEDBACK("5", "已反馈"),
      // COMPLETED("6", "已完成");
      // issue: 0: 未发布  1: 发布
      const btns = [
        {
          text: '派发',
          name: 'handleClickForTableDistribute'
        },
        {
          text: '编辑',
          name: 'handleClickForTableEdit'
        },
        {
          text: '关闭',
          name: 'handleClickForTableClose'
        },
        {
          text: '驳回',
          name: 'handleClickForTableReject'
        }
      ];
      const { queryObj, pagination } = this,
        params = Object.assign({}, pagination, {
          obj: queryObj
        });
      const { data, resultCode } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/getMaintainForMore',
        params
      );
      if (data && resultCode && resultCode.includes('200')) {
        this.tableData = (data.content || []).map((item) => {
          const { planStatus, issue, deviationDay = 0 } = item;
          let icons = [];
          switch (true) {
          case [ 'FEEDBACK', '5' ].includes(planStatus):
            icons = [ btns[2], btns[3] ];
            break;
          case +issue === 1 &&
              (!planStatus || [ 'UNALLOCATED', '0' ].includes(planStatus)): //&&  [ 'UNALLOCATED','0' ].includes(planStatus)
            icons = [ btns[0], btns[1] ];
            break;
          case !+issue || !planStatus:
            icons = [ btns[1] ];
            break;
          default:
            break;
          }
          if(+deviationDay > 0) {
            item.deviationDay = `<span style="color: red;">${ deviationDay }</span>`
          }

          item.icons = icons;
          return item;
        });

        this.pagination = Object.assign({}, this.pagination, {
          total: data.totalElements
        });
      }
    },

    // table callback start
    paginationCallback(page) {
      this.pagination.pageNum = page;
      this.getMaintainForMore();
    },
    pagiantionSizeChange(counts) {
      this.pagination.pageNum = 1;
      this.pagination.pageCount = counts;
      this.getMaintainForMore();
    },
    async handleClickForTableClose(rowData = {}) {
      const { resultCode } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/closePlan',
        {
          id: rowData.id
        }
      );
      if (resultCode && resultCode.includes('200')) {
        this.getMaintainForMore();
      }
    },
    async handleClickForTableDistribute(rowData = {}) {
      // 派发
      const { resultCode, resultMessage } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/distributePlan',
        {
          id: rowData.id
        }
      );
      if (+resultCode === 200) {
        this.$elTooltip({
          message: resultMessage,
          type: 'success'
        });
      }
      this.getMaintainForMore();
    },
    handleClickForTableEdit(rowData) {
      //编辑
      const { dutyPersonNo, dutyPersonName, dutyDept, planEndDate } = rowData;

      this.tableForm = Object.assign(
        {},
        {
          dutyPersonName:
            dutyPersonName &&
            dutyPersonNo + '#_#' + dutyPersonName + '#_#' + dutyDept,
          planEndDate
        }
      );
      this.$refs.tableRef.changeInputProps({
        rows: [ rowData ],
        props: [ 'dutyPersonName', 'planEndDate' ],
        icons: [
          {
            text: '取消',
            name: 'handleClickForTableCancel'
          },
          {
            text: '保存',
            name: 'handleClickForTableSave'
          }
        ]
      });
    },
    tableFormInit() {
      this.tableForm = Object.assign(
        {},
        {
          dutyPersonName: '',
          planEndDate: ''
        }
      );
    },
    handleClickForTableCancel() {
      //取消
      this.$refs.tableRef.changeInputProps({ row: null });
      this.tableFormInit();
    },
    async handleClickForTableSave(rowData) {
      //保存
      // wbsMaintainSavePlan
      const params = this.tableForm.toJson(),
        { dutyPersonName, planEndDate } = params;
      let msg = '';
      switch (true) {
      case !planEndDate:
        msg = '请输入计划结束时间!';
        break;
      case !dutyPersonName:
        msg = '请选择责任人!';
        break;
      default:
        break;
      }
      if (msg) {
        this.$elTooltip({
          message: msg,
          type: 'error'
        });
        return false;
      }
      if (dutyPersonName.includes('#_#')) {
        const userinfoArr = dutyPersonName.split('#_#');
        params.dutyPersonNo = userinfoArr[0];
        params.dutyPersonName = userinfoArr[1];
        params.dutyDept = userinfoArr[2];
      }
      const { resultCode } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/wbsMaintainSavePlan',
        Object.assign(
          {},
          {
            id: rowData.id,
            actualEndDate: rowData.actualEndDate,
            jobDescription: rowData.jobDescription,
            jobName: rowData.jobName,
            jobNo: rowData.jobNo,
            supportPersonNo: rowData.supportPersonNo,
            supportPersonName: rowData.supportPersonName
          },
          this.queryObj,
          params
        )
      );

      if (+resultCode === 200) {
        this.tableFormInit();
        this.getMaintainForMore();
      }
    },
    async handleClickForTableReject(rowData) {
      const { id } = rowData;
      if (id) {
        const { resultCode } = await this.$store.dispatch(
          'ISDP/projectStart/wbs/wbsMaintainReject',
          { id }
        );
        if (+resultCode === 200) {
          this.$elTooltip({
            message: '驳回成功!',
            type: 'success'
          });
        }
        this.getMaintainForMore();
      }
    },
    // table callback end
    async getAllMember() {
      const { data = [] } = await this.$store.dispatch(
        'ISDP/operationManage/getMember',
        {
          id: this.queryObj.projectId
        }
      );

      this.remoteData = Object.assign({}, this.remoteData, {
        dutyPersonName: (data || []).map((item) => {
          const { userName, displayName, depName } = item;
          item.val =
            (userName || '') +
            '#_#' +
            (displayName || '') +
            '#_#' +
            (depName || '');
          return item;
        })
      });
    }
  },
  created() {
    this.queryObj = {
      projectId: this.$route.query.id
    };
    this.getMaintainForMore();
    this.getAllMember();
  }
};
</script>
// <style lang="less" scoped>
  .projectStart-wbs-maintain-wrap {
    .wbs-maintain-table {
      /deep/ .el-table {
        .el-table__fixed-right {
          margin-right: -8px;
        }
      }
    }
  }
</style>
