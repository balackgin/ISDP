<template>
  <div class="clearfix model-pagination-wrap"
       :class="[{'nISDP-pagination-wrap': options.theme === 'isdp'}]"
       v-if="options && options.total">
    <el-pagination background
                   :small="options.small"
                   :current-page="options.current || options.pageNum"
                   :page-size="options.pageSize || options.pageCount"
                   :total="options.total"
                   :pager-count="5"
                   :page-sizes="options.pageSizes || [5,10,15,20,50,100]"
                   :layout="options.layout || 'total,prev,pager,next'"
                   :popper-class="popperClass"
                   @size-change="paginationSizeChange"
                   @current-change="paginationCurrentChange"
                   class="float-right mt-1 model-pagination">
    </el-pagination>
    <!-- layout: total,prev,pager,next,sizes,jumper -->
  </div>
</template>
<script>
export default {
  computed: {
    popperClass() {
      const { options } = this,
        { popperClass, theme } = options,
        result = [];
      theme === 'isdp' ? result.push('model-pagination-dropdown') : '';
      result.push(
        ...(popperClass && popperClass.join ? popperClass : [ popperClass ])
      );
      return result.join(' ');
    }
  },
  methods: {
    callback(...args) {
      this.$callback(...args);
    },
    paginationCurrentChange(...args) {
      this.callback('paginationCallback', ...args);
    },
    paginationSizeChange(...args) {
      this.callback('pagiantionSizeChange', ...args);
    }
  },
  props: {
    options: {
      type: Object
    }
  }
};
</script>
<style lang="less" scoped>
  @import url('./config/pagination.default.less');
  @import url('./config/pagination.isdp.less');
</style>
<style lang="less">
  .model-pagination-dropdown {
    .el-scrollbar__wrap {
      .el-select-dropdown__list {
        padding: 0;
        box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.6);
        border-radius: 1px;
        border: 0;
        .el-select-dropdown__item {
          @hei: 30px;
          height: @hei;
          border-radius: 1px;
          line-height: @hei;
          color: #4d4f53;
          font-weight: 500;
          font-size: 14px;
          background-color: #fff;
          &:hover {
            color: #f00000;
            background-color: #fff;
            box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.4);
          }
        }
      }
    }
  }
</style>
