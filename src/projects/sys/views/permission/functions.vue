<template>
    <el-card class="functions-wrap">
        <el-header class="functions-header">
            <h2 class="title">功能点管理</h2>
            <hr>
        </el-header>
        <el-form ref="form" :model="form" label-width="120px" class="functions-form">
            <el-form-item label="视图名称：" class="functions-item">
                <el-input class="functions-input" placeholder="视图名称..." v-model="form.viewName"></el-input>
            </el-form-item>
            <el-form-item label="视图关键字：" class="functions-item">
                <el-input class="functions-input" placeholder="视图关键字..." v-model="form.keywords"></el-input>
            </el-form-item>
            <el-form-item label="名称：" class="functions-item">
                <el-input class="functions-input" placeholder="名称..." v-model="form.functionName"></el-input>
            </el-form-item>
            <el-form-item label="类型：">
                <el-radio-group v-model="form.genre">
                    <el-radio label="0">全部</el-radio>
                    <el-radio label="1">菜单页面</el-radio>
                    <el-radio label="2">页面</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class="functions-item">
                <el-button type="primary" class="functions-query" @click="goQuery()">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrap">
            <p class="table-header">
                功能点列表
                <el-button type="info" round class="table-add" @click="addBox()">添加</el-button>
            </p>
            <el-table
                    style="width: 1293px"
                    height="444"
                    class="functions-table"
                    :border="true"
                    :stripe="true"
                    :data="tableData.slice((currpage - 1) * pagesize,currpage * pagesize)"
                    >
                <el-table-column
                        class="functions-column"
                        label="序号"
                        width="48"
                        type="index"
                        fixed>
                </el-table-column>
                <el-table-column
                        class-name="functions-column"
                        width="184"
                        label="视图名称/功能点操作">
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
                    </template>
                </el-table-column>
                <el-table-column
                        class="functions-column"
                        label="视图名称"
                        width="369"
                        prop="viewName">
                </el-table-column>
                <el-table-column
                        class="functions-column"
                        label="功能点名称"
                        width="370"
                        prop="functionName">
                </el-table-column>
                <el-table-column
                        class="functions-column"
                        label="功能关键字"
                        width="122"
                        prop="keywords">
                </el-table-column>
                <el-table-column
                        class="functions-column"
                        label="描述"
                        width="123"
                        prop="account">
                </el-table-column>
                <el-table-column
                        class="functions-column"
                        label="允许"
                        width="122"
                        prop="allows">
                </el-table-column>
                <el-table-column
                        class="functions-column"
                        label="类型"
                        width="85"
                        prop="types">
                </el-table-column>
            </el-table>
            <el-pagination
                    class="functions-pagination"
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
            <span>确定需要删除记录[{{functionName}}]？</span>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
        </el-dialog>
        <!--编辑弹窗-->
        <el-dialog title="功能点信息编辑" :visible.sync="dialogEditForm" class="edit-dialog">
            <div class="edit-wrap">
                <el-form :model="formEdit" ref="formEdit">
                    <el-form-item label="名称*:" label-width="80px">
                        <el-input v-model="formEdit.functionName" ></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" label-width="80px">
                        <el-input type="textarea" v-model="formEdit.account" label-width="534px"></el-input>
                    </el-form-item>
                    <el-form-item label="允许*:" label-width="80px">
                        <el-radio-group v-model="formEdit.allows">
                            <el-radio label="0">可读、可见</el-radio>
                            <el-radio label="1">可写、可点击</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="类型*:" label-width="80px">
                        <el-radio-group v-model="formEdit.types">
                            <el-radio label="0">字段</el-radio>
                            <el-radio label="1">按钮</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关键字:" label-width="80px">
                        <el-select
                                v-model="selectGroup"
                                multiple
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
                    <el-form-item label="所属范围:" label-width="80px">
                        <el-select
                                v-model="selectGroup"
                                multiple
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
                <el-button type="primary" @click="editUser()">确 定</el-button>
                <el-button @click="dialogEditForm = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!--添加弹窗-->
        <el-dialog title="功能点信息添加" :visible.sync="dialogAddForm" class="add-dialog">
            <div class="add-wrap">
                <el-form :model="formAdd" ref="formAdd">
                    <el-form-item label="名称*:" label-width="80px">
                        <el-input v-model="formAdd.functionName" ></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" label-width="80px">
                        <el-input type="textarea" v-model="formAdd.account" label-width="534px"></el-input>
                    </el-form-item>
                    <el-form-item label="允许*:" label-width="80px">
                        <el-radio-group v-model="formAdd.allows">
                            <el-radio label="0">可读、可见</el-radio>
                            <el-radio label="1">可写、可点击</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="类型*:" label-width="80px">
                        <el-radio-group v-model="formAdd.types">
                            <el-radio label="0">字段</el-radio>
                            <el-radio label="1">按钮</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关键字:" label-width="80px">
                        <el-select
                                v-model="selectGroup"
                                multiple
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
                    <el-form-item label="所属范围:" label-width="80px">
                        <el-select
                                v-model="selectGroup"
                                multiple
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
    </el-card>
