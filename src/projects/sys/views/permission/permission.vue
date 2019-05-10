<template>
    <el-card class="permission-wrap">
        <el-header class="permission-header">
            <h2 class="title">用户权限情况查询</h2>
            <hr>
        </el-header>
        <el-form ref="form" :model="form" label-width="120px" class="permission-form">
            <el-form-item label="名称：" class="permission-item">
                <el-input class="permission-input" placeholder="名称..." v-model="form.permissionName"></el-input>
            </el-form-item>
            <el-form-item class="permission-item">
                <el-button type="primary" class="permission-query left" @click="goQuery()">查询</el-button>
                <el-upload
                        class="permission-upload"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :file-list="fileList" :show-file-list="false">
                    <el-button size="small" type="info" class="permission-query right">导入</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <div class="table-wrap">
            <p class="table-header">
                用户权限情况列表
            </p>
            <el-table
                    style="width: 1293px"
                    height="444"
                    :border="true"
                    :stripe="true"
                    class="permission-table">
                <el-table-column
                        class="permission-column"
                        type="index"
                        label="序号"
                        width="48"
                        fixed>
                </el-table-column>
                <el-table-column
                        class-name="permission-column"
                        width="180"
                        label="登录名">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        label="姓名"
                        width="124">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        label="视图名称"
                        width="124">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        label="视图关键字"
                        width="124">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        label="视图类型"
                        width="124">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        label="功能点名称"
                        width="124">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        label="功能点关键字"
                        width="124">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        label="功能点类型"
                        width="86">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        label="功能点允许"
                        width="86">
                </el-table-column>
                <el-table-column
                        class="permission-column"
                        width="145">
                </el-table-column>
            </el-table>
            <el-pagination
                    class="permission-pagination"
                    :page-size="20"
                    layout="total, prev, pager, next, jumper"
            >
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "permission",
        data() {
            return {
                form: {
                    permissionName: ""
                },
                fileList: []
            }
        },
        methods: {
            // 查询
            goQuery() {
                // console.log("permissionQuery");
            }
        }
    }
</script>

<style lang="less" scoped>
    .permission-wrap {
        padding: 5px 20px 20px 20px;
        box-shadow: none;

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

        .permission-form {
            .permission-item {
                margin-bottom: 5px;
                position: relative;

                .permission-input {
                    width: 50%;
                }


            }
        }

        .permission-query {
            width: 64px;
            height: 33px;
            padding: 6px 15px;
            border-radius: 0;
        }

        .left {
            background-color: #59C2E6;
            border-color: #59C2E6;

            &:hover {
                border-color: #2db2df;
                background-color: #2db2df;
            }
        }

        .right {
            position: absolute;
            left: 70px;
            top: 4px;
            background-color: #DDDDDD;
            border-color: #DDDDDD;
            color: #4F5F6F;
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

            .permission-pagination {
                background-color: #E4ECF7;
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

    .permission-table {
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
</style>