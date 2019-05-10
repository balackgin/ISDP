<template>
  <inside-dialog :title="options.title"
                 @beforeClose="cancel"
                 :show.sync="show"
                 class="search-popup-wrap">
    <!-- searchOptions start -->
    <template v-if="options.iframe">
      <iframe :src="options.iframe"
              width="100%"
              height="500"
              frameborder="0"></iframe>
    </template>
    <template v-else-if="options.type === 'textarea'">
      <el-form @submit.native.prevent>
        <el-form-item class="readonly-bg">
          <el-input type="textarea"
                    v-model="options.defaultValue"
                    :autosize="{minRows: 8}"
                    :readonly="options.disabled"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center"
           slot="footer">
        <el-button size="small"
                   @click="handleClickSubmitForTextarea"
                   v-if="!options.disabled"
                   type="danger">保存</el-button>
        <el-button size="small"
                   @click="cancel"
                   class="ml-1">{{options.disabled ? '关闭' : '取消'}}</el-button>
      </div>
    </template>
    <template v-else>
      <el-form :inline="true"
               @submit.native.prevent="searchCallback"
               v-if="options.searchOptions">
        <el-form-item size="small">
          <template slot="label">
            <template v-if="options.searchOptions.label.name">
              {{options.searchOptions.label.name}}
            </template>
            <template v-else-if="options.searchOptions.label.select">
              <el-select class="label-select"
                         :placeholder="options.searchOptions.label.select.placeholder"
                         v-model="selectSituation">
                <el-option v-for="item of options.searchOptions.label.select.options"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </template>

          </template>
          <el-input :placeholder="options.searchOptions.placeholder"
                    v-model.trim="value"
                    @keyup.enter="searchCallback"
                    :style="{width: options.searchOptions.width || '220px'}"
                    :class="options.searchOptions.inputClass"></el-input>
        </el-form-item>
        <!-- label.append start -->
        <template v-if="options.searchOptions.label.append">
          <el-form-item :label="options.searchOptions.label.append.name"
                        class="label-append">
            <el-checkbox v-model="labelSelectCheckbox"></el-checkbox>
          </el-form-item>
        </template>
        <!-- label.append  end -->
        <el-form-item>
          <el-button size="small"
                     @click="searchCallback"
                     type="danger">{{options.searchOptions.btn}}</el-button>
        </el-form-item>
      </el-form>
      <!-- searchOptions end -->
      <!-- tableOptions start -->
      <!-- <el-table class="mt-2"
              :empty-text="options.tableOptions.emptyText"
              :data="lists"
              max-height="300px">
      <el-table-column v-for="item of options.tableOptions.head"
                       :label="item.label || item"
                       :key="item.label || item">
        <template slot-scope="scope">

        </template>
      </el-table-column>
    </el-table> -->
      <model-table :class="{'mt-1': options.searchOptions}"
                   :options="options.tableOptions"
                   :data="resultTableData"
                   @tableColumnChangeWidth="tableColumnChangeWidth"
                   @handleDBLClickForRow="submit"
                   @paginationCallback="paginationCallback"
                   :current="current"
                   :total="total"
                   :checkboxData.sync="checkboxData">
      </model-table>
      <!-- tableOptions end -->

      <div class="text-center"
           slot="footer">
        <template v-if="options.name ==='equipmentListAdd'">
          <el-tooltip effect="dark"
                      placement="top">
            <template slot="content">
              把本合同<strong>所有</strong>设备加入本申请单
            </template>
            <el-button size="small"
                       @click="submitAll"
                       type="danger">加入全部</el-button>
          </el-tooltip>
        </template>
        <el-tooltip effect="dark"
                    content="把所选设备加入本申请单"
                    :disabled="options.name !=='equipmentListAdd'"
                    placement="top">
          <el-button size="small"
                     @click="submit"
                     type="danger">保存</el-button>
        </el-tooltip>
        <el-button size="small"
                   @click="cancel"
                   class="ml-1">取消</el-button>
      </div>
    </template>

  </inside-dialog>
</template>

