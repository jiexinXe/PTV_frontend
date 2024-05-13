<template>
  <div class="main-background">
    <div class="login-box">
      <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent="handleLogin" auto-complete="on" label-position="top" class="login-area">
        <h2 class="login-title">登录</h2>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" auto-complete="username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="current-password"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="login-buttons">
            <el-button type="primary" @click="handleLogin">登录</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </el-form-item>
        <p v-if="error" class="error">{{ error }}</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { userLogin, userRegister } from '../api/user.js'
import axios from '../utils/axios.js'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      },
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const params = {
            username: this.form.name,
            password: this.form.password
          };
          try {
            userLogin(params).then(res =>{
              console.log(res)
              if(res.data.code==200){
                this.$message.success(`登录成功`)
                this.loginForm = {}
                console.log(res.data.userId)
                const params3 = {
                  userId:res.data.data.userId,
                  username:res.data.data.username,
                  password:res.data.data.password,
                  roleId:res.data.data.role,
                 

                }
                // 缓存用户数据
                this.setUserInfo(params3)
                const userInfo = this.$store.getters.userInfo
                console.log(userInfo)
                const jwt = res.headers['authorization']
                
                this.setToken(jwt)
                const token = this.$store.getters.token
                console.log(localStorage.getItem("token"))
                // 关闭弹窗
                this.setShowLogin(false)
              }else if(res.data.code==400){
                this.isLoading = false
                this.$message.error('用户名或密码或验证码错误')
              }
            })
            this.$router.push({ name: 'dashboard' }); // 假设登录成功后跳转到仪表板
          } catch (error) {
            this.error = '登录失败，请检查您的用户名和密码是否正确。';
          }
        } else {
          console.log('表单验证失败!');
          return false;
        }
      });
    },
    handleCancel() {
      this.$router.push('/'); 
    },
    ...mapMutations('login', {
      'setUserInfo': 'SET_USER_INFO',
      'setShowLogin': 'SET_SHOW_LOGIN',
      'setToken':'SET_TOKEN',
    }),
  },
  computed: {
    ...mapGetters(['userInfo','token']),
    
  },
}
</script>

<style scoped lang="less">
.main-background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('../background/bg.jpg'); /* 背景图片 */
  background-size: cover;
  background-position: center;
}

.login-box {
  background-color: white; /* 更明亮的背景色 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); /* 添加阴影 */
  border-radius: 10px; /* 圆角边框 */
  width: 350px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 中心对齐子项 */
}

.login-title {
  margin-bottom: 30px;
}

.el-form-item {
  width: 100%; /* 确保表单项宽度与登录框一致 */
}

.el-input {
  border-radius: 20px; /* 输入框圆角 */
}

.el-button {
  border-radius: 20px; /* 按钮圆角 */
  transition: background-color 0.3s, transform 0.3s; /* 过渡效果 */
}

.el-button:hover {
  transform: translateY(-2px); /* 鼠标悬停时上移效果 */
}
</style>
