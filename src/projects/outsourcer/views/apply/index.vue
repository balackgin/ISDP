<template>
  <div class="outsourced-entry-wrap">
    <el-container class="flex entry-container">
      <el-aside class="flex-auto entry-aside">
        <nav class="entry-nav"
             :session="userinfo">
          <a href="#baseinfo"
             class="nav-link"
             @click.prevent="changeBaseInfoHash"
             :class="{active: ['#baseinfo',''].includes($route.hash)}">
            基本信息
          </a>
          <a href="#qualifications"
             class="nav-link"
             :class="{active: $route.hash === '#qualifications'}">
            资质
          </a>
          <a href="#personnel"
             class="nav-link"
             :class="{active: $route.hash === '#personnel'}">
            人员
          </a>
          <a href="#vehicle"
             class="nav-link"
             :class="{active: $route.hash === '#vehicle'}">
            车辆
          </a>
          <a href="#equipment"
             class="nav-link"
             :class="{active: $route.hash === '#equipment'}">
            设备
          </a>
          <a href="#achievement"
             class="nav-link"
             :class="{active: $route.hash === '#achievement'}">
            业绩
          </a>
        </nav>
      </el-aside>
      <el-main class="flex-item entry-main">
        <div class="main-box"
             id="baseinfo">
          <!-- <h3 class="title">外包工程商纳入申请</h3> -->
          <p class="title-box">
            <span class="title">外包工程商纳入申请</span>
            <span class="text ml-1">{{form.approvalStatus}}</span>
          </p>
          <el-form @submit.native.prevent
                   :model="form"
                   :rules="rules"
                   :show-message="false"
                   ref="applyForm">
            <section class="section-box baseinfo-form">
              <!-- <model-form :options="baseInfoConfig"
                          :form="form"
                          :rules="rules"></model-form> -->
              <el-row :gutter="baseInfoConfig.formOpts.row.gutter">
                <template v-for="item of baseInfoConfig.formGroup[0].formItems">
                  <model-col :key="item.prop || item.label"
                             :options="item"
                             :form="form"
                             :remoteData="{projectArea: citys}"
                             @callback="callback"></model-col>
                </template>
              </el-row>
            </section>
            <section class="section-box"
                     id="qualifications">
              <!-- <p class="section-title">企业资质</p>
              <ul class="section-checkbox-lists">
                <li v-for="item of enterpriseQualificationArray"
                    :key="item.prop">
                  <model-form-item :options="item.outsideFormItem"
                                   :form="enterpriseCertificateArrayForm"
                                   class="d-inline-block">
                  </model-form-item>
                  <model-form-item :options="item.innerFormItem"
                                   :form="enterpriseCertificateArrayForm"
                                   class="d-inline-block select-box">
                  </model-form-item>
                  级
                </li> -->
              <!-- <li>
                  <model-form-item :options="{type: 'checkbox',prop: 'checkbox',checkbox: [{label: '建筑智能化工程专业承包企业资质'}]}"
                                   :form="form"
                                   class="d-inline-block">
                  </model-form-item>
                  <model-form-item :options="{type: 'select',select: [{label: '1',value: '1'}]}"
                                   :form="form"
                                   class="d-inline-block select-box">
                  </model-form-item>
                  级
                </li>
                <li>
                  <model-form-item :options="{type: 'checkbox',prop: 'checkbox',checkbox: [{label: '安防工程企业资质'}]}"
                                   :form="form"
                                   class="d-inline-block">
                  </model-form-item>
                  <model-form-item :options="{type: 'select',select: [{label: '1',value: '1'}]}"
                                   :form="form"
                                   class="d-inline-block select-box">
                  </model-form-item>
                  级
                </li> -->
              <!-- </ul>
              <model-form-item :options="{label: '其他资质',prop: 'other',labelPosition: 'top',placeholder: '多个用 , 隔开'}"
                               :form="enterpriseCertificateArrayForm">
              </model-form-item> -->
              <p class="table-title">
                资质证书
                <a href="#"
                   class="icon fa fa-plus-circle"
                   @click.prevent="handleClickForPlus('qualifications')"></a>
              </p>
              <model-table class="section-table"
                           :options="qualifications"
                           :data="handleListData(qualificationsData)"
                           :fns="tableActions"
                           @callback="callback"></model-table>
            </section>
            <section class="section-box"
                     id="personnel">
              <!-- <p class="total-content">
                在编总人数
                <span class="num"></span>
                人, 中工程技术人员
                <span class="num"></span>
                人, 管理人员
                <span class="num"></span>
                人, 其中: 高级工程师
                <span class="num"></span>
                人,一级建造师
                <span class="num"></span>
                人,工程师
                <span class="num"></span>
                人,电工
                <span class="num"></span>
                人,特种作业人员
                <span class="num"></span>
                人
              </p> -->
              <!-- <p class="total-content">
                <template v-for="item of personnelCount">
                  {{item.text}}
                  <span class="num"
                        :key="item.text">{{item.count || ''}}</span>
                  {{item.appendText}}
                </template>
              </p> -->
              <div class="total-content ">

                <div class="d-inline-block">
                  在编总人数
                  <el-form-item class="num no-write-input-box">
                    <el-input :readonly="true"
                              v-model.trim="personTotalData.total"></el-input>
                  </el-form-item>
                  人,
                </div>
                <div class="d-inline-block">
                  其中: 工程管理人员
                  <el-form-item class="num"
                                prop="proManager">
                    <el-input @change="handleChangeForPersonData('proManager')"
                              v-model.trim="personTotalData.proManager"></el-input>
                  </el-form-item>
                  人,
                </div>
                <div class="d-inline-block">
                  技术管理人员
                  <el-form-item class="num"
                                prop="engineerManager">
                    <el-input @change="handleChangeForPersonData('engineerManager')"
                              v-model.trim="personTotalData.engineerManager"></el-input>
                  </el-form-item>
                  人,
                </div>
                <div class="d-inline-block">
                  技术员
                  <el-form-item class="num">
                    <el-input @change="handleChangeForPersonData('techWorker')"
                              v-model.trim="personTotalData.techWorker"></el-input>
                  </el-form-item>
                  人,
                </div>
                <div class="d-inline-block">
                  设计人员
                  <el-form-item class="num">
                    <el-input @change="handleChangeForPersonData('designer')"
                              v-model.trim="personTotalData.designer"></el-input>
                  </el-form-item>
                  人,
                </div>
                <div class="d-inline-block">
                  资料员
                  <el-form-item class="num">
                    <el-input @change="handleChangeForPersonData('dataManager')"
                              v-model.trim="personTotalData.dataManager"></el-input>
                  </el-form-item>
                  人,
                </div>
                <div class="d-inline-block">
                  其他
                  <el-form-item class="num">
                    <el-input @change="handleChangeForPersonData('other')"
                              v-model.trim="personTotalData.other"></el-input>
                  </el-form-item>
                  人
                </div>
              </div>
              <p class="table-title"><i class="star-icon">*</i>主要人员详情
                <a href="#"
                   class="icon fa fa-plus-circle"
                   @click.prevent="handleClickForPlus('personnel')"></a>
                <span class="achievement-desc">技术人员、管理人员数量越多认证级别越高，其中管理人员必须填写“主要人员详情</span>
              </p>
              <model-table class="section-table"
                           :options="personnel"
                           :data="handleListData(personnelData)"
                           :fns="tableActions"
                           @callback="callback"></model-table>
            </section>
            <section class="section-box"
                     id="vehicle">
              <!-- <p class="total-content">
                车辆总数量
                <span class="num"></span>
                辆, 其中: 登高车
                <span class="num"></span>
                辆,吊车
                <span class="num"></span>
                辆,货车
                <span class="num"></span>
                辆,客车
                <span class="num"></span>
                辆,其他
                <span class="num"></span>
                辆
              </p> -->
              <p class="total-content">
                <template v-for="item of vehicleTypeCount">
                  {{item.text}}
                  <span class="num no-write-input-box"
                        :key="item.text">{{item.count || ''}}</span>
                  {{item.appendText}}
                </template>
              </p>
              <p class="table-title">主要车辆详情
                <a href="#"
                   class="icon fa fa-plus-circle"
                   @click.prevent="handleClickForPlus('vehicle')"></a>
                <span class="achievement-desc">单位车辆数量会影响认证级别，单位车辆数量越多认证级别越高，其中最高认证级别需要单位施工车辆的配置</span>
              </p>
              <model-table class="section-table"
                           :options="vehicle"
                           :data="handleListData(vehicleData)"
                           :fns="tableActions"
                           @callback="callback"></model-table>
            </section>
            <section class="section-box"
                     id="equipment">
              <div class="total-content">
                <!-- 设备总数量
                <span class="num"></span>
                台, 其中: 切割机
                <span class="num"></span>
                台,发电机
                <span class="num"></span>
                台,冲击钻
                <span class="num"></span>
                台,风镐
                <span class="num"></span>
                台,振动棒
                <span class="num"></span>
                台,打夯机
                <span class="num"></span>
                台,穿管机
                <span class="num"></span>
                台,其他
                <span class="num"></span>
                台 -->
                <div class="d-inline-block"
                     v-for="(item,idx) of equipment"
                     :key="item.equipmentType+idx">
                  {{item.equipmentType}}
                  <el-form-item prop="equipmentCount"
                                class="num"
                                :class="{'no-write-input-box':idx === 0}">
                    <el-input :readonly="idx === 0"
                              @change="handleChangeForEquipment"
                              v-model.trim="equipment[idx].equipmentCount"></el-input>
                  </el-form-item>
                  台 {{idx !== equipment.length -1 ? ', ' : ''}} {{item.equipmentType === 'all' && '其中: ' || ''}}
                </div>
              </div>
            </section>
            <section class="section-box"
                     id="achievement">
              <div class="total-content">
                <p class="table-title">
                  近两年同类业绩 <span class="achievement-desc">近两年每年的同类业绩累积金额会影响认证级别，累积金额越高认证级别越高</span>
                </p>
                <el-row type="flex">

                  <el-col class="flex-item ml-1">
                    <p v-for="item of achievementCount"
                       :key="item.text">
                      <span class="num no-write-input-box">{{item.year}}</span>
                      年内完成同类业绩金额累积总计
                      <span class="num no-write-input-box">{{item.num}}</span>
                      万元
                    </p>
                  </el-col>
                </el-row>
              </div>
              <p class="table-title"><i class="star-icon">*</i> 业绩详情
                <a href="#"
                   class="icon fa fa-plus-circle"
                   @click.prevent="handleClickForPlus('achievement')"></a>
              </p>
              <model-table class="section-table"
                           :options="achievement"
                           :data="handleListData(achievementData)"
                           :fns="tableActions"
                           @callback="callback"></model-table>
            </section>
          </el-form>
        </div>
      </el-main>
    </el-container>
    <div class="entry-btns"
         :style="btnStyle"
         v-if="!['approving','finished'].includes(form.statusSign)">
      <el-button type="danger"
                 size="medium"
                 @click="submit(0)">保存</el-button>
      <el-button size="medium"
                 @click="submit(1)">提交</el-button>
    </div>
    <outside-dialog ref="dialog"
                    :show="outsideDialogShow"
                    @callback="callback"
                    :form="dialogForm"
                    refEle="outsideDialogForm"
                    :rules="dialogRulesOptions"
                    :remoteData="selects"
                    :options="dialogOptions"></outside-dialog>
  </div>
</template>
<script src="./config/apply.js">
</script>

<style lang="less" src="./config/apply.less">
</style>
