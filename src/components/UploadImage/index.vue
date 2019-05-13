<template>
  <div>
    <el-upload
      multiple
      :headers = "headers"
      :data="{'id': ablumId}"
      :before-upload="beforeAvatarUpload"
      class="upload-demo"
      action="/api/kantu/uploadMXImages"
      :on-remove="handleRemove"
      :file-list="fileList2"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
    </el-upload>
  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'
export default {
  name: 'uploadImage',
  props: {
    ablumId: {
      type: Number,
    }
  },
  created() {
    this.getlistImages()
  },
  data() {
    return {
      headers:{
        "Authorization": 'Bearer '+getToken()
      },
      fileList2: []
    }
  },
  methods: {
    getlistImages(){
      this.$axios.get(this.HOST + "/kantu/listMXImages",{params:{ id:this.ablumId}
      })
        .then(res => {
          this.fileList2 = []
          let resData = res.data.list
          for(let i = 0;i<resData.length ;i++){
            var obj = new Object()
            obj.id = resData[i].id
            obj.name = resData[i].img_src
            obj.url = 'http://www.qunzq.com:6060/'+ this.ablumId+'/'+resData[i].img_src
            this.fileList2.push(obj)
          }
        }).catch(error =>{
        this.$message.error('保存异常');
      })
    },
    handleRemove(file) {
      this.$axios.post(this.HOST + "/kantu/updateBaseImage",{
        id:file.id,
        delete:true
      })
        .then(res => {
          this.getlistImages()
        }).catch(error =>{
        this.$message.error('保存异常');
      })
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

<style scoped>

</style>
