import fetch from '@/utils/fetch';
// const feedback = '';
const feedback = '/easywork/api/project';
export default {
  //风险及问题追踪列表
  getRiskproblemList(args) {
    return fetch({
      url: feedback + '/riskproblem/list',
      method: 'post',
      data: args //post传参数
      // params: args //get传参数
    });
  },
  //新增
  saveRiskproblem(args) {
    return fetch({
      url: feedback + '/riskproblem/save',
      method: 'post',
      data: args
    });
  },
  //风险及问题追踪详情
  getRiskDetail(args) {
    return fetch({
      url: feedback + '/riskproblem/detail',
      method: 'post',
      data: args
    })
  },
  //风险及问题保存
  riskSave(args) {
    return fetch({
      url: feedback + '/riskproblem/save',
      method: 'post',
      data: args
    })
  },
  //发布问题风险
  releaseRisk(args) {
    return fetch({
      url: feedback + '/riskproblem/publish',
      method: 'post',
      data: args
    })
  },
  //作废
  defeatRisk(args) {
    return fetch({
      url: feedback + '/riskproblem/delete',
      method: 'post',
      data: args
    })
  },
  //关闭
  closedRisk(args) {
    return fetch({
      url: feedback + '/riskproblem/close',
      method: 'post',
      data: args
    })
  },
  //退回
  sendBackRisk(args) {
    return fetch({
      url: feedback + '/riskproblem/sendback',
      method: 'post',
      data: args
    })
  },
  //获取人员
  getMember(args) {
    return fetch({
      url: '/easywork/api/platform/role/project/members/query',
      method: 'post',
      data: args
    })
  },
  //财务类风险导出
  downexcel(args) {
    return fetch({
      url: feedback + '/riskproblem/downexcel',
      method: 'post',
      data: args,
      responseType: 'blob'
    })
  },
  //派发
  sendTask(args) {
    return fetch({
      url: feedback + '/riskproblem/send/task',
      method: 'post',
      data: args
    })
  },
  //挂起
  hangRisk(args) {
    return fetch({
      url: feedback + '/riskproblem/left/hanging',
      method: 'post',
      data: args
    })
  }
};
