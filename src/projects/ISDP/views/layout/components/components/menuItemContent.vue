<template>
  <div class="menu-item-content-wrap">
    <div class="menu-item-edit-box"
         v-if="options.type === 'edit'">
      <div class="clearfix btns">
        <div class="float-right">
          <el-button type="text"
                     class="btn-item"
                     @click.prevent="handleClickForAdd">{{editFlag ? '取消' : '添加'}}</el-button>
          <el-button type="text"
                     class="btn-item"
                     :class="{'btn-edit': editFlag}"
                     @click.prevent="handleClickForSave">{{editFlag ? '保存' : '编辑'}}</el-button>
          <dialog-menu v-if="dialogMenuFlag"
                       ref="dialogMenu"
                       :data="data"
                       @callback="handleCallback"></dialog-menu>
        </div>
      </div>
      <div class="edit-content"
           v-if="collectData.length">
        <el-row :gutter="20"
                class="edit-row">
          <el-col :span="8"
                  class="edit-col"
                  v-for="(item,idx) of collectData"
                  :key="idx+''">
            <collect-menu :editFlag="editFlag"
                          :options="item"
                          @callback="handleCallback"></collect-menu>
          </el-col>
        </el-row>
      </div>
    </div>
    <template v-else>
      <router-link class="link menu-link"
                   v-if="urlPath.route"
                   :to="Object.assign({},urlPath.route,{id: projectId})">
        <template v-if="options.iconStyle">
          <i class="menu-item-icon icon-default"
             :style="options.iconStyle"></i>
          <i class="menu-item-icon icon-hover"
             :style="options.iconHoverStyle"></i>
          <i class="menu-item-icon icon-active"
             :style="options.iconActiveStyle"></i>
        </template>
        {{title}}</router-link>
      <a class="link menu-link"
         v-else-if="urlPath.link"
         :href="urlPath.link">{{title}}</a>
      <span class="link menu-link"
            v-else>{{title}}</span>
    </template>
  </div>
</template>
<script>
import dialogMenu from './dialogMenu';
import collectMenu from './collectMenu';
export default {
  components: {
    dialogMenu,
    collectMenu
  },
  data() {
    return {
      editFlag: false,
      dialogMenuFlag: false,
      collectData: [],
      delCollectArr: []
    };
  },
  computed: {
    title() {
      return this.options.elementName;
    },
    projectId(){
      return this.$route.query.id;
    },
    urlPath() {
      const { options, projectId } = this,
        { urlPath } = options;
      return urlPath
        ? (urlPath.includes('/') && { link: urlPath.trim() }) || {
          route: { name: urlPath.trim(), query: { id: projectId } }
        }
        : {};
    }
  },
  methods: {
    handleCallback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    selectMenu() {
      this.getCollectMenu();
    },
    async getCollectMenu() {
      const { data: collectData = [] } = await this.$store.dispatch(
        'ISDP/common/getFavoriteMenu'
      );
      this.collectData = collectData;
    },
    handleClickForAdd() {
      const { editFlag } = this;
      if (editFlag) {
        // 取消按钮
        this.getCollectMenu();
        this.editFlag = false;
      } else {
        this.dialogMenuFlag = true;
        this.$nextTick(function() {
          this.$refs.dialogMenu.open('0');
        });
      }
    },
    async handleClickForSave() {
      const { editFlag, delCollectArr } = this;
      if (editFlag && delCollectArr.length) {
        //保存
        const { resultMessage, resultCode } = await this.$store.dispatch(
          'ISDP/common/delMenu',
          delCollectArr
        );
        let type = 'error';
        if (+resultCode === 200) {
          this.getCollectMenu();
          type = 'success';
          this.editFlag = false;
        }
        this.$elTooltip({ message: resultMessage, type });
      } else {
        //编辑
        this.editFlag = !editFlag;
      }
    },
    handleClickForDelItem(args) {
      const { delCollectArr, collectData } = this;
      delCollectArr.push(args);
      const index = collectData.findIndex((item) => item === args);
      collectData.splice(index, 1);
    }
  },
  created() {
    this.options.type === 'edit' ? this.getCollectMenu() : '';
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    data: {
      type: Array
    }
  }
};
</script><style lang="less" scoped>
  .menu-item-content-wrap {
    .link,
    .figure-link {
      display: block;
    }
    .menu-item-edit-box {
      background-color: #fafafa;
      .btns {
        padding: 10px 9px;
        border-bottom: 1px dashed #e6e6e6;
        .btn-item {
          margin: 0 9px 0 0;
          padding: 2px;
          color: #777a80;
          font-size: 12px;
          &.btn-edit {
            color: #f81b1b;
          }
        }
      }
      .edit-content {
        padding-top: 20px;
        .edit-row {
          padding: 0 14px;
          .edit-col {
            margin-bottom: 20px;
          }
        }
      }
    }
  }
</style>