</template>

<script>
    export default {
        name: "functions",
        data(){
            return {
                form: {
                    viewName:"",
                    keywords:"",
                    functionName: "",
                    genre:"0",
                },
                tableData:[{
                    viewName:"全部项目",
                    keywords:"export",
                    functionName: "导出项目",
                    account:"1111111",
                    allows:"可点击",
                    types:"字段"
                },{
                    viewName:"",
                    keywords:"",
                    functionName: "",
                    account:"",
                    allows:"",
                    types:""
                }],
                pagesize: 20,
                currpage: 1,
                formEdit:{
                    functionName:"",
                    account:"",
                    allows:"",
                    types:"",
                },
                formAdd:{
                    functionName:"",
                    account:"",
                    allows:"",
                    types:"",
                },
                selectGroup:[],
                options: [{
                    value: 'export',
                    label: '导出'
                }, {
                    value: 'save',
                    label: '保存'
                }, {
                    value: 'close',
                    label: '关闭'
                }, {
                    value: 'delete',
                    label: '删除'
                }, {
                    value: 'cancel',
                    label: '取消'
                }],
                options2: [{
                    value: 'export',
                    label: '导出'
                }, {
                    value: 'save',
                    label: '保存'
                }, {
                    value: 'close',
                    label: '关闭'
                }, {
                    value: 'delete',
                    label: '删除'
                }, {
                    value: 'cancel',
                    label: '取消'
                }],
                dialogEditForm: false,
                dialogVisible:false,
                dialogAddForm:false,
                functionName:""
            }
        },
        methods:{
            // 查询
            goQuery() {
                console.log("functionsQuery");
            },
            handleCurrentChange(cpage) {
                this.currpage = cpage;
            },
            handleSizeChange(psize) {
                this.pagesize = psize;
            },
            editBox(user){
                this.formEdit.functionName= user.functionName;
                this.formEdit.account = user.account;
                this.formEdit.allows = user.allows;
                this.formEdit.types = user.types;
                this.dialogEditForm = true;
            },
            editUser(){
                this.dialogEditForm = false;
            },
            deleteBox(user) {
                this.dialogVisible = true;
                this.functionName=user.functionName;
            },
            async close() {
                // 删除记录
                this.dialogVisible=false;

            },
            addBox(){
                this.dialogAddForm=true
            },
            addUser(){
                this.dialogAddForm=false;
            }
        }
    }
</script>

<style lang="less" scoped>
    .functions-wrap{
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
        .functions-form {
            .functions-item {
                margin-bottom: 5px;

                .functions-input {
                    width: 50%;
                }

                .functions-query {
                    width: 64px;
                    height: 33px;
                    padding: 6px 15px;
                    border-radius: 0;
                    background-color: #59C2E6;
                    border-color: #59C2E6;

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
            .table-header {
                height: 27px;
                line-height: 27px;
                font-size: 12px;
                font-weight: 600;
                color: #666666;
                padding: 0 10px;
                background-color: #E4ECF7;
            }
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
            .functions-pagination {
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
    .functions-table {
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
    .edit-dialog,.add-dialog{
        .el-dialog__body {
            background: #EDEEEE;
        }
    }
</style>