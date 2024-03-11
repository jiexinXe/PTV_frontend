<template>
  <div class="login">
    <el-link class="lin-login" type="primary" size="medium" @click="handlelogin">
      登录
    </el-link>
    <el-button class="but-register" type="info" size="small">
      注册
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    handlelogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="less">
.login {
  min-width: 100%;
  height: 40px;
  position: relative;
  display:flex;
  justify-content:flex-end;

}
.lin-login {
  position: relative;
  right: 120px;
  top: 10px;
}
.but-register {
  position: relative;
  right: 90px;
  top: 10px;
}
</style>