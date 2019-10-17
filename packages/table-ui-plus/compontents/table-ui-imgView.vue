<template>
    <img :src='src' :class="'img-default '+className"/>
</template>

<script>
    export default {
        name: "table-ui-imgView",
        pageAuthor: 'xiaosiyan',
        data() {
            return {}
        },
        props: {
            src: {type: String, default: ''},
            className: {type: String, default: ''}
        }
    }
</script>

<style lang="scss" scoped>
    .img-default {
        display: block;
        width: 150px;
        height: auto;
    }
</style>