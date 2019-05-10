<template>
  <div class="orderBox">
    <div class="orderBox_header">
      <img class="orderBox_header_logo" src="@orderVis/assets/images/logo_new.png" alt="LOGO">
      <span class="orderBox_header_title">集成项目订单可视化布局</span>
      <img class="orderBox_header_bound" src="@orderVis/assets/images/Bounds.png">
    </div>
    <div class="orderBox_content">
      <p class="orderBox_content_title">订单</p>
      <div class="orderBox_content_searchBox" :style="bg">
        <div>
          <div class="orderBox_content_searchBox_item">
            <span class="orderBox_content_searchBox_item_label">生产发货单/订单编号</span>
            <div class="orderBox_content_searchBox_item_ipt">
              <el-input placeholder="请输入编号" v-model="searchData.num"></el-input>
            </div>
          </div>
          <div class="orderBox_content_searchBox_item">
            <span class="orderBox_content_searchBox_item_label">工程合同</span>
            <div class="orderBox_content_searchBox_item_ipt" style="width:320px;">
              <el-input placeholder="请输入工程合同编号" v-model="searchData.num"></el-input>
            </div>
          </div>
          <div class="orderBox_content_searchBox_item">
            <span class="orderBox_content_searchBox_item_label">项目所在省份</span>
            <div class="orderBox_content_searchBox_item_ipt" style="width:180px;">
              <el-select v-model="value" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="orderBox_content_searchBox_item">
            <span class="orderBox_content_searchBox_item_label">项目交付等级</span>
            <div class="orderBox_content_searchBox_item_ipt" style="width:180px;">
              <el-select v-model="value" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <span class="orderBox_content_searchBox_clearBtn">清&nbsp;&nbsp;&nbsp;空</span>
        </div>
        <div>
          <div class="orderBox_content_searchBox_item" style="margin-left:78px;">
            <span class="orderBox_content_searchBox_item_label">收货人</span>
            <div class="orderBox_content_searchBox_item_ipt">
              <el-input placeholder="请输入收货人" v-model="searchData.num"></el-input>
            </div>
          </div>
          <div class="orderBox_content_searchBox_item">
            <span class="orderBox_content_searchBox_item_label">收货地址</span>
            <div class="orderBox_content_searchBox_item_ipt" style="width:592px;">
              <el-input placeholder="请输入收货地址" v-model="searchData.num"></el-input>
            </div>
          </div>
          <div class="orderBox_content_searchBox_item">
            <span class="orderBox_content_searchBox_item_label">供应链统筹人</span>
            <div class="orderBox_content_searchBox_item_ipt">
              <el-input placeholder="请输入供应链统筹人" v-model="searchData.num"></el-input>
            </div>
          </div>
          <span class="orderBox_content_searchBox_searchBtn">查 询</span>
        </div>
      </div>
    </div>
    <common-pagination v-if="false"></common-pagination>
  </div>
</template>
<script>
import commonPagination from '../../components/commonPagination.vue';
export default {
  components: {
    commonPagination
  },
  data() {
    return {
      options: [
        {
          value: '5',
          label: '5'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '20',
          label: '20'
        },
        {
          value: '50',
          label: '50'
        },
        {
          value: '100',
          label: '100'
        }
      ],
      value: '5',
      bg: {
        backgroundImage:
          'url(' + require('@orderVis/assets/images/background.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      searchData: {
        num: ''
      }
    };
  }
};
</script>
<style lang='less' scoped>
@import url('./style.less');
</style>

<style lang='less'>
.el-select-dropdown__item.selected {
  color: #d50000 !important;
}
.commonSelectBox {
  display: inline-block;
  position: relative;
  .el-select .el-input .el-select__caret {
    font-size: 0;
  }
  .el-input--suffix .el-input__inner {
    padding-left: 0px;
    padding-right: 10px;
    text-align: center;
  }
  .el-input__inner {
    height: 24px !important;
    line-height: 24px !important;
  }
  .el-select {
    position: relative;
  }
  .el-input__inner {
    border-color: #dddddd;
    font-size: 12px;
  }
  .el-select:after {
    right: 7px;
    top: 10px;
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-top: 5px solid #949394;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #d50000;
  }
  .el-select .el-input__inner:focus {
    border-color: #d50000;
  }
  &_donwIcon {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 6px;
    height: 5px;
    z-index: 1000;
  }
}
//输入框公用样式
.orderBox {
  .el-input__icon {
    line-height: 28px;
  }
  .el-input__inner {
    border-radius: 2px;
    border-color: #dddddd;
    height: 28px;
    font-size: 12px;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #d50000;
  }
  .el-select .el-input__inner:focus {
    border-color: #d50000;
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: #d50000;
  }
}
</style>


