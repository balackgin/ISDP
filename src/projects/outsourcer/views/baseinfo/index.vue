<template>
  <model-layout :options="config">
    <template slot="main">
      <router-view></router-view>
    </template>
  </model-layout>
</template>
<script>
import modelLayout from '@/components/modelLayout';
import { mapState } from 'vuex';
export default {

  components: {
    modelLayout
  },
  data() {
    return {
      config: {
        navs: [
          {
            name: 'outsourcerBaseinfoIndex',
            text: '基本信息',
            icon: 'fa-address-card',
            route: {
              name: 'outsourcerBaseinfoIndex'
            }
          },
          {
            name: 'outsourcerBaseinfoDetail',
            text: '详细信息',
            icon: 'fa-certificate',
            route: {
              name: 'outsourcerBaseinfoDetail'
            }
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      outsourcerInfo: (state) => state.outsourcer.common.outsourcerInfo || {}
    })
  },
  methods: {
    async getDetail(){
      const { id } = this.outsourcerInfo;
      if (!id) {
        await this.$store.commit('outsourcer/apply/SET_DETAIL',Object.assign({}));
        return false;
      }
      await this.$store.dispatch('outsourcer/apply/getDetailForBaseinfo',{
        id
      });
    }
  },
  async created(){
    await this.$store.dispatch('outsourcer/common/getOutsourcerInfo');
    await this.getDetail();
  }
};
</script>
