<template>
  <el-form label-position="left"
           label-width="100px"
           :inline="inline">
    <el-row type="flex"
            class="flex-wrap">
      <el-col :md="inline && 8 || 24"
              :sm="12">
        <el-form-item size="small"
                      :label="label && '州/省'">
          <el-select filterable
                     placeholder="请选择州/省"
                     :loading="getProvinceLoading"
                     v-model="provinceVal"
                     @change="getLovString({type: 'DH_CITY',parentId: provinceVal})">
            <el-option v-for="item of provinceData"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="inline && 8 || 24"
              :sm="12">
        <el-form-item size="small"
                      :label="label && '城市'">
          <el-select filterable
                     placeholder="请选择城市"
                     v-model="cityVal"
                     :loading="getCityLoading"
                     :no-data-text="provinceVal ? '无数据' : '请先选择州/省'"
                     :disabled="!provinceVal"
                     @change="getLovString({type: 'DH_COUNTY',parentId: cityVal})">
            <el-option v-for="item of cityData"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="inline && 8 || 24"
              :sm="12">
        <el-form-item size="small"
                      :label="label && '区/县'">
          <el-select filterable
                     placeholder="请选择区/县"
                     :loading="getCountLoading"
                     :no-data-text="cityVal ? '无数据' : '请先选择城市'"
                     :disabled="!cityVal"
                     v-model="countyVal">
            <el-option v-for="item of countyData"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: 'citys',
  data(){
    return {
      provinceVal: '',
      cityVal: '',
      countyVal: '',
      provinceData: [],
      cityData: [],
      countyData: [],


      getCountLoading: false,
      getCityLoading: false,
      getProvinceLoading: false
    }
  },
  methods: {
    getLovString(params){
      if(params.type === 'DH_PROVINCE'){
        this.cityVal = '';
        this.cityData = [];
        this.countyVal = '';
        this.countyData = [];
        this.getProvinceLoading = true;
      }else if(params.type === 'DH_CITY'){
        this.cityVal = '';
        this.cityData = [];
        this.countyVal = '';
        this.countyData = [];
        this.getCityLoading = true;
      }else if(params.type === 'DH_COUNTY'){
        this.countyData = [];
        this.countyVal = '';
        this.getCountLoading = true;
      }
      this.$store.dispatch('common/getLovString',params).then(({data})=>{
        let result = data.data;
        if(params.type === 'DH_PROVINCE'){
          this.provinceData = result;
          this.getProvinceLoading = false;
        }else if(params.type === 'DH_CITY'){
          this.cityData = result;
          this.getCityLoading = false;
        }else if(params.type === 'DH_COUNTY'){
          this.countyData = result;
          this.getCountLoading = false;
        }
      })
    }
  },
  created(){
    this.getLovString({type: 'DH_PROVINCE'})
  },
  props: {
    label: {
      default: true,
      type: Boolean
    },
    inline: {
      type: Boolean,
      default: true
    }
  }
}
</script>
