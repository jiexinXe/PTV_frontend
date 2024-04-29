<template>
  <div class="cargo-management">
    <Layout>
      <!-- 引用 Header 组件 -->

      <h2 class="cargo-list-title">货物列表</h2>
      <button class="add-cargo-btn" @click="goToAddCargo">新增货物</button>
      <div class="cargos-list">
        <table>
          <thead>
          <tr>
            <th>货物编号</th>
            <th>货物名称</th>
            <th>数量</th>
            <th>仓库位置</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="cargo in cargos" :key="cargo.cid">
            <td>{{ cargo.cid }}</td>
            <td>{{ cargo.name }}</td>
            <td>{{ cargo.num }}</td>
            <td>{{ cargo.location }}</td>
<!--            <td><button @click="editCargo(cargo)">编辑</button></td>-->
          </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  </div>
</template>

<script>
import axios from 'axios';
import Layout from "@/components/layout.vue";
import { ref } from 'vue';
import router from "@/router";
import {useRouter} from "vue-router/composables";

export default {
  components: {
    Layout
  },
  setup() {
    const router = useRouter();  // 获取router实例
    const cargos = ref([]);

    const fetchCargos = async () => {
      try {
        const response = await axios.get('http://localhost:8082/cargo/list/userid?userid=2');
        if (response.data.code === 200) {
          cargos.value = response.data.data.CargoList;
        } else {
          alert('获取货物列表失败：' + response.data.msg);
        }
      } catch (error) {
        console.error('获取货物列表出错：', error);
        alert('获取货物列表出错');
      }
    };

    fetchCargos();  // 组件创建时调用此函数

    // 定义跳转到添加货物页面的方法
    const goToAddCargo = () => {
      router.push('/addCargo');  // 修改为你的添加货物页面的路由路径
    };

    return {
      cargos,
      goToAddCargo
    };
  }
}
</script>

<style>
.cargo-management {
  padding: 20px;
}

.cargo-list-title {
  margin-bottom: 15px;
}

.add-cargo-btn {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
}

.cargos-list table {
  width: 100%;
  border-collapse: collapse;
}

.cargos-list th, .cargos-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>
