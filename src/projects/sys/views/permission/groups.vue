<template>
    <el-card class="groups-wrap">
        <el-header class="groups-header">
            <h2 class="title">组管理</h2>
            <hr>
        </el-header>
        <el-form ref="form" :model="form" label-width="120px" class="groups-form">
            <el-form-item label="名称：" class="groups-item">
                <el-input class="groups-input" placeholder="名称..." v-model="form.groupsName"></el-input>
            </el-form-item>
            <el-form-item class="groups-item">
                <el-button type="primary" class="groups-query" @click="goQuery()">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrap">
            <p class="table-header">
                组列表
                <el-button type="info" round class="table-add" @click="addBox()">添加</el-button>
            </p>
            <el-table
                    :data="tableData.slice((currpage - 1) * pagesize,currpage * pagesize)"
                    style="width: 1293px"
                    height="444"
                    :border="true"
                    :stripe="true"
                    class="groups-table">
                <el-table-column
                        class="groups-column"
                        type="index"
                        label="序号"
                        width="48"
                        fixed>
                </el-table-column>
                <el-table-column
                        class-name="groups-column"
                        width="37"
                        type="expand">
                    <!--展开表格-->
                    <template slot-scope="scope">
                        <el-table style="width:452px;margin-left:85px" :border="true" class="second-table">
                            <el-table-column width="150" label="角色名称">

                            </el-table-column>
                            <el-table-column width="300" label="描述">

                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                        class="groups-column"
                        label="操作"
                        width="122">
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
                        class="groups-column"
                        prop="id"
                        label="ID"
                        width="64">
                </el-table-column>
                <el-table-column
                        class="groups-column"
                        prop="design"
                        label="名称"
                        width="246">
                </el-table-column>
                <el-table-column
                        class="groups-column"
                        prop="account"
                        label="描述"
                        width="246">
                </el-table-column>
                <el-table-column
                        class="groups-column"
                        width="526">
                </el-table-column>
            </el-table>
            <el-pagination
                    class="groups-pagination"
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
        <el-dialog title="组信息编辑" :visible.sync="dialogEditForm" class="edit-dialog">
            <div class="edit-wrap">
                <el-form :model="formEdit" ref="formEdit">
                    <el-form-item label="名称*:" label-width="80px">
                        <el-input v-model="formEdit.design"></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" label-width="80px">
                        <el-input type="textarea" v-model="formEdit.account" label-width="534px"></el-input>
                    </el-form-item>
                    <el-form-item label="角色选择:" label-width="80px">
                        <el-select
                                v-model="selectGroup"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="选择角色"
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
        <el-dialog title="组信息添加" :visible.sync="dialogAddForm" class="add-dialog">
            <div class="add-wrap">
                <el-form :model="formAdd" ref="formAdd">
                    <el-form-item label="名称*:" label-width="80px">
                        <el-input v-model="formAdd.design" placeholder="名称(必填)..."></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" label-width="80px">
                        <el-input type="textarea" v-model="formAdd.account" label-width="534px"></el-input>
                    </el-form-item>
                    <el-form-item label="角色选择:" label-width="80px">
                        <el-select
                                v-model="selectGroup"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="选择角色"
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
        name: "groups",
        data() {
            return {
                form: {
                    groupsName: ""
                },
                tableData: [{
                    id: "",
                    design: '王小虎',
                    account: "111111111111"
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
                }, {
                    id: "",
                    design: '王小虎',
                    account: ""
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
                formEdit: {
                    design: "",
                    account: ""
                },
                dialogVisible: false,
                design: "",
                dialogAddForm: false,
                formAdd: {
                    design: "",
                    account: ""
                }
            }
        },
        methods: {
            // 查询
            goQuery() {
                console.log("groupsQuery");
            },
            handleCurrentChange(cpage) {
                this.currpage = cpage;
            },
            handleSizeChange(psize) {
                this.pagesize = psize;
            },
            editBox(user) {
                this.formEdit.design = user.design;
                this.formEdit.account = user.account;
                this.dialogEditForm = true;
            },
            editUser() {
                console.log("编辑");
                this.dialogEditForm = false;
            },
            deleteBox(user) {
                this.dialogVisible = true;
                this.design = user.design;
            },
            async close() {
                // 删除记录
                this.dialogVisible = false;
                console.log("删除");

            },
            addBox() {
                this.dialogAddForm = true
            },
            addUser() {
                this.dialogAddForm = false;
                console.log("添加");
            }
        }
    }
</script>

<style lang="less" scoped>
    .groups-wrap {
        padding: 5px 20px 20px 20px;
        box-shadow: none;
        height: 100%;

        .title {

            font-weight: 600;
            font-size: 18px;
            margin-bottom: 5px;
            color: #4f5f6f;
        }

        hr {
            margin: 10px 0;
            border: none;
            background-color: #d7dde4;
            height: 1px;
        }

        .groups-form {
            .groups-item {
                margin-bottom: 5px;

                .groups-input {
                    width: 50%;
                }

                .groups-query {
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

            .table-add {
                width: 50px;
                height: 22px;
                font-size: 12px;
                text-align: center;
                padding: 0;
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

            .groups-pagination {
                background-color: #E4ECF7;
            }
        }

        .edit-wrap, .add-wrap {
            .edit-select {
                width: 80%;
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

        .el-textarea__inner {
            border-radius: 0;
            border-color: #ccc;

            &:focus {
                border-color: #4BCF99;
            }
        }
    }

    .groups-table {
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

    .edit-dialog, .add-dialog {
        .el-dialog__body {
            background: #EDEEEE;
        }
    }
</style>