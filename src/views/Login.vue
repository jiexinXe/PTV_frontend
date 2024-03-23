<template>
  <div class="main-background">
    <div class="login-box">
      <el-form ref="form" :model="form" auto-complete="on" label-position="top" class="login-area">
        <h2 class="login-title">登录</h2>
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <div class="login-buttons">
          <el-button type="primary" @click="handlelogin">登录</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form>
    </div>
    <div class="cover-box"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        name: '',
        password: ''
      }
    };
  },
  methods: {
    async handlelogin() {
      const params = {
        username: this.form.name,
        password: this.form.password
      };
      try {
        const response = await axios.post('http://localhost:8082/login', params);
        console.log('请求成功:', response);
      } catch (error) {
        console.error('请求失败:', error.response);
      }
    },
    handleCancel() {
      this.$router.push('/'); 
    }
  }
}
</script>

<style scoped lang="less">
.main-background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-size: cover;
}

.login-box, .cover-box {
  background-color: aliceblue;
  width: 30%;
  max-width: 400px; /* 最大宽度，确保在大屏幕上也不会过大 */
  height: auto; /* 高度自适应内容 */
  box-shadow: 0 0 5px 1px #999;
  padding: 20px; /* 添加内边距 */
}

.cover-box {
  background-color: rgba(15, 30, 47, 0.73);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.login-area {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 表单元素之间的间隔 */
}

.login-buttons {
  display: flex;
  justify-content: space-around;
}
</style>
