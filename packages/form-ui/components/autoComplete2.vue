<!--本组件用于处理自动填充的情况-->
<template>
    <AutoComplete
            v-model="autoComplete_model"
            :placeholder="placeholder"
            :data="autoComplete_dataShow" :disabled="disabled"
            icon="ios-search"></AutoComplete>
</template>

<script>
    export default {
        name: "AutoComplete2",
        props: {
            disabled: {type: Boolean, default: false},
            placeholder: {type: String, default: ''},
            show: {type: String, default: ''},
            data: {type: Array, default: () => ([])},
            allData: {type: [String, Object], default: () => ({})}
        },
        model: {
            prop: 'allData',
            event: 'update'
        },
        methods: {},
        mounted: function () {

        },
        data() {
            return {
                //v-model绑定的结果(String)
                autoComplete_model: '',
                //需要向上uodate的数据(String/Object)
                autoComplete_value: '',

                //用于切换数据的索引
                index: null,

                //用于展示的数据对数组
                autoComplete_dataShow: [],
                autoComplete_dataAll: []
            };
        },
        watch: {
            allData: {
                deep: true,
                immediate: true,
                handler: function (nv) {
                    if (typeof this.allData == 'object') {
                        this.autoComplete_model = nv[this.show];
                        this.autoComplete_value = nv;
                    } else if (typeof this.allData == 'string') {
                        this.autoComplete_model = nv;
                        this.autoComplete_value = nv;
                    }
                }
            },
            data: {
                deep: true,
                immediate: true,
                handler: function (nv, ov) {
                    let self = this;
                    //每次data数据更新，说明autoComplete_model数据的变化，并且有对应查询结果
                    if (self.show) {
                        //如果带有show的情况，数据格式为对象
                        self.autoComplete_dataAll = nv;
                        self.autoComplete_dataShow = nv.map(function (item) {
                            return item[self.show];
                        });

                        //对数据进行遍历，得到当前的对象数据
                        let res = this.autoComplete_dataAll.filter(function (item) {
                            if (item[self.show] == self.autoComplete_model) {
                                return item;
                            }
                        });

                        if (res[0]) {
                            //如果查询到结果，更新对应的值
                            self.autoComplete_value = res[0];
                            self.$emit('update', self.autoComplete_value);
                        } else {
                            //如果查询不到结果，不做变化
                        }
                    } else {
                        //如果是字符串格式，只需要更新data列表展示，不需要对autoComplete_value进行操作
                        self.autoComplete_dataShow = nv;
                        self.autoComplete_dataAll = nv;
                    }
                }
            },
            autoComplete_model: {
                deep: false,
                immediate: true,
                handler: function (nv, ov) {
                    //每次输入框的值变化之后，都需要重新生成一个value向上触发
                    if (this.show) {
                        this.autoComplete_value = {};
                        this.autoComplete_value[this.show] = nv;
                    } else {
                        this.autoComplete_value = nv;
                    }

                    this.$emit('update', this.autoComplete_value);
                }
            }
        }
    }
</script>

<style scoped>

</style>