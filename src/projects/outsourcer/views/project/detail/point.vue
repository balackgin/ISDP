<template>
  <div class="point">
    <model-list :options="listConfig"
                :data="[]"></model-list>
  </div>
</template>
<script>
import modelList from '@/components/modelList';
import listConfig from '../config/detail.config.json';
export default {
  components: {
    modelList
  },
  data() {
    return {
      listConfig
    };
  }
};
</script>
