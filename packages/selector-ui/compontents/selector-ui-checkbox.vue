<template>
    <div>
        <CheckboxGroup v-model="CheckBoxAll" @on-change="onCheckBoxGroupChange">
            <Checkbox :size="'large'" :class="'checkbox'"
                      v-for="(item,index) in CheckBoxInit" :key="index" :label="index">
                <span>{{item.label}}</span>
            </Checkbox>
        </CheckboxGroup>
    </div>
</template>

<script>
    export default {
        name: "selector-ui-checkBox",
        pageAuthor: 'xiaosiyan',
        props: {
            'uiInit': {type: Object, default: () => ({})},
            'storageName': {type: String, default: ''}
        },
        mounted: function () {
            this.setSelectorCheckBox();
        },
        data() {
            return {
                CheckBoxAll: [],
                CheckBoxInit: {},
                CheckBoxOrder: [],

                //保存数据的路径名
                routeName: ''
            }
        },
        methods: {
            onCheckBoxGroupChange: function (arr) {
                let arrAll = [];
                arr.forEach((item) => {
                    let index = this.CheckBoxOrder.indexOf(item);
                    arrAll[index] = item;
                });

                //注意这个数据需要是map循环，所有对应字段都需要有，不然反向渲染会不成功，所以即使item是null也需要
                this.CheckBoxAll = arrAll.map(function (item) {
                    if (item) {
                        return item;
                    }
                });

                this.$emit('update', this.CheckBoxAll);
            },
            //设置右侧隐藏选择框默认参数
            setSelectorCheckBox: function () {
                //获取当前存储空间字段
                if (this.$route) {
                    this.routeName = this.$route.path + '/' + this.storageName;
                    this.routeName = this.routeName.split('/');
                    this.routeName = this.routeName.join('_');
                } else {
                    this.routeName = '_' + this.storageName;
                }
                this.routeName = 'SelectorUI' + this.routeName;

                //根据本地参数情况，判断是否需要使用本地存储
                if (this.storageName) {
                    if (window.localStorage[this.routeName]) {
                        this.$set(this, 'CheckBoxAll', JSON.parse(window.localStorage[this.routeName]));
                    } else {
                        window.localStorage[this.routeName] = '[]';
                    }
                }
            }
        },
        model: {
            prop: 'allData',
            event: 'update'
        },
        watch: {
            uiInit: {
                handler(nv, ov) {
                    let temp = {};
                    let buttonArr = [];

                    //重置状态,每次都需要重新渲染
                    this.CheckBoxAll = [];
                    this.CheckBoxInit = {};
                    this.CheckBoxOrder = [];

                    for (let i in nv) {
                        if (nv[i]['type'] == 'button') {
                            //如果是button类型，不参与渲染，直接选中
                            buttonArr.push(i);
                        } else {
                            temp[i] = nv[i];
                            //如果不带  drawer: true 参数，说明是默认选中的状态，需要额外处理选中态
                            if (!nv[i]['drawer']) {
                                this.CheckBoxAll.push(i);
                            }
                        }
                        this.CheckBoxOrder.push(i);
                    }
                    //确保最后才是按钮
                    this.CheckBoxAll = this.CheckBoxAll.concat(buttonArr);

                    this.CheckBoxInit = temp;
                },
                deep: true,
                immediate: true
            },
            CheckBoxAll: {
                handler(nv, ov) {
                    if (this.routeName && this.storageName) {
                        window.localStorage[this.routeName] = JSON.stringify(nv);
                    }

                    this.$emit('update', nv);
                },
                deep: true,
                immediate: true
            }
        },

    }
</script>

<style lang="scss" scoped>
    .checkbox {
        display: block;
        padding-bottom: 10px;
    }
</style>