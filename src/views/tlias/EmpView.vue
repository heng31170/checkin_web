<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee">
            <el-header
                style="font-size: 40px; background-color: rgb(238, 241, 246); display: flex; justify-content: space-between; align-items: center;">
                <span
                    style="display: block; width: 100%; text-align: center; transform: translateX(-50%); margin-left: 50%;">拔剑班打卡系统</span>
                <!-- 菜单放置在右侧 -->
                <el-menu :default-active="null" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                    style="margin-right: 10%;" id="delBgc">
                    <el-submenu index="2">
                        <template slot="title">Hello! {{ curEmp.name }} <img :src="curEmp.image"
                                style="width: 40%; height: auto; border-radius: 50%;"></template>
                        <el-menu-item index="2-1" @click="toPerson">个人中心</el-menu-item>
                        <el-menu-item index="2-2" @click="dialogUpdatePasswdVisible = true">修改密码</el-menu-item>
                        <el-menu-item index="2-3" @click="unlogin">登出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu :default-openeds="['1', '3']">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-message"></i>系统信息管理</template>

                            <!-- <el-menu-item index="1-1">
                            <router-link to="/login">登录管理</router-link>
                            </el-menu-item> -->
                            <el-menu-item index="1-2">
                                <router-link to="/emp">拔剑班管理</router-link>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!-- 表单 查询员工 -->
                    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
                        <el-form-item label="姓名">
                            <el-input v-model="searchEmp.name" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="职位">
                            <el-input v-model="searchEmp.position" placeholder="职位"></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-select v-model="searchEmp.gender" placeholder="性别">
                                <el-option label="男" value="男"></el-option>
                                <el-option label="女" value="女"></el-option>
                                <el-option label="不限" value=""></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="入职日期(起)">
                            <!-- 日期选择器 -->
                            <el-date-picker type="date" v-model="searchEmp.entryDate" placeholder="选择入职日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="queEmp">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="dialogAddEmpVisible = true">新增员工</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="exprotTable">导出签到表</el-button>
                        </el-form-item>
                    </el-form>

                    <!-- 表格  插入数据？  -->
                    <el-table :data="tableData">
                        <el-table-column prop="name" label="姓名" width="140">
                        </el-table-column>
                        <el-table-column prop="image" label="头像" width="140">
                            <template slot-scope="scope">
                                <img :src="scope.row.image" alt="头像"
                                    style="width: 40%; height: 40%; border-radius: 50%;" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="gender" label="性别" width="140"></el-table-column>
                        <el-table-column prop="position" label="职位" width="140"></el-table-column>
                        <el-table-column prop="entryDate" label="入职日期" width="180"></el-table-column>
                        <el-table-column prop="lastOperationTime" label="最后操作时间" width="230"></el-table-column>
                        <el-table-column prop="action" label="操作" width="230">
                            <template slot-scope="scope">
                                <el-button v-if="!isCheck[scope.row.id]" type="primary" size="mini"
                                    @click="getIdAndCheckDialog(scope.row.id)">
                                    打卡
                                </el-button>
                                <el-button v-else type="success" size="mini"
                                    @click="getIdAndUnCheckDialog(scope.row.id)">
                                    已打卡
                                </el-button>
                                <el-button type="primary" size="mini"
                                    @click="getIdAndChangeDialog(scope.row.id)">编辑</el-button>
                                <el-button type="danger" size="mini"
                                    @click="getIdAndDelDialog(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 结束表格   插入数据 -->

                    <!-- 弹出更改密码对话框 -->
                    <el-dialog title="修改密码" :visible.sync="dialogUpdatePasswdVisible">
                        <el-form :model="EmpPasswd" status-icon :rules="rules" ref="EmpPasswd" label-width="100px"
                            class="demo-ruleForm">

                            <el-form-item label="原密码" prop="passwd">
                                <el-input type="password" v-model="EmpPasswd.originPasswd"
                                    autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="passwd">
                                <el-input type="password" v-model="EmpPasswd.passwd" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="confirmPasswd">
                                <el-input type="password" v-model="EmpPasswd.confirmPasswd"
                                    autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="updatePasswd">确定</el-button>
                                <el-button @click="dialogUpdatePasswdVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <!-- 结束更改密码对话框 -->

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
                    <el-dialog title="确定给该员工签到?" :visible.sync="dialogCheckVisible">
                        <el-form>
                            <el-form-item>
                                <el-button type="primary" @click="confirmCheck">确定</el-button>
                                <el-button @click="dialogCheckVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <!-- 结束签到对话框 -->
                    <!-- 弹出对话框,是否取消签到  -->
                    <el-dialog title="确定给该员工取消签到?" :visible.sync="dialogUnCheckVisible">
                        <el-form>
                            <el-form-item>
                                <el-button type="primary" @click="confirmUnCheck">确定</el-button>
                                <el-button @click="dialogUnCheckVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <!-- 结束取消签到对话框 -->
                    <!-- 编辑员工对话框 -->
                    <el-dialog title="编辑员工" :visible.sync="dialogChangeEmpVisible">
                        <el-form ref="form" :model="changeEmp" label-width="80px">
                            <el-form-item label="姓名">
                                <el-input v-model="changeEmp.name"></el-input>
                            </el-form-item>
                            <el-form-item label="头像">
                                <el-upload class="upload-demo" :on-change="handleFileChange"
                                    :before-upload="beforeUpload" :show-file-list="false" action="">
                                    <el-button size="small" type="primary">点击上传头像</el-button>
                                </el-upload>
                                <img v-if="changeEmp.image" :src="changeEmp.image" class="avatar" />
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-select v-model="changeEmp.gender" placeholder="请选择性别">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职位">
                                <el-input v-model="changeEmp.position"></el-input>
                            </el-form-item>
                            <el-form-item label="入职日期">
                                <el-date-picker type="date" placeholder="选择入职日期" v-model="changeEmp.entryDate"
                                    style="width: 100%"></el-date-picker>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="confirmChangeEmp">确定</el-button>
                                <el-button @click="cancelChangeEmp">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <!-- 结束编辑员工对话框 -->

                    <!-- 新增员工对话框 -->
                    <el-dialog title="新增员工" :visible.sync="dialogAddEmpVisible">
                        <el-form ref="form" :model="AddEmp" label-width="80px">
                            <el-form-item label="账户">
                                <el-input v-model="AddEmp.account"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="AddEmp.name"></el-input>
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-select v-model="AddEmp.gender" placeholder="请选择性别">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职位">
                                <el-input v-model="AddEmp.position"></el-input>
                            </el-form-item>
                            <el-form-item label="入职日期">
                                <el-date-picker type="date" placeholder="选择入职日期" v-model="AddEmp.entryDate"
                                    style="width: 100%"></el-date-picker>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="confirmAddEmp">确定</el-button>
                                <el-button @click="dialogAddEmpVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <!-- 结束新增员工对话框 -->

                    <br /><br />
                    <!-- 分页条 -->
                    <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="pagination.total"
                        :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize"
                        :current-page="pagination.currentPage" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>



