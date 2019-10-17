<style lang="scss" scoped>
    .flex-box {
        display: flex;
        align-items: center;
    }

    .flex-right {
        padding-top: 10px;
    }
</style>

<template>
    <div class="page-editDemo-form-Line" :style="Div_width" data-ui-name="selector-ui">
        <!--循环formInit用来初始化整个表单内容，此表单默认为多个form和多个formItem的组合-->
        <div class="flex-box">
            <div class="flex-left">
                <Button @click="openDrawer" type="warning" icon="md-list">高级筛选</Button>
                <Button @click="clearLocalStorage" style="margin-left: 6px;" type="warning" icon="md-build"></Button>
            </div>
            <Divider type="vertical"></Divider>
            <div class="flex-right">
                <SelectorForm :uiInit="uiInit_Form" v-model="uiItems" :needInline="true"
                              @select="formButtonClick" :formID="'normal'"></SelectorForm>
            </div>
        </div>

        <Drawer title="所有筛选" v-model="Drawer_show">
            <SelectorCheckBox :uiInit="uiInit" v-model="SelectorUI_check" :storageName="storageName"></SelectorCheckBox>
        </Drawer>
    </div>
</template>

<script>
    import SelectorForm from './compontents/selector-ui-form.vue';
    import SelectorCheckBox from './compontents/selector-ui-checkbox.vue';

    export default {
        components: {SelectorForm, SelectorCheckBox},
        props: {
            'uiInit': {type: Object, default: () => ({})},
            'width': {type: Number, default: 100},
            'uiItems': {type: Object, default: () => ({})},
            //存储空间名字设置
            'storageName': {type: String, default: ''}
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
                //当前被选择的选择器
                SelectorUI_check: [],
                //此项为Form表单数据的初始化，可以通过修改此配置项来控制form表单的格式和内容
                SelectorUI_init: {},

                //默认宽度100%
                Div_width: 'width:100%',

                Drawer_show: false,

                //当前渲染内容
                uiInit_Form: {}
            };
        },
        model: {
            prop: 'uiItems',
            event: 'update'
        },
        methods: {
            //点击按钮事件监听(通常为发送请求或者取消)
            formButtonClick: function (obj) {
                this.$emit('select', obj);
            },
            openDrawer: function () {
                this.Drawer_show = true;
            },
            clearLocalStorage: function () {
                window.localStorage.clear();
                window.location.reload(true);
            }
        },
        watch: {
            SelectorUI_check: {
                handler(nv, ov) {
                    //获取到需要渲染的字段之后，需要转换成可渲染格式给SelectorForm
                    this.uiInit_Form = {};
                    if (nv.length) {
                        nv.forEach((item) => {
                            if (item) {
                                this.$set(this.uiInit_Form, item, this.uiInit[item]);
                            }
                        });
                    }
                },
                deep: true,
                immediate: false
            }
        }
    }
</script>

