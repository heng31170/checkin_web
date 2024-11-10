<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee">
            <el-header style="font-size: 40px; background-color: rgb(238, 241, 246)">登录</el-header>
            <el-main style="display: flex; align-items: center; justify-content: center;">
                <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="loginForm.account" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="passwd">
                        <el-input v-model="loginForm.passwd" :type="passwordFieldType" autocomplete="off">
                            <template #append>
                                <el-button 
                                    icon="el-icon-view" 
                                    @click="togglePasswordVisibility" 
                                    size="small" 
                                    class="toggle-password-button">
                                </el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="rememberMe" style="float: left;"> 保存密码</el-checkbox>
                        <el-button type="primary" @click="submitLogin()">登录</el-button>
                        <el-button @click="goToRegister" type="text" style="margin-left: 20%;">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/config";

export default {
    data() {
        return {
            loginForm: {
                account: '',
                passwd: ''
            },
            rememberMe: false,
            passwordFieldType: 'password', // 密码字段类型
            rules: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                passwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        const savedAccount = localStorage.getItem('savedAccount');
        const savedPassword = localStorage.getItem('savedPassword');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (savedAccount) {
            this.loginForm.account = savedAccount;
        }
        if (savedPassword) {
            this.loginForm.passwd = savedPassword;
        }
        this.rememberMe = savedRememberMe;
    },
    methods: {
        submitLogin() {
            axios.post(`${API_URL}/api/login`, this.loginForm)
                .then(response => {
                    this.$message.success("登录成功!");
                    
                    if (this.rememberMe) {
                        localStorage.setItem('savedAccount', this.loginForm.account);
                        localStorage.setItem('savedPassword', this.loginForm.passwd);
                        localStorage.setItem('rememberMe', 'true');
                    } else {
                        localStorage.removeItem('savedAccount');
                        localStorage.removeItem('savedPassword');
                        localStorage.setItem('rememberMe', 'false');
                    }

                    this.$router.push('/emp');
                })
                .catch(error => {
                    this.$message.error('登录失败!账号或密码错误');
                });
        },
        goToRegister() {
            this.$router.push('/register');
        },
        togglePasswordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
        resetLoginForm(formName) {
            this.$refs[formName].resetFields();
            this.rememberMe = false;
            localStorage.removeItem('savedAccount');
            localStorage.removeItem('savedPassword');
            localStorage.setItem('rememberMe', 'false');
        }
    }
}
</script>

<style scoped>
.demo-ruleForm {
    width: 25%;
}

.toggle-password-button {
    border: none; /* 去掉按钮边框 */
    background: transparent; /* 设置背景透明 */
    cursor: pointer; /* 鼠标指针变为手型 */
}
</style>