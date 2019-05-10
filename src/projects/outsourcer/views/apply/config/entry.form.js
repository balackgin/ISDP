export const form = {
  // id: 83, // 外包商ID      选填
  // approvalFormId: '', // 审批单ID      选填
  contractCompany: '', // 申请单位
  contactMan: '', // 联系人
  contactTel: '', // 联系人电话
  email: '', // 联系人邮箱
  // proManager: '', // 工程管理人员人数
  // engineerManager: '', // 技术管理人员人数
  postalAddress: '', // 通讯地址
  contractorType: [], // 所属类别
  contractorStatus: '', // 供应商状态
  // certificationCategory: '', // 认证类别
  projectArea: [], // 可承接项目区域
  projectType: [], // 可承接项目类型
  bankDeposit: '', // 开户行
  bankAccountNo: '', // 开户行账号
  registeredFund: '', // 注册资金
  businessLicense: [], // 营业执照
  referrer: '', // 推荐人
  referrerTel: '' // 推荐人电话
  // approvalVersion: 1, // 申请修改版本号   选填
  // version: 0 // 外包商修改版本号 选填

  // enterpriseCertificateArray: [],
  // enterpriseCertificateArray: [ {           // 企业资质信息
  //   id: '',                               // 企业荣誉资质ID   选填
  //   certificateName: '',                  // 证书名称
  //   certificateLeve: '',                  // 证书级别
  //   version: '',                          // 修改版本号       选填
  //   attachmentArray: [                    // 附件列表         选填
  //     {
  //       id: '',                           // 附件ID           选填
  //       fileUploadId: ''                  // 文件ID
  //     }
  //   ]
  // } ],

  // certificateArray: [],
  // enterpriseCertificateArray: [ {           // 资质证书信息
  //   id: '',                               // 企业荣誉资质ID   选填
  //   certificateName: '',                  // 证书名称
  //   certificateLeve: '',                  // 证书级别
  //   expireDate: '',                       // 有效期
  //   version: '',                          // 修改版本号       选填
  //   attachmentArray: [                    // 附件列表         选填
  //     {
  //       id: '',                           // 附件ID           选填
  //       fileUploadId: ''                  // 文件ID
  //     }
  //   ]
  // } ],

  // staffArray: [],
  // staffArray: [ {                           //员工信息
  //   id: '',                               // 员工ID           选填
  //   staffName: '',                        // 姓名
  //   duty: '',                             // 职务
  //   technicalTitle: '',                   // 职称
  //   specialty: '',                        // 专业
  //   idNumber: '',                         // 身份证号
  //   version: '',                          //修改版本号        选填
  //   attachmentArray: [                    // 附件列表         选填
  //     {
  //       id: '',                           // 附件ID           选填
  //       fileUploadId: ''                  // 文件ID
  //     }
  //   ]
  // } ],

  // vehicleArray: [],
  // vehicleArray: [ {                        //车辆信息
  //   id: '',                              // 车辆ID            选填
  //   manufactureInfo: '',                 // 型号/产地/出厂日期
  //   vehicleType: '',                     // 车辆类型
  //   count: '',                           // 数量
  //   value: '',                           // 价值 单位: 元
  //   version: ''                          // 修改版本号         选填
  // } ],
  // equipmentArray: [],
  // equipmentArray: [ {                       //设备信息
  //   id: '',                               // 设备ID           选填
  //   equipmentType: '',                    // 设备类型
  //   equipmentCount: '',                            // 数量
  //   version: ''                           // 修改版本号       选填
  // } ],
  // achievementArray: []
  // achievementArray: [ {                     // 业绩信息
  //   id: '',                               // 业绩信息ID       选填
  //   projectName: '',                      // 项目名称
  //   projectAmount: '',                    // 项目金额 单位: 元
  //   startDate: '',                        // 开始日期
  //   endDate: '',                         // 结束日期
  //   constructorCompany: '',                      // 建设单位
  //   constructorContacter: '',             // 建设单位联系人
  //   constructorContacterTel: '',          // 建设单位联系人电话
  //   projectManager: '',                   // 工程商项目经理
  //   projectStatus: '',                    // 项目状态
  //   version: ''                           //修改版本号         选填
  // } ]
};

