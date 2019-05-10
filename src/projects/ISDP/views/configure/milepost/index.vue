<template>
  <div class="configuration-milepost-wrap">
    <div class="milepost-title">
      <span>里程碑设置</span>
      <el-button class="bottom-release"
                 type="danger"
                 @click="click">发布</el-button>
    </div>
    <el-row class="milepost-list-title milepost-list">
      <el-col :span="8">
        <div class="milepost-item">里程碑</div>
      </el-col>
      <el-col :span="8">
        <div class="milepost-item">来源</div>
      </el-col>
      <el-col :span="8">
        <div class="milepost-item">计划节点</div>
      </el-col>
    </el-row>
    <el-row class="milepost-list"
            v-for="(value,index) in listData"
            :key="index">
      <el-col :span="8">
        <div class="milepost-item">{{value&&value.milestoneName}}</div>
      </el-col>
      <el-col :span="8">
        <div class="milepost-item">
          <div class="optionWorp">
            <!-- <select class="optionOpt source"
                    @change="(event)=>setUpListData(event,index,1)"
                    v-model="value.sourceCode">
              <option :value="null"
                      label="请选择"></option>
              <option :value="item.codeKey"
                      v-for="item in workProcedureList"
                      :key="item.codeKey"
                      :label="item.codeValue"></option>
            </select> -->
            <el-select v-model="value.sourceCode"
                       @change="setUpListData(value.sourceCode,value,1)">
              <el-option v-for="(optionItem,optionIdx) of workProcedureList"
                         :key="`option${optionIdx}`"
                         :value="optionItem.codeKey"
                         :label="optionItem.codeValue + ''">
              </el-option>
            </el-select>
            <!-- <i class="el-icon-caret-bottom el-icon--right"></i> -->
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="milepost-item">
          <div class="optionWorp planNode">
            <el-select class="inside-select"
                       v-model="value.planNoteCode"
                       @change="setUpListData(value.planNoteCode,value,2)"
                       v-if="value.sourceCode === 'wbs'">
              <el-option v-for="(optionItem) of milestoneSourceList"
                         :key="optionItem.id"
                         :label="optionItem.jobName"
                         :value="optionItem.jobNo+''">
              </el-option>
            </el-select>
            <el-select class="inside-select"
                       v-else
                       v-model="value.planNoteCode"
                       @change="setUpListData(value.planNoteCode,value,3)">
              <el-option v-for="(optionItem) of milestoneSourceList2"
                         :key="optionItem.id"
                         :label="optionItem.codeValue"
                         :value="optionItem.codeOrder+''">
              </el-option>
            </el-select>
            <!-- <select class="optionOpt planNode"
                    @change="(event)=>setUpListData(event,index,0)"
                    v-model="value.planNoteCode">
              <option :value="null"
                      label="请选择"
                      selected></option>
              <template v-if="value&&value.sourceCode=='wbs'">
                <option v-for="item in milestoneSourceList"
                        :key="item.id"
                        :value="item.jobNo"
                        :label="item.jobName"></option>
              </template>
              <template v-if="value.sourceCode=='idp'">
                <option v-for="item in milestoneSourceList2"
                        :value="item.codeOrder"
                        :key="item.id"
                        :label="item.codeValue"></option>
              </template>

            </select> -->
            <!-- <i class="el-icon-caret-bottom el-icon--right"></i> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import listConfig from './config/milepost.list';
