<template>
    <div class="page-editDemo-form-Line" :style="Div_width" data-ui-name="selector-ui">
        <!--循环formInit用来初始化整个表单内容，此表单默认为多个form和多个formItem的组合-->
        <div class="flex-box">
            <div class="flex-left">
                <Button @click="openDrawer" type="warning" icon="md-list">数据筛选</Button>
            </div>
            <Divider type="vertical"></Divider>
            <div class="flex-center">
                <Tag v-for="(tagItem,tagIndex) in Tags_list" closable :name="tagIndex" :key="tagIndex"
                     @on-close="onTagClose">
                    {{tagItem.init.label}}:<span class="yellow">{{tagItem.value}}</span>
                </Tag>
            </div>
            <Divider type="vertical"></Divider>
            <div class="flex-right">
                <Button v-for="(buttonItem,buttonIndex) in uiInit_Button" :key="buttonIndex"
                        :type="buttonItem.init.type||'primary'"
                        :name="buttonItem.init.name" @click="formButtonClick(buttonItem.init)" :class="'button'">
                    {{buttonItem.init.btnText}}
                </Button>
            </div>
        </div>

        <Drawer title="所有筛选" v-model="Drawer_show">
            <SelectorForm :uiInit="uiInit_Select" v-model="uiItems" :needInline="false"
                          :formID="'normal'" @check-labelMap="onSelectFormCheck"></SelectorForm>
        </Drawer>
    </div>
</template>

<script>
    import SelectorForm from '~/components/selector-ui-base/compontents/selector-ui-form2.vue';
    import SelectorCheckBox from '~/components/selector-ui-base/compontents/selector-ui-checkBox.vue';

    export default {
        components: {SelectorForm, SelectorCheckBox},
        props: {
            'uiInit': {type: Object, default: () => ({})},
            'width': {type: Number, default: 100},
            'uiItems': {type: Object, default: () => ({})}
        },
        mounted: function () {
            //设置选择器宽度
            if (this.width <= 100) {
                this.Div_width = 'width:' + this.width + '%';
            } else {
                this.Div_width = 'width:' + this.width + 'px';
            }
        },
        data() {
            return {
                //默认宽度100%
                Div_width: 'width:100%',

                Drawer_show: false,

                //当前按钮内容
                uiInit_Button: {},
                uiInit_Select: {},

                Tags_list: {},
                Tags_map: {}
            };
        },
        model: {
            prop: 'uiItems',
            event: 'update'
        },
        methods: {
            //点击按钮事件监听(通常为发送请求或者取消)
            formButtonClick: function (btn) {
                this.$emit('select', {btn: btn, select: this.uiItems});
            },
            openDrawer: function () {
                this.Drawer_show = true;
            },
            onSelectFormCheck: function (labelMap) {
                for (let i in labelMap) {
                    if (this.Tags_list[i]) {
                        this.$set(this.Tags_list[i], 'value', labelMap[i]);
                    }
                }
            },
            onTagClose: function (event, name) {
                this.$set(this.uiItems, name, '');
            }
        },
        watch: {
            uiInit: {
                handler(nv, ov) {
                    //获取到需要渲染的字段之后，需要转换成可渲染格式给SelectorForm
                    this.uiInit_Button = {};
                    this.uiInit_Select = {};

                    for (let i in nv) {
                        if (nv[i].type == 'button') {
                            this.$set(this.uiInit_Button, i, nv[i]);
                        } else {
                            this.$set(this.uiInit_Select, i, nv[i]);
                        }
                    }
                },
                deep: true,
                immediate: true
            },
            uiItems: {
                handler(nv, ov) {
                    this.Tags_list = {};
                    for (let i in nv) {
                        if (this.uiItems[i]) {
                            this.$set(this.Tags_list, i, {
                                value: this.uiItems[i],
                                init: this.uiInit[i]
                            });
                        }
                    }
                },
                deep: true,
                immediate: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .flex-box {
        display: flex;
        align-items: center;
    }

    .button {
        margin-right: 10px;
        margin-top: 2px;
        margin-bottom: 2px;
    }

    .yellow {
        color: #ff9900;
    }
</style>