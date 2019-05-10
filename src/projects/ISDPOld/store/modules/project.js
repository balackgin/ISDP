import api from '@/projects/ISDPOld/api/project';
const project = {
  namespaced: true,
  state: {
    detailData: null,
    riskData: null,
    disclosureData: null,
    wbstemplate: null,
    approvalList: null,
    approvalListForContract: null,
    teamObj: null,
    teamList: null, // 团队成员列表
    roleArr: null,
    roleAll: undefined, // 团队职能分类  [{}]

    userinfoOA: undefined,
    projectModel: null,
    projectManager: undefined, //是否是项目经理
    projectManagerSuperior: undefined //是否是项目经理上级
  },
  getters: {},
  mutations: {
    SET_PROJECT_DETAIL(state, data) {
      state.detailData = data;
    },
    SET_SUPERIOR(state, isSuperior) {
      state.projectManagerSuperior = isSuperior;
    },
    SET_OAINFO(state, data) {
      state.userinfoOA = data;
    },
    SET_PROJECTMANAGER(state, isProjectManager) {
      state.projectManager = isProjectManager;
    },
    GET_RISK_LIST(state, data) {
      state.riskData = data;
    },
    SET_DISCLOSURE(state, data) {
      state.disclosureData = data;
    },
    SET_WBSTEMPLATE(state, data) {
      state.wbstemplate = data;
    },
    SET_APPROVAL_LIST(state, data) {
      state.approvalList = data;
    },
    SET_APPROVAL_LIST_FOR_CONTRACT(state, data) {
      state.approvalListForContract = data;
    },
    SET_TEAM_OBJ(state, data) {
      state.teamObj = Object.assign({}, state.teamObj, data);
    },
    SET_PROJECT_MODEL(state, data) {
      state.projectModel = data;
    },
    SET_ROLE_ARR(state, data) {
      state.roleArr = data;
    },
    /**
     *   项目经理（PM）      PM
     *   整体组组长          T_GROUP_LEADER
     *   法务负责人          T_LEGAL_LEADER
     *   运营负责人          T_OPERATE_LEADER
     *   采购负责人          T_PURCHASE_LEADER
     *   销售负责人          T_SALE_LEADER
     *   解决方案负责人       T_SOLUTION_LEADER
     *   供应链负责人         T_SUPPLY_LEADER
     *   整体组副组长         T_VICE_GROUP_LEADER
     *   造价工程师           D_COST_ENGINEER
     *   资料员               D_DATA_CLERK
     *   内场负责人           D_INNER_LEADER
     *   内部监理             D_INNER_SUPERVISION
     *   物料员               D_MATERIAL_MAN
     *   外场负责人           D_OUTER_LEADER
     *   项目经理助理（PCM）   D_PCM
     *   质量员               D_QA
     *   安全员               D_SAFE_OFFICER
     *   软件交付经理          D_SDM
     *   软件交付技术支持工程师 D_SDSE
     *   解决方案工程师        D_SE
     *   项目仓管员            D_STORE_KEEPER
     *   技术负责人（TD）      D_TD
     *   技术支持工程师        D_TSE
     */
    SET_TEAM_MEMBER(state, { data }) {
      // 过滤掉已停用的人  按职能分类

      let resultObj = {};
      if (data) {
        data.forEach((item) => {
          if (item.list) {
            item.list.forEach((listItem) => {
              listItem.staffNo &&
                !+listItem.isStop &&
                (resultObj[listItem.projectRole]
                  ? resultObj[listItem.projectRole].push(listItem)
                  : (resultObj[listItem.projectRole] = [ listItem ]));
            });
          } else {
            item.staffNo &&
              !+item.isStop &&
              (resultObj[item.projectRole]
                ? resultObj[item.projectRole].push(item)
                : (resultObj[item.projectRole] = [ item ]));
          }
        });
        // forEach end
        state.roleAll = resultObj;
      }
    }
  },
  actions: {
    async getProjectList(store, params) {
      let data = await api.getProjectList(params);
      return data;
    },
    async getProjectDetail(store, params) {
      let data = await api.getProjectDetail(params);
      const { userinfo = {} } = store.rootState.common,
        { username = '' } = userinfo || {},
        resultDetailData = data.data || {};

      store.commit('SET_PROJECT_MODEL', resultDetailData.projectModel);
      store.commit(
        //是否是项目经理
        'SET_PROJECTMANAGER',
        username && username === resultDetailData.projectManagerNo
      );
      store.commit('SET_PROJECT_DETAIL', data); // 保存数据
      username &&
        resultDetailData.projectManagerNo &&
        (await store.dispatch('getEmplyees', {
          //是否是项目经理上级
          StrKey: resultDetailData.projectManagerNo,
          superior: true
        }));
      return data;
    },
    async getMilestoneList(store, params) {
      let data = await api.getMilestoneList(params);
      return data;
    },
    async getProjectSelect(store, params) {
      let data = await api.getProjectSelect(params);
      return data;
    },
    // 项目管理 => 团队
    async getProjectTeam(store, { code }) {
      const { teamObj = {} } = store.state,
        currentObj = teamObj && teamObj[code];
      if (
        currentObj &&
        currentObj.time &&
        currentObj.time > Date.now() - 600000 &&
        currentObj.data
      ) {
        return currentObj.data;
      }
      let { data } = await api.getProjectSelect(
        Object.assign({
          type: 'projectRole',
          code
        })
      );
      // 处理数据
      if (data) {
        let obj = {};
        obj[code || 'S'] = {
          time: Date.now(),
          data: data.map((item) => {
            item.label = item.value;
            item.value = item.code + '-' + item.value;
            return item;
          })
        };
        store.commit('SET_TEAM_OBJ', obj);
        return obj;
      }
    },

    async findRole(store, params) {
      let data = await api.findRole(params);
      return data;
    },
    async getTaskList(store, params) {
      let data = await api.getTaskList(params);
      return data;
    },
    async getQueryList(store, params) {
      let data = await api.getQueryList(params);
      return data;
    },
    async modifyTaskList(store, params) {
      let data = await api.modifyTaskList(params);
      return data;
    },
    async addTask(store, params) {
      const data = await api.addTask(params);
      return data;
    },
    async getTeamMember(store, params) {
      let data = await api.getTeamMember(params);
      store.commit('SET_WBSTEMPLATE', data);
      store.commit('SET_TEAM_MEMBER', data);
      return data;
    },
    async addTeamMember(store, params) {
      let data = await api.addTeamMember(params);
      return data;
    },
    stopTeamMember(store, params) {
      return api.stopTeamMember(params);
    },
    async getRiskList(store, params) {
      let data = await api.getRiskList(params);
      store.commit('GET_RISK_LIST', data);
      return data;
    },
    removeRiskItem(store, params) {
      return api.removeRiskItem(params);
    },
    async getPlanNodes(store, params) {
      const data = await api.getPlanNodes(params);
      return data;
    },
    async addPlanNode(store, params) {
      const data = await api.addPlanNode(params);
      return data;
    },
    async addWBSPlanNode(store, params) {
      const data = await api.addWBSPlanNode(params);
      return data;
    },
    async addRiskProblem(store, params) {
      const data = await api.addRiskProblem(params);
      return data;
    },
    async operateTeamMember(store, params) {
      const data = await api.operateTeamMember(params);
      return data;
    },
    async getWEBStemplate(store, params) {
      const data = await api.getWEBStemplate(params);
      return data;
    },
    async getEmplyees(store, params) {
      const bool = params.superior;
      delete params.superior;
      const data = await api.getEmplyees(params);
      if (bool) {
        const { userinfo = {} } = store.rootState.common,
          { username = '' } = userinfo || {},
          resultData = data.data || [],
          { FSuperiorItemNumber } = resultData[0] || {};
        store.commit(
          'SET_SUPERIOR',
          username && FSuperiorItemNumber === username
        );
        store.commit('SET_OAINFO', resultData[0]);
      }
      return data;
    },
    async getTotalInfo(store, params) {
      const data = await api.getTotalInfo(params);
      return data;
    },
    async modifyWBSPlanNode(store, params) {
      const data = await api.modifyWBSPlanNode(params);
      return data;
    },
    async deleteWBSPlanNode(store, params) {
      const data = await api.deleteWBSPlanNode(params);
      return data;
    },
    async modifyRiskProblem(store, params) {
      const data = await api.modifyRiskProblem(params);
      return data;
    },
    async finishMilestoneNote(store, params) {
      const data = await api.finishMilestoneNote(params);
      return data;
    },
    async wbsApproval(store, params) {
      const data = await api.wbsApproval(params);
      return data;
    },
    async getProjectDisclosure(store, params) {
      let { data = {} } = await api.getProjectDisclosure(params),
        result = [];
      data.MATERIAL &&
        result.push({
          data: data.MATERIAL || [],
          text: data.MATERIAL_ZH || '资料'
        });
      data.BUSINESS_RELATIONSHIP &&
        result.push({
          data: data.BUSINESS_RELATIONSHIP || [],
          text: data.BUSINESS_RELATIONSHIP_ZH || '商务关系'
        });
      data.TECHNOLOGY &&
        result.push({
          data: data.TECHNOLOGY || [],
          text: data.TECHNOLOGY_ZH || '技术'
        });
      data.CHECK_ACCEPTANCE &&
        result.push({
          data: data.CHECK_ACCEPTANCE || [],
          text: data.CHECK_ACCEPTANCE_ZH || '验收'
        });
      data.RISK &&
        result.push({
          data: data.RISK || [],
          text: data.RISK_ZH || '风险'
        });
      store.commit('SET_DISCLOSURE', result);
    },
    async getRoleForProjectDisclosure(store, params) {
      let { data } = await api.getRoleForProjectDisclosure(params);
      store.commit('SET_ROLE_ARR', data);
      return data;
    },
    setProjectDisclosure(store, params) {
      return api.setProjectDisclosure(params);
    },
    projectModelConfirm(store, params) {
      return api.projectModelConfirm(params);
    },
    projectModelChange(store, params) {
      return api.projectModelChange(params);
    },
    getFeedbackDetail(store, params) {
      return api.getFeedbackDetail(params);
    },
    getTaskFeedbackDetail(store, params) {
      return api.getTaskFeedbackDetail(params);
    },
    taskCompleteConfirm(store, params) {
      return api.taskCompleteConfirm(params);
    },
    projectApproval(store, params) {
      return api.projectApproval(params);
    },
    projectWithdraw(store, params) {
      return api.projectWithdraw(params);
    },
    milestoneCommit(store, params) {
      return api.milestoneCommit(params);
    },
    async getApprovalList(store, params) {
      const { data } = await api.getApprovalList(params);
      store.commit('SET_APPROVAL_LIST', data);
    },
    async getApprovalListForContract(store, params) {
      let { data } = await api.getApprovalList(params);
      store.commit('SET_APPROVAL_LIST_FOR_CONTRACT', data || []);
      return data;
    },
    businessOppList(store, params) {
      return api.businessOppList(params);
    },
    revokeApproval(store, params) {
      return api.revokeApproval(params);
    },
    importTemplate(store, params) {
      return api.importTemplate(params);
    },
    addWBSPlan(store, params) {
      return api.addWBSPlan(params);
    },
    disclosureFileStart(store, params) {
      return api.disclosureFileStart(params);
    },
    contractGeneral(store, params) {
      return api.contractGeneral(params);
    },
    biddingList(store, params) {
      return api.biddingList(params);
    },
    getReportForContract(store, params) {
      return api.getReportForContract(params);
    },
    getReportForProjectLevel(store, params) {
      return api.getReportForProjectLevel(params);
    },
    getReportForProjectStatus(store, params) {
      return api.getReportForProjectStatus(params);
    },
    cleanPlan(store, params) {
      return api.cleanPlan(params);
    },
    exportWBSExcel(store, params) {
      return api.exportWBSExcel(params);
    }
  }
};

export default project;
