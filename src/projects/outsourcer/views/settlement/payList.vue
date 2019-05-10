<template>
  <div class="project-list">
    <div class="clearfix">
      <router-link :to="{name: 'outsourcerSettlementApply'}"
                   target="_blank">
        <el-button type="danger"
                   size="small"
                   class="float-right">新增付款申请</el-button>
      </router-link>
    </div>
    <model-list :options="listConfig"
                :data="[]"></model-list>
  </div>
</template>
<script>
import modelList from '@/components/modelList';
import listConfig from './config/payList.config';
export default {
  components: {
    modelList
  },
  data(){
    return {
      listConfig
    }
  }
}
</script>
