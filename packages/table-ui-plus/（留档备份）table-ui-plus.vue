<style>
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
    <div :style="Div_width">
        <!--表头控制区域-->
        <Collapse v-model="Collapse_value" v-if="Table_collapse_show">
            <Panel name="1">
                表头筛选控制
                <div slot="content">
                    <CheckboxGroup v-model="CheckboxGroup_value" @on-change="onCollapseChange">
                        <Checkbox v-for="(item,index) in Checkbox_columns" :label="item.key"
                                  v-if="(item.level==1)" v-show="false" :key="'Checkbox'+index">
                            {{item.title}}
                        </Checkbox>
                        <Checkbox v-for="(item,index) in Checkbox_columns" :label="item.key"
                                  v-if="(item.level==2)||(item.level==3)" :key="'Checkbox'+index">
                            {{item.title}}
                        </Checkbox>
                    </CheckboxGroup>
                </div>

            </Panel>
        </Collapse>

        <!--表格选择框区域-->

        <!--表格渲染区域-->
        <Table ref="table" border :columns="Table_columns" :data="Table_data" :loading="Table_isLoading"
               :highlight-row="true"
               :width="Table_width" @on-selection-change="onTableSelectionChange" @on-sort-change="onTableSortChange"
               @on-row-dblclick="onTableDoubleClick">
        </Table>

        <!--分页处理-->
        <Page :total="Page_Info.Page_total" :page-size="Page_Info.Page_size" :current.sync="Page_current"
              show-elevator
              v-if="Page_Info.Page_need" show-total/>
    </div>
</template>

