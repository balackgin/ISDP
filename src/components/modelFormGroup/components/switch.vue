<template>
  <el-switch v-model="currentStatus"
             active-color="#f42020"
             inactive-color="#bbbcbf"></el-switch>
</template>

<script>
export default {
  data() {
    return {
      value1: false
    }
  },
  computed: {
    currentStatus: {
      get() {
        return !!this.form[this.options.prop];
      },
      set(val) {
        this.form[this.options.prop] = val;
      }
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
</style>
