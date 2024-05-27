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
        <!-- 订单管理 -->
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-s-order"></i>订单管理</template>
          <el-menu-item v-if="!isAdmin" index="1-1">货物信息</el-menu-item>
          <el-menu-item v-if="isAdmin" index="1-1">货物管理</el-menu-item>
          <el-menu-item index="1-2">订单信息</el-menu-item>
        </el-submenu>

        <!-- 存储管理 -->
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-s-shop"></i>存储管理</template>
          <el-menu-item index="2-1">存储信息</el-menu-item>
          <el-menu-item v-if="isAdmin" index="2-2">仓库管理</el-menu-item>
        </el-submenu>

        <!-- 设备管理，仅管理员可见 -->
        <el-submenu v-if="isAdmin" index="3">
          <template slot="title"><i class="el-icon-s-tools"></i>设备管理</template>
          <el-menu-item index="3-1">小车管理</el-menu-item>
          <el-menu-item index="3-2">货架管理</el-menu-item>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router/composables";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeIndex = ref('1');

    const handleSelect = (key, keyPath) => {
      let targetPath = '';
      switch (key) {
        case '1-1':
          targetPath = isAdmin.value ? '/CargoManagement' : '/CargoManagement';
          break;
        case '1-2':
          targetPath = '/OrderManagement';
          break;
        case '1-3':
          targetPath = '/CargoManagement';
          break;
        case '2-1':
          targetPath = '/StoreManagement';
          break;
        case '2-2':
          targetPath = '/WareManagement';
          break;
        case '3-1':
          targetPath = '/CarManagement';
          break;
        case '3-2':
          targetPath = '/ShelfManagement';
          break;
      }
      if (targetPath && route.path !== targetPath) {
        router.push(targetPath);
      }
    };

    const isAdmin = ref(false);

    return {
      activeIndex,
      handleSelect,
      isAdmin
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    isAdmin() {
      return this.userInfo && this.userInfo.roleId === 2;
    }
  },
  watch: {
    isAdmin(newVal) {
      this.isAdmin = newVal;
    }
  },
  mounted() {
    this.isAdmin = this.userInfo && this.userInfo.roleId === 2;
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
