<template>
  <div class="warehouse-management">
    <Layout>
      <h2 class="warehouse-title">仓库管理</h2>
      <div class="shelf-container">
        <div
            v-for="(shelf, shelfIndex) in warehouse"
            :key="shelfIndex"
            class="shelf"
        >
          <h3 class="shelf-label">货架 {{ shelfIndex + 1 }}</h3>
          <div class="compartments">
            <div
                v-for="(compartment, compartmentIndex) in getPaginatedCompartments(shelfIndex)"
                :key="compartmentIndex"
                class="compartment"
                :class="{ filled: compartment.filled }"
                @click="toggleCompartment(shelfIndex, compartmentIndex)"
            >
              {{ compartment.id }}
            </div>
          </div>
          <el-pagination
              @current-change="handleCurrentChange(shelfIndex)"
              :current-page="currentPages[shelfIndex]"
              :page-size="pageSizes[shelfIndex]"
              layout="total, prev, pager, next, jumper"
              :total="warehouse[shelfIndex].length"
          >
          </el-pagination>
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
      rows: 4, // 仓库中的货架排数
      columns: 20, // 每个货架的列数
      levels: 10, // 每个隔间的层数
      warehouse: [], // 存储仓库数据
      currentPages: [], // 记录每个货架当前的页码
      pageSizes: [] // 记录每个货架的每页显示数量
    };
  },
  mounted() {
    this.initializeWarehouse();
  },
  methods: {
    initializeWarehouse() {
      for (let i = 0; i < this.rows; i++) {
        const shelf = [];
        for (let j = 0; j < this.columns * this.levels * 2; j++) {
          shelf.push({ id: `S${i + 1}-C${j + 1}`, filled: false });
        }
        this.warehouse.push(shelf);
        this.currentPages.push(1); // 初始化每个货架的当前页码为1
        this.pageSizes.push(20); // 初始化每个货架的每页显示数量为20
      }
    },
    toggleCompartment(shelfIndex, compartmentIndex) {
      const actualIndex = compartmentIndex + (this.currentPages[shelfIndex] - 1) * this.pageSizes[shelfIndex];
      this.$set(
          this.warehouse[shelfIndex][actualIndex],
          "filled",
          !this.warehouse[shelfIndex][actualIndex].filled
      );
    },
    getPaginatedCompartments(shelfIndex) {
      const start = (this.currentPages[shelfIndex] - 1) * this.pageSizes[shelfIndex];
      const end = start + this.pageSizes[shelfIndex];
      return this.warehouse[shelfIndex].slice(start, end);
    },
    handleCurrentChange(shelfIndex) {
      return (val) => {
        this.$set(this.currentPages, shelfIndex, val);
      };
    }
  }
};
</script>

<style scoped>
.warehouse-management {
  padding: 20px;
}

.warehouse-title {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.shelf-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-around;
}

.shelf {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  width: 48%; /* 每个货架占宽度的48%，确保两列布局 */
  box-sizing: border-box;
}

.shelf-label {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.compartments {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5列 */
  grid-template-rows: repeat(4, 40px); /* 4行，每行高40px */
  gap: 5px;
}

.compartment {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.compartment.filled {
  background-color: blue;
  color: white;
}

.compartment:hover {
  transform: scale(1.1);
  background-color: lightgray;
}
</style>
