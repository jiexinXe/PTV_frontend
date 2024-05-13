<template>
  <div>
    <el-row class="top-bar" type="flex" justify="space-between" align="middle">
      <!-- Logo 区域 -->
      <el-col :span="4">
        <div class="logo">Your Logo</div>
      </el-col>
      <!-- 个人信息区域 -->
      <el-col :span="4" :offset="16">
        <div class="user_box">
          <!-- 个人信息图标或名字 -->
          <el-icon><User /></el-icon>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
}
</script>

<style lang="less">
.top-bar {
  padding: 10px;
  background-color: #545c64;
  color: #fff;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
}

.user_box {
  position: relative;
  background-color: #42b983;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
