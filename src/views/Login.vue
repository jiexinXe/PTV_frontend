<template>
  <div class="main-background">
    <div class="login-box">
      <div class="login-area">
        <el-form ref="form" :model="form" auto-complete="on" label-width="80px">
          <div class="denglu" :style="{ color: '#2c3e50', fontSize: '30px', fontWeight: 'bold'}">
            登录
          </div>
          <el-form-item>
            <el-input style="width: 400px; left: -30px" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input style="width: 400px; left: -30px" v-model="form.password"></el-input>
          </el-form-item>
          <div class="denglu-btn">
            <el-button type="primary" @click="handlelogin">登录</el-button>
            <el-button @click="handleCancel">取消</el-button> <!-- 已更新点击事件处理器 -->
          </div>
        </el-form>
      </div>
    </div>
    <div class="cover-box">
    </div>
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
      }
    },
    methods: {
      handlelogin() {
        const params = {
          username: this.form.username,
          password: this.form.password
        };
        const res = axios.post('http://localhost:8082/login', params);
        console.log('res', res);

        res.then(response => {
          console.log('请求成功:');
          console.log('response', response);
        });

        res.catch(error => {
          console.log('请求失败:');
          console.log('请求失败响应对象获取', error.response);
        });
      },
      handleCancel() {
        this.$router.push('/'); 
      }
    }
  }
</script>

<style scoped lang="less">
.login-box{
  background-color: aliceblue;
  position: relative;
  width: 30%;
  height: 600px;
  left: 50%;
  top: 150px;
  box-shadow: 0 0 5px 1px #999
}
.cover-box{
  background-color: rgba(15,30,47,0.73);
  position: relative;
  width: 30%;
  height: 600px;
  left: 20%;
  top: -450px;
  box-shadow: 0 0 5px 1px #999
}
.login-area{
  position: relative;
  top: 100px;
}
.denglu{
  position: relative;
  left: -175px;
  top: -20px;
}
.main-background{
  margin-top: 0px;
  //background:url("../assets/snow.jpg");
  width:100%;
  height:100%;
  position:fixed;
  background-size:100% 100%;
}
</style>