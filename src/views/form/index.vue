<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="图片大类">
        <el-select v-model="form.region" placeholder="请选择分类">
          <el-option label="婚礼" value="婚礼"/>
          <el-option label="写真" value="写真"/>
          <el-option label="产品" value="产品"/>
          <el-option label="小姐姐" value="小姐姐"/>
        </el-select>
      </el-form-item>
      <el-form-item label="图片描述">
        <el-input v-model="form.desc"  style="width: 800px"/>
      </el-form-item>

      <dropzone></dropzone>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import dropzone from '../../components/Dropzone'
export default {
    components:{
      dropzone
    },
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

