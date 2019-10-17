<style scoped>
    .img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .wrap {
        position: relative;
        margin: 0 auto;
        background: #fafafa;
    }

    .uploader {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .jz {
        position: absolute;
        width: 140px;
        height: auto;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
        /*margin-left: -70px;*/
        text-align: center;
        color: #fff;
        text-shadow: 1px 1px #555;
        line-height: 1.4;
    }

    .bg {
        transition: .3s ease all;
        background: rgba(0, 0, 0, .3);
        opacity: 0;
    }

    .bg:hover {
        opacity: 1;
    }

    .bgfont {
        color: #ddd;
        text-shadow: none;
        font-size: 22px;
        line-height: 60px;
    }

    .tips {
        font-size: 12px;
    }
</style>
<template>
    <div class="wrap" :style="wrapStyle">
        <div class="jz bgfont" v-html="tips">
            {{this.payload.width}} * {{this.payload.height}}
        </div>
        <Upload
            class="uploader"
            ref="upload"
            :format="['jpg','jpeg','png','gif']"
            :max-size="4096"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            with-credentials
            multiple
            :show-upload-list="false"
            action="/General/Upload/Picture/upload"
        >
            <div :style="wrapStyle" class="wrap bg">
                <div class="jz">
                    <Icon type="ios-cloud-upload" size="36"></Icon>
                    <p class="tips">点击或者拖拽上传</p>
                </div>
            </div>
        </Upload>
        <img v-show="!!img_src" :src="img_src" class="img">
    </div>
</template>
<script>

    export default {
        data() {
            let type = Object.prototype.toString.call(this.payload),
                width,
                height,
                tips = '';
            if (type == '[object Object]') {
                width = this.payload.width * this.payload.scale + 'px';
                height = this.payload.height * this.payload.scale + 'px';
                tips = this.payload.width + ' * ' + this.payload.height;
            } else {
                width = this.payload[0].width * this.payload[0].scale + 'px';
                height = this.payload[0].height * this.payload[0].scale + 'px';
                this.payload.forEach((item) => {
                    tips += item.width + ' * ' + item.height + '、';
                });
            }
            return {
                img_src: '',
                wrapStyle: {
                    width,
                    height
                },
                tips
            }
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            payload: {
                type: [Object, Array],
                default: () => {
                }
            },
        },
        methods: {
            handleSuccess(res, file) {

                if (res.status === 2) {
                    let type = Object.prototype.toString.call(this.payload);
                    if (type == '[object Object]') {
                        if ((this.payload.width && (this.payload.width !== res.data.width)) || (this.payload.height && (this.payload.height !== res.data.height))) {
                            this.$Notice.warning({
                                title: '图片尺寸不符合要求',
                                desc: '标准尺寸为 ' + this.payload.width + ' * ' + this.payload.height
                            })
                        } else {
                            this.img_src = res.data['url'];
                            this.$emit('input', res.data['url']);
                            this.$emit('updateStyle', res);
                        }
                    } else if (type == '[object Array]') {
                        let pass = false,
                            desc = '';
                        this.payload.forEach((item) => {
                            if (item.width === res.data.width && item.height === res.data.height) {
                                this.$set(this.wrapStyle, 'width', (item.width * item.scale) + 'px');
                                this.$set(this.wrapStyle, 'height', (item.height * item.scale) + 'px');
                                pass = true;
                            }
                            desc += item.width + ' * ' + item.height + '、';
                        });
                        if (pass) {
                            this.$emit('input', res.data['url']);
                            this.$emit('updateStyle', {height: res.data.height, width: res.data.width});
                        } else {
                            this.$Notice.warning({
                                title: '图片尺寸不符合要求',
                                desc: '标准尺寸为 ' + desc
                            });
                        }
                    }
                } else {
                    this.$Message.error('图片文件上传错误!')
                }
            },
            handleError(res, file) {
                this.$Message.error('图片文件上传错误!')
            },
            handleFormatError(file) {
                // 格式不对
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小',
                    desc: '文件  ' + file.name + ' 太大了, 超出 2M 的文件不被允许。'
                });
            },
            handleBeforeUpload(file) {
                return true
            }
        },
        mounted: function () {

        },
        watch: {
            value: {
                handler(nv, ov) {
                    this.img_src = nv;
                },
                deep: false,
                immediate: true
            },

        }
    }
</script>
