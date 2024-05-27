<template>
  <div class="hero">
    <nav>

<!--		<img src="../assets/logo.jpg" width="150" height="150">-->

      <ul>
        <li><el-link class="nav-item" @click.prevent="goHome">首页</el-link></li>
        <li><el-link class="nav-item" @click.prevent="goAbout">关于</el-link></li>
        <li><el-link class="nav-item" @click.prevent="handleLogin">登录</el-link></li>
        <li><el-link class="nav-item" @click.prevent="goRegister">注册</el-link></li>
        <!-- 根据需要添加更多链接 -->
      </ul>
      <el-button class="btn" @click.prevent="goRegister">联系我们</el-button>
    </nav>

    <div class="content">
      <div class="background-image"></div>
      <div class="service">
        <div class="title">
          <h2>智慧仓库管理系统</h2>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="card">
        <i class="fas fa-chart-line"></i>
        <h5>用户管理</h5>
        <div class="pra">
          <p>保证您的信息不泄露</p>
          <p style="text-align: center;">
            <a class="button" href="">了解更多</a>
          </p>
        </div>
      </div>

      <div class="card">
        <i class="fas fa-chart-line"></i>
        <h5>安全保证</h5>
        <div class="pra">
          <p>让您的货物</p>
          <p style="text-align: center;">
            <a class="button" href="">了解更多</a>
          </p>
        </div>
      </div>

      <div class="card">
        <i class="fas fa-chart-line"></i>
        <h5>订单管理</h5>
        <div class="pra">
          <p>快速处理订单</p>
          <p style="text-align: center;">
            <a class="button" href="">了解更多</a>
          </p>
        </div>
      </div>

      <div class="card">
        <i class="fas fa-chart-line"></i>
        <h5>智能分拣</h5>
        <div class="pra">
          <p>智能完成仓储工作</p>
          <p style="text-align: center;">
            <a class="button" href="">了解更多</a>
          </p>
        </div>
      </div>
    </div>
    <footer>
      <p>网站主要使用的技术栈：</p>
      <p class="end">版权所有 叫什么小组 2024</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDropDown: false,
    };
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    goAbout() {
      this.$router.push('/about');
    },
    handleLogin() {
      this.$router.push('/login');
    },
    goRegister() {
      this.$router.push('/register');
    },
    handleScroll() {
      this.showDropDown = window.scrollY > 100;
    },
  }
};
</script>

<style scoped>
*{
	padding: 0;
	margin: 0;
	font-family: 'Josefin Sans', sans-serif;
	box-sizing: border-box;
}
.hero{
	height: 115vh;
	width: 100%;
	background-image: url(../background/1.jpg);
	background-size: cover;
	background-position: center;
  position: absolute;
}
nav{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 45px;
	padding-left: 8%;
	padding-right: 8%;
}
.logo{
	color: black;
	font-size: 35px;
	letter-spacing: 1px;
	cursor: pointer;
}
span{
	color: black;
}
.nav-item {
  color: rgb(232, 0, 0);
  font-size: 24px; /* 或任何希望的大小 */
}

nav ul li{
	list-style-type: none;
	display: inline-block;
	padding: 10px  25px;
}
nav ul li a{
	color: rgb(255, 0, 0);
	text-decoration: none;
	font-weight: bold;
	text-transform: capitalize;
}
nav ul li a:hover{
	color: #f9004d;
	transition: .4s;
}
.btn{
	background-color:#f9004d;
	color: black;
	text-decoration: none;
	border: 2px solid transparent;
	font-weight: bold;
	padding: 10px 25px;
	border-radius: 30px;
	transition: transform .4s;
}
.btn:hover{
	transform: scale(1.2);
}
h1{
	color: white;
	margin: 20px 0px 20px;
	font-size: 75px;
}
h3{
	color: black;
	font-size: 25px;
	margin-bottom: 50px;
}
h4{
	color: #fcfc;
	letter-spacing: 2px;
	font-size: 20px;
}

button{
	background-color:#f9004d;
	color: white;
	text-decoration: none;
	border: 2px solid transparent;
	font-weight: bold;
	padding: 13px 30px;
	border-radius: 30px;
	transition: .4s;
}
button:hover{
	background-color: transparent;
	border: 2px solid #f9004d;
	cursor: pointer;
}

.service{
	background: rgba(133, 68, 92, 0);
	width: 100%;
	padding: 100px 0px;
}
.title h2{
	color: black;
	font-size: 75px;
	width: 1130px;
	margin: 30px auto;
	text-align: center;
}
.box{
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 400px;
  position: relative;
  top: 70px;
}
.card{
	height: 220px;
	width: 320px;
	padding: 10px 35px;
	background: #929efd;
	border-radius: 20px;
	margin: 15px;
	position: relative;
	overflow: hidden;
	text-align: center;
}
.card i{
	font-size: 50px;
	display: block;
	text-align: center;
	margin: 25px 0px;
	color: #f9004d;

}
h5{
	color: black;
	font-size: 23px;
	margin-bottom: 15px;
}
.pra p{
	color: white;
	font-size: 16px;
	line-height: 27px;
	margin-bottom: 25px;
}
.card .button{
	background-color:#f9004d;
	color: white;
	text-decoration: none;
	border: 2px solid transparent;
	font-weight: bold;
	padding: 9px 22px;
	border-radius: 30px;
	transition: .4s;
}
.card .button:hover{
	background-color: transparent;
	border: 2px solid #f9004d;
	cursor: pointer;
}
footer{
	position: relative;
	width: 100%;
	height: 400px;
	background: rgb(6, 147, 138);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
footer p:nth-child(1){
	font-size: 30px;
	color: black;
	margin-bottom: 20px;
	font-weight: bold;
}
footer p:nth-child(2){
	color: black;
	font-size: 17px;
	width: 500px;
	text-align: center;
	line-height: 26px;
}
.social{
	display: flex;
}
.social a{
	width: 45px;
	height: 45px;
	display: flex;
	align-items: center;
	justify-content: center;
	background:  #f9004d;
	border-radius: 50%;
	margin: 22px 10px;
	color: black;
	text-decoration: none;
	font-size: 20px;
}
.social a:hover{
	transform: scale(1.3);
	transition: .3s;
}
.end{
	position: absolute;
	color:#f9004d;
	bottom: 35px;
	font-size: 14px;
}

</style>
