import fetch from '@/utils/fetch';
// import {
//   getApiQuery
// } from '@/utils/getApiQuery';
const urlStr = '/easywork/api/project';
export default {
  getProjectList(args) {
    return fetch({
      url: urlStr + '/list',
      method: 'post',
      data: args
    });
  },

  /**
   *
   *
   * @param {*} args
   * @returns
   *   //创建时间   createDate;
   *
    //工程合同号  contractNo;

    //合同名称  contractName;

    //合同类型  contractClassify;

    //业务实体  businessEntity;

    //是否租赁合同  isTenancyContract;

    //客户名称  customer;

    //客户合同编号  customerContractNo;

    //项目所在省份  projectProvince;

    //集成项目类型  projectClassify;

    //项目交付阶段  projectPhase;

    //项目交付级别  projectLevel;

    //项目交付模式  projectModel;

    //项目交付状态  projectStatus;

    //商机名称  opportunityName;

    //是否维保项目  isMaintenanceProject;

    //合同签订时间  contractSignDate;

    //要求发货时间  requiredShipmentDate;

    //合同终止时间  contractEndDate;

    //质保期  warrantyPeriod;

    //项目经理工号  projectManagerNo;

    //项目经理姓名  projectManagerName;

    //项目经理所在部门  projectManagerDept;

    //业务归属人工号  businessOwnerNo;

    //业务归属人姓名  businessOwnerName;

    //业务归属人所在部门  businessOwnerDept;


    //合同跟踪人工号  contractTrackerNo;

    //合同跟踪人姓名  contractTrackerName;

    //合同跟踪人所在部门  contractTrackerDept;

    //合同最新金额  contractAmountLatest;

    //合同原始金额  contractAmountOriginal;

    //是否同步到ERP  isSyncERP;

    //产品类型  productType;

    //产品子类型  productSubtype;

    //货币  currency;

    //行业类型  industryType;

    //付款形式  paymentForm;

    //付款描述  paymentDescription;

    //项目进度  projectProgress;

    //售前技术工号  preTechNo;

    //技术配置工程师工号  cfrEgrNo;

    //是否未确定签约主体  uncertainFlg;

    //工程合同创建日期  contractCreateDate;

    //工程合同最后更新日期  contractUpdateDate;
   */
  getProjectDetail(args) {
    return fetch({
      url: urlStr + '/detail',
      method: 'post',
      data: args
    });
  },
  getMilestoneList(args) {
    return fetch({
      url: urlStr + '/milestoneNote/list',
      method: 'post',
      data: args
    });
  },
  getProjectSelect(args) {
    return fetch({
      url: urlStr + '/projectManager/projectSelect',
      method: 'post',
      data: args
    });
  },

  /**
   * 查询项目经理
   *
   * @param {*} args
   * projectManagerName: 名字/工号
   * @returns
   */
  findRole(args) {
    return fetch({
      url: '/easywork/api/project/projectManager/queryPms',
      method: 'post',
      data: args
    });
  },
  getTaskList(args) {
    // 任务列表
    return fetch({
      url: '/easywork/api/taskman/taskform/list/querybyproject',
      method: 'post',
      data: args,
      loading: false
    });
  },
  getQueryList(args) {
    // 任务分解
    return fetch({
      url: '/easywork/api/taskman/feedback/list/querybytask',
      method: 'post',
      data: args
    });
  },

  /**
   * 查询反馈单详情
   *
   * @param {*} args
   * id: 反馈单ID
   * @returns
   */
  getTaskFeedbackDetail(args) {
    return fetch({
      url: 'easywork/api/taskman/feedback/detail/querybyid',
      method: 'post',
      data: args
    });
  },

  /**
   *查询审批流程
   *
   * @param {*} args
   * id: 项目ID
   * formType: 1:合同立项 2:里程碑 3: WBS计划
   * @returns
   */
  getApprovalList(args) {
    return fetch({
      url: '/easywork/api/platform/project/approval/record',
      method: 'post',
      data: args,
      showMessage: false
    });
  },
  /**
   * 查询任务单详情
   *
   * @param {*} args
   * id: 任务ID
   * @returns
   */
  getFeedbackDetail(args) {
    return fetch({
      url: 'easywork/api/taskman/feedback/detail/querylastone',
      method: 'post',
      data: args,
      showMessage: false
    });
  },
  modifyTaskList(args) {
    // 提交反馈
    return fetch({
      url: '/easywork/api/taskman/feedback/save',
      method: 'post',
      data: args
    });
  },
  addWBSPlanNode(args) {
    return fetch({
      url: '/easywork/api/project/planNote/add',
      method: 'post',
      data: args
    });
  },
  addTask(args) {
    //任务分派（新建）
    return fetch({
      url: '/easywork/api/taskman/taskform/save',
      method: 'post',
      data: args
    });
  },
  getTeamMember(args) {
    return fetch({
      url: urlStr + '/teamMember',
      method: 'post',
      data: args
    });
  },
  addTeamMember(args) {
    return fetch({
      url: urlStr + '/teamMember/batchAdd',
      method: 'post',
      data: args
    });
  },
  stopTeamMember(args) {
    return fetch({
      url: '/easywork/api/project/teamMember/stop',
      method: 'post',
      data: args
    });
  },
  // 风险项列表
  getRiskList(args) {
    return fetch({
      url: urlStr + '/problemRisk/list',
      method: 'post',
      data: args
    });
  },

  /**
   * 风险项及问题删除
   *
   * @param {*} args
   * id
   * 	isDel: 	0或1  //1是删除
   * @returns
   */
  removeRiskItem(args) {
    return fetch({
      url: urlStr + '/problemRisk/delete',
      method: 'post',
      data: args
    });
  },
  // 计划列表
  getPlanNodes(args) {
    return fetch({
      url: urlStr + '/planNote/list',
      method: 'post',
      data: args
    });
  },
  // 编辑计划列表
  modifyWBSPlanNode(args) {
    return fetch({
      url: urlStr + '/planNote/modify',
      method: 'post',
      data: args
    });
  },
  // 删除计划
  deleteWBSPlanNode(args) {
    return fetch({
      url: urlStr + '/planNote/delete',
      method: 'post',
      data: args
    });
  },
  // 添加里程碑节点
  addPlanNode(args) {
    return fetch({
      url: urlStr + '/milestoneNote/plan/add',
      method: 'post',
      data: args
    });
  },
  //
  finishMilestoneNote(args) {
    return fetch({
      url: urlStr + '/milestoneNote/finish',
      method: 'post',
      data: args
    });
  },
  addRiskProblem(args) {
    return fetch({
      url: urlStr + '/problemRisk/add',
      method: 'post',
      data: args
    });
  },

  modifyRiskProblem(args) {
    return fetch({
      url: urlStr + '/problemRisk/modify',
      method: 'post',
      data: args
    });
  },
  operateTeamMember(args) {
    return fetch({
      url: urlStr + '/teamMember/modify',
      method: 'post',
      data: args
    });
  },
  getWEBStemplate(args) {
    return fetch({
      url: urlStr + '/planNote/listWBStemplate',
      method: 'post',
      data: args
    });
  },
  getEmplyees(args) {
    return fetch({
      url: '/easywork/api/auth/queryemployee',
      method: 'post',
      data: args
    });
  },
  getTotalInfo(args) {
    return fetch({
      url: urlStr + '/problemRisk/totalInfo',
      method: 'post',
      data: args
    });
  },

  /**
   * 获取项目经理 解决方案负责人  销售负责人 三种职能人员
   *
   * @param {*} args
   * projectId: 项目ID
   */
  getRoleForProjectDisclosure(args) {
    return fetch({
      url: '/easywork/api/project/teamMember/queryStaffNosByRole',
      method: 'post',
      data: args
    });
  },

  /**
   * 获取项目交底列表
   *
   * @param {*} args
   * @returns
   */
  getProjectDisclosure(args) {
    return fetch({
      url: urlStr + '/disclosureFile/list',
      method: 'post',
      data: args
    });
  },

  /**
   * 项目交底编辑
   *
   * @param {*} args
   * @returns
   */
  setProjectDisclosure(args) {
    return fetch({
      url: urlStr + '/disclosureFile/modify',
      method: 'post',
      data: args
    });
  },

  /**
   * 项目经理确认项目模式
   *
   * @param {*} args
   * id: 项目ID
   * @returns
   */
  projectModelConfirm(args) {
    return fetch({
      url: urlStr + '/projectManager/projectModel/confirm',
      method: 'post',
      data: args
    });
  },

  /**
   *  项目模式变更申请
   *
   * @param {*} args
   * id: 项目ID
   * projectModel: 项目交付模式
   * @returns
   */
  projectModelChange(args) {
    return fetch({
      url: urlStr + '/projectManager/projectModel/modifyApply',
      method: 'post',
      data: args
    });
  },

  /**
   *  任务完成
   *
   * @param {*} args
   * id: 任务单ID
   * @returns
   */
  taskCompleteConfirm(args) {
    return fetch({
      url: 'easywork/api/taskman/taskform/done',
      method: 'post',
      data: args
    });
  },

  /**
   * project提交审批接口
   *
   * @param {*} args
   * @returns
   */
  projectApproval(args) {
    return fetch({
      url: '/easywork/api/platform/project/confirm',
      method: 'post',
      data: args
    });
  },
  projectWithdraw(args) {
    return fetch({
      url: '/easywork/api/project/projectManager/updatePlanApporvalStatus',
      method: 'post',
      data: args
    });
  },
  /**
   * WBS计划提交审批接口
   *
   * @param {*} args
   * @returns
   */
  wbsApproval(args) {
    return fetch({
      url: urlStr + '/planNote/approval',
      method: 'post',
      data: args
    });
  },
  /**
   * 里程碑节点提交审批接口
   *
   * @param {*} args
   * @returns
   */
  milestoneCommit(args) {
    return fetch({
      url: '/easywork/api/platform/milestone/commit',
      method: 'post',
      data: args
    });
  },
  /**
   * 商机列表
   *
   * @param {*} args
   * @param {*}
   * @returns
   */
  businessOppList(args) {
    return fetch({
      url: urlStr + '/opp/listbyself',
      method: 'post',
      data: args
    });
  },
  /**
   * 审批撤回
   *
   * @param {*} args
   * @param {*}
   * @returns
   */
  revokeApproval(args) {
    return fetch({
      url: urlStr + '/projectManager/modifyprojectstatus',
      method: 'post',
      data: args
    });
  },
  /**
   * 导入标准模板
   *
   * @param {*} args
   * @param {*} id: 项目id
   * @returns
   */
  importTemplate(args) {
    return fetch({
      url: urlStr + '/planNote/import',
      method: 'post',
      data: args
    });
  },
  /**
   * 添加自定义模板
   *
   * @param {*} args
   * @param {*} id: 项目id
   * @returns
   */
  addWBSPlan(args) {
    return fetch({
      url: urlStr + '/planNote/addPlan',
      method: 'post',
      data: args
    });
  },

  /**
   * 项目交底确认
   *
   * @param {*} args
   * id: 项目ID
   * @returns
   */
  disclosureFileStart(args) {
    return fetch({
      url: '/easywork/api/project/disclosureFile/start',
      method: 'post',
      data: args
    });
  },
  /**
   * 招投标申请列表

  /**
   *  报表 合同签订情况
   *
   * @param {*} args
   * @returns
   */
  biddingList(args) {
    return fetch({
      url: urlStr + '/opp/bidding/list',
      method: 'post',
      data: args
    });
  },
  // 查询合同信息
  getReportForContract(args) {
    return fetch({
      url: '/easywork/api/project/projectManager/statisticsContract',
      method: 'post',
      data: args
    });
  },

  /**
   * 报表 合同签订情况
   *
   * @param {*} args
   * @returns
   */
  contractGeneral(args) {
    return fetch({
      url: urlStr + '/opp/contract/general',
      method: 'post',
      data: args
    });
  },
  getReportForProjectLevel(args) {
    return fetch({
      url: '/easywork/api/project/projectManager/statisticsLevel',
      method: 'post',
      data: args
    });
  },

  /**
   * 报表 在建项目状态
   *
   * @param {*} args
   * @returns
   */
  getReportForProjectStatus(args) {
    return fetch({
      url: '/easywork/api/project/projectManager/statisticsStatus',
      method: 'post',
      data: args
    });
  },

  /**
   * WBS项目清理
   *
   * @param {*} args
   * id: 项目ID
   * @returns
   */
  cleanPlan(args) {
    return fetch({
      url: '/easywork/api/project/planNote/cleanPlan',
      method: 'post',
      data: args
    });
  },
  exportWBSExcel(args) {
    return fetch({
      url: urlStr + '/planNote/export',
      method: 'get',
      params: args,
      responseType: 'blob'
    })
  }
};