<template>
    <div class="flex" data-ui-name="nav-head">
        <h1 class="inline-block">{{title}}</h1>
        <Poptip :class="'poptip'" placement="right-start" word-wrap width="500"
                trigger="hover">
            <Icon type="ios-help-circle-outline" :color="'red'" size="30"/>
            <div slot="content">
                <slot></slot>
            </div>
        </Poptip>
    </div>
</template>

<script>
    export default {
        name: "nav-head",
        pageAuthor: 'xiaosiyan',
        data() {
            return {}
        },
        props: {
            title: {type: String, default: '页面标题'},
            infoList: {type: Array, default: () => ([])}
        }
    }
</script>

<style lang="scss" scoped>
    .flex {
        display: flex;
        align-items: center;
    }

    .poptip {
        display: block;
        vertical-align: middle;
    }
</style>