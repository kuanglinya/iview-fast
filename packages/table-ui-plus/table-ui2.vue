<style scoped>
    .ivu-table-cell {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .ivu-table-wrapper {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>

<template>
    <div>
        <Table border :columns="Table_columns" :data="Table_data" :loading="Table_isLoading" :highlight-row="true"
               :width="Table_width">
        </Table>
    </div>
</template>

<script>
    export default {
        props: {
            'columns': {type: Array, default: null},
            'list': {type: Array, default: null},
            'clickArgs': {type: Object, default: null},
            'width': {type: [Number, String], default: 'auto'},
            'loading': {type: Boolean, default: false},
            'transform': {type: Function, default: null},
        },
        data() {
            return {
                //配置Table表格展示
                Table_columns: [],
                //具体渲染成表格的数据
                Table_data: [],
                //是否正在加载
                Table_isLoading: false,
                //表格宽度
                Table_width: 'auto'
            };
        },
        mounted: function () {
            //Table的数据初始化
            this.setRender();
            this.Table_columns = this.columns;
            this.Table_data = this.list;
            this.Table_isLoading = this.loading;
            this.Table_width = this.width;
        },
        methods: {
            setRender: function () {
                let self = this;
                if (this.columns && this.columns.length > 0) {
                    this.columns.forEach(function (item, index) {
                        if (item.UI && item.UI.type) {
                            let {UI, key} = item;
                            item.render = function (h, params) {
                                let value = params.row[key];
                                switch (item.UI.type) {
                                    //图片
                                    case 'img': {
                                        return h(
                                            'img',
                                            {
                                                attrs: {
                                                    src: value,
                                                    class: UI['class']
                                                }
                                            }
                                        )
                                    }
                                    //时间显示器（时间戳转本地时间显示）
                                    case 'time': {
                                        let tempValue = value;

                                        if (Number(value)) {
                                            //转换单位
                                            if (UI['unit'].toLowerCase() == 's') {

                                                tempValue = Number(value) * 1000;
                                            }
                                            //如果是时间戳，按照时间戳展示
                                            return h(
                                                'Time',
                                                {
                                                    props: Object.assign({
                                                        time: Number(tempValue),
                                                        type: "datetime"
                                                    })
                                                }
                                            )
                                        } else {
                                            //不是时间戳，按字符串渲染
                                            return h('span', value);
                                        }
                                    }
                                    //链接类型
                                    case 'link': {
                                        return h(
                                            'a',
                                            {
                                                attrs: {
                                                    href: value,
                                                    target: '_bank'
                                                }
                                            },
                                            [
                                                UI['text'] ? UI['text'] : value
                                            ]
                                        )
                                    }
                                    //单一按钮
                                    case 'button': {
                                        const {clickArgs} = this;
                                        if (value && key) {
                                            //按钮
                                            return createElement(
                                                'Button',
                                                {
                                                    props: Object.assign({
                                                        value
                                                    }),
                                                    on: {
                                                        click: () => {
                                                            self.onRowClick(UI.name, context.row, context.index, clickArgs);
                                                        }
                                                    }
                                                },
                                                [UI.btnText]
                                            );
                                        } else {
                                            break;
                                        }
                                    }
                                    //多个按钮
                                    case 'buttonGroup': {
                                        const {clickArgs} = this;
                                        let buttonList = [];
                                        if (UI.list && UI.list.length > 0) {
                                            for (let i = 0; i < UI.list.length; i++) {
                                                buttonList.push(h(
                                                    'Button',
                                                    {
                                                        props: Object.assign({
                                                            value
                                                        }),
                                                        on: {
                                                            click: () => {
                                                                self.onRowClick(UI.list[i].name, params.row, params.index, clickArgs)
                                                            }
                                                        }
                                                    },
                                                    [UI.list[i].btnText]
                                                ));
                                            }
                                        }

                                        if (value && key) {
                                            return h(
                                                'ButtonGroup',
                                                {},
                                                buttonList
                                            );
                                        } else {
                                            break;
                                        }
                                    }
                                    case 'tags': {
                                        let tagList = [];
                                        if (value && value.length > 0) {
                                            value.forEach(function (item) {
                                                let showValue = '';
                                                if (UI.needTransform && self.transform) {
                                                    //如果需要转换，从外部转换过来再次赋值
                                                    showValue = self.transform({key: key, value: item});
                                                } else {
                                                    //如果不需要转换，直接使用当前值
                                                    showValue = item;
                                                }

                                                //只有值不为空的情况下，才需要渲染
                                                if (showValue) {
                                                    tagList.push(h(
                                                        'Tag',
                                                        {},
                                                        [showValue]
                                                    ));
                                                }
                                            });

                                            return h(
                                                'div',
                                                {},
                                                tagList
                                            );
                                        } else {
                                            break;
                                        }
                                    }
                                    case 'span': {
                                        if (UI.needTransform && self.transform) {
                                            return h('span', self.transform({key: key, value: value}));
                                        } else {
                                            //默认字符串展示
                                            return h('span', value);
                                        }
                                    }
                                    default: {
                                        console.warn('TableUIPlus,数据结构没有匹配类型');
                                    }
                                }
                            }
                        }
                    });
                }
            },
            onRowClick(btn, row, index, clickArgs) {
                this.$emit('on-click-ctrl', {btn, row, index, clickArgs});
            },
        },

        model: {
            prop: 'dataAll',
            event: 'update'
        },
        watch: {
            //当检测到了参数list更新之后，及时更新到当前数据内
            list: {
                handler(nv, ov) {
                    this.Table_data = this.list;
                },
                deep: true,
                immediate: false
            },
            //当检测到Table_data数据更新了，向上传递
            Table_data: {
                handler(nv, ov) {
                    let obj = Object.assign({}, nv);

                    this.$emit('update', obj);

                    //旧的数据
                    // console.log(ov);
                },
                deep: true,
                immediate: false
            },
            //当检测到loading更新了，及时更新到当前数据内
            loading: {
                handler(nv, ov) {
                    this.Table_isLoading = this.loading;
                },
                deep: true,
                immediate: false
            }
        },
    };
</script>