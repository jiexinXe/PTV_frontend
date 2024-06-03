<template>
  <el-container direction="vertical">
    <!-- 顶部栏 -->
    <el-header height="60px" class="header">
      <el-row type="flex" justify="space-between" align="middle">
        <!-- Logo 区域 -->
        <el-col :span="6" class="logo">
          自动化仓库管理系统
        </el-col>
        <!-- 个人信息区域 -->
        <el-col :span="4" :offset="14">
          <div class="user_box">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-avatar :src="userAvatar" size="small" />
                <span :class="{'user-name': true, 'default-user': !isLoggedIn}">{{ userName }}</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="isLoggedIn" @click.native="handleProfile">个人中心</el-dropdown-item>
                <el-dropdown-item v-if="isLoggedIn" @click.native="handleSettings">设置</el-dropdown-item>
                <el-dropdown-item v-if="isLoggedIn" divided @click.native="handleLogout">退出</el-dropdown-item>
                <el-dropdown-item v-else @click.native="handleLogin">登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <!-- 主体容器 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <el-menu
            :default-active="activeIndex"
            @select="handleSelect"
            mode="vertical"
            background-color="transparent"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
          <!-- 订单管理 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item v-if="!isAdmin" index="1-1">货物信息</el-menu-item>
            <el-menu-item v-if="isAdmin" index="1-1">货物管理</el-menu-item>
            <el-menu-item index="1-2">订单信息</el-menu-item>
          </el-submenu>

          <!-- 存储管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-shop"></i>
              <span>存储管理</span>
            </template>
            <el-menu-item index="2-0">状态查询</el-menu-item>
            <el-menu-item index="2-1">存储信息</el-menu-item>
            <el-menu-item v-if="isAdmin" index="2-2">仓库管理</el-menu-item>
          </el-submenu>

          <!-- 设备管理，仅管理员可见 -->
          <el-submenu v-if="isAdmin" index="3">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>设备管理</span>
            </template>
            <el-menu-item index="3-1">小车管理</el-menu-item>
            <el-menu-item index="3-2">货架管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主体内容 -->
      <el-main class="main-content">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router/composables';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeIndex = ref('1');

    const handleSelect = (key) => {
      let targetPath = '';
      switch (key) {
        case '1-1':
          targetPath = isAdmin.value ? '/CargoManagement' : '/CargoManagement';
          break;
        case '1-2':
          targetPath = '/OrderManagement';
          break;
        case '2-0':
          targetPath = '/StateManagement';
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
    },
    ...mapGetters(['userInfo', 'token'])
  },
  data() {
    return {
      isLoggedIn: false,
      userName: '未登录',
      userAvatar: require('../background/user_default.jpg') // 使用 require 语法加载本地图片
    };
  },
  methods: {
    handleProfile() {
      this.$router.push('/profile');
    },
    handleSettings() {
      this.$router.push('/settings');
    },
    handleLogout() {
      // 清除本地存储中的token
      localStorage.removeItem('token');
      this.setUserInfo(null);
      this.isLoggedIn = false;
      this.userName = '未登录';
      this.userAvatar = require('../background/user_default.jpg');
      this.$router.push('/login');
    },
    handleLogin() {
      this.$router.push('/login');
    },
    checkLoginStatus() {
      // 从本地存储中获取token
      const token = localStorage.getItem('token');
      if (token) {
        const userInfo = this.userInfo;
        if (userInfo) {
          this.isLoggedIn = true;
          this.userName = userInfo.username;
          this.userAvatar = userInfo.avatar || require('../background/user_default.jpg');
        }
      } else {
        this.isLoggedIn = false;
        this.userName = '未登录';
        this.userAvatar = require('../background/user_default.jpg');
      }
    },
    ...mapMutations('login', {
      'setUserInfo': 'SET_USER_INFO',
      'setShowLogin': 'SET_SHOW_LOGIN',
      'setToken': 'SET_TOKEN',
    })
  },
  watch: {
    isAdmin(newVal) {
      this.isAdmin = newVal;
    },
    userInfo(newValue) {
      this.checkLoginStatus();
    }
  },
  mounted() {
    this.isAdmin = this.userInfo && this.userInfo.roleId === 2;
    this.checkLoginStatus();
  }
}
</script>

<style scoped>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu','Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
  monospace;
}

.header {
  padding: 10px;
  background: linear-gradient(90deg, rgb(75, 111, 150) 0%, rgb(72, 150, 115) 100%);
  color: #fff;
}

.logo {
  font-size: 1.8em;
  font-weight: bold;
  color: #000000;
  text-align: center;
}

.user_box {
  display: flex;
  align-items: center;
  color: #fff;
}

.el-avatar {
  margin-right: 10px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  font-size: 1.2em;
  color: #032265;
}

.default-user {
  color: #ffec00; /* 未登录时用户名字体颜色 */
}

.sidebar {
  background: linear-gradient(180deg, rgb(53, 118, 183) 0%, rgb(79, 208, 149) 100%);
  color: white;
  padding: 0;
  height: 100vh;
  transition: all 0.3s;
}

.el-menu {
  border-right: none;
}

.el-menu-item, .el-submenu__title {
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-size: 0.9em;
  transition: background-color 0.3s, color 0.3s;
  background-color: transparent;
  color: white;
}

.el-menu-item:hover, .el-submenu__title:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffd04b;
}

.el-menu-item i, .el-submenu__title i {
  margin-right: 10px;
  font-size: 1.5em;
}

@media (max-width: 768px) {
  .sidebar {
    width: 0;
    overflow: hidden;
  }
}

.el-header {
  background: linear-gradient(90deg, rgb(39, 103, 227, 90%) 10%, rgb(170, 255, 225) 90%);
  color: white;
  text-align: center;
  padding: 10px;
}

.el-aside {
  background: linear-gradient(180deg, rgb(39, 103, 227, 90%) 10%, rgb(170, 255, 225) 90%);
  color: white;
  padding: 10px;
  height: 100vh;
}

.el-main {
  padding: 20px;
  background-color: #eff3fd;
  min-height: calc(100vh - 60px);
  border-radius: 10px;
}

</style>