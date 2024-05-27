<template>
  <div class="car-management">
    <Layout>
      <h1 class="car-list-title">小车管理</h1>
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
          <tr v-for="car in cars" :key="car.id">
            <td>{{ car.id }}</td>
            <td>{{ formatStatus(car.status) }}</td>
            <td>{{ car.location }}</td>
            <td>{{ car.currentTask }}</td>
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
  name: 'CarManagement',
  components: { Layout },
  data() {
    return {
      cars: []
    };
  },
  created() {
    this.fetchCars();
  },
  methods: {
    async fetchCars() {
      try {
        const response = await axios.get('http://localhost:8082/car/all', {
          headers: {
            Authorization: localStorage.getItem("token") // 添加授权标头
          }       
        });
        this.cars = response.data;
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    },
    formatStatus(status) {
      return status === 0 ? '空闲' : '工作中';
    }
  }
}
</script>

<style scoped>
.car-management h1 {
  color: #333;
}

.car-management table {
  width: 100%;
  border-collapse: collapse;
}

.car-management th, .car-management td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.car-list-title {
  font-weight: bold;
  font-size: 24px;
  text-align: left;
  margin-bottom: 15px;
}

.car-management th {
  background-color: #eee;
}
</style>
