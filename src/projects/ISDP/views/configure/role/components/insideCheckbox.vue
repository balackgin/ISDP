<template>
  <div class="inside-checkbox">
    <div class="checkbox-item"
         :class="options.className">
      <el-checkbox class="inside-item"
                   @change="handleChangeForCheckbox(options, options.select)"
                   v-model="options.select">
        {{options.elementName}}
      </el-checkbox>
      <div class="checkbox-con"
           v-if="options.children">
        <inside-checkbox :data="item"
                         @callback="callback"
                         v-for="(item, index) of options.children"
                         :key="index + ''"></inside-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'inside-checkbox',
  computed: {
    options(){
      // console.log(this.data.toJson(),'data');
      return this.data || {};
    }
  },
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleChangeForCheckbox(...args) {
      this.$callback('handleChangeForCheckbox', ...args);
    }
  }
}
</script>

<style lang="less" scoped>
  .inside-checkbox {
    .checkbox-item {
      padding-left: 24px;
      &.flex-checkbox {
        > .checkbox-con {
          display: flex;
          flex-wrap: wrap;
          padding: 14px 0 0;
          background-color: #f9f9f9;
          > .inside-checkbox {
            margin: 0 150px 14px 0;
          }
        }
      }
      > .el-checkbox {
        line-height: 38px;
      }
    }
  }
</style>
