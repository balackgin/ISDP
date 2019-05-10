<template>
  <div class="certificate-wrap">
    <section class="group">
      <p class="title">资质证书</p>
      <model-table :options="tableConfig.qualifications"
                   :fns="tableActions"
                   :data="detailData.certificateArray"></model-table>
    </section>
    <section class="group">
      <p class="title">主要人员详情</p>
      <model-table :options="tableConfig.personnel"
                   :fns="tableActions"
                   :data="detailData.staffArray"></model-table>
    </section>
    <section class="group">
      <p class="title">主要车辆详情</p>
      <model-table :options="tableConfig.vehicle"
                   :data="detailData.vehicleArray"></model-table>
    </section>
    <section class="group">
      <p class="title">业绩详情</p>
      <model-table :options="tableConfig.achievement"
                   :data="detailData.achievementArray"></model-table>
    </section>
  </div>
</template>
<script>
import modelTable from '@/components/modelList/modelTable';
import tableConfig from './config/detail';
import { mapState } from 'vuex';
export default {
  metaInfo: {
    title: '外包工程商详细信息'
  },
  components: {
    modelTable
  },
  data(){
    return {
      tableConfig,
      tableActions: {
        attachmentFn(val){
          return val && val.map((item)=>item.fileName).join(' , ')
        }
      }
      // qualificationsData: [],
      // personnelData: [],
      // vehicleData: [],
      // achievementData: []
    }
  },
  computed: {
    ...mapState({
      detailData: (state) => state.outsourcer.apply.detailData || {}
    })
  }
  // methods: {
  //   async getQualificationsList(){  //证书
  //     let { data } = await this.$store.dispatch('outsourcer/apply/getQualificationsList',{
  //       id: 4
  //     });
  //     this.qualificationsData = data;
  //   },
  //   async getPersonnelList(){  //人员
  //     let { data } = await this.$store.dispatch('outsourcer/apply/getPersonnelList',{
  //       id: 4
  //     });
  //     this.personnelData = data;
  //   },
  //   async getVehicleList(){   //车辆
  //     let {data} = await this.$store.dispatch('outsourcer/apply/getVehicleList',{
  //       id: 4
  //     });
  //     this.vehicleData = data;
  //   },
  //   async getAchievementList(){  //业绩
  //     let {data} = await this.$store.dispatch('outsourcer/apply/getAchievementList',{
  //       id: 4
  //     });
  //     this.achievementData = data;
  //   }
  // },
  // created () {
  // this.getQualificationsList();
  // this.getPersonnelList();
  // this.getVehicleList();
  // this.getAchievementList();
  // }
}
</script>
<style lang="less" scoped>
  .certificate-wrap {
    .group {
      margin-bottom: 24px;
      .title {
        padding: 10px 0;
      }
    }
  }
</style>
