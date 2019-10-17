<template>
    <div class="display-flex">
        <div class="flex-left">
            <Upload action="/General/Upload/Picture/upload"
                    :with-credentials="true"
                    :show-upload-list="true"
                    :max-size="4096"
                    :multiple="false"
                    :format="['jpg','jpeg','png','gif']"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :on-remove="handleRemove"
                    :before-upload="handleBeforeUpload"
                    :default-file-list="imgUploadList"
                    ref="imgUploader"
            >
                <Button icon="ios-cloud-upload-outline">上传图片</Button>
                <div>
                    {{imgTitle}}
                    <strong style="display: block" v-if="limitWidth">宽:{{limitWidth}}</strong>
                    <strong style="display: block" v-if="limitHeight">高:{{limitHeight}}</strong>
                </div>

            </Upload>
        </div>
        <div class="flex-right">
            <Poptip v-if="imgPreView" placement="right-start" trigger="hover">
                <div class="img-box"
                     :style="{backgroundImage: 'url(' + imgPreView+ ')'}"></div>
                <div slot="content" class="img-view"
                     :style="{backgroundImage: 'url(' + imgPreView+ ')'}">
                </div>
            </Poptip>
        </div>
    </div>
</template>

<script>
    export default {
        name: "imgUploader",
        pageAuthor: 'xiaosiyan',
        props: {
            limitWidth: {type: Number, default: 0},
            limitHeight: {type: Number, default: 0},
            imgTitle: {type: String, default: '尺寸限制：'},
            allData: {type: String, default: ''}
        },
        data() {
            return {
                //当前需要预览的图片
                imgPreView: '',
                //当前已经上传的图片列表
                imgUploadList: []
            }
        },
        model: {
            prop: 'allData',
            event: 'update'
        },
        methods: {
            handleSuccess: function (response, file, fileList) {
                if (response.status == 2) {
                    let check = true;
                    //不限制高宽情况
                    if (this.limitWidth === 0 && this.limitHeight === 0) {
                        check = true;
                    } else {
                        //限制宽度的情况下
                        if (this.limitWidth && this.limitWidth !== response.data.width) {
                            check = false;
                        }
                        // 限制高度的情况
                        if (this.limitHeight && this.limitHeight !== response.data.height) {
                            check = false;
                        }
                    }

                    if (check) {
                        this.imgPreView = response.data.url;
                        this.$emit('update', response.data.url);
                    } else {
                        this.imgPreView = '';
                        this.$emit('update', '');
                        this.$Message.error('图片文件尺寸校验不通过!');
                        this.imgUploadList = [];
                    }
                } else {
                    this.$Message.error('图片文件上传错误!')
                }
            },
            handleFormatError: function () {
                this.$Message.error('非图片格式!');
            },
            handleError(res, file) {
                this.$Message.error('图片文件上传错误!')
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小',
                    desc: '文件  ' + file.name + ' 太大了, 超出 4M 的文件不被允许。'
                });
            },
            handleRemove(file, fileList) {
                // 清除当前预览的图片
                this.imgPreView = '';
                this.$emit('update', '');
            },
            handleBeforeUpload() {
                this.$refs.imgUploader.clearFiles();
            }
        },
        watch: {
            allData: {
                handler: function (nv) {

                    //this.imgPreView = nv;

                    // mo 新增；
                    // 在没有图片数据的时候清空 上次遗留的文件记录和图片
                    if(nv){
                        this.imgPreView = nv;
                    }else{
                        if(this.$refs.imgUploader){
                            this.imgPreView = [];
                            this.handleBeforeUpload()
                        }
                    }

                },
                deep: false,
                immediate: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .img-box {
        width: 100px;
        height: 100px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 10px;
    }

    .img-view {
        width: 400px;
        height: 400px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .display-flex {
        display: flex;
    }

    .flex-left {
        margin-right: 20px;
        width: 120px;
        text-overflow: ellipsis;
    }
</style>