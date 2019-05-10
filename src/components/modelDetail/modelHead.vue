<template>
  <header class="model-detail-head flex">
    <div class="link-box flex-auto">
      <router-link :to="options.route"
                   class="link"
                   v-if="options.route">
        <i class="fa fa-arrow-circle-left"></i>
        {{options.linkName}}
      </router-link>
      <a :href="options.route"
         class="link"
         v-else>
        <i class="fa fa-arrow-circle-left"></i>
        {{options.linkName}}
      </a>
    </div>
    <div class="rt-box flex-item flex">
      <div class="flex-item">
        <el-select v-if="options.type === 'select'"
                   v-model="form[options.prop]"
                   filterable
                   @change="changeRoute(form)"
                   :remote="true"
                   :remote-method="remoteMethod">
          <el-option :key="idx+''"
                     v-for="(option,idx) of  (remoteData && remoteData[options.prop] && (remoteData[options.prop].options || remoteData[options.prop])  || options.select)"
                     :label="option.label"
                     :value="option.value">
          </el-option>
          <!-- <el-option v-for="item of options.select"
                     :key="item.label"
                     :label="item.label"
                     :disabled="item.disabled"
                     :value="item.value">
          </el-option> -->
        </el-select>
      </div>
      <div class="flex-item">
        <div class="text-box">
          <div class="text"
               v-for="item of list || options.list || []"
               :key="item.title">
            <p class="title">{{item.title}}</p>
            <span class="txt">{{item.text}}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'modelDetailHead',
  methods: {
    callback(...args) {
      this.$callback( ...args);
    },
    remoteMethod(...args){
      this.callback('changeForSearch',...args);
    },
    changeRoute(form) {
      const { contractName: id } = form;
      if(id === this.$route.query.id) {
        return false;
      } else {
        window.location.href = location.href.replace(location.search,'') + '?id=' + id
      }
    }
  },
  props: {
    options: {
      type: Object,
      required: true,
      default(){
        return {}
      /*  {
          name: '',
          type: 'select',
          select: [],
          route: {},
          link: '',
          linkName:'',
          list: []
        } */
      }
    },
    form: {
      type: Object,
      default(){
        return {}
      }
    },
    list: {
      type: Array
    },
    remoteData: {
      type: Object
    }
  }
}
</script>

<style lang="less" scoped>
  .model-detail-head {
    padding: 20px;
    flex-wrap: wrap;
    .link-box {
      @wid: 180px;
      flex-basis: @wid;
      align-self: center;
      .link {
        color: #333;
        .fa {
          font-size: 16px;
        }
      }
    }
    .rt-box {
      .flex-item {
        flex-basis: 50%;
        &:first-child {
          padding-right: 30px;
          flex-basis: 32%;
        }
        &:last-child {
          padding-left: 30px;
        }
        .el-select {
          width: 100%;
        }
        .text-box {
          white-space: nowrap;
          .text {
            padding: 0 14px;
            min-height: 30px;
            display: inline-block;
            vertical-align: middle;
            & ~ .text {
              border-left: 1px solid #ddd;
            }
            .title {
              margin-bottom: 4px;
              color: #666;
              font-size: 12px;
            }
            .txt {
              min-height: 16px;
              display: block;
              color: #333;
              font-size: 14px;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
</style>
