<template>
  <ul class="model-detail-content-list-wrap">
    <li v-for="(item,idx) of data"
        :key="idx+''">
      <template v-if="type.includes('file')">
        <a href="#"
           @click.prevent="fileDownload(item)"
           class="link">
          {{item.fileName}}
        </a>
      </template>
      <template v-else>
        <div v-html="item.listContent"></div>
      </template>
    </li>
  </ul>
</template>
<script>
export default {
  methods: {
    async fileDownload(args){
      let result = await this.$store.dispatch('common/download',{
        url: location.origin + '/' + args.url
      });
      if(result && result.data){
        this.$download(result.data,args.fileName);
      }
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    type: true
  }
}
</script>

<style lang="less" scoped>
  .model-detail-content-list-wrap {
    li {
      margin-bottom: 8px;
      font-size: 16px;
      color: #333;
      .link {
        color: #565ece;
        text-decoration: underline;
      }
    }
  }
</style>
