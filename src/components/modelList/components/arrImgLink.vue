<template>
  <div>
    <a class="link arr-img-link"
       v-for="(imgLink,idx) of data[options.prop]"
       :key="idx+''"
       :target="columnOpts.target"
       @click.prevent="saveFile(imgLink,columnOpts)">{{imgLink[columnOpts.fileName || 'fileName']}}
    </a>
  </div>
</template>
<script>
export default {
  computed: {
    columnOpts(){
      return this.options.columnOpts || {};
    }
  },
  methods: {
    async saveFile(data,opts){
      let result = await this.$store.dispatch('common/download',{
        url: location.origin + '/' + data[opts.fileUrl || 'url']
      });
      if(result && result.data){
        this.$download(result.data,data[opts.fileName || 'fileName']);
      }
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
    }
  }
}
</script>
