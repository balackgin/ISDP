<template>
  <div class="settlement-apply-wrap">
    <div class="apply-box">
      <header class="head-box mt-1">
        <span class="title">外包工程商付款申请</span>
        <span class="txt ml-3">
          单据编号: AG201
        </span>
        <span class="txt ml-1">申请日期: 20181105</span>
      </header>
      <model-form-group :options="payForm"
                        :form="{}"
                        class="mt-1">

      </model-form-group>
      <section class="enclosure-box">
        <p class="caption">支撑材料</p>
        <model-table :options="payTable"
                     :data="[{}]"></model-table>
      </section>
      <div class="btns text-center mt-3">
        <el-button size="small">保存</el-button>
        <el-button size="small"
                   type="danger">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import modelFormGroup from '@/components/modelFormGroup';
import modelTable from '@/components/modelList/modelTable';
import formConfig from './config/apply.config.json';
export default {
  components: {
    modelFormGroup,
    modelTable
  },
  data(){
    return {
      payForm: formConfig.payForm,
      payTable: formConfig.payTable
    }
  }
}
</script>
<style lang="less" scoped>
  .settlement-apply-wrap {
    .apply-box {
      width: 960px;
      max-width: 92%;
      margin: 20px auto;
      padding: 10px 30px;
      border-radius: 5px;
      border: 1px solid #ddd;
      background-color: #fff;
    }
    .head-box {
      .title {
        font-size: 20px;
        font-weight: 700;
      }
      .txt {
        color: #999;
        font-size: 14px;
      }
    }
    .enclosure-box {
      .caption {
        padding: 6px 0;
      }
    }
    .btns {
      .el-button {
        margin-right: 14px;
      }
    }
  }
</style>
