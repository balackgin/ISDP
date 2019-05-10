<template>
  <div class="action-icons-wrap">
    <template v-for="icon of  resultArr">
      <model-upload class="icon-item"
                    :key="icon.name"
                    v-if="icon.type ==='upload'"
                    :options="icon"
                    :form="{}"
                    :type="icon.uploadType"
                    @click.native.stop="callback('handleForUpload', data)"
                    @callback="callback"></model-upload>
      <a v-else
         href="#"
         class="icon-item"
         :key="icon.name"
         :class="icon.className"
         :title="icon.title"
         :disabled="icon.disabled"
         @click.prevent.stop="callback(icon.name,data)">
        {{icon.text}}
      </a>
    </template>

  </div>
</template>
<script>
import modelUpload from '@/components/modelFormGroup/components/upload';
export default {
  components: {
    modelUpload
  },
  computed: {
    resultArr(){
      const {data,options} = this,
        rowProp = data[options.prop] || {};
      return  options.icons || rowProp.icons  || data.icons || options.columnOpts && options.columnOpts.icons || [];
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    remoteData: {
      type: Object
    }
  }
}
</script>
<style lang="less" scoped>
  .action-icons-wrap {
    .icon-item {
      display: inline-block;
      text-decoration: none !important;
    }
  }
</style>
