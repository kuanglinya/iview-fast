<template>
    <div>
        <Button :type="ButtonConfig.btnType" :class="{hide:ButtonConfig.isHidden}"
                @click="buttonClick(ButtonConfig.name)">
            {{ButtonConfig.btnText}}
        </Button>
    </div>
</template>

<script>
    export default {
        name: "table-ui-button",
        pageAuthor: 'jialinmo',
        data() {
            return {
                ButtonConfig: {}
            }
        },
        props: {
            config:{type:  Object, default: ()=>({})},
            button: {type: [String, Number, Boolean, Object], default: false},
        },
        mounted: function () {
        },
        methods: {
            buttonClick: function (name) {
                this.$emit('click', name);
            }
        },
        watch: {
            button: {
                handler: function (nv) {
                    if (typeof nv === 'object') {
                        //是对象结构，渲染信息需要额外读取
                            this.ButtonConfig = {
                                name:this.config.name,
                                btnText:nv[this.config.key.btnText || 'xx'],
                                btnType:nv[this.config.key.btnType] || 'default',
                                isHidden:nv[this.config.key.isHidden] || false,
                            };
                    } else {
                        //不是对象结构，直接读取配置的UI中需要渲染的按钮
                        this.ButtonConfig = {
                            name:this.config.name,
                            btnText:this.config.btnText,
                            btnType:this.config.btnType || 'default',
                            isHidden:this.config.isHidden || false,
                        };
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