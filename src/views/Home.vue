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
  min-height: 100vh; /* 使div至少有视窗的高度 */
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center; /* 新增：垂直居中对齐内容 */
  flex-direction: column; /* 新增：让内容垂直排列 */
  background-image: url('../background/bg.jpg'); /* 设置背景图片 */
  background-size: cover; /* 背景图片覆盖整个div */
  background-position: center; /* 背景图片居中显示 */
}
.lin-login, .but-register {
  position: absolute; /* 调整为绝对定位 */
  top: 10px; /* 根据实际情况调整按钮位置 */
}
.lin-login {
  right: 120px; /* 根据实际情况调整按钮位置 */
}
.but-register {
  right: 20px; /* 根据实际情况调整按钮位置 */
}
</style>
