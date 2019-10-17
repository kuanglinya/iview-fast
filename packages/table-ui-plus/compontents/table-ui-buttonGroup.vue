<template>
    <div>
        <ButtonGroup :vertical="vertical">
            <Button v-for="(item,index) in Button_RenderList" :key="'b'+index"
                    :type="item.type" :icon="item.icon" :style="item.style" :class="{hide:item.isHidden}"
                    :disabled="item.isDisabled" :ghost="item.isGhost"
                    @click="buttonClick(item.name)">
                {{item.btnText}}
            </Button>
        </ButtonGroup>
    </div>
</template>

<script>
    export default {
        name: "table-ui-buttonGroup",
        pageAuthor: 'xiaosiyan',
        data() {
            return {
                //按钮渲染列表
                Button_RenderList: []
            }
        },
        props: {
            list: {type: Array, default: () => ([])},
            buttons: {type: [String, Number, Boolean, Object], default: false},
            vertical: {type: Boolean, default: false}
        },
        mounted: function () {

        },
        methods: {
            buttonClick: function (name) {
                this.$emit('click', name);
            }
        },
        watch: {
            buttons: {
                handler: function (nv) {
                    this.Button_RenderList = [];
                    if (typeof nv === 'object') {
                        //如果是对象结构，说明渲染内容需要额外读取
                        this.list.forEach((item) => {
                            if (item && item.key) {
                                let info = this.buttons[item.key.name];
                                let obj = {};
                                if (info) {
                                    obj = {
                                        btnText: info[item.key.btnText] || item.btnText,
                                        icon: info[item.key.icon],
                                        isHidden: info[item.key.isHidden],
                                        isDisabled: info[item.key.isDisabled] || false,
                                        isGhost: info[item.key.isGhost] || false,
                                        style: info[item.key.style],
                                        type: info[item.key.type],
                                        name: item.name                         //这个name是前端标记用来区分按钮的，不是后台返回数据
                                    };

                                    this.Button_RenderList.push(obj);
                                }
                            }
                        });
                    } else {
                        //如果不是对象结构，说明直接从list读取需要渲染的按钮
                        this.Button_RenderList = [];
                        this.list.forEach((item) => {
                            if (item && item.name) {
                                let obj = {
                                    btnText: item.btnText || item.name,
                                    icon: item.icon,
                                    isHidden: item.isHidden,
                                    isDisabled: item.isDisabled || false,
                                    isGhost: item.isGhost || false,
                                    style: item.style,
                                    type: item.type,
                                    name: item.name
                                };

                                this.Button_RenderList.push(obj);
                            }
                        });
                    }
                },
                deep: true,
                immediate: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .hide {
        display: none;
    }

</style>