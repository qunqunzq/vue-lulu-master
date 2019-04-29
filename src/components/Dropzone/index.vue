<template>
  <div>
    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
                  @vdropzone-success="vsuccess"
                  @vdropzone-removed-file="vremoved"
    ></vue-dropzone>

  </div>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.min.css'

  export default {
    name: 'dropzone',
    components: {
      vueDropzone: vue2Dropzone
    },
    data: function () {
      return {
        dropzoneOptions: {
          url: 'https://httpbin.org/post',
          addRemoveLinks:true,
          clickable:true,
          maxFiles:20,
          dictDefaultMessage:'<i class="el-icon-upload">上传图片</i>',
          thumbnailWidth: 200,
          thumbnailHeight:200,
          maxFilesize: 2,
          acceptedFiles:'.jpg,.npg,.JPG',
          dictRemoveFile:'Remove',
          headers: { "My-Awesome-Header": "header value" }
        }
      }
    },
    methods:{
      vsuccess(file, response){
        console.log(file)
        console.log(response)
        file.name = '123123123123123123123123123'
      },
      vremoved(file, error, xhr){
        console.log(file)
      }
    }
  }
</script>
<style></style>
