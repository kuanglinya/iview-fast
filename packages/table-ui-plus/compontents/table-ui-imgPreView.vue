<style lang="scss" scoped>
    .out-box{
        width: 100px;
        height: 100px;
    }
    .img-box {
        width: 100px;
        height: 100px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 10px;
        display: block;
        box-sizing: border-box;
        &:hover {
            border: 1px solid #5cadff;
        }
    }

    .img-view {
        width: 400px;
        height: 400px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .content-box {
        width: 400px;
    }

    .img-link {
        word-break: break-all;
        white-space: pre-wrap;
        border-bottom: 1px solid #e8eaec;
        color: #3399ff;
    }

</style>

<template>
    <div class="out-box">
        <Poptip v-if="imgPreView" placement="right-start" trigger="hover" :transfer="true">
            <div class="out-box">
                <a class="img-box"
                   :style="{backgroundImage: 'url(' + imgPreView+ ')'}" :href="imgPreView" target="_blank"></a>
            </div>
            <div slot="content" class="content-box">
                <a class="img-link" :href="imgPreView" target="_blank">{{imgPreView}}</a>
                <div class="img-view" :style="{backgroundImage: 'url(' + imgPreView+ ')'}"></div>
            </div>
        </Poptip>
    </div>
</template>

<script>
    export default {
        name: "table-ui-imgPreView",
        pageAuthor: 'xiaosiyan',
        props: {
            imgPreView: {type: String, default: ''}
        },
        data() {
            return {
                //需要预览的图片地址
            }
        }
    }
</script>

