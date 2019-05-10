<template>
  <div class="commonPagination">
    <div class="commonPagination_left">
      <span class="commonPagination_left_count">第 1 - 15 条，共24条</span>
      <div class="commonSelectBox" style="width:50px;">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <span class="commonPagination_left_unit">条/页</span>
    </div>
    <div class="commonPagination_right">
      <el-pagination layout="prev, pager, next" :total="1000"></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: '5',
          label: '5'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '20',
          label: '20'
        },
        {
          value: '50',
          label: '50'
        },
        {
          value: '100',
          label: '100'
        }
      ],
      value: '5'
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang='less'>
.commonPagination {
  background: #ffffff;
  padding-left: 11px;
  padding-right: 18px;

  &_left {
    float: left;
    &_count {
      color: #6a6a6a;
      font-size: 12px;
      margin-right: 20px;
    }
    &_unit {
      color: #6a6a6a;
      font-size: 12px;
      margin-left: 8px;
    }
  }
  &_right {
    float: right;
    .el-pagination {
      padding: 0 0 !important;
    }
    .el-pager {
      margin-top: 2px;
    }
    .el-pager li {
      height: 24px;
      line-height: 24px;
      min-width: 24px;
      color: #6a6a6a;
      font-size: 13px;
      font-weight: normal;
    }
    .el-pager li:hover {
      color: #d50000;
    }
    .el-pagination button:hover {
      color: #d50000;
    }
    .el-pager li.active {
      border: 1px solid #d50000;
      border-radius: 2px;
      color: #d50000;
    }
  }
}
</style>