<script>
import axios from "axios";
import { API_URL } from "@/config";
import moment from 'moment';
import { mapGetters } from "vuex";
import * as XLSX from 'xlsx';
export default {
    data() {
        return {
            tableData: [],
            // 当前员工
            curEmp: {
                account: "",
                name: "",
                gender: "",
                position: "",
                entryDate: "",
                isManager: "",
                image: "",
            },
            // 修改密码
            EmpPasswd: {
                originPasswd: '',
                passwd: '',
                confirmPasswd: '',
            },
            // 条件查询
            searchEmp: {
                name: "",
                gender: "",
                entryDate: "",
                position: "",
            },
            // 分页信息
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            // 编辑员工
            changeEmp: {
                name: "",
                image: null,
                gender: "",
                position: "",
                entryDate: "",
            },
            // 新增员工
            AddEmp: {
                account: "",
                name: "",
                gender: "",
                position: "",
                entryDate: "",
            },
            dialogDelVisible: false,
            dialogCheckVisible: false,
            dialogUnCheckVisible: false,
            dialogChangeEmpVisible: false,
            dialogAddEmpVisible: false,
            dialogUpdatePasswdVisible: false,
            empId: null,
            isCheck: {},
            selectedFile: null,
        };
    },
    computed: {
        ...mapGetters(['getCurEmp']),
        emp() {
            return this.getCurEmp || {};
        }
    },
    methods: {
        // 导出签到表
        exprotTable() {
            // 过滤 tableData，只保留所需字段
            const filteredData = this.tableData.map(item => ({
                账户: item.account,
                姓名: item.name,
                性别: item.gender,
                职位: item.position,
                打卡情况: this.isCheck[item.id] ? '已打卡' : '未打卡' // 根据 id 判断是否打卡
            }));
            const today = moment().format('YYYY-MM-DD');
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(filteredData);
            XLSX.utils.book_append_sheet(wb, ws, '签到表');
            XLSX.writeFile(wb, `${today}_签到表.xlsx`);
        },
        // 更新密码
        updatePasswd() {
            // 验证密码输入
            if (!this.EmpPasswd.originPasswd || !this.EmpPasswd.passwd || !this.EmpPasswd.confirmPasswd) {
                this.$message.error("原密码、新密码和确认密码不能为空");
                return;
            }

            if (this.EmpPasswd.passwd !== this.EmpPasswd.confirmPasswd) {
                this.$message.error("新密码和确认密码不一致");
                return;
            }
            // 检查新密码是否包含空格
            if (this.EmpPasswd.passwd.includes(" ")) {
                this.$message.error("新密码不能包含空格");
                return;
            }
            // 发送更新请求
            axios
                .post(`${API_URL}/api/passwd/update`, {
                    id: this.emp.id, // 传递员工 ID
                    originPasswd: this.EmpPasswd.originPasswd,
                    passwd: this.EmpPasswd.passwd,
                })
                .then(response => {
                    if (response.data) {
                        this.$message.success("密码更新成功,请重新登录!");
                        this.dialogUpdatePasswdVisible = false; // 关闭对话框
                        this.resetPasswdForm(); // 重置表单
                        this.unlogin();
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        this.$message.error(error.response.data.message || "密码更新失败");
                    } else {
                        this.$message.error("密码更新失败");
                    }
                });
        },

        // 重置密码表单
        resetPasswdForm() {
            this.EmpPasswd.originPasswd = '';
            this.EmpPasswd.passwd = '';
            this.EmpPasswd.confirmPasswd = '';
        },
        handleSelect() {
        },
        // 个人中心
        toPerson() {
            this.$router.push('/person');
        },
        // 登出
        unlogin() {
            // 清除 token
            sessionStorage.removeItem('token');
            // this.$router.replace('/login');
            this.$router.push('/login').then(() => {
                window.location.reload(); // 刷新页面
            });

        },
        // 确认新增员工
        confirmAddEmp() {
            const formattedDate = moment(this.AddEmp.entryDate).format('YYYY-MM-DD');
            this.AddEmp.entryDate = formattedDate;

            axios
                .post(`${API_URL}/api/emp/add`, this.AddEmp)
                .then(() => {
                    this.$message.success("新增员工成功!")
                    this.dialogAddEmpVisible = false;
                    this.resetAddEmp();
                    this.getEmp();
                })
                .catch(error => {
                    this.$message.error('员工添加失败!' + error.message);
                });
        },
        // 清空员工表单
        resetAddEmp() {
            this.AddEmp = {
                name: "",
                gender: "",
                position: "",
                entryDate: ""
            }
        },
        // 处理文件选择
        handleFileChange(file) {
            this.selectedFile = file.raw;
        },
        // 获取id并且弹出编辑对话框
        getIdAndChangeDialog(id) {
            this.empId = id;
            axios
                .get(`${API_URL}/api/emp/${id}`)
                .then((response) => {
                    this.changeEmp = response.data;
                    this.dialogChangeEmpVisible = true;
                })
                .catch((error) => {
                    log.error("获取员工信息失败", error);
                })
        },
        // 确认编辑并关闭对话框
        confirmChangeEmp() {
            const formattedDate = moment(this.changeEmp.entryDate).format('YYYY-MM-DD');
            this.changeEmp.entryDate = formattedDate;
            const formData = new FormData();
            const { name, image, gender, position, entryDate } = this.changeEmp;
            // 添加json数据
            formData.append("json", JSON.stringify({
                id: this.empId,
                name,
                gender,
                position,
                entryDate,
                image,
            }));
            // 添加文件
            if (this.selectedFile) {
                formData.append("file", this.selectedFile);
            }
            axios
                .post(`${API_URL}/api/emp/update`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((response) => {
                    this.getEmp();
                    //this.changeEmp.image = response.data.fileUrl;
                    this.dialogChangeEmpVisible = false;
                    this.$message.success("员工信息更新成功!")
                })
                .catch((error) => {
                    console.error("更新员工信息失败:", error);
                })
        },
        // 取消编辑对话框
        cancelChangeEmp() {
            this.dialogChangeEmpVisible = false;
        },

        // 上传前的处理
        beforeUpload(file) {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                this.$message.error('上传头像只能是图片!');
            }
            return false;
        },
        // 分页大小变化处理
        handleSizeChange(size) {
            this.pagination.pageSize = size;
            this.getEmp();
        },
        // 当前页变化处理
        handleCurrentChange(page) {
            this.pagination.currentPage = page;
            this.getEmp();
        },
        // 条件查询员工
        queEmp() {
            const { name, gender, entryDate, position } = this.searchEmp;

            // 检查入职日期是否存在，如果存在，则格式化
            const formattedDate = entryDate ? moment(entryDate).format('YYYY-MM-DD') : null;

            // 构建查询参数对象
            const params = {
                name,
                gender,
                ...(formattedDate ? { entryDate: formattedDate } : {}), // 仅在日期存在时添加
                position
            };

            axios
                .get(`${API_URL}/api/emp/search`, { params })
                .then((response) => {
                    this.tableData = response.data.empList;
                    this.$message.success("员工信息查询成功!");
                })
                .catch((error) => {
                    console.log("查询失败:", error.response ? error.response.data : error);
                    alert("查询失败: " + (error.response ? error.response.data.message : error.message));
                });
        },
        // 获取id并弹出删除对话框
        getIdAndDelDialog(id) {
            this.empId = id;
            this.dialogDelVisible = true;
        },
        // 确认删除并关闭对话框
        confirmDel() {
            this.delEmp(this.empId);
            this.dialogDelVisible = false;
            this.$message.success("员工删除成功!")
        },
        // 删除员工
        delEmp(id) {
            axios
                .post(`${API_URL}/api/emp/delete?id=${id}`)
                .then(() => {
                    this.getEmp(); // 刷新
                })
                .catch((error) => {
                    console.error("删除失败,请重试!", error);
                    alert("删除失败!");
                });
        },
        // 签到对话框
        getIdAndCheckDialog(id) {
            this.empId = id;
            this.dialogCheckVisible = true;
        },
        // 确认签到并关闭对话框
        confirmCheck() {
            this.addCheck(this.empId);
            this.dialogCheckVisible = false;
            this.$message.success("签到成功!")
        },
        // 取消签到对话框
        getIdAndUnCheckDialog(id) {
            this.empId = id;
            this.dialogUnCheckVisible = true;
        },
        // 确认取消签到并关闭对话框
        confirmUnCheck() {
            this.delCheck(this.empId);
            this.dialogUnCheckVisible = false;
            this.$message.success("取消签到成功!")
        },
        // 获取当前个人信息
        getPerson() {
            this.empId = this.emp.id;
            axios
                .get(`${API_URL}/api/emp/${this.empId}`)
                .then((response) => {
                    this.curEmp = response.data;
                })
                .catch((error) => {
                    console.error("获取员工信息失败", error);
                })
        },

        // 获取所有员工数据
        getEmp() {
            const params = {
                current: this.pagination.currentPage,
                size: this.pagination.pageSize
            }
            axios
                .get(`${API_URL}/api/emp/page`, {
                    params,
                })
                .then((response) => {
                    this.tableData = response.data.records;
                    this.pagination.total = response.data.total;
                })
                .catch((error) => {
                    console.error("请求失败:", error);
                    console.log("无法连接到API,请检查后端服务!");
                });
        },

        // 获取打卡状态
        getAllCheck() {
            axios
                .get(`${API_URL}/api/checkins`, {
                })
                .then((response) => {
                    response.data.isCheck.forEach((item) => {
                        this.$set(this.isCheck, item.empId, item.isCheck);
                    });
                })
                .catch((error) => {
                    console.error("获取签到信息失败:", error);
                    console.log(
                        "无法获取签到信息" +
                        (error.response ? error.response.data : error.message)
                    );
                });
        },
        // 打卡
        addCheck(id) {
            axios
                .post(`${API_URL}/api/addcheck?id=${id}`)
                .then(() => {
                    this.getAllCheck();
                })
                .catch((error) => {
                    alert("打卡失败!原因是：" + error);
                });
        },
        // 取消打卡
        delCheck(id) {
            axios
                .post(`${API_URL}/api/delcheck?id=${id}`)
                .then(() => {
                    this.getAllCheck();
                })
                .catch((error) => {
                    alert("取消打卡失败!原因是：" + error);
                });
        },
    },
    mounted() {
        const token = sessionStorage.getItem('token'); // 获取存储的token
        if (!token) { // 如果token为空，跳转到登录页面并刷新
            this.$router.replace('/login').then(() => {
                window.location.reload(); // 刷新页面
            });
        } else { // 如果token存在，继续获取用户信息和员工数据
            this.getPerson();
            this.getEmp();
            this.getAllCheck();
        }
    },
};
</script>




<style>
.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-top: 10px;
}

#delBgc {
    background-color: transparent;
}
</style>