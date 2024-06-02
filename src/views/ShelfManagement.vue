<template>
  <div class="shelf-management">
    <Layout>
      <h1 class="shelf-list-title">货架管理</h1>
      <table>
        <thead>
        <tr>
          <th>编号</th>
          <th>状态</th>
          <th>位置</th>
          <th>当前任务</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="shelf in shelves" :key="shelf.id">
          <td>{{ shelf.id }}</td>
          <td>{{ formatStatus(shelf.status) }}</td>
          <td>{{ shelf.location }}</td>
          <td>{{ shelf.currentTask }}</td>
        </tr>
        </tbody>
      </table>
    </Layout>
  </div>
</template>

<script>
import axios from 'axios';
import Layout from "@/components/layout.vue";

export default {
  name: 'ShelfManagement',
  components: { Layout },
  data() {
    return {
      shelves: []
    };
  },
  created() {
    this.fetchShelves();
  },
  methods: {
    async fetchShelves() {
      try {
        const response = await axios.get('http://localhost:8082/car/all', {
          headers: {
            Authorization: localStorage.getItem("token") // 添加授权标头
          }
        });
        console.log(response.data);
        this.shelves = response.data;
      } catch (error) {
        console.error('Error fetching shelves:', error);
      }
    },
    formatStatus(status) {
      return status === 0 ? '空闲' : '工作中';
    }
  }
}
</script>

<style scoped>
.shelf-management h1 {
  color: #333;
}

.shelf-management table {
  width: 100%;
  border-collapse: collapse;
}

.shelf-management th, .shelf-management td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.shelf-list-title {
  font-weight: bold;
  font-size: 24px;
  text-align: left;
  margin-bottom: 15px;
}

.shelf-management th {
  background-color: #eee;
}
</style>