export default {
  data() {
    return {
      listConfig,
      listData: [],
      milestoneSourceList: [],
      milestoneSourceList2: [],
      workProcedureList: [
        {
          sourceCode: 'wbs',
          codeValue: 'wbs计划'
        },
        {
          sourceCode: 'idp',
          codeValue: '集成子计划'
        }
      ],
      source: '',

      collectWBS: {},
      collectIDP: {}
    };
  },
  async created() {
    await this.getMilepostListQuery();
    await this.gitMilepostWbsOptList();
    await this.gitMilepostWbsOptList2();
    await this.gitMilepostOptList();
  },
  methods: {
    setUpListData(val, opts, flag) {
      const obj = {
        wbs: 'wbs计划',
        idp: '集成子计划'
      };
      if (+flag === 1) {
        opts.planNoteCode = '';
        opts.sourceName = obj[val];
      } else {
        const collectObj = flag === 2 ? this.collectWBS : this.collectIDP;
        opts.planNoteName = collectObj[val];
      }
    },
    click() {
      this.saveMilepost();
    },
    async getMilepostListQuery() {
      let { data } = await this.$store.dispatch(
        'ISDP/configure/getMilepostListQuery',
        { milestoneType: 'L' }
      );
      data && (this.listData = data.toJson());
    },
    async gitMilepostWbsOptList() {
      let { data } = await this.$store.dispatch(
        'ISDP/configure/gitMilepostWbsOptList',
        {}
      );
      let obj = {};
      this.milestoneSourceList = data.map((item) => {
        // item.insideKey = item.jobNo + '#_#' + item.jobName;
        obj[item.jobNo] = item.jobName;
        return item;
      });
      this.collectWBS = obj;
    },
    async gitMilepostWbsOptList2() {
      let { data } = await this.$store.dispatch(
        'ISDP/configure/gitMilepostOptList',
        { appClassify: 'ISDP', classifyName: 'work_procedure' }
      );
      let obj = {};
      this.milestoneSourceList2 = data.map((item) => {
        // item.insideKey = item.codeOrder + '#_#' + item.codeValue + '#_#' + 'idp';
        obj[item.codeOrder] = item.codeValue;
        return item;
      });
      this.collectIDP = obj;
    },
    async gitMilepostOptList() {
      let { data } = await this.$store.dispatch(
        'ISDP/configure/gitMilepostOptList',
        {
          appClassify: 'ISDP',
          classifyName: 'milestone_source'
        }
      );
      this.workProcedureList = data.toJson();
    },
    async saveMilepost() {
      let { data, resultMessage, resultCode } = await this.$store.dispatch(
        'ISDP/configure/saveMilepost',
        this.listData
      );
      if (resultCode == 200 && data) {
        this.$elTooltip({ message: resultMessage, type: 'success' });
        this.listData = data.toJson();
      } else {
        this.$elTooltip({ message: resultMessage, type: 'error' });
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .configuration-milepost-wrap {
    .milepost-title {
      height: 44px;
      span {
        width: 80px;
        height: 17px;
        font-size: 16px;
        color: #333333;
      }
      .bottom-release {
        float: right;
      }
    }
    .milepost-list-title.milepost-list {
      height: 48px;
      color: #777a80;
    }
    .milepost-list {
      height: 48px;
      font-size: 14px;
      color: #4d4f53;
      &:nth-child(even) {
        background-image: linear-gradient(#ffffff, #ffffff),
          linear-gradient(#040507, #040507);
        background-blend-mode: normal, normal;
        border-radius: 1px 1px 0px 0px;
      }
      .el-col {
        &:nth-child(3n) {
          padding-left: 20px;
        }
        &:nth-child(3n + 1) {
          padding-left: 24px;
        }
        &:nth-child(3n + 2) {
          padding-left: 0;
        }
      }
      .milepost-item {
        font-size: 14px;
        line-height: 48px;
        .el-icon--right {
          position: absolute;
          right: 10px;
          top: 9px;
          font-size: 12px;
          color: #a4a4a4;
        }
      }
      .optionWorp {
        width: 140px;
        height: 30px;
        line-height: 30px;
        margin-top: 9px;
        // background: rgba(255, 255, 255, 1);
        position: relative;
        &.planNode {
          width: auto;
          .inside-select {
            width: 268px;
          }
        }
      }
      .source {
        width: 140px;
      }
    }
  }
</style>
