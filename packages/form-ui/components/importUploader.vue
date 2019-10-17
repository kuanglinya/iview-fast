<style>

</style>
<template>
    <div class="importUploader">
        <Upload ref="upload" :action="url"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="handleBeforeUpload"
                :data="Upload_data"
                :default-file-list="list">
            <Button icon="ios-cloud-upload-outline">{{Button_text}}</Button>
        </Upload>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                Button_text: '',
                Upload_data: {
                    uri: window.location.href
                },
            }
        },
        props: {
            text: {type: String, default: ''},
            url: {type: String, default: '/General/Upload/File/upload'},
            value: {
                type: String,
                default: ''
            },
            list: {type: Array, default: () => ([])}
        },
        model: {
            prop: 'dateAll',
            event: 'update'
        },
        methods: {
            handleSuccess: function (res, file, fileList) {
                console.log(res);

                if (res.status == 2) {
                    console.log(res)
                    this.$emit('update', res.data);
                    this.$emit('update:list', fileList);
                } else {
                    //如果是异常文件，提示并且删除
                    alert(res.msg);
                    this.$refs.upload.clearFiles();
                }
            },
            handleError: function (error, file, fileList) {
                console.log(error);
            },
            //确保只能提交一个文件
            handleBeforeUpload: function () {
                this.$refs.upload.clearFiles();
            }
        },
        mounted: function () {
            this.Button_text = this.text;
        }
    }
</script>
