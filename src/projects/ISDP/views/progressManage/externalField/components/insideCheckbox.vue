<template>
  <el-checkbox class="inside-role-checkbox-wrap"
               :indeterminate="indeterminate"
               :label="value"
               v-model="getValue"
               @change="handleChange">{{label}}</el-checkbox>
</template>
<script>
export default {
  computed: {
    indeterminate() {
      const  { indeterminate } = this.defaultProp;
      return indeterminate ? this.options[indeterminate] : false;
    },
    label() {
      const { label = null } = this.defaultProp;
      return label && this.options[label] || this.options.label || '';
    },
    value() {
      const { value = null } = this.defaultProp;
      return  this.options[value || 'defaultValue'];
    },
    getValue: {
      get(){
        const {options,defaultProp} = this,
          {modelValue} = defaultProp;
        return options[modelValue || 'value'];
      },
      set(val){
        const {options,defaultProp} = this,
          {modelValue} = defaultProp;
        options[modelValue || 'value'] = val;
      }
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    handleChange(){
      this.callback('handleChangeForCheckbox',this.options,this.pOpts,this.getValue);
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    pOpts: {
      type: Object
    },
    defaultProp: {
      type: Object,
      default() {
        return {};
      }
    }
  }
}
</script>
<style lang="less">
  .inside-role-checkbox-wrap {
    margin-right: 0.625rem /* 120/192 */;
    & ~ .inside-role-checkbox-wrap {
      margin-right: 0.625rem /* 120/192 */;
    }
    // .el-checkbox__input {
    //   .el-checkbox__inner {
    //     // border-color: #7c7c7c;
    //     border: 2px solid #7c7c7c;
    //     border-radius: 0;
    //   }
    //   &.is-indeterminate {
    //     .el-checkbox__inner {
    //       background-color: transparent;
    //       &::after {
    //         content: none;
    //       }
    //     }
    //   }
    // }
    // &.is-checked {
    //   .el-checkbox__input {
    //     .el-checkbox__inner {
    //       @color: #f81b1b;
    //       position: relative;
    //       border-color: @color;
    //       background-color: transparent;
    //       &::before {
    //         content: '';
    //         position: absolute;
    //         @dis: 2px;
    //         top: @dis;
    //         left: @dis;
    //         @wid: 6px;
    //         width: @wid;
    //         height: @wid;
    //         display: block;
    //         background-color: @color;
    //       }
    //       &::after {
    //         content: none;
    //       }
    //     }
    //   }
    //   .el-checkbox__label {
    //     color: #333;
    //   }
    // }
  }
</style>
