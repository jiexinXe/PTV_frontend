<template>
    <div>
      <my_header></my_header>
      <h1>个人信息</h1>
      <form @submit.prevent="saveProfile" style="max-width: 400px; margin: 0 auto;">
        <label for="role">角色:</label>
        <input type="text" id="role" v-model="roleText" readonly style="width: 100%; font-weight: bold; color: red;"
            @mouseover="showAdminInfo" 
            @mouseleave="hideAdminInfo">
        <div v-if="user.isAdmin" style="margin-top: 10px;">
        <h3>管理员权限:</h3>
        <ul style="list-style-position: inside;">
        <li style="padding-left: 20px;">管理用户</li>
        <li style="padding-left: 20px;">管理订单</li>
        <li style="padding-left: 20px;">管理仓库使用</li>
       </ul>


        </div>

      <label for="name">姓名:</label>
      <input type="text" id="name" v-model="user.name" style="width: 100%;">
      <label for="username">用户名:</label>
      <input type="text" id="username" v-model="user.username" style="width: 100%;">
      <label for="gender">性别:</label>
      <input type="text" id="gender" v-model="user.gender" style="width: 100%;">
      <label for="address">地址:</label>
      <input type="text" id="address" v-model="user.address" style="width: 100%;">
      <label for="email">电子邮箱:</label>
      <input type="text" id="email" v-model="user.email" style="width: 100%;">
      <label for="phone">电话:</label>
      <input type="text" id="phone" v-model="user.phone" style="width: 100%;">
      <label for="lastLogin">上次登录时间:</label>
      <input type="text" id="lastLogin" v-model="user.lastLogin" readonly style="width: 100%;">
      <button type="submit" style="width: 100%;">修改</button>
    </form>
    </div>
  </template>
  
  <style lang="less">
h1 {
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
  
  <script>
  import axios from "axios";
  export default {
    data() {
      return {
        user: {
          name: "",
          username: "",
          gender: "",
          address: "",
          email: "",
          phone: "",
          lastLogin: "",
          role:"",
          roleText:"",
          isAdmin:false,
        }
      };
    },
    computed: {
    roleText() {
      if (this.user.role === "1") {
        this.user.roleText = "管理员";
        return "管理员";
      } else if (this.user.role === "2") {
        this.user.roleText = "超级管理员";
        return "超级管理员";
      } else if (this.user.role === "3") {
        this.user.roleText = "普通用户";
        return "普通用户";
      } else {
        return "未知角色";
      }
    }
  },
    mounted(){
        this.getUserInfo();
    },
    methods: {

    showAdminInfo() {
    if (this.user.roleText.trim() === '管理员')
    {
        this.user.isAdmin = true;
    }

    },
    hideAdminInfo() {
        if (this.user.roleText.trim() === '管理员')
    {  
      this.user.isAdmin = false;
    }
    },
        
        getUserInfo() {
            axios.get('http://localhost:8082/user/getUserinfo/1')
            .then(response => {
                const userData = response.data.data;
                const userFields = userData.split(', ');
                this.user.id = parseInt(userFields[0].split('=')[1]);
                this.user.name = userFields[1].split('=')[1];
                this.user.username = userFields[3].split('=')[1];
                this.user.gender = userFields[5].split('=')[1];
                this.user.address = userFields[6].split('=')[1];
                this.user.email = userFields[7].split('=')[1];
                this.user.phone = userFields[8].split('=')[1];
                this.user.role = userFields[2].split('=')[1];
                this.user.lastLogin = userFields[9].split('=')[1].slice(0, -1);
                console.log(userFields[2].split('=')[1]);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });


    },    
    saveProfile() {
    axios.post('http://localhost:8082/user/changeUserinfo', {
        userId: '1', // 替换为实际的用户ID
        changeItem: 'profile', // 使用一个字段标识要修改的是用户信息
        changeVariable: JSON.stringify({
            name: this.user.name,
            username: this.user.username,
            gender: this.user.gender,
            address: this.user.address,
            email: this.user.email,
            phone: this.user.phone
        })
    })
    .then(response => {
        console.log('Profile saved:', response.data.msg);
        this.$message({
        message: '修改成功！',
        type: 'success'
    });
        // 如果需要更新页面上的用户信息，可以调用getUserInfo方法重新获取用户信息
        this.getUserInfo();
    })
    .catch(error => {
        console.error('Error saving profile:', error);
    });
}


    }
  };
  </script>
  