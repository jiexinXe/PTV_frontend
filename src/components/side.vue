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
import { ref } from "vue";
import {useRouter, useRoute} from "vue-router/composables";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();  // 获取当前路由对象
    const activeIndex = ref('1');

    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
      // 使用route.path代替this.$route.path
      if (key === '1-2' && route.path !== '/OrderManagement') {
        router.push('/OrderManagement');
      }
      if (key === '2-1' && route.path !== '/CargoManagement') {
        router.push('/CargoManagement');  // 使用router.push代替this.$router.push
      }
    };

    return {
      activeIndex,
      handleSelect
    };
  }
}
</script>
