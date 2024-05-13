<template>
  <el-container direction="vertical">
    <!-- 顶部栏 -->
    <el-header height="60px">
      <Header /> <!-- 这个是顶部栏的组件 -->
    </el-header>

    <!-- 主体容器 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <Side /> <!-- 这个是侧边栏的组件 -->
      </el-aside>

      <!-- 主体内容 -->
      <el-main>
        <!-- 这里可以放置其他组件和内容 -->
        <slot /> <!-- 使用slot来放置不同的内容 -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '../components/header.vue'; // 顶部栏组件
import Side from '../components/side.vue'; // 侧边栏组件

export default {
  components: {
    Header,
    Side
  }
};
</script>

<style>
/* 顶部栏的样式 */
.el-header {
  background-color: #545c64;
  color: white;
  text-align: center;
  padding: 10px;
}

/* 侧边栏的样式 */
.el-aside {
  background-color: #545c64;
  color: white;
  padding: 10px;
  height: 100vh;
}

.el-main {
  padding: 20px;
}
</style>
