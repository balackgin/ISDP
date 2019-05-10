import { mapState } from 'vuex';
import outsideDialog from '@/components/outsideDialog';
import modelForm from '@/components/modelFormGroup/index';
import modelFormItem from '@/components/modelFormGroup/modelFormItem';
import modelCol from '@/components/modelFormGroup/modelCol';
import modelTable from '@/components/modelList/modelTable';
import Config from './entry.config';
const {
  qualifications,
  personnel,
  vehicle,
  achievement,
  equipment,
  enterpriseQualificationArray
} = Config.table;

function collectFn(data, prop, optsArr, { totalText, unit } = {}) {
  const collectObj = {};
  const optsArray = [
    ...optsArr,
    {
      value: '其他',
      label: '其他'
    }
  ];
  data.forEach((item) => {
    const hasItem = optsArr.some((key) => key.value === item[prop]),
      objKey = hasItem ? item[prop] : '其他',
      val = collectObj[objKey];

    collectObj[objKey] = item.count
      ? (val && +val + +item.count) || +item.count
      : val
        ? +val + 1
        : 1;
  });
  let total = 0;
  const result = optsArray.map((item, idx) => {
    let count = +collectObj[item.value] || 0;
    total += +count || 0;
    return {
      text: item.value,
      count,
      appendText: optsArray.length - 1 === idx ? unit : `${ unit },`
    };
  });
  // const result = Object.keys(collectObj).map((item,idx) => {
  //   const count = +collectObj[item] || 0;
  //   total += +count;
  //   return {
  //     text: item,
  //     count,
  //     appendText: optsArr.length - 1 === idx ? unit : `${ unit },`
  //   }
  // });

  result.unshift({
    text: totalText,
    count: total,
    appendText: `${ unit }, 其中: `
  });
  return result;
}

