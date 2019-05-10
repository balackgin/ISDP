<template>
    <el-card class="users-wrap">
        <el-header class="users-header">
            <h2 class="title">用户管理</h2>
            <hr>
        </el-header>
        <!--查询数据-->
        <el-form ref="form" :model="form" label-width="120px" class="users-form">
            <el-form-item label="姓名：" class="users-item">
                <el-input class="users-input" placeholder="姓名..." v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="登录名：" class="users-item">
                <el-input class="users-input" placeholder="登录名..." v-model="form.loginName"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：" class="users-item">
                <el-input class="users-input" placeholder="手机号码..." v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item class="users-item">
                <el-button type="primary" class="users-query" @click="goQuery()">查询</el-button>
            </el-form-item>
        </el-form>
        <!--表格数据-->
        <div class="table-wrap">
            <p class="table-header">用户列表</p>
            <el-table
                    :data="tableData.slice((currpage - 1) * pagesize,currpage * pagesize)"
                    style="width: 1293px"
                    height="444"
                    :border="true"
                    :stripe="true"
                    class="users-table">
                <el-table-column
                        class="users-column"
                        type="index"
                        label="序号"
                        width="48"
                        fixed>
                </el-table-column>
                <el-table-column
                        class-name="users-column"
                        width="37"
                        type="expand">
                    <template slot-scope="scope">
                        <el-table style="width:452px;margin-left:85px" :border="true" class="second-table">
                            <el-table-column width="150" label="组名称">

                            </el-table-column>
                            <el-table-column width="300" label="描述">

                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                        class="users-column"
                        label="操作"
                        width="63">
                    <template slot-scope="scope">
                        <el-button
                                class="handle-button"
                                @click="handlegroups(scope.row)"
                                inactive-color="#ff4949">
                            组维护
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        class="users-column"
                        prop="id"
                        label="ID"
                        width="64">
                </el-table-column>
                <el-table-column
                        class="users-column"
                        prop="name"
                        label="姓名"
                        width="249">
                </el-table-column>
                <el-table-column
                        class="users-column"
                        prop="loginName"
                        label="登录名"
                        width="126">
                </el-table-column>
                <el-table-column
                        class="users-column"
                        prop="tel"
                        label="电话"
                        width="125">
                </el-table-column>
                <el-table-column
                        class="users-column"
                        prop="job"
                        label="职位"
                        width="249">
                </el-table-column>
                <el-table-column
                        class="users-column"
                        prop="department"
                        label="部门"
                        width="249">
                </el-table-column>
                <el-table-column
                        class="users-column"
                        prop="organized"
                        label="组织"
                        width="126">
                </el-table-column>
            </el-table>
            <el-pagination
                    class="users-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="20"
                    layout="total, prev, pager, next, jumper"
                    :total="tableData.length">
            </el-pagination>
        </div>
        <!--组维护dialog-->
        <el-dialog title="选择用户所属组" :visible.sync="dialogForm" class="edit-dialog">
            <div class="edit-wrap">
                <el-table
                        style="width: 100%"
                        height="42"
                        class="edit-table">
                    <el-table-column
                            label="姓名"
                            width="182">
                    </el-table-column>
                    <el-table-column
                            label="登录名"
                            width="234">
                    </el-table-column>
                    <el-table-column
                            label="手机号码"
                            width="340">
                    </el-table-column>
                </el-table>
                <span class="edit-span" style="width:182px">{{currUserName}}</span>
                <span class="edit-span" style="width:234px">{{currUserLoginName}}</span>
                <span class="edit-span" style="width:340px">{{currUserTel}}</span>
                <el-select
                        v-model="selectGroup"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="选择组"
                        class="edit-select">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editUser()">确 定</el-button>
                <el-button @click="dialogForm = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    export default {
        name: "users",
        data() {
            return {
                form: {
                    name: "",
                    loginName: "",
                    tel: ""
                },
                // 表格json假数据
                tableData: [{
                    id: "",
                    name: '王小虎',
                    loginName: "90400",
                    tel: "18600000000",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }, {
                    id: "",
                    name: '王小虎',
                    loginName: "",
                    tel: "",
                    job: "",
                    department: "",
                    organized: ""
                }

                ],
                pagesize: 20,
                currpage: 1,
                dialogForm: false,
                currUserName: "",
                currUserLoginName: "",
                currUserTel: "",
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
                selectGroup: []
            }
        },
        methods: {
            // 查询
            goQuery() {
                // console.log("usersQuery");
            },
            // 分页
            handleCurrentChange(cpage) {
                this.currpage = cpage;
            },
            handleSizeChange(psize) {
                this.pagesize = psize;
            },
            handlegroups(user) {
                this.currUserName = user.name;
                this.currUserLoginName = user.loginName;
                this.currUserTel = user.tel;
                this.dialogForm = true;
            },
            editUser() {
                this.dialogForm = false;
            }
        }

    }
</script>

<style lang="less" scoped>
    .users-wrap {
        padding: 5px 20px 20px 20px;
        box-shadow: none;

        .users-header {
            padding-left: 0;
            height: 55px;
        }

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

        .users-form {
            .users-item {
                margin-bottom: 5px;

                .users-input {
                    width: 50%;
                }

                .users-query {
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

            .handle-button {
                font-size: 12px;
                padding: 0;
                color: #000;
                border: none;
                width: 50px;
                height: 20px;
                background-color: #d7dde4;

                &:hover {
                    color: #33BE85;
                }
            }
        }

        .users-pagination {
            background-color: #E4ECF7;
        }

        .edit-wrap {
            .edit-span {
                display: inline-block;
                height: 42px;
                line-height: 42px;
                text-align: center;
            }

            .edit-select {
                width: 80%;
                margin-left: 50px;
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
    }

    .el-item-item {
        margin-bottom: 5px;
    }

    .users-table {
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

    .edit-dialog {
        .el-dialog__body {
            background: #EDEEEE;
        }
    }
</style>