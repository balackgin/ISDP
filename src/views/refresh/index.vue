<template>
  <div>
  </div>
</template>
<script>
export default {
  created () {
    try{
      const {query} = this.$route,
        {btnName} = query,
        parentWin = window.parent.parent,
        btn = parentWin.document.querySelector(btnName ? '.' + btnName : '.refreshBtn');
      btn && btn.click();
      parentWin.postMessage(query,'*');
    }catch{
      console.log('refresh error!!!');
    }
  }
}
</script>