<script>
    export default {
        props: {
            'columns': {type: Array, default: null},
            'list': {type: Array, default: () => ([])},
            'clickArgs': {type: Object, default: null},
            'width': {type: [Number, String], default: 'auto'},
            'loading': {type: Boolean, default: false},
            'page': {type: Object, default: null},
            'collapse': {type: Boolean, default: true},
            'dataAll': {type: Object, default: null},
            'transform': {type: Function, default: null},
            'exportList': {type: Array, default: null}
        },
        data() {
            return {
                //配置Table表格展示
                Table_columns: [],
                Table_columns_index: {},
                //具体渲染成表格的数据
                Table_data: [],
                //是否正在加载
                Table_isLoading: false,
                //表格宽度
                Table_width: 'auto',
                Div_width: 'width:auto',

                //表格点击额外添加的参数
                Table_clickArgs: {},

                //表格数据筛选展示框
                Collapse_value: '1',
                //表格数据筛选是否隐藏
                Table_collapse_show: true,
                //表格数据删选选择框
                CheckboxGroup_value: [],
                //用于渲染数据选择框
                Checkbox_columns: [],
                columnsOrigin: [],

                //分页相关处理
                Page_Info: {
                    Page_need: false,
                    Page_total: 1,
                    Page_size: 1
                },
                Page_current: 1

            };
        },
        mounted: function () {
            //设置columns相关配置，确定TableUI和Checkbox的渲染格式
            this.Table_columns = this.setColumnsConifg(this.columns);
            this.Checkbox_columns = this.setColumnsConifg(this.columns);

            //设置TableUI相关赋值，从而完成TableUI渲染
            this.Table_data = this.list;
            this.Table_isLoading = this.loading;
            this.Table_width = this.width;

            //设置表格数据筛选是否隐藏
            this.Table_collapse_show = this.collapse;

            //设置TableUI额外参数相关
            this.Table_clickArgs = this.clickArgs;

            //更新CheckBox的选择状态，从而完成CheckBox的渲染
            this.CheckboxGroup_value = this.checkCheckboxLevel(this.Checkbox_columns);
            this.setColumnsIndex();
            this.onCollapseChange(this.CheckboxGroup_value);

            //整个表的宽度控制
            if (this.Table_width) {
                this.Div_width = 'width:' + this.Table_width + 'px';
            }

            //设置分页相关
            if (this.page) {
                this.Page_Info.Page_need = true;
                this.Page_Info.Page_total = Number(this.page.total);
                this.Page_Info.Page_size = Number(this.page.pageSize);
                this.Page_current = Number(this.page.current);
            }
        },
        methods: {
            //初始化TableUI内部渲染器结构
            setColumnsConifg: function (columns) {
                /**
                 * 此函数主要做以下几件事情
                 * 1. 创建一个新的数组对象返回，使得断开iview内部的watcher监听，避免bug出现
                 * 2. 判断不同的UI类型添加对应的render函数
                 * 3. 判断UI类型补充（修正）缺省的level字段
                 * */
                let self = this;
                let columnsTemp = [];
                if (columns && columns.length > 0) {

                    //重新生成一个和源数据没关系的字段，避免被watch
                    columns.forEach(function (item) {
                        columnsTemp.push(Object.assign({}, item));
                    });

                    columnsTemp.forEach(function (item, index) {
                        if (item.key) {
                            if (!item.level) {
                                item.level = 2;                     //如果没有写level，默认为重要数据，默认展示，手动隐藏
                                if (item.UI && item.UI.type) {
                                    switch (item.UI.type) {
                                        case 'button':
                                        case 'buttonGroup': {
                                            item.level = 1;         //操作的UI类型为核心展示级别，一定展示
                                        }
                                    }
                                }
                            }
                        } else {
                            item.level = 1;                          //没有key值属于功能类型
                        }

                        if (item.UI && item.UI.type) {
                            let {UI, key} = item;
                            item.render = function (h, params) {
                                let value = params.row[key];

                                switch (item.UI.type) {
                                    //图片
                                    case 'img': {
                                        let src = '';
                                        //少数情况下，需要进行地址转化
                                        if (UI.needTransform && self.transform) {
                                            //如果需要转换，从外部转换过来再次赋值

                                            src = self.transform({
                                                key: key,
                                                value: value
                                            }, params.row);
                                        } else {
                                            //如果不需要转换，直接使用当前值
                                            src = value;
                                        }
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
                                        //链接显示的文案，如果没有设置文案使用当前value
                                        let text = UI['text'] ? UI['text'] : value;
                                        //是否需要前置地址，如果有前置地址，会加在地址前方
                                        let preHref = UI['preHref'] ? UI['preHref'] : '';
                                        return h(
                                            'a',
                                            {
                                                attrs: {
                                                    href: preHref + value,
                                                    target: '_bank'
                                                }
                                            },
                                            [
                                                text
                                            ]
                                        )
                                    }
                                    //单一按钮
                                    case 'button': {
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
                                                            self.onRowClick(UI.name, context.row, context.index, self.Table_clickArgs);
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
                                        let buttonList = [];
                                        if (UI.list && UI.list.length > 0) {
                                            for (let i = 0; i < UI.list.length; i++) {

                                                //如果存在key参数同时key内也有那么参数，说明需要从后台返回数据内读取需要的内容
                                                if (UI.list[i].key && UI.list[i].key['name'] && value[UI.list[i].key.name]) {

                                                    if (value[UI.list[i].key.name]['isHidden']) {
                                                        //如果需要隐藏，不渲染页面节点
                                                    } else {
                                                        let keyObj = UI.list[i].key;
                                                        buttonList.push(h(
                                                            'Button',
                                                            {
                                                                props: Object.assign({
                                                                    type: value[keyObj.name][keyObj['type']] || 'primary',
                                                                    disabled: value[keyObj.name][keyObj['disabled']] || false,
                                                                    // style: value[keyObj.name][keyObj['style']],
                                                                    icon: value[keyObj.name][keyObj['icon']] || ''
                                                                }),
                                                                on: {
                                                                    click: () => {
                                                                        self.onRowClick(UI.list[i].name, params.row, params.index, self.Table_clickArgs)
                                                                    }
                                                                }
                                                            },
                                                            //如果从后台返回值拿不到按钮文字，使用btnText作为默认文字
                                                            [value[keyObj.name][keyObj['btnText']] || UI.list[i].btnText]
                                                        ));
                                                    }
                                                } else if (value && (typeof value) != 'object') {
                                                    //如果value不是一个对象，那么说明所有按钮都需要渲染，前端定义按钮状态
                                                    buttonList.push(h(
                                                        'Button',
                                                        {
                                                            props: Object.assign({
                                                                value
                                                            }),
                                                            on: {
                                                                click: () => {

                                                                    self.onRowClick(UI.list[i].name, params.row, params.index, self.Table_clickArgs)
                                                                }
                                                            }
                                                        },
                                                        [UI.list[i].btnText]
                                                    ));
                                                }
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
                                    //标签数组
                                    case 'tags': {
                                        let tagList = [];
                                        if (value && value.length > 0) {
                                            value.forEach(function (item) {
                                                let showValue = '';
                                                if (UI.needTransform && self.transform) {
                                                    //如果需要转换，从外部转换过来再次赋值

                                                    showValue = self.transform({
                                                        key: key,
                                                        value: item
                                                    }, params.row);
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
                                    //需要额外处理的字符串
                                    case 'span': {
                                        //默认样式
                                        let style = {};
                                        //默认文字来源是value值
                                        let text = value;

                                        //判断文字是否需要添加额外样式
                                        if (UI.style) {

                                            if (typeof UI.style == 'object') {
                                                //如果style是对象形式的话直接添加样式
                                                style = UI.style;
                                            } else if (typeof UI.style == 'string') {
                                                //如果style是字符串的话，说明需要从后台数据读取
                                                if (value[UI.style] && typeof  value[UI.style] == 'object') {
                                                    //只有当读取的数据为对象的时候，才会赋值
                                                    style = value[UI.style];
                                                } else {
                                                    console.warn('TableUIPlus-UI type为"span"的项后台数据结构与渲染不匹配');
                                                }
                                            }
                                        }

                                        //判断文字是否需要从子字段额外读取，当UI.style为字符串时，通常此值也需要设置
                                        if (UI.text && typeof UI.text == 'string') {
                                            text = value[UI.text];
                                        }

                                        //判断文字是否

                                        if (UI.needTransform && self.transform) {
                                            return h('span', {style: style}, self.transform({
                                                key: key,
                                                value: text
                                            }, params.row));
                                        } else {
                                            //默认字符串展示
                                            return h('span', {style: style}, text);
                                        }
                                    }
                                    //下拉按钮
                                    case 'dropDown': {
                                        let dropDownList = [];
                                        if (UI.list && UI.list.length > 0) {
                                            UI.list.forEach(function (dropDownItem, dropDownIndex) {
                                                //按钮必须要有对应名字和字符串显示
                                                if (dropDownItem.name && dropDownItem.btnText) {
                                                    //如果存在isHidden属性，不进行渲染
                                                    if (value[dropDownItem['isHidden']]) {
                                                        //do nothing
                                                    } else {
                                                        dropDownList.push(h(
                                                            'DropdownItem',
                                                            {
                                                                props: Object.assign({
                                                                    name: dropDownItem['name'],
                                                                    transfer: true
                                                                })
                                                            },
                                                            [dropDownItem['btnText']]
                                                        ));
                                                    }
                                                }
                                            });

                                            if (value && key) {

                                                return (h(
                                                    'Dropdown',
                                                    {
                                                        props: Object.assign({
                                                            placement: 'bottom-start',
                                                            transfer: true
                                                        }),
                                                        on: {
                                                            'on-click': (name) => {
                                                                self.onRowClick(name, params.row, params.index, self.Table_clickArgs)
                                                            }
                                                        }
                                                    },
                                                    [

                                                        h(
                                                            'Button',
                                                            {
                                                                props: Object.assign({
                                                                    type: UI.btnType || 'default'
                                                                })
                                                            },
                                                            [
                                                                UI.btnText || '下拉菜单',
                                                                h(
                                                                    'Icon',
                                                                    {
                                                                        props: Object.assign({
                                                                            type: 'ios-arrow-down'
                                                                        })
                                                                    }
                                                                )
                                                            ]
                                                        ),
                                                        h(
                                                            'DropdownMenu',
                                                            {
                                                                slot: 'list'
                                                            },
                                                            dropDownList
                                                        )
                                                    ]
                                                ));
                                            } else {
                                                break;
                                            }
                                        }
                                    }
                                    //特殊dom节点，用于需要手动控制html的时候
                                    case 'dom': {
                                        let name = UI['name'] ? UI['name'] : 'table-ui-dom';
                                        return h(
                                            'div',
                                            {
                                                attrs: {
                                                    'data-name': name,
                                                    'data-value': value
                                                }
                                            }
                                        );
                                    }
                                    default: {
                                        console.warn('TableUIPlus,数据结构没有匹配类型');
                                    }
                                }
                            }
                        }
                    });

                    return columnsTemp;
                } else {
                    return [];
                }

            },
            //更新初始化数据顺序
            setColumnsIndex: function () {
                if (this.columns.length > 0) {
                    this.columns.forEach((item, index) => {
                        this.Table_columns_index[item['key']] = index;
                    });
                }

            },
            //TableUI 点击按钮之后的回调函数传递
            onRowClick(btn, row, index, clickArgs) {
                this.$emit('on-click-ctrl', {btn, row, index, clickArgs});
            },
            onCollapseChange: function (obj) {
                //在点击数据配置表的时候，修改配套的参数
                let newColumns = new Array(this.columns.length);
                let tempColumns2 = this.setColumnsConifg(this.columns);
                let tempColumns3 = Object.assign({}, this.Table_columns_index);

                obj.forEach((item) => {
                    let columnsIndex = tempColumns3[item];
                    newColumns[columnsIndex] = Object.assign({}, tempColumns2[columnsIndex]);
                });
                let index = 0;


                let tempColumns = [];
                newColumns.forEach((item) => {
                    if (item) {
                        tempColumns[index] = item;
                        index++;
                    }
                });
                this.Table_columns = [];
                this.$nextTick(() => {
                    this.Table_columns = tempColumns;
                });
            },
            //校验Checkbox_columns的level字段，初始化选择框的值
            checkCheckboxLevel: function (columns) {
                let value = [];
                columns.forEach(function (item) {
                    if (item.level == 1) {
                        //核心数据不允许选择，一定展示(选择框不展示)
                        value.push(item.key);
                    } else if (item.level == 2) {
                        //重要数据，默认为选择态
                        value.push(item.key);
                    } else if (item.level == 3) {
                        //非重要数据，添加空值
                        value.push('');
                    }
                });

                return value;
            },
            //Table被选择之后触发
            onTableSelectionChange: function (res) {
                this.$emit('on-select', res);
            },
            //Table被选择排序之后触发
            onTableSortChange: function (res) {
                this.$emit('on-sort-change', res);
            },

            //Table被双击之后，选择当前项
            onTableDoubleClick: function (row, index) {
                this.$refs.table.toggleSelect(index);
            },

            //导出数据
            exportCsv: function (obj) {
                let temp = {
                    original: false,
                    filename: 'Table数据',
                    columns: this.Table_columns,
                    data: this.exportList
                };
                Object.assign(temp, obj);
                this.$refs.table.exportCsv(temp);
            }
        },
        model: {
            prop: 'dataAll',
            event: 'update'
        },
        watch: {
            //当检测到了参数data更新之后，及时更新到当前数据内
            list: {
                handler(nv, ov) {
                    let [...data] = this.list;
                    this.Table_data = data;

                },
                deep: true,
                immediate: false
            },
            //当检测到clickArgs更新了，及时更新到当前数据内
            clickArgs: {
                handler(nv, ov) {
                    this.Table_clickArgs = nv;
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
            },
            //当检测到了page更新了，及时更新到当前数据内
            page: {
                handler(nv, ov) {
                    this.Page_Info.Page_total = Number(this.page.total);
                    this.Page_Info.Page_size = Number(this.page.pageSize);
                    this.Page_current = Number(this.page.current);
                },
                deep: true,
                immediate: false
            },
            //当检测了Page_current的更新，向上传递
            Page_current: {
                handler(nv, ov) {
                    console.log(this.Page_Info);
                    this.page.current = nv;

                    this.$emit('update:page', this.page);
                    this.$emit('on-click-page', nv);

                    //旧的数据
                    // console.log(ov);
                },
                deep: true,
                immediate: false
            }
        }

    };
</script>