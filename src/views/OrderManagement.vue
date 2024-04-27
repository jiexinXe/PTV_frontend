<template>
  <div class="order-management">
    <Layout>
    <!-- 引用 Header 组件 -->


    <h2 class="order-list-title">订单列表</h2>
    <button class="add-order-btn" @click="showAddOrder = true">新增订单</button>
    <div class="orders-list">
      <table>
        <thead>
        <tr>
          <th>订单编号</th>
          <th>客户名</th>
          <th>订单金额</th>
          <th>订单状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer }}</td>
          <td>{{ order.amount }}</td>
          <td>{{ order.status }}</td>
          <td><button @click="editOrder(order)">编辑</button></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增订单模态框 -->
    <!-- 新增订单模态框 -->
    <div v-if="showAddOrder" class="modal">
      <div class="modal-content">
        <span class="close" @click="showAddOrder = false">&times;</span>
        <h3>新增订单</h3>
        <form @submit.prevent="addOrder">
          <label for="name">订单名称:</label>
          <input id="name" v-model="newOrder.name" required>

          <label for="amount">订单金额:</label>
          <input id="amount" type="number" v-model="newOrder.amount" required>

          <label for="quantity">货物数量:</label>
          <input id="quantity" type="number" v-model="newOrder.quantity" required>

          <label for="startTime">开始时间:</label>
          <input id="startTime" type="date" v-model="newOrder.startTime" required>

          <label for="endTime">结束时间:</label>
          <input id="endTime" type="date" v-model="newOrder.endTime" required>

          <label for="customer">客户名:</label>
          <input id="customer" v-model="newOrder.customer" required>

          <label for="note">备注:</label>
          <textarea id="note" v-model="newOrder.note"></textarea>

          <button type="submit">提交</button>
        </form>
      </div>
    </div>
    </Layout>
  </div>
</template>

<script>
import Layout from "@/components/layout.vue";

export default {
  components: {
    Layout
  },
  data() {
    return {
      orders: [],
      showAddOrder: false,
      newOrder: {
        customer: '',
        amount: 0,
        status: '进行中',
      },
    };
  },
  methods: {
    addOrder() {
      this.orders.push({
        id: (this.orders.length + 1).toString().padStart(3, '0'),
        ...this.newOrder
      });
      this.newOrder = { customer: '', amount: 0, status: '进行中' };
      this.showAddOrder = false;
    },
    editOrder(order) {
      // 编辑订单的逻辑
    },
  },
};
</script>

<style>
.order-management {
  padding: 20px;
}

.order-list-title {
  margin-bottom: 15px; /* 调整标题和表格之间的距离 */
}

.add-order-btn {
  margin-bottom: 20px; /* 调整按钮和表格之间的距离 */
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block; /* 确保按钮独占一行 */
}

.orders-list table {
  width: 100%;
  border-collapse: collapse;
}

.orders-list th, .orders-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0.4); /* Black w/ opacity */
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 40%; /* Could be more or less, depending on screen size */
  border-radius: 10px; /* Rounded corners */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

form > label {
  display: block;
  margin-bottom: 5px;
}

form > input, form > select {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

form > button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form > button:hover {
  background-color: #45a049;
}
</style>

