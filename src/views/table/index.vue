<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="描叙" style="width: 200px;" class="filter-item" />
      <el-select @change="selectChange"  v-model="listQuery.baseSort" placeholder="类型选择" clearable style="width: 140px" class="filter-item">
        <el-option label="请选择" value="0"></el-option>
        <el-option v-for="item in importanceOptions" :key="item" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 30px" type="primary" icon="el-icon-search" @click="handlegetList">
          搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加
      </el-button>
    </div>
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="名称"
         >
      </el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="描述"
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="img_src"
        label="主图"
      >
        <template slot-scope="scope">
          <el-upload
            :data="{'id':scope.row.id}"
            class="avatar-uploader"
            action="/api/kantu/uploadZhuImage"
            :headers = "headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="'http://localhost:6060/232.jpg'" :src="'http://localhost:6060/232.jpg'" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </template>
      </el-table-column>


      <el-table-column
        align="center"
        prop="create_time"
        label="创建时间"
         >
      </el-table-column>
      <el-table-column
        align="center"
        prop="base_sort"
        label="大类"
         >
      </el-table-column>

     <!-- <el-table-column align="center" label="ID" width="95">
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
      </el-table-column>-->



    </el-table>
    <pagination  :total="total"  :page.sync="currentPage" :limit.sync="pageSizes"  @pagination="getList" />

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
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
export default {
  components: { Pagination },
  data() {
    return {
      imageUrl: 'http://localhost:6060/232.jpg',
      headers:{
        "Authorization": 'Bearer '+getToken()
      },
      dialogVisible:false,
      total:0,
      listQuery:{
        title:'',
        baseSort:'',
        pageSizes:20,
        currentPage:0,
      },
      pageSizes:20,
      currentPage:1,
      list: [],
      importanceOptions: [
        {
          label: '婚礼',
          value: 1,
        },
        {
          label: '写真',
          value: 2,
        },
        {
          label: '产品',
          value: 3,
        },
        {
          label: '小姐姐',
          value: 4,
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
          value: 1,
        },
        {
          label: '写真',
          value: 2,
        },
        {
          label: '产品',
          value: 3,
        },
        {
          label: '小姐姐',
          value: 4,
        }
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    selectChange(){
      this.currentPage = 1
      this.handlegetList()
    },

    //添加
    handleCreate(){
    this.dialogVisible = true
    },

    //搜索
    handlegetList(){
      this.listQuery.pageSizes = this.pageSizes
      this.listQuery.currentPage = (this.currentPage -1) * this.pageSizes

      this.$axios.post(this.HOST+"/kantu/listBaseAlbum",this.listQuery)
        .then(res =>{
          let data = res.data
          this.list = data.list
          this.total = data.total
        })
    },
    //分页搜索
    getList(data) {
      if(data){
        this.listQuery.pageSizes = data.limit
        this.listQuery.currentPage = (data.page - 1) * data.limit
      }
      this.$axios.post(this.HOST+"/kantu/listBaseAlbum",this.listQuery)
        .then(res =>{
          let data = res.data
          this.list = data.list
          this.total = data.total
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

    handleAvatarSuccess(res, file) {


    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
    },
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
