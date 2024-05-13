<template>
  <el-container direction="vertical">
    <!-- 顶部栏 -->
    <el-header height="60px">
      <Header />
    </el-header>

    <!-- 主体容器 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <Side />
      </el-aside>

      <!-- 主体内容 -->
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '../components/header.vue';
import Side from '../components/side.vue';

export default {
  components: {
    Header,
    Side
  }
};
</script>

<style>
.el-header {
  background-color: #35495e;
  color: white;
  text-align: center;
  padding: 10px;
}

.el-aside {
  background-color: #35495e;
  color: white;
  padding: 10px;
  height: 100vh;
}

.el-main {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}
</style>
