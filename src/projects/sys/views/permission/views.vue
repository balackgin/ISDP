<template>
    <el-card class="views-wrap">
        <el-header class="views-header">
            <h2 class="title">视图管理</h2>
            <hr>
        </el-header>
        <el-form ref="form" :model="form" label-width="120px" class="views-form">
            <el-form-item label="名称：" class="views-item">
                <el-input class="views-input" placeholder="名称..." v-model="form.viewsName"></el-input>
            </el-form-item>
            <el-form-item label="类型：">
                <el-radio-group v-model="form.genre">
                    <el-radio label="0">全部</el-radio>
                    <el-radio label="1">菜单页面</el-radio>
                    <el-radio label="2">页面</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class="views-item">
                <el-button type="primary" class="views-query" @click="goQuery()">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrap">
            <p class="table-header">
                视图列表
                <el-button type="info" round class="table-add" @click="addBox()">添加</el-button>
            </p>
            <el-table
                    :data="tableData.slice((currpage - 1) * pagesize,currpage * pagesize)"
                    style="width: 1293px"
                    height="444"
                    :border="true"
                    :stripe="true"
                    class="views-table">
                <el-table-column
                        class="views-column"
                        type="index"
                        label="序号"
                        width="48"
                        fixed>
                </el-table-column>
                <el-table-column
                        class-name="views-column"
                        width="37"
                        type="expand">
                    <!--展开表格-->
                    <template slot-scope="scope">
                        <el-table style="width:552px;margin-left:85px" :border="true" class="second-table">
                            <el-table-column width="150" label="功能点名称">

                            </el-table-column>
                            <el-table-column width="100" label="功能关键字">

                            </el-table-column>
                            <el-table-column width="200" label="描述">

                            </el-table-column>
                            <el-table-column width="50" label="允许">

                            </el-table-column>
                            <el-table-column width="50" label="类型">

                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                        class="views-column"
                        label="操作"
                        width="184">
                    <template slot-scope="scope">
                        <el-button
                                class="handle-button"
                                @click="editBox(scope.row)"
                                inactive-color="#ff4949">
                            编辑
                        </el-button>
                        <el-button
                                class="handle-button"
                                @click="deleteBox(scope.row)"
                                inactive-color="#ff4949">
                            删除
                        </el-button>
                        <el-button
                                class="handle-button"
                                @click="copyBox(scope.row)"
                                inactive-color="#ff4949">
                            复制
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        class="views-column"
                        prop="id"
                        label="ID"
                        width="64">
                </el-table-column>
                <el-table-column
                        class="views-column"
                        prop="design"
                        label="名称"
                        width="246">
                </el-table-column>
                <el-table-column
                        class="views-column"
                        prop="account"
                        label="描述"
                        width="246">
                </el-table-column>
                <el-table-column
                        prop="indexs"
                        label="索引"
                        class="views-column"
                        width="246">
                </el-table-column>
                <el-table-column
                        prop="types"
                        label="类型"
                        class="views-column"
                        width="246">
                </el-table-column>
            </el-table>
            <el-pagination
                    class="views-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="20"
                    layout="total, prev, pager, next, jumper"
                    :total="tableData.length">
            </el-pagination>
        </div>
        <!--删除窗口-->
        <el-dialog
                title="系统提示"
                :visible.sync="dialogVisible"
                width="20%"
        >
            <span>确定需要删除记录[{{design}}]？</span>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
        </el-dialog>
        <!--编辑弹窗-->
        <el-dialog title="视图信息编辑" :visible.sync="dialogEditForm" class="editViews-dialog">
            <div class="edit-wrap">
                <el-form :model="formEdit" ref="formEdit">
                    <el-form-item label="名称*:" label-width="80px">
                        <el-input v-model="formEdit.design" ></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" label-width="80px">
                        <el-input type="textarea" v-model="formEdit.account" label-width="534px"></el-input>
                    </el-form-item>
                    <el-form-item label="类型*:" label-width="80px">
                        <el-radio-group v-model="formAdd.genre">
                            <el-radio label="0">菜单页面</el-radio>
                            <el-radio label="1">页面</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="索引:" label-width="80px">
                        <el-input v-model="formAdd.indexs" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="视图选择:" label-width="80px">
                        <el-select
                                v-model="selectGroup"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="选择视图"
                                class="edit-select">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editUser()">确 定</el-button>
                <el-button @click="dialogEditForm = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!--添加弹窗-->
        <el-dialog title="视图信息添加" :visible.sync="dialogAddForm" class="addViews-dialog">
            <div class="add-wrap">
                <el-form :model="formAdd" ref="formAdd">
                    <el-form-item label="名称*:" label-width="80px">
                        <el-input v-model="formAdd.design"  placeholder="名称(必填)..."></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" label-width="80px">
                        <el-input type="textarea" v-model="formAdd.account" label-width="534px"></el-input>
                    </el-form-item>
                    <el-form-item label="类型*:" label-width="80px">
                        <el-radio-group v-model="formAdd.genre">
                            <el-radio label="0">菜单页面</el-radio>
                            <el-radio label="1">页面</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="索引:" label-width="80px">
                        <el-input v-model="formAdd.indexs" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="关键字:" label-width="80px">
                        <el-select
                                v-model="selectGroup"
                                filterable
                                allow-create
                                default-first-option
                                class="edit-select">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addUser()">确 定</el-button>
                <el-button @click="dialogAddForm = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!--复制窗口-->
        <el-dialog title="请输入你要绑定的新名称" :visible.sync="dialogCopyForm" width="30%">
                <el-form :model="formCopy" ref="formAdd">
                    <el-form-item label="新名称*:" label-width="80px">
                        <el-input v-model="formCopy.design"></el-input>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="copyUser()">确 定</el-button>
                <el-button @click="dialogCopyForm = false">关 闭</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    export default {
        name: "views",
        data(){
            return {
                form: {
                    viewsName: "",
                    genre:"0",
                },
                tableData: [{
                    id: "",
                    design: '王小虎',
                    account:"111111111111",
                    indexs:0,
                    types:"页面"
                },{
                    id: "",
                    design: '甲方',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }, {
                    id: "",
                    design: '王小虎',
                    account:"",
                    indexs:0,
                    types:"页面"
                }],
                pagesize: 20,
                currpage: 1,
                dialogEditForm: false,
                options: [{
                    value: 'it',
                    label: 'IT管理员'
                }, {
                    value: 'work',
                    label: '办事处'
                }, {
                    value: 'charge',
                    label: '主管'
                }, {
                    value: 'sell',
                    label: '销售'
                }, {
                    value: 'operation',
                    label: '运营'
                }],
                selectGroup: [],
                formEdit:{
                    design:"",
                    account:"",
                    indexs:""
                },
                dialogVisible:false,
                design:"",
                dialogAddForm:false,
                formAdd:{
                    design:"",
                    account:"",
                    genre:"0",
                    indexs:0
                },
                dialogCopyForm:false,
                formCopy:{
                    design:""
                }
            }
        },
        methods:{
            // 查询
            goQuery() {
                console.log("viewsQuery");
            },
            handleCurrentChange(cpage) {
                this.currpage = cpage;
            },
            handleSizeChange(psize) {
                this.pagesize = psize;
            },
            editBox(user){
                this.formEdit.design = user.design;
                this.formEdit.account = user.account;
                this.formEdit.indexs = user.indexs;
                this.dialogEditForm = true;
            },
            editUser(){
                console.log("编辑");
                this.dialogEditForm = false;
            },
            deleteBox(user) {
                this.dialogVisible = true;
                this.design=user.design;
            },
            async close() {
                // 删除记录
                this.dialogVisible=false;
                console.log("删除");

            },
            addBox(){
                this.dialogAddForm=true
            },
            addUser(){
                this.dialogAddForm=false;
                console.log("添加");
            },
            copyBox(user){
                this.dialogCopyForm=true;
                this.formCopy.design=user.design;
            },
            copyUser(){
                this.dialogCopyForm=false;
                console.log("复制");
            }
        }
    }
