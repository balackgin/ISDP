<template>
  <div class="doc-components-wrap">
    <h1>{{$route.params.name}}</h1>
    <p>type:</p>
    <model-detail :options="modelDetailConfig"
                  :data="modelDetailData"></model-detail>
    <pre>
    {{modelDetailConfig}}
  </pre>
    <el-tree default-expand-all
             :data="modelDetailTreeData"></el-tree>
  </div>
</template>
<script>
import modelDetailConfig from './config/model.detail.config';
import modelDetailData from './config/model.detail.data.config';
import modelDetailTreeData from './config/model.detail.tree.config';
const modelDetail = () => import('@/components/modelDetail');
export default {
  components: {
    modelDetail
  },
  data(){
    return {
      modelDetailConfig,
      modelDetailData,
      modelDetailTreeData
    }
  }
}
</script>
<style lang="less" scoped>
  .doc-components-wrap {
    padding: 50px 20px 200px;
  }
</style>
