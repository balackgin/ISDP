import api from '@/projects/outsourcer/api/apply';
export default {
  namespaced: true,
  state: {
    detailData: null
  },
  mutations: {
    SET_DETAIL(state, data) {
      state.detailData = data;
    }
  },
  actions: {
    async approvalSave(store, params) {
      return await api.approvalSave(params);
    },
    async approvalSubmit(store, params) {
      return await api.approvalSubmit(params);
    },
    async getDetail(store, params) {
      return await api.getDetail(params);
    },
    async getDetailForBaseinfo(store, params) {
      let { data, resultCode } = await api.getDetail(params);
      if (+resultCode === 200 && data) {
        const {
          countVO,
          equipmentArray,
          staffCount = {},
          vehicleArray,
          achievementArray: achievementArr = []
        } = data;
        let equipmentCountArr = equipmentArray.map((item) => {
            item.listContent =
              (countVO.equipmentCount &&
                `${ item.equipmentType || '' }<strong>${ countVO.equipmentCount ||
                  0 }</strong>台`) ||
              '';
            return item;
          }),
          vehicleCountArr = vehicleArray.map((item) => {
            item.listContent =
              (item.count &&
                `${ item.vehicleType }<strong>${ item.count }</strong>辆`) ||
              '';
            return item;
          }),
          achievementArray = achievementArr.map((item) => {
            const startYear = new Date(item.startDate).getFullYear();
            item.listContent = `<strong>${ startYear }</strong>年内完成同类业绩金额累积总计<strong>${
              item.projectAmount
            }</strong>万元`;
            item.cycle = item.startDate + ' ~ ' + item.endDate;
            return item;
          });
        //设备情况 start
        equipmentCountArr.unshift({
          listContent: `设备总数量<strong>${ countVO.equipmentCount ||
            0 }</strong>台`
        });
        //设备情况 end
        // 人员情况 start
        let personMatchCNObj = {
          dataManager: '资料员',
          // total: '在编总人数',
          techWorker: '技术员',
          techGovernor: '技术管理人员',
          techManager: '工程管理人员',
          contGovernor: '设计人员',
          other: '其他'
        };
        //         其他
        // 工程管理人员
        // 技术员
        // 技术管理人员
        // 设计人员
        // 资料员
        let staffCountArr = Object.keys(personMatchCNObj).map((item) => {
          const obj = {};
          obj.listContent =
            (staffCount &&
              staffCount[item] &&
              `${ personMatchCNObj[item] || '' }<strong>${ (staffCount &&
                staffCount[item]) ||
                0 }</strong>人`) ||
            '';
          return obj;
        });
        // ({
        //   text: personMatchCNObj[item] || '',
        //   num: (staffCount && staffCount[item]) || 0
        // }));
        // console.log(staffCountArr, 'staffCountArr');
        staffCountArr.unshift({
          listContent: `在编总人数<strong>${ (staffCount && staffCount.total) ||
            0 }</strong>人`
        });
        // 人员情况 end
        // 车辆情况 start
        vehicleCountArr.unshift({
          listContent:
            (countVO.vehicleCount &&
              `车辆总数量<strong>${ countVO.vehicleCount }</strong>辆`) ||
            ''
        });
        // 车辆情况 end
        // 业绩情况  start
        // data.achievementArray = data.achievementArray.map((item) => {
        //   item.cycle = item.startDate + ' ~ ' + item.endDate;
        //   item
        //   return item;
        // });
        // 业绩情况  end
        store.commit(
          'SET_DETAIL',
          Object.assign({}, data, {
            equipmentCountArr,
            staffCountArr,
            vehicleCountArr,
            achievementArray
          })
        );
      } else {
        store.commit('SET_DETAIL', {});
      }
    },
    async getQualificationsList(store, params) {
      return await api.getQualificationsList(params);
    },
    async getPersonnelList(store, params) {
      return await api.getPersonnelList(params);
    },
    async getVehicleList(store, params) {
      return await api.getVehicleList(params);
    },
    async getAchievementList(store, params) {
      return await api.getAchievementList(params);
    }
  }
};
