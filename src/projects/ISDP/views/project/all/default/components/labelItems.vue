<template v-if="list && list[0]">
  <div class="label-items"
       :class="className">
    <span class="label">{{data.label}} :</span>
    <span class="label-item"
          v-for="(item, index) of list"
          @click="handleForClick(item)"
          :class="[defaultValue === item.value ? 'active': '']"
          :key="index">{{item.label}}
    </span>
  </div>
</template>

<script>
export default {
  name: 'label-items',
  data() {
    return {
      selectValue: ''
    }
  },
  computed: {
    list() {
      return this.data.list || [];
    },
    defaultValue() {
      return this.selectValue;
    }
  },
  methods: {
    callback(...args) {
      this.$callback( ...args);
    },
    handleForClick(row) {
      const {value} = row;
      this.selectValue = value;
      this.callback('clickForLabelItem', row);
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    className: {
      type: String
    }
  }
}
</script>

<style lang="less" scoped>
  .label-items {
    display: inline-block;
    .label-item {
      padding: 3px 10px;
      margin-right: 30px;
      border: 1px solid transparent;
      border-radius: 2px;
      display: inline-block;
      font-size: 14px;
      cursor: pointer;
      &.active {
        border-color: #fe2323;
        color: #fe2323;
        background-color: #fff;
      }
      &:hover {
        background-color: #fe2323;
        color: #fff;
      }
    }
    .label {
      margin-right: 12px;
      font-size: 14px;
      color: #777a80;
    }
  }
</style>
