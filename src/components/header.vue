<template>
  <div>
    <el-row class="top-bar" type="flex" justify="space-between" align="middle">
      <!-- Logo 区域 -->
      <el-col :span="4">
        <img src="../assets/logo.jpg" width="150" height="150">
      </el-col>
      <!-- 个人信息区域 -->
      <el-col :span="4" :offset="16">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      isLoggedIn: false,
      userName: '未登录',
      userAvatar: require('../background/user_default.jpg') // 使用 require 语法加载本地图片
    };
  },
  computed: {
    ...mapGetters(['userInfo','token']),
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
      console.log(localStorage.getItem('token'))
      const userInfo = this.$store.getters.userInfo
      console.log(userInfo)
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
      'setToken':'SET_TOKEN',
    }),
  },
  mounted() {
    this.checkLoginStatus();
  },
  watch: {
    userInfo(newValue) {
      this.checkLoginStatus();
    }
  }
}
</script>

<style scoped lang="less">
.top-bar {
  padding: 10px;
  background-color: #35495e;
  color: #fff;
}

.logo {
  font-size: 1.8em;
  font-weight: bold;
  color: #42b983;
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
  color: #42b983;
}

.default-user {
  color: #ffec00; /* 未登录时用户名字体颜色 */
}
</style>