<script>
import InsideDialog from '@/components/insideDialog';
import ModelTable from '@/components/modelList/modelTable';
export default {
  name: 'dialogSearch',
  components: {
    InsideDialog,
    ModelTable
  },
  data(){
    let select = this.options.searchOptions && this.options.searchOptions.label.select;
    return {
      lists: [],
      value: '',
      // label.select start
      selectSituation: select && (select.default || select.options[0]),
      labelSelectCheckbox: true,
      // label.select end

      tableData: [],

      checkboxData: []  // model-table type = checkbox

    }
  },
  computed: {
    resultTableData(){
      return this.parentTableData ||  this.tableData;
    }
  },
  watch: {
    show(newVal){
      this.tableData = [];
      this.checkboxData = [];
      this.lists = [];
      this.value = '';
      this.labelSelectCheckbox = true;
      newVal && this.options.handleCreate && this.options.handleCreate(this);
    }
  },

  methods: {
    cancel(){
      this.$emit('beforeClose');
      this.$emit('update:show',false);
    },
    searchCallback(){
      let value = this.value;
      this.options.searchOptions.searchCallback(this,value, this.labelSelectCheckbox);
    },
    submit(){
      let {options} = this;
      // options.situation && this.$emit('update:result',options.situation.data);

      this.$emit('handleClickSubmit',{
        data: options.submitKey ? this[options.submitKey] : this,
        type: options.name,
        callback: () =>{
          this.cancel();
        }
      })
    },
    submitAll(){
      const { options } = this;
      this.$emit('submitAll',{
        data: options.submitKey ? this[options.submitKey] : this,
        type: options.name,
        callback: () =>{
          this.cancel();
        }
      });
    },
    handleClickSubmitForTextarea(){
      this.$emit('handleClickSubmitForSituation',{
        value: this.options.defaultValue,
        prop: this.options.prop,
        callback: this.cancel
      })
    },
    tableColumnChangeWidth(args,type){
      this.$emit('tableColumnChangeWidth',this.options.name,args,type);
    },
    paginationCallback(num){
      this.$emit('paginationCallback',num);
    }
  },
  props: {
    show: {
      default: false,
      type: Boolean
    },
    result: {
      type: Array,
      default(){
        return []
      }
    },
    parentTableData: {
      type: Array
    },
    options: {
      default(){
        return {
          situation: {
            // type: '',
            // data: []
          }, // 1: contract/detail
          //title
          title: '',
          handleCreate(){1},
          tableOptions: {
            emptyText: '',
            head: []
          },
          //search
          searchOptions: {
            label: {},
            value: '',
            btn: '搜索',
            placeholder: ''
          },

          btnOptions: [ {name: '保存',callback(vm){vm}},{name: '取消',callback(vm){vm}} ]
        }
      }
    },
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1000
    }
    // tableOptions: {
    //   default(){
    //     return {
    //       emptyText: '',
    //       head: []
    //     }
    //   },
    //   type: Object
    // },
    // searchOptions: {
    //   default(){
    //     return {
    //       label: '',
    //       value: '',
    //       btn: '搜索',
    //       placeholder: ''
    //     }
    //   },
    //   type: Object
    // },
    // title: {
    //   default: '',
    //   type: String
    // },
    // handleCreate: true,
    // btns: {
    //   default(){
    //     return []
    //   },
    //   type: Array
    // }
  }
}
</script>


<style lang="less">
  .search-popup-wrap {
    .el-table {
      thead {
        tr {
          th {
            font-size: 12px;
            font-weight: 600;
            text-align: center;
          }
        }
      }
    }
    .situation1 {
      margin: 14px auto;
      .el-tag {
        @hei: 26px;
        height: @hei;
        margin-bottom: 6px;
        line-height: @hei;
        color: #666;
        background-color: #eee;
        &:hover {
          background-color: #dc332a;
          color: #fff;
          .el-tag__close {
            color: #fff;
            background-color: transparent;
          }
        }
        & ~ .el-tag {
          margin-left: 12px;
        }
        .el-tag__close {
          font-size: 16px;
          font-weight: 700;
          color: #999;
        }
      }
    }
    .label-select {
      width: 100px;
    }
    .label-search {
      min-width: 430px;
      font-size: 12px;
    }
    .label-append {
      padding-right: 10px;
      .el-form-item__label {
        padding-right: 4px;
        line-height: 30px;
      }
      .el-form-item__content {
        vertical-align: middle;
      }
    }
    .readonly-bg {
      textarea {
        &:read-only,
        &:disabled {
          background-color: #eee;
        }
      }
    }
  }
</style>
