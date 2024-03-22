<template>
  <div>
    <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <el-submenu index="1">
        <template slot="title">订单中心</template>
        <el-menu-item index="1-1">添加订单</el-menu-item>
        <el-menu-item index="1-2">订单列表</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">仓库中心</template>
        <el-menu-item index="2-1">货物列表</el-menu-item>
        <el-menu-item index="2-2">我的仓库</el-menu-item>
      </el-submenu>
      <div class="user_box">
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="less">
.user_box{
  position: relative;
  background-color: #42b983;
  width: 40px;
  height: 40px;
  left: 95%;
  top: 10px;
  border-radius: 100px
}
</style>