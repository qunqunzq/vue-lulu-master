<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="描叙" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="类型选择" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 30px" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog
      title="Create"
      :visible.sync="dialogVisible"
      >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类别"  prop="name">
          <el-select v-model="temp.baseSort" class="filter-item" placeholder="请选择类别">
            <el-option v-for="item in statusOptions"  :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称"  prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="标题"  prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
         取消
        </el-button>
        <el-button type="primary" @click="createData()">
         提交
        </el-button>
      </div>

    </el-dialog>


  </div>
</template>

<script>
import { getList } from '@/api/table'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      dialogVisible:false,
      total:20,
      listQuery:{},
      list: null,
      listLoading: true,
      importanceOptions: [
        {
          label: '婚礼',
          value: 0,
        },
        {
          label: '写真',
          value: 1,
        },
        {
          label: '产品',
          value: 2,
        },
        {
          label: '小姐姐',
          value: 3,
        }
      ],
      temp: {
        baseSort:'',
        name:'',
        title: '',
        userId:this.$store.state.user.userId
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        title: [{ required: true, message: '请填写描述', trigger: 'blur' }],
        baseSort: [{ required: true, message: '请选择大类', trigger: 'blur' }]
      },
      statusOptions: [
        {
          label: '婚礼',
          value: 0,
        },
        {
          label: '写真',
          value: 1,
        },
        {
          label: '产品',
          value: 2,
        },
        {
          label: '小姐姐',
          value: 3,
        }
      ],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //查询
    handleFilter(){

    },
    //添加
    handleCreate(){
    this.dialogVisible = true
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    //添加
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$axios.post(this.HOST + "/kantu/creatBaseAlbum",this.temp)
            .then(res => {
              this.$message.success('保存成功');
              this.dialogVisible = false
            }).catch(error =>{
            this.$message.error('保存异常');
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