export default {
  metaInfo() {
    return {
      title:
        (this.options.isFrame && this.options.title) || '外包工程商纳入申请'
    };
  },
  components: {
    modelForm,
    modelFormItem,
    modelCol,
    modelTable,
    outsideDialog
  },
  data() {
    const rules = Config.rules(this),
      dialogRules = Config.dialogRules(this);
    return {
      form: Config.form,
      rules,
      dialogRules,
      baseInfoConfig: Config.baseinfo,
      // model-table start
      qualifications,
      qualificationsData: [],
      personnel,
      personnelData: [],
      vehicle,
      vehicleData: [],
      achievement,
      achievementData: [],
      equipment: equipment.columns,

      enterpriseQualificationArray, //企业资质
      enterpriseCertificateArrayForm: {
        //企业资质form
        computedChecked: false, //计算机信息系统集成企业资质
        computed: '',
        architectureChecked: false, //建筑智能化工程专业承包企业资质
        architecture: '',
        securityChecked: false, //安防工程企业资质
        security: '',
        other: '' //其他资质
      },
      tableActions: {
        cycle(val, data) {
          return (
            (val && val.join(' ~ ')) || data.startDate + ' ~ ' + data.endDate
          );
        },
        attachmentArrayFn(val) {
          let arr = val.map((item) => item.fileName);
          return arr.join(' , ');
        },
        rowClassName(row) {
          return row.isDel && 'hide-row';
        }
      },
      // model-table end
      // outside-dialog start
      dialog: Config.dialog,
      dialogForm: {},
      dialogOptions: {},
      dialogRulesOptions: {},
      outsideDialogShow: false,
      // outside-dialog  end
      btnStyle: {},
      getFormObj: {},

      personTotalData: {
        total: '',
        techManager: '',
        techGovernor: '',
        techWorker: '',
        contGovernor: '',
        dataManager: '',
        other: ''
      },
      remoteData: {}
    };
  },
  computed: {
    ...mapState({
      userinfo(state) {
        let user = state.common.userinfo;
        this.form.contactTel ? '' : (this.form.contactTel = user && user.tel);
        return user || {};
      },
      regexp: (state) => state.common.regexp,
      selects: (state) => state.outsourcer.common.selects,
      citys: (state) => {
        const arr = state.common.citys,
          firstArr = [],
          secondArr = [];
        arr.forEach((item) => {
          if (item.children && item.children.length) {
            secondArr.push(item); // 省
            // item.children.forEach((cityChild) => {
            //   secondArr.push(
            //     Object.assign({}, cityChild, {
            //       label: item.label + ' ' + cityChild.label
            //     })
            //   );
            // });
          } else {
            firstArr.push(item); //直辖市
          }
        });
        return [
          {
            label: '海外',
            value: '海外'
          },
          {
            label: '全国',
            value: '全国'
          },
          ...firstArr,
          ...secondArr
        ];
      },
      outsourcerInfo: (state) => state.outsourcer.common.outsourcerInfo || {}
    }),
    // personnelCount() {
    //   //人员统计
    //   const { personnelData, selects } = this,
    //     duty = selects.duty.options;
    //   return collectFn(personnelData, 'duty', duty, {
    //     totalText: '在编总人数',
    //     unit: '人'
    //   });
    // },
    vehicleTypeCount() {
      const { vehicleData, selects } = this,
        vehicleType = selects.vehicleType.options;
      return collectFn(vehicleData, 'vehicleType', vehicleType, {
        totalText: '车辆总数量',
        unit: '辆'
      });
    },

    achievementCount() {
      const { achievementData } = this,
        collectObj = {};

      achievementData.forEach((item) => {
        if (+item.isDel) {
          return false;
        }
        const cycle = (item.cycle && item.cycle.split(' ~ ')) || [];
        let year = cycle[0] || item.startDate;
        year = year && new Date(year).getFullYear();
        let num = collectObj[year]
          ? +collectObj[year] + +item.projectAmount
          : +item.projectAmount;
        collectObj[year] = Number.isNaN(+num) ? 0 : num.toFixed(2);
      });
      let result = Object.keys(collectObj).map((item) => ({
        year: item,
        num: collectObj[item]
      }));
      return result.length ? result : [ {} ];
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleListData(data = []) {
      return data.filter((item) => !+item.isDel);
    },
    handleClickForPlus(name) {
      let obj = this.dialog[name],
        rules = this.dialogRules[name];
      if (obj) {
        this.dialogOptions = obj;
        rules ? (this.dialogRulesOptions = rules) : '';
        this.dialogForm = Object.assign({}, obj.data);
        this.outsideDialogShow = true;
      }
    },
    // model-table fn start
    personnelRemove(rowData) {
      const { personnelData } = this,
        index = personnelData.findIndex(
          (item) =>
            (item.id && item.id === rowData.id) ||
            (item._index && item._index === rowData._index)
        );
      rowData.id
        ? (personnelData[index].isDel = 1)
        : personnelData.splice(index, 1);
    },
    qualificationsRemove(rowData) {
      const { qualificationsData } = this,
        index = qualificationsData.findIndex(
          (item) =>
            (item.id && item.id === rowData.id) ||
            (item._index && item._index === rowData._index)
        );
      rowData.id
        ? (qualificationsData[index].isDel = 1)
        : qualificationsData.splice(index, 1);
    },
    vehicleRemove(rowData) {
      const { vehicleData } = this,
        index = vehicleData.findIndex(
          (item) =>
            (item.id && item.id === rowData.id) ||
            (item._index && item._index === rowData._index)
        );
      rowData.id
        ? (vehicleData[index].isDel = 1)
        : vehicleData.splice(index, 1);
    },
    achievementRemove(rowData) {
      const { achievementData } = this,
        index = achievementData.findIndex(
          (item) =>
            (item.id && item.id === rowData.id) ||
            (item._index && item._index === rowData._index)
        );
      rowData.id
        ? (achievementData[index].isDel = 1)
        : achievementData.splice(index, 1);
    },
    // model-table fn end

    // outside-dialog fn start
    beforeClose() {
      this.outsideDialogShow = false;
    },
    getForm(name, vm) {
      this.getFormObj[name] = vm;
    },
    async outsideDialogSubmit() {
      let formVM = await this.$refs.dialog.getForm();
      const vm = this;
      formVM.validate((valid) => {
        if (valid) {
          const { dialogForm } = vm,
            args = JSON.parse(JSON.stringify(dialogForm)),
            { _name: name } = args;
          args._index = Date.now();
          if (args.attachmentArray) {
            args.attachmentArray = args.attachmentArray.map((item) =>
              Object.assign(item, {
                fileUploadId: item.data.id,
                fileName: item.name
              })
            );
          }
          switch (name) {
          case 'dialog-qualifications':
            vm.qualificationsData.push(args);
            break;
          case 'dialog-personnel':
            vm.personnelData.push(args);
            break;
          case 'dialog-vehicle':
            vm.vehicleData.push(args);
            break;
          case 'dialog-achievement':
            args.cycle = (args.cycle && args.cycle.join(' ~ ')) || '';
            vm.achievementData.push(args);
            break;
          default:
            break;
          }
          vm.outsideDialogShow = false;
          this.$refs.dialog.clearFiles();
        }
      });
    },
    // outside-dialog fn end
    async getDetail() {
      const { enterpriseCertificateArrayForm } = this,
        { id } = this.outsourcerInfo;
      if (!id) {
        return false;
      }
      let { data, resultCode } = await this.$store.dispatch(
        'outsourcer/apply/getDetail',
        {
          id
        }
      );
      if (+resultCode !== 200) {
        return false;
      }

      data.projectType && data.projectType.push
        ? ''
        : (data.projectType =
            data.projectType && data.projectType.split('/')) || [];

      const {
        enterQualificationArray = [],
        certificateArray = [],
        staffArray = [],
        achievementArray = [],
        vehicleArray = [],
        equipmentArray = [],
        countVO,
        projectArea = [],
        contractorType = [],
        businessLicense = [],
        staffCount
      } = data;
      // 企业资质 start
      // let otherObj = {};
      enterQualificationArray.forEach((item) => {
        switch (item.qualificationName) {
        case '计算机信息系统集成企业资质':
          enterpriseCertificateArrayForm.computedChecked = true;
          enterpriseCertificateArrayForm.computed = item.qualificationLevel;
          enterpriseCertificateArrayForm.computedID = item.id;
          enterpriseCertificateArrayForm.computedVersion = item.version;
          break;
        case '建筑智能化工程专业承包企业资质':
          enterpriseCertificateArrayForm.architecture =
              item.qualificationLevel;
          enterpriseCertificateArrayForm.architectureChecked = true;
          enterpriseCertificateArrayForm.architectureID = item.id;
          enterpriseCertificateArrayForm.architectureVersion = item.version;
          break;
        case '安防工程企业资质':
          enterpriseCertificateArrayForm.security = item.qualificationLevel;
          enterpriseCertificateArrayForm.securityChecked = true;
          enterpriseCertificateArrayForm.securityID = item.id;
          enterpriseCertificateArrayForm.securityVersion = item.version;
          break;
        default:
          // otherObj = {
          //   content: item.qualificationName,
          //   id: item.id,
          //   version: item.version
          // };
          break;
        }
      });
      // enterpriseCertificateArrayForm.other = otherObj.content;
      // enterpriseCertificateArrayForm.otherID = otherObj.id;
      // enterpriseCertificateArrayForm.otherVersion = otherObj.version;

      // 企业资质 end
      this.personTotalData = Object.assign(
        {},
        this.personTotalData,
        staffCount
      );
      // 资质证书 start
      this.qualificationsData = [ ...certificateArray ];
      // 资质证书 end
      // 人员详情 start
      this.personnelData = [ ...staffArray ];
      // 人员详情 end
      // 车辆详情  start
      this.vehicleData = [ ...vehicleArray ];
      // 车辆详情  end
      // 设备信息  start
      let equipmentArr = equipmentArray.map((item) => {
        item.equipmentCount = item.equipmentCount || '';
        return item;
      });
      this.equipment = [
        {
          equipmentCount: countVO.equipmentCount,
          equipmentType: '设备总数量'
        },
        ...equipmentArr
      ];
      //设备信息  end
      // 业绩详情 start
      this.achievementData = achievementArray.map((item) => {
        item.startDate && item.endDate
          ? (item.cycle = item.startDate + ' ~ ' + item.endDate)
          : '';
        return item;
      });
      // 业绩详情 end
      delete data.countVO;
      delete data.staffCountVO;

      this.form = Object.assign({}, this.form, data, {
        projectArea: (projectArea && projectArea.split(',')) || [],
        businessLicense: businessLicense || [],
        contractorType: (contractorType && contractorType.split(',')) || []
      });
      setTimeout(() => {
        this.$refs.applyForm.clearValidate();
      });
    },
    async submit(isSubmit) {
      // isSubmit: 0 保存; 1 提交
      this.$refs.applyForm.validate(async (valid) => {
        if (valid) {
          const {
            form,
            qualificationsData, //资质证书
            personnelData, //人员详情
            vehicleData, //车辆详情
            achievementData, //业绩详情
            achievementCount, //业绩统计
            equipment, //设备详情
            // enterpriseCertificateArrayForm //企业资质
            personTotalData //人员统计
          } = this;
          // 资质证书
          if (isSubmit) {
            // const {
            //   proManager,
            //   engineerManager
            // } = personTotalData;
            // console.log(personTotalData, 'total');
            // if (+proManager && (+proManager <= 0 || !proManager)) {
            //   this.$elMessage({
            //     message: '请填写工程管理人员人数!',
            //     type: 'error'
            //   });
            //   return false;
            // } else if (+engineerManager !== 0 && (+engineerManager < 0 || !engineerManager)) {
            //   this.$elMessage({
            //     message: '请填写技术管理人员人数!',
            //     type: 'error'
            //   });
            //   return false;
            // } else
            if (!personnelData || personnelData.length < 1) {
              this.$elMessage({
                message: '请填写主要人员详情!',
                type: 'error'
              });
              return false;
            }
            // if (!vehicleData || vehicleData.length < 1) {
            //   this.$elMessage({
            //     message: '请填写主要车辆详情!',
            //     type: 'error'
            //   });
            //   return false;
            // }

            let lately = 0;
            achievementCount.forEach((item) => {
              item.year <= 2019 && item.year >= 2019 - 2 && lately++;
            });
            // console.log(lately, achievementCount, 'sdfsadf');
            if (lately < 2) {
              this.$elMessage({
                message: '请填写近两年的业绩详情, 至少填写两条业绩信息!',
                type: 'error'
              });
              return false;
            }
          }
          let certificateArray = JSON.parse(
            JSON.stringify(qualificationsData)
          ).map((item) => {
            delete item._name;
            delete item._index;
            !item.id && delete item.id;
            // item.version = item.version ? +item.version + 1 : 1;
            return item;
          });

          // 人员详情
          let staffArray = JSON.parse(JSON.stringify(personnelData)).map(
            (item) => {
              delete item._name;
              delete item._index;
              !item.id && delete item.id;
              // item.version = item.version ? +item.version + 1 : 1;
              return item;
            }
          );

          //车辆详情
          let vehicleArray = JSON.parse(JSON.stringify(vehicleData)).map(
            (item) => {
              delete item._name;
              delete item._index;
              !item.id && delete item.id;
              // item.version = item.version ? +item.version + 1 : 1;
              return item;
            }
          );

          // 设备详情
          let equipmentArr = JSON.parse(JSON.stringify(equipment));
          equipmentArr.shift();
          let equipmentArray = equipmentArr.map((item) => {
            item.equipmentCount = +item.equipmentCount
              ? (+item.equipmentCount < 0 && 0) || +item.equipmentCount
              : 0;
            // item.version = item.version ? +item.version + 1 : 1;
            return item;
          });

          //业绩详情
          let achievementArray = JSON.parse(
            JSON.stringify(achievementData)
          ).map((item) => {
            delete item._name;
            delete item._index;
            !item.id && delete item.id;
            // item.version = item.version ? +item.version + 1 : 1;
            const cycle = (item.cycle && item.cycle.split(' ~ ')) || [];
            item.startDate = cycle[0];
            item.endDate = cycle[1];
            delete item.cycle;
            return item;
          });

          // let enterQualificationArray = []; //企业资质

          // enterpriseCertificateArrayForm.computedChecked &&
          //   enterpriseCertificateArrayForm.computed &&
          //   enterQualificationArray.push({
          //     qualificationName: '计算机信息系统集成企业资质',
          //     qualificationLevel: enterpriseCertificateArrayForm.computed,
          //     version: enterpriseCertificateArrayForm.computedVersion,
          //     id: enterpriseCertificateArrayForm.computedID
          //   });

          // enterpriseCertificateArrayForm.architectureChecked &&
          //   enterpriseCertificateArrayForm.architecture &&
          //   enterQualificationArray.push({
          //     qualificationName: '建筑智能化工程专业承包企业资质',
          //     qualificationLevel: enterpriseCertificateArrayForm.architecture,
          //     version: enterpriseCertificateArrayForm.architectureVersion,
          //     id: enterpriseCertificateArrayForm.architectureID
          //   });

          // enterpriseCertificateArrayForm.securityChecked &&
          //   enterpriseCertificateArrayForm.security &&
          //   enterQualificationArray.push({
          //     qualificationName: '安防工程企业资质',
          //     qualificationLevel: enterpriseCertificateArrayForm.security,
          //     version: enterpriseCertificateArrayForm.securityVersion,
          //     id: enterpriseCertificateArrayForm.securityID
          //   });
          // enterpriseCertificateArrayForm.other &&
          //   enterQualificationArray.push({
          //     qualificationName: enterpriseCertificateArrayForm.other,
          //     qualificationLevel: '',
          //     version: enterpriseCertificateArrayForm.otherVersion,
          //     id: enterpriseCertificateArrayForm.otherID
          //   });

          let params = Object.assign({}, form, {
            certificateArray,
            staffArray,
            vehicleArray,
            equipmentArray,
            achievementArray,
            // enterQualificationArray,
            projectType: form.projectType.join('/'),
            projectArea: form.projectArea.join(','),
            contractorType: form.contractorType.join(','),
            staffCount: personTotalData
          });
          this.$refs.applyForm.clearValidate();
          let { data, resultCode } = await this.$store.dispatch(
            'outsourcer/apply/approvalSave',
            params
          );

          if (data && +resultCode === 200) {
            this.form.version = data.version;
            if (isSubmit) {
              let { resultCode: submitResultCode } = await this.$store.dispatch(
                'outsourcer/apply/approvalSubmit',
                {
                  businessId: data.id,
                  applicationCompany: form.contractCompany,
                  applicant: form.contactMan,
                  applicantTel: form.contactTel,
                  approvalStatus: form.statusSign
                }
              );
              if (+submitResultCode === 200) {
                this.$elMessage({
                  message: '提交成功!',
                  type: 'success'
                });
                (this.options.isFrame && this.$emit('callback', 'hidePopup')) ||
                  this.$router.replace({
                    name: 'outsourcerBaseinfoIndex'
                  });
              }
              //提交
            } else {
              this.$elMessage({
                message: '保存成功!',
                type: 'success'
              });
              !this.outsourcerInfo.id &&
                (await this.$store.dispatch(
                  'outsourcer/common/getOutsourcerInfo'
                ));
              this.getDetail();
            }
          }
        }
      });
    },
    changeBaseInfoHash() {
      document.querySelector('.entry-main').scrollTop = 0;
    },
    // beforeUploadForUpload(file, el) {
    //   // file,el
    //   if (file.size > 100 * 1024 * 1024) {
    //     this.$elMessage({
    //       message: '文件大小不能大于100M!',
    //       type: 'error'
    //     });
    //     el.abort();
    //     return false;
    //   } else if (
    //     !(
    //       file.type &&
    //       [ 'png', 'jpg', 'jpeg', 'pdf' ].includes(
    //         file.type.replace('image/', '')
    //       )
    //     )
    //   ) {
    //     this.$elMessage({
    //       message: '文件格式不正确',
    //       type: 'error'
    //     });
    //     el.abort();
    //     return false;
    //   }
    // },
    onSuccessForUpload(response, file, fileList, opts) {
      const { data, resultCode, resultMessage } = response;
      if (+resultCode === 200 || resultCode === 'FS200') {
        if (opts.prop === 'businessLicense') {
          let fileData = data.toJson(),
            fileUploadId = fileData.id;
          delete fileData.id;

          this.form[opts.prop] &&
            this.form[opts.prop].push(
              Object.assign({}, fileData, {
                fileUploadId
              })
            );
        } else {
          file.data = data;
          file.url = data.docUrl;
          this.dialogForm[opts.prop] = fileList;
        }
      } else {
        this.$elMessage({
          message: resultMessage,
          type: 'error'
        });
      }
    },
    handleChangeForEquipment() {
      let { equipment } = this,
        total = 0;
      equipment.forEach((item, idx) => {
        let num = +item.equipmentCount;
        if (
          idx > 0 &&
          (num && !(Number.isNaN(+num) || +num <= 0 || +num % 1 !== 0))
        ) {
          total += num;
          item.equipmentCount = num;
        } else {
          item.equipmentCount = '';
        }
      });
      this.equipment[0].equipmentCount = total;
    },
    handleChangeForPersonData(prop) {
      const { personTotalData = {} } = this,
        val = personTotalData[prop];
      if ((val && Number.isNaN(+val)) || +val <= 0 || +val % 1 !== 0) {
        personTotalData[prop] = '';
      } else {
        personTotalData[prop] = +personTotalData[prop];
      }
      const {
        engineerManager = 0,
        proManager = 0,
        techWorker = 0,
        designer = 0,
        dataManager = 0,
        other = 0
      } = personTotalData;
      personTotalData.total =
        +engineerManager +
        +proManager +
        +techWorker +
        +designer +
        +dataManager +
        +other;
    }

    // async onRemoveForUpload(file, fileList, opts) {
    //   let data = await this.$store.dispatch('common/delUploadFile',{
    //     fileUploadId: file.data.id
    //   });
    // }
  },
  mounted() {
    if (this.options.isFrame) {
      return false;
    }
    const vm = this;
    let ele = document.querySelector('.entry-main');
    vm.$route.hash
      ? vm.$route.hash === '#baseinfo'
        ? (ele.scrollTop = 0)
        : (location.href = vm.$route.hash)
      : ''; //锚点跳转
    vm.btnStyle = {
      right: ele.offsetWidth - ele.clientWidth + 'px'
    };

    let // baseinfo = document.getElementById('baseinfo'),
      qualifications = document.getElementById('qualifications'),
      personnel = document.getElementById('personnel'),
      vehicle = document.getElementById('vehicle'),
      equipment = document.getElementById('equipment'),
      achievement = document.getElementById('achievement');

    ele.addEventListener('scroll', function(event) {
      if (
        (event.target.classList &&
          event.target.classList.contains('entry-main')) ||
        event.target.className.includes('entry-main')
      ) {
        let top = ele.scrollTop,
          hash = vm.$route.hash;

        switch (true) {
        case top < qualifications.offsetTop:
          hash = '#baseinfo';
          break;
        case top < personnel.offsetTop:
          hash = '#qualifications';
          break;
        case top < vehicle.offsetTop:
          [ '#personnel', '#vehicle', '#equipment', '#achievement' ].includes(
            hash
          )
            ? ''
            : (hash = '#personnel');
          break;
        case top < equipment.offsetTop:
          [ '#vehicle', '#equipment', '#achievement' ].includes(hash)
            ? ''
            : (hash = '#vehicle');
          break;
        case top < achievement.offsetTop:
          [ '#equipment', '#achievement' ].includes(hash)
            ? ''
            : (hash = '#equipment');
          break;
        case achievement.offsetTop > top:
          hash = '#achievement';
          break;
        default:
          break;
        }
        if (hash) {
          // location.href = hash;
          vm.$router.replace({
            name: vm.$route.name,
            hash,
            query: vm.$route.query
          });
        }
      }
    });
  },
  async created() {
    if (!this.options.isFrame) {
      await this.$store.dispatch('outsourcer/common/getOutsourcerInfo');
    }
    await this.getDetail();
  },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
