<template>
  <div class="task-dialog-wrap">
    <outside-dialog :show="dialogShow"
                    title="添加分类项"
                    @callback="callback">
      <!-- <model-detail :options="Config.dialogDetail"
                    :data="currentTask">
      </model-detail> -->
      <model-search :options="Config.dialogForm"
                    :form="formEdit"
                    :remoteData="dialogRemoteData"
                    @callback="callback">
      </model-search>
      <el-form @submit.native.prevent>
        <el-form-item label-width="120px"
                      label-position="right">
          <template slot="label">
            <el-button class="button-add"
                       @click="addRowTask()">+</el-button>
          </template>
          <model-table :options="Config.dialogTable"
                       :data="tableData"
                       @callback="callback">
          </model-table>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="small"
                   type="primary"
                   @click="saveCodeClassify">确 定</el-button>
        <el-button size="small"
                   @click="beforeClose">关 闭</el-button>
      </div>
    </outside-dialog>
  </div>
</template>
<script>
import modelFormGroup from '@/components/modelFormGroup';
import modelDetail from '@/components/modelDetail';
import modelTable from '@/components/modelList/modelTable';
import modelSearch from '@/components/modelList/modelSearch';
import outsideDialog from '@/components/outsideDialog';
import Config from './config/roles.add.dialog.json';
export default {
  components: {
    modelFormGroup,
    modelSearch,
    modelDetail,
    outsideDialog,
    modelTable
  },
  data(){
    const vm = this;
    function validateIsNull(msg){
      return (rule,value,callback) => {
        if(!value){
          vm.$elMessage({
            message: msg,
            type: 'error'
          });
          callback(new Error(msg));
        }else{
          callback();
        }
      }
    }
    return {
      Config,
      dialogShow: false,
      dialogRemoteData: {},
      currentTask: {},
      tableData: [],
      formTem: null,
      removeList: [],
      formEdit: {
        appClassify: '',
        classifyName: '',
        classifyDisplay: ''
      },
      taskStatusOptions: [ {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      } ],
      rules: {
        appClassify: [ {
          trigger: 'blur',
          required: true,
          validator: validateIsNull('请选择所属平台!')
        } ],
        classifyName: [ {
          trigger: 'blur',
          required: true,
          validator: validateIsNull('请填写分类名!')
        } ],
        classifyDesc: [ {
          trigger: 'blur',
          required: true,
          validator: validateIsNull('请填写分类描述!')
        } ]
      }
    }
  },
  prop: {
    classifyList: {
      type: Array,
      defautl() {
        return []
      }
    }
  },

  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    handleCallback(...args){
      this.$callback(...args);
    },
    beforeClose(){
      this.$emit('update:params',undefined);
      this.removeList = [];
      this.tableData = [];
      this.dialogShow = false;
    },
    taskFeedback(itemData = {}){
      const { version, id, appClassify, classifyName, classifyDisplay, contentDTOList} = itemData;
      this.formEdit = Object.assign({}, this.formEdit, {
        appClassify,
        classifyName,
        classifyDisplay,
        id,
        version
      });
      this.tableData = Object.assign([], this.tableData, contentDTOList);
      this.dialogShow = true;
    },
    // // 增加操作
    addRowTask(){
      const addRows = {
        codeKey: '',
        codeValue: '',
        codeOrder: '',
        id: '',
        version: 0
      };
      this.tableData.push(addRows);
    },
    // 删除操作
    handleClickForDialogRemove(row){
      const { isDel = 2 } = row;
      let index = this.tableData.findIndex((item) => row === item);
      if(isDel === 2) this.tableData[index].isDel = 1;
      this.removeList.push(this.tableData[index]);
      this.tableData.splice(index,1);
    },
    getForm(formName,vm){
      this.formTem = vm;
    },
    rulesForSubmit() {
      const { formEdit, tableData } = this;
      let msg = '', rule = true;
      switch(true) {
      case !formEdit.appClassify:
        msg = '请选择应用分类！';
        rule = false;
        break;
      case !formEdit.classifyName:
        msg = '请输入分类名！';
        rule = false;
        break;
      case !formEdit.classifyDisplay:
        msg = '请输入分类描述！';
        rule = false
        break;
      default:
        break;
      }
      // TO DO...
      tableData && tableData.forEach((item) => {
        const { codeKey = '', codeValue = '', codeOrder = ''} = item;
        if(!codeKey) {
          msg = '请输入分类键名！';
          rule = false;
          return ;
        } else if(!codeValue) {
          msg = '请输入分类键值！';
          rule = false;
          return ;
        }else if (!codeOrder) {
          msg = '请输入分类排序！';
          rule = false;
          return ;
        }
      })
      return { msg, rule };
    },
    async saveCodeClassify() {
      const { formEdit, tableData = [], removeList } = this;
      const { rule, msg } = this.rulesForSubmit();
      if(!rule) {
        this.$elMessage({
          type: 'error',
          message: msg
        })
        return ;
      }
      // return ;
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDPOld/sys/saveCodeClassify', {
        contentDTOList: tableData.concat(removeList),
        ...formEdit
      })
      if(+resultCode === '200' || resultCode.includes('200')) {
        this.$elMessage({type: 'success', message: resultMessage});
        const str = formEdit.appClassify === 'ISDP' ? 'ISDP' : 'outsoucer';
        this.$emit('queryAllCodeClassify', str);
        this.beforeClose();
      }
    }
  },
  watch: {
    params(newVal){
      if(newVal){
        this.taskFeedback(newVal);
      }
    }
  },
  props: {
    params: {
      type: Object
    }
  }
}
</script>

<style lang="less" scoped>
  .task-dialog-wrap {
    .el-form-item__content {
      height: auto;
    }
    .button-add {
      font-size: 24px;
      padding: 0;
      color: #d50000;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-weight: 700;
      margin-left: 70px;
      &:hover {
        background-color: #ffc5c5;
      }
    }
  }
</style>
<style lang="less">
  .task-dialog-wrap {
    .el-form-item__content {
      height: auto;
    }
  }
</style>
