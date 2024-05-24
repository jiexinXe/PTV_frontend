<template>
  <div>
    <Layout>
      <h1>货物信息</h1>
      <form @submit.prevent="addCargo" style="max-width: 400px; margin: 0 auto;">
        <label htmlFor="name">货物名称:</label>
        <input type="text" id="name" v-model="cargo.name" style="width: 100%;">
        <label htmlFor="category">货物类别:</label>
        <select v-model="selectedCategoryId" style="width: 100%;">
          <option v-for="category in categories" :value="category.categoryId" :key="category.categoryId">
            {{ category.categoryName }}
          </option>
        </select>
        <label htmlFor="num">货物数量:</label>
        <input type="text" id="num" v-model="cargo.num" style="width: 100%;">
        <label htmlFor="price">货物单价:</label>
        <input type="text" id="price" v-model="cargo.price" style="width: 100%;">
        <label htmlFor="supplier">供应商名称:</label>
        <input type="text" id="supplier" v-model="cargo.supplier" style="width: 100%;">
        <label htmlFor="location">入库位置:</label>
        <input type="text" id="location" v-model="cargo.location" style="width: 100%;">
        <button type="submit" style="width: 100%;">添加货物</button>
      </form>
    </Layout>
  </div>
</template>

<script>
import service from "../utils/axios"; // 引入带有拦截器的axios实例
import Layout from "@/components/layout.vue";
import axios from "axios";

export default {
  components: {Layout},
  data() {
    return {
      cargo: {
        name: "",
        num: "",
        price: "",
        supplier: "",
        location: "",
        userid: "2"
      },
      categories: [],
      selectedCategoryId: null,
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      axios.get("http://localhost:8082/category/all", {
                headers: {
                  Authorization: localStorage.getItem("token")// 添加授权标头
                }       
            })
          .then(response => {
            this.categories = response.data;
          })
          .catch(error => {
            console.error("Error fetching categories:", error);
          });
    },
    addCargo() {
      // 验证输入是否为空
      if (!this.cargo.name || !this.selectedCategoryId || !this.cargo.num || !this.cargo.price || !this.cargo.supplier || !this.cargo.location) {
        this.$message({
          message: "请填写完整信息！",
          type: "warning",
        });
        return;
      }

      // 验证货物数量和单价是否为数字
      if (isNaN(this.cargo.num) || isNaN(this.cargo.price)) {
        this.$message({
          message: "货物数量和单价必须为数字！",
          type: "warning",
        });
        return;
      }

      // 验证货物数量和单价是否为正数
      if (parseFloat(this.cargo.num) <= 0 || parseFloat(this.cargo.price) <= 0) {
        this.$message({
          message: "货物数量和单价必须为正数！",
          type: "warning",
        });
        return;
      }

 
      // 验证成功，发送请求
      axios.post("http://localhost:8082/cargo/add", {
  name: this.cargo.name,
  category: this.selectedCategoryId,
  num: this.cargo.num,
  price: this.cargo.price,
  supplier: this.cargo.supplier,
  enterTime: new Date().toISOString(),
  location: this.cargo.location,
  userid: this.cargo.userid
}, {
  headers: {
    Authorization: localStorage.getItem("token")  
  }
})

          .then(response => {
            console.log("Add cargo:", response.data.msg);
            this.$message({
              message: "添加成功！",
              type: "success",
            });
          })
          .catch(error => {
            console.error("Error saving profile:", error);
          });
    },
  },
};
</script>

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

input[type="text"], select {
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
