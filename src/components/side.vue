<template>
  <div>
    <el-aside width="200px">
      <el-menu
          :default-active="activeIndex"
          @select="handleSelect"
          mode="vertical"
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
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
