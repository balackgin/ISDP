<template>
  <figure class="edit-figure"
          :class="{editing: editFlag}">
    <i class="editing-dialog"
       v-if="editFlag">
    </i>
    <router-link :to="urlPath"
                 class="figure-link">
      <i class="icon-del icon"
         v-if="editFlag"
         @click.prevent.stop="handleClickForDelItem(options)">
      </i>
      <span class="circle-icons">
        <i class="project-icon icon"
           :style="icons.default"></i>
        <i class="project-icon icon active"
           :style="icons.active"></i>
      </span>
      <figcaption class="edit-title">{{options.elementName}}</figcaption>
    </router-link>
  </figure>
</template>
<script>
import { mapState } from 'vuex';
import menuSprite from '@ISDP/assets/images/menuSprite';
export default {
  computed: {
    ...mapState({
      menuObj: (state) => state.ISDP.common.menuObj || {}
    }),
    urlPath(){
      const {options,$route} = this;
      return {
        name: options.urlPath,
        query: {
          id: $route.query.id
        }
      };
    },
    icons(){
      const {urlPath,menuObj} = this,
        arr = menuObj[urlPath.name];
      if(arr){
        const icon = arr[0].icon,
          defaultIcon = menuSprite[icon + '_n'],
          activeIcon = menuSprite[icon + '_changyong_p'];
        return {
          default: {
            backgroundPosition: `${ defaultIcon.offset_x }px ${ defaultIcon.offset_y }px`
          },
          active: {
            backgroundPosition: `${ activeIcon.offset_x }px ${ activeIcon.offset_y }px`
          }
        }
      }
      return {};
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    handleClickForDelItem(...args){
      this.callback('handleClickForDelItem',...args);
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    editFlag: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
  .edit-figure {
    position: relative;
    text-align: center;
    .editing-dialog {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
    .icon {
      background: transparent url('../../../../assets/images/menuSprite.png')
        no-repeat;
    }
    .icon-del {
      position: absolute;
      top: -9px;
      right: 9px;
      @wid: 14px;
      width: @wid;
      height: @wid;
      display: block;
      z-index: 2;
      cursor: pointer;
      background-position: -80px -132px;
    }

    .circle-icons {
      @wid: 30px;
      width: @wid;
      height: @wid;
      border-radius: 50%;
      margin: auto;
      display: block;
      background-color: #e9e9e9;
      line-height: 25px;
      .project-icon {
        @wid: 16px;
        width: @wid;
        height: @wid;
        // border-radius: 50%;
        // margin: auto;
        display: inline-block;

        &.active {
          display: none;
        }
      }
    }
    .edit-title {
      margin-top: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #777a80;
      font-size: 12px;
    }

    &.active,
    .router-link-exact-active {
      .circle-icons {
        background-color: #f42020;
        .project-icon {
          display: none;
          &.active {
            display: inline-block;
          }
        }
      }
      .edit-title {
        color: #f42020;
      }
    }
    :not(.router-link-exact-active):hover,
    &.editing {
      .circle-icons {
        background-color: #fff;
        box-shadow: 0px 0px 19px 1px rgba(216, 213, 213, 0.4);
        .project-icon {
          display: inline-block;
          &.active {
            display: none;
          }
        }
      }
    }
  }
</style>
