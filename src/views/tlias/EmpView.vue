<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee">
            <el-header style="font-size: 40px; background-color: rgb(238, 241, 246)">拔剑班打卡系统</el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu :default-openeds="['1', '3']">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-message"></i>系统信息管理</template>

                            <!-- <el-menu-item index="1-1">
                  <router-link to="/dept">部门管理</router-link>
                </el-menu-item> -->
                            <el-menu-item index="1-2">
                                <router-link to="/emp">拔剑班管理</router-link>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!-- 表单 -->
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="姓名">
                            <el-input v-model="searchForm.name" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-select v-model="searchForm.gender" placeholder="性别">
                                <el-option label="男" value="1"></el-option>
                                <el-option label="女" value="2"></el-option>
                                <el-option label="不限" value="3"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="入职日期">
                            <!-- 日期选择器 -->
                            <el-date-picker v-model="searchForm.entrydate" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                        </el-form-item>
                    </el-form>

                    <!-- 表格  插入数据？  -->
                    <el-table :data="tableData">
                        <el-table-column prop="name" label="姓名" width="140">
                        </el-table-column>
                        <el-table-column prop="image" label="头像" width="140">
                        </el-table-column>
                        <el-table-column prop="gender" label="性别" width="140"></el-table-column>
                        <el-table-column prop="position" label="职位" width="140"></el-table-column>
                        <el-table-column prop="entryDate" label="入职日期" width="180"></el-table-column>
                        <el-table-column prop="lastOperationTime" label="最后操作时间" width="230"></el-table-column>
                        <el-table-column prop="action" label="操作" width="230">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="getIdAndCheckDialog(scope.row.id)">打卡</el-button>
                                <el-button type="primary" size="mini">编辑</el-button>
                                <el-button type="danger" size="mini"
                                    @click="getIdAndDelDialog(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 结束表格   插入数据 -->

                    <!-- 弹出对话框,是否删除  -->
                    <el-dialog title="确定删除改员工?" :visible.sync="dialogDelVisible">
                        <el-form>
                            <el-form-item>
                                <el-button type="primary" @click="confirmDel">确定</el-button>
                                <el-button @click="dialogDelVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <!-- 结束删除对话框 -->
                    <!-- 弹出对话框,是否签到  -->
                    <el-dialog title="确定给改员工签到?" :visible.sync="dialogCheckVisible">
                        <el-form>
                            <el-form-item>
                                <el-button type="primary" @click="confirmCheck">确定</el-button>
                                <el-button @click="dialogCheckVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <!-- 结束签到对话框 -->

                    <br /><br />
                    <!-- 分页条 -->
                    <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="1000"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange">
                    </el-pagination>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>



<script>
import axios from "axios";
export default {
    data() {
        return {
            tableData: [],
            searchForm: {
                name: "",
                gender: "",
                entrydate: [],
            },
            dialogDelVisible: false,
            dialogCheckVisible: false,
            empId: null,
        };
    },
    methods: {
        // 获取id并弹出删除对话框
        getIdAndDelDialog(id) {
            this.empId = id;
            this.dialogDelVisible = true;
        },
        // 确认删除并关闭对话框
        confirmDel() {
            this.delEmp(this.empId);
            this.dialogDelVisible = false;
        },
        // 获取id并弹出签到对话框
        getIdAndCheckDialog(id) {
            this.empId = id;
            this.dialogCheckVisible = true;
        },
        // 确认签到并关闭对话框
        confirmCheck() {
            alert("id是"+this.empId);
            this.dialogCheckVisible = false;
        },
        // 获取员工数据
        getEmp() {
            axios
                .get("http://127.0.0.1:5678/api/emp")
                .then((response) => {
                    this.tableData = response.data.empList;
                })
                .catch((error) => {
                    console.log("请求失败:", error);
                    alert("无法连接到API,请检查后端服务!");
                });
        },
        // 删除员工
        delEmp(id) {
            axios
                .post(`http://127.0.0.1:5678/api/emp/delete?id=${id}`)
                .then(() => {
                    this.getEmp(); // 刷新
                    alert("删除成功!");
                })
                .catch((error) => {
                    console.error("删除失败,请重试!", error);
                    alert("删除失败!");
                });
        },
    },
    mounted() {
        this.getEmp();
    },
};
</script>




<style></style>