function getRuleItem(vm, msg) {
  return [
    {
      required: true,
      trigger: [ 'blur' ],
      // message: msg
      validator(rule, value, callback) {
        if (value && value.length) {
          callback();
        } else {
          vm.$elMessage({
            message: msg,
            type: 'error'
          });
          callback(new Error(msg));
        }
      }
    }
  ];
}
export const rules = (vm) => ({
  contractCompany: getRuleItem(vm, '请输入申请单位!'),
  contactMan: getRuleItem(vm, '请输入联系人!'),
  // proManager: getRuleItem(vm, '请输入工程管理人员人数！'),
  // engineerManager: getRuleItem(vm, '请输入技术管理人员人数！'),
  contactTel: [
    ...getRuleItem(vm, '请输入联系人电话!'),
    {
      trigger: [ 'blur' ],
      validator: (rule, value, callback) => {
        if (vm.regexp.mobile.test(value)) {
          callback();
        } else {
          vm.$elMessage({
            message: '联系人电话号码不正确,请重新输入!',
            type: 'error'
          });
          callback(new Error('联系人电话号码不正确,请重新输入!'));
        }
      }
    }
  ],
  registeredFund: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value || Number.isNaN(+value)) {
          const msg = '请输入注册资金,只能填写数字!';
          vm.$elMessage({
            message: msg,
            type: 'error'
          });
          callback(new Error(msg));
        } else {
          callback();
        }
      }
    }
  ],
  businessLicense: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value && value.length) {
          callback();
        } else {
          const msg = '请上传营业执照!';
          vm.$elMessage({
            message: msg,
            type: 'error'
          });
          callback(new Error(msg));
        }
      }
    }
  ],
  email: [
    {
      trigger: 'blur',
      required: true,
      validator: (rule, value, callback) => {
        if (vm.regexp.email.test(value)) {
          callback();
        } else {
          const msg = '请输入正确的邮箱地址!';
          vm.$elMessage({
            message: msg,
            type: 'error'
          });
          callback(new Error(msg));
        }
      }
    }
  ],
  postalAddress: getRuleItem(vm, '请输入通讯地址!'),
  contractorType: getRuleItem(vm, '请选择所属类别!'),
  // certificationCategory: getRuleItem(vm, '请填写认证类型!'),
  projectArea: getRuleItem(vm, '请输入可承接项目区域!'),
  projectType: [
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value.length) {
          callback();
        } else {
          vm.$elMessage({
            message: '请选择可承接项目类型!',
            type: 'error'
          });
          callback(new Error('请选择可承接项目类型'));
        }
      }
    }
  ],
  bankDeposit: getRuleItem(vm, '请输入开户行!'),
  bankAccountNo: getRuleItem(vm, '请输入开户行账号!'),
  referrer: getRuleItem(vm, '请输入推荐人!')
});

export const dialogRules = (vm) => ({
  qualifications: {
    certificateName: getRuleItem(vm, '请输入资质证书名称!'),
    certificateNo: getRuleItem(vm, '请输入证书编号!'),
    expireDate: getRuleItem(vm, '请选择有效期!'),
    attachmentArray: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (value.length) {
            callback();
          } else {
            vm.$elMessage({
              message: '请上传附件!',
              type: 'error'
            });
            callback(new Error('请上传附件!'));
          }
        }
      }
    ]
  },
  personnel: {
    staffName: getRuleItem(vm, '请输入姓名!'),
    duty: getRuleItem(vm, '请选择职务'),
    idNumber: [
      ...getRuleItem(vm, '请输入身份证号码!'),
      {
        trigger: [ 'blur' ],
        validator: (rule, value, callback) => {
          if (vm.regexp.IDNum.test(value)) {
            callback();
          } else {
            vm.$elMessage({
              message: '身份证号码不正确,请重新输入!',
              type: 'error'
            });
            callback(new Error('身份证号码不正确,请重新输入!'));
          }
        }
      }
    ],
    attachmentArray: [
      ...getRuleItem(vm, '请上传附件!'),
      {
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (value.length) {
            callback();
          } else {
            vm.$elMessage({
              message: '请上传附件!',
              type: 'error'
            });
            callback(new Error('请上传附件!'));
          }
        }
      }
    ]
  },
  vehicle: {
    vehicleType: getRuleItem(vm, '请输入车辆名称!'),
    count: [
      ...getRuleItem(vm, '请输入数量!'),
      {
        trigger: [ 'blur' ],
        validator: (rule, value, callback) => {
          if (Number.isNaN(+value) || +value <= 0) {
            vm.$elMessage({
              message: '数量只能输入大于0的数字!',
              type: 'error'
            });
            callback(new Error('数量只能输入大于0的数字!'));
          } else {
            callback();
          }
        }
      }
    ],
    value: [
      ...getRuleItem(vm, '请输入价值!'),
      {
        trigger: [ 'blur' ],
        validator: (rule, value, callback) => {
          if (Number.isNaN(+value) || +value <= 0) {
            vm.$elMessage({
              message: '价值只能输入大于0的数字!',
              type: 'error'
            });
            callback(new Error('价值只能输入大于0的数字!'));
          } else {
            callback();
          }
        }
      }
    ]
  },
  achievement: {
    projectName: getRuleItem(vm, '请输入项目名称!'),
    projectAmount: [
      ...getRuleItem(vm, '请输入项目金额!'),
      {
        trigger: [ 'blur' ],
        validator: (rule, value, callback) => {
          if (Number.isNaN(+value) || +value <= 0) {
            vm.$elMessage({
              message: '项目金额只能输入大于0的数字!',
              type: 'error'
            });
            callback(new Error('项目金额只能输入大于0的数字!'));
          } else {
            callback();
          }
        }
      }
    ],
    cycle: [
      ...getRuleItem(vm, '请选择实施周期!'),
      {
        trigger: [ 'blur' ],
        validator: (rule, value, callback) => {
          if (!value || !value[0] || !value[1]) {
            vm.$elMessage({
              message: '请选择实施周期!',
              type: 'error'
            });
            callback(new Error('请选择实施周期!'));
          } else {
            callback();
          }
        }
      }
    ],
    constructorCompany: getRuleItem(vm, '请输入建设单位!'),
    constructorContacter: getRuleItem(vm, '请输入建设单位联系人!'),
    constructorContacterTel: [
      ...getRuleItem(vm, '请输入联系人电话!'),
      {
        trigger: [ 'blur' ],
        validator: (rule, value, callback) => {
          if (vm.regexp.mobile.test(value)) {
            callback();
          } else {
            vm.$elMessage({
              message: '联系人电话号码输入不正确,请重新输入!',
              type: 'error'
            });
            callback(new Error('联系人电话号码不正确,请重新输入!'));
          }
        }
      }
    ],
    projectManager: getRuleItem(vm, '请输入项目经理!')
  }
});
