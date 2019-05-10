<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '大华股份集成交付一站式平台'
    // all titles will be injected into this template
    // titleTemplate: '%s | partner'
  },
  created() {
    ((doc) => {
      let loading = doc.getElementById('Loading');
      loading && doc.body.removeChild(loading);
    })(document);
  }
};
</script>