</script>

<style lang="less" scoped>
    .views-wrap{
        padding:5px 20px 20px 20px;
        box-shadow:none;
        .title{

            font-weight:600;
            font-size:18px;
            margin-bottom:5px;
            color:#4f5f6f;
        }
        hr{
            margin:10px 0;
            border:none;
            background-color:#d7dde4;
            height:1px;
        }
        .views-form {
            .views-item {
                margin-bottom: 5px;

                .views-input {
                    width: 50%;
                }
                .views-query {
                    width: 64px;
                    height: 33px;
                    padding: 6px 15px;
                    border-radius: 0;
                    background-color: #59C2E6;
                    border-color: #59C2E6;
                    margin-top:-50px;
                    &:hover {
                        border-color: #2db2df;
                        background-color: #2db2df;
                    }
                }
            }
        }
        .table-wrap {
            width: 1293px;
            border: 1px solid #99BCE8;
            border-radius: 5px;
            margin-top: 10px;
            .table-add{
                width:50px;
                height:22px;
                font-size: 12px;
                text-align: center;
                padding:0;
            }
            .table-header {
                height: 27px;
                line-height: 27px;
                font-size: 12px;
                font-weight: 600;
                color: #666666;
                padding: 0 10px;
                background-color: #E4ECF7;
            }
            .handle-button {
                font-size: 12px;
                padding: 0;
                color: #000;
                border: none;
                width: 40px;
                height: 20px;
                background-color: #d7dde4;
                &:hover {
                    color: #33BE85;
                }
            }
            .views-pagination {
                background-color: #E4ECF7;
            }
        }
        .edit-wrap,.add-wrap{
            .edit-select{
                width:80%;
            }
        }
    }
</style>
<style lang="less">
    .el-form-item__content {
        height: 33px;
        .el-input__inner {
            height: 33px;
            border-radius: 0;
            border-color: #ccc;
            &:focus {
                border-color: #4BCF99;
            }
        }
        .el-textarea__inner{
            border-radius: 0;
            border-color: #ccc;
            &:focus {
                border-color: #4BCF99;
            }
        }
    }
    .views-table {
        .cell {
            font-size: 12px;
            text-align: center;
        }
        .el-table__header th, el-table__header tr {
            padding: 1px;
            background-color: #eeeeee;
            color: #666666;
        }
        .el-table__body td, el-table__body th {
            padding: 1px;
            color: #333333;
        }
    }
    .edit-table {
        .el-table__header th, el-table__header tr {
            background-color: #ffffff;
            color: #666666;
            text-align: center;
        }
    }
    .editViews-dialog,.addViews-dialog{
        .el-dialog__body {
            background: #EDEEEE;
            height: 480px;
        }
    }
    .edit-dialog,.add-dialog{
        .el-dialog__body {
            background: #EDEEEE;
            /*height: 300px;*/
        }
    }
</style>