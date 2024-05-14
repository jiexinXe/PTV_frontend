<template>
  <div>
    <el-aside width="200px">
      <el-menu
          :default-active="activeIndex"
          @select="handleSelect"
          mode="vertical"
          background-color="#35495e"
          text-color="#fff"
          active-text-color="#ffd04b"
      >
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-s-order"></i>订单中心</template>
          <el-menu-item index="1-1">添加订单</el-menu-item>
          <el-menu-item index="1-2">订单列表</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-s-shop"></i>仓库中心</template>
          <el-menu-item index="2-1">货物列表</el-menu-item>
          <el-menu-item index="2-2">我的仓库</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router/composables";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeIndex = ref('1');

    const handleSelect = (key, keyPath) => {
      if (key === '1-2' && route.path !== '/OrderManagement') {
        router.push('/OrderManagement');
      }
      if (key === '2-1' && route.path !== '/CargoManagement') {
        router.push('/CargoManagement');
      }
    };

    return {
      activeIndex,
      handleSelect
    };
  }
}
</script>

<style scoped>
.el-aside {
  background-color: #35495e;
  color: white;
  padding: 10px;
  height: 100vh;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.el-menu-item i {
  margin-right: 10px;
}
</style>
