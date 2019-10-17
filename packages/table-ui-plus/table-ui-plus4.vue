<style lang="scss" scoped>
    .batch-button {
        margin-right: 5px;
    }

    .batch-group {
        margin-right: 10px;
    }

    .box-flex {
        display: flex;
        flex-direction: column;
    }

    .box-card {
        margin-top: 10px;
    }

    .flex-top {
        padding-bottom: 10px;
    }

    .flex-bottom {
        padding-top: 10px;
    }

    .modal-title {
        padding-bottom: 10px;
        span {
            color: #ed4014;
            padding-left: 5px;
            padding-right: 5px;
        }
    }

    .inline-block {
        display: inline-block;
    }


</style>
<style lang="scss">
    .ivu-table-cell {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .TableUI-Selection-Modal {
        .ivu-modal {
            max-height: 80%;
            overflow-y: scroll;
            margin-top: 0;
        }
    }
</style>

<template>

    <tableUIFullScreen
            :fullScreenStatus.sync="fullScreenStatus">
        <div :style="Div_width" class="box-flex" ref="content_box" slot="table-plus-x">
            <div class="flex-top" ref="collapse_box" v-show="Table_collapse_show">
                <!--表头控制区域-->
                <Drawer title="表头数据筛选" :closable="false" v-model="Drawer_value" :transfer="false">
                    <CheckboxGroup v-model="CheckboxGroup_value" @on-change="onCheckboxChange">
                        <div v-for="(item,index) in Checkbox_columns" :key="index">
                            <Checkbox :label="item.key"
                                      v-if="(item.level==1)" v-show="false" :key="'Checkbox'+index">
                                {{item.title}}
                            </Checkbox>
                            <Checkbox :label="item.key"
                                      v-if="(item.level==2)||(item.level==3)" :key="'Checkbox'+index">
                                {{item.title}}
                            </Checkbox>
                        </div>
                    </CheckboxGroup>
                </Drawer>

                <div>
                    <Card class="box-card">
                        <Button type="warning" @click="onButtonShowDrawer" icon="md-list">表头筛选</Button>
                        <Button type="warning" @click="onButtonChangeFullScreen">
                            <Icon v-if="!fullScreenStatus" type="md-expand" size="18"/>
                            <Icon v-else type="md-contract" size="18"/>
                        </Button>


                        <Divider type="vertical"></Divider>
                        <div v-if="Array.isArray(batchButtons)" class="inline-block">
                            <Button class="batch-button" v-for="(item_b,index_b) in batchButtons" :key="'a'+index_b"
                                    :type="item_b.type"
                                    :style="item_b.style" @click="onBatchClick(item_b)">
                                {{item_b.text}}
                            </Button>
                        </div>
                        <div v-else class="inline-block">
                            <ButtonGroup v-for="(item_g,index_g) in batchButtons" class="batch-group"
                                         :key="'b'+index_g">
                                <Button v-for="(item_b,index_b) in item_g" :type="item_b.type"
                                        :style="item_b.style" @click="onBatchClick(item_b)" :key="'c'+index_b">
                                    {{item_b.text}}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </Card>
                </div>
            </div>

            <!--表格渲染区域-->
            <Table ref="table" border :columns="Table_columns" :data="Table_data" :loading="Table_isLoading"
                   :highlight-row="true"
                   :width="Table_width" @on-selection-change="onTableSelectionChange"
                   @on-sort-change="onTableSortChange"
                   @on-row-dblclick="onTableDoubleClick" :draggable="draggable" @on-drag-drop="onTableDragDrop"
                   :max-height="Table_maxHeight"
            >
            </Table>

            <div class="flex-bottom" ref="page_box">
                <!--分页处理-->
                <Page :total="Page_Info.Page_total" :page-size="Page_Info.Page_size" :current.sync="Page_current"
                      show-elevator
                      v-if="Page_Info.Page_need" show-total :show-sizer="true" :transfer="true"
                      @on-page-size-change="onPageSizeChange"
                      :page-size-opts="Page_Info.Page_size_opts"/>
            </div>

            <Modal :width="80" v-model="Modal_Selection_show" v-if="batchColumns" @on-ok="onModalSelectionOk"
                   :class-name="'TableUI-Selection-Modal'">
                <h3 class="modal-title">请确认对以下数据进行<span>{{Modal_Selection_text}}</span>操作</h3>
                <Table border :columns="Table_selection_columns" :data="Table_selection"
                       :max-height="Table_selection_maxHeight"></Table>
            </Modal>
        </div>
    </tableUIFullScreen>
</template>

<script>
    import bus from '../event-bus.js';
    import mixin_setColumns from './mixin/table-ui-setColumns3.js';
    import mixin_page from '~/common/page-mixin.js';
    import tableUiFullScreen from './compontents/table-ui-full-screen.vue';

    export default {
        mixins: [mixin_setColumns, mixin_page],
        props: {
            //设置表格格式的参数
            'columns': {type: Array, default: null, required: true},
            'batchColumns': {type: Array, default: null},
            //表格渲染数据来源参数
            'list': {type: Array, default: () => ([]), required: true},
            //点击携带参数配置
            'clickArgs': {type: Object, default: null},
            //表格宽度设置
            'width': {type: [Number, String], default: 'auto'},
            //当前loading态设置
            'loading': {type: Boolean, default: false},
            //分页相关设置
            'page': {type: Object, default: null},
            //顶部表头筛选是否显示控制
            'collapse': {type: Boolean, default: true},
            //参数字段转化控制
            'transform': {type: Function, default: null},
            //导出数据控制
            'exportList': {type: Array, default: null},
            //是否可以拖动配置
            'draggable': {type: Boolean, default: false},
            //批量操作配置
            'batchButtons': {type: [Array, Object], default: () => (null)},
            //最高高度设置
            'autoFixHeight': {type: Boolean, default: false},
            //处理高度的时候需要考虑的节点(默认值里面就会考虑NavHead和SelectorUI，在这个defaultHeightDomList控制)
            'fixHeightDomList': {
                type: Array,
                default: () => ([])
            },
            //存储空间名字设置
            'storageName': {type: String, default: ''},
            'isFullScreen': {type: Boolean, default: false}
        },
        components: {
            'tableUIFullScreen': tableUiFullScreen
        },
        data() {
            return {
                // 全屏幕显示弹窗
                fullScreenStatus: false,

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

                //表格在多选情况下的被选择内容
                Table_selection: [],

                Table_maxHeight: '',
                Table_selection_maxHeight: '',

                //表格数据筛选是否隐藏
                Table_collapse_show: true,
                //表格数据删选选择框
                CheckboxGroup_value: [],
                //用于渲染数据选择框
                Checkbox_columns: [],
                columnsOrigin: [],

                //右侧抽屉显示
                Drawer_value: false,

                //分页相关处理
                Page_Info: {
                    Page_need: false,
                    Page_total: 1,
                    Page_size: 1,
                    Page_size_opts: [50,100,150,200],
                },
                Page_current: 1,

                //可视区域高度
                viewHeight: 0,

                //默认的需要考虑高度计算的节点
                defaultHeightDomList: [`[data-ui-name="nav-head"]`, `[data-ui-name="selector-ui"]`],
                //用于储存所有的需要考虑的高度计算节点
                allHeightDomList: [],

                //多选数据确认相关控制
                Modal_Selection_show: false,
                Modal_Selection_text: '',
                Modal_Selection_name: '',

                //route路径名字，用于区分本地存储空间
                routeName: ''
            };
        },
        created: function () {
            //初始化关于可视区域的事件挂在，便于在其他组件中监听
            bus.$on('set-view-height', this.setViewHeight);
            bus.$on('show-drawer', this.onButtonShowDrawer)
        },
        mounted: function () {
            //设置columns相关配置，确定TableUI和Checkbox的渲染格式
            this.Table_columns = this.setColumnsConifg(this.columns);
            this.Checkbox_columns = this.setColumnsConifg(this.columns);
            //更新CheckBox的选择状态，从而完成CheckBox的渲染
            this.setCollapseValue();

            //设置TableUI相关赋值，从而完成TableUI渲染
            this.Table_data = this.list;
            this.Table_isLoading = this.loading;
            this.Table_width = this.width;

            //设置TableUI额外参数相关
            this.Table_clickArgs = this.clickArgs;

            //整个表的宽度控制
            if (this.Table_width) {
                this.Div_width = 'width:' + this.Table_width + 'px';
            }

            //设置分页相关
            if (this.page) {
                this.Page_Info.Page_need = true;
                this.Page_Info.Page_total = Number(this.page.total);
                this.Page_Info.Page_size = Number(this.page.pageSize);
                this.Page_Info.Page_size_opts = this.page.pageSizeOpts;
                this.Page_current = Number(this.page.current);
            }
        },
        methods: {
            //设置可视区域高度
            setViewHeight: function (viewHeight) {
                if (viewHeight) {
                    this.viewHeight = viewHeight;
                } else if (this.viewHeight === 0) {
                    console.error('TableUIPlus的setViewHeight设置参数有误');
                }
                if (this.autoFixHeight === true) {
                    //这个地方需要判断的原因是TableUIPlus是默认引用的，可能未被初始化，没有dom节点
                    if (this.$refs.collapse_box && this.$refs.page_box) {
                        this.$nextTick(() => {
                            if (this.fullScreenStatus) {
                                //全屏的时候，直接使用弹窗的高度
                                this.Table_maxHeight = document.querySelector('.TableUIPlus-Modal-FullScreen').offsetHeight - (this.$refs.collapse_box.offsetHeight + this.$refs.page_box.offsetHeight + 20);
                            } else {
                                //非全屏的时候，需要根据当前参数判断情况
                                this.allHeightDomList = this.defaultHeightDomList.concat(this.fixHeightDomList);
                                let fixHeight = 0;
                                this.allHeightDomList.forEach(function (item) {
                                    if (document.querySelector(item)) {
                                        fixHeight = document.querySelector(item).offsetHeight + fixHeight;
                                    }
                                });

                                this.Table_maxHeight = this.viewHeight - (this.$refs.collapse_box.offsetHeight + this.$refs.page_box.offsetHeight + fixHeight + 20);
                            }
                        });
                    }
                }

                console.log('viewHeight' + viewHeight);
            },
            //更新初始化数据顺序
            setColumnsIndex: function () {
                if (this.columns.length > 0) {
                    this.columns.forEach((item, index) => {
                        this.Table_columns_index[item['key']] = index;
                    });
                }
            },
            //设置数据筛选项相关
            setCollapseValue: function () {
                //获取当前存储空间字段
                this.routeName = this.routePath + '/' + this.storageName;
                this.routeName = this.routeName.split('/');
                this.routeName = this.routeName.join('_');
                this.routeName = 'TableUIPlus' + this.routeName;

                //根据本地参数情况，判断是否需要使用本地存储
                if (window.localStorage[this.routeName] && this.storageName) {
                    this.CheckboxGroup_value = JSON.parse(window.localStorage[this.routeName]);
                } else {
                    this.CheckboxGroup_value = this.checkCheckboxLevel(this.Checkbox_columns);
                }

                this.setColumnsIndex();
                this.onCheckboxChange(this.CheckboxGroup_value);
            },

            //顶部筛选框变化触发
            onCheckboxChange: function (obj) {
                //只有在开启本地存储的情况下，才需要使用本地存储
                if (this.storageName) {
                    window.localStorage[this.routeName] = JSON.stringify(this.CheckboxGroup_value);
                }

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

            //TableUI 点击按钮之后的回调函数传递
            onRowClick(btn, row, index, clickArgs) {
                this.$emit('on-click-ctrl', {btn, row, index, clickArgs});
            },
            //Table被双击之后，选择当前项
            onTableDoubleClick: function (row, index) {
                this.$refs.table.toggleSelect(index);
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
                this.Table_selection = res;
                this.$emit('on-select', res);
            },
            //Table被选择排序之后触发
            onTableSortChange: function (res) {
                this.$emit('on-sort-change', res);
            },

            //批量操作按钮被点击时
            onBatchClick: function (btn,batch = true) {
                //只有需要批量操作的时候才需要有确认处理

                if(btn.hasOwnProperty('checkBatch')  && !btn.checkBatch){
                    batch = false
                }

                if (batch) {
                    // source 没有自定义方法，直接执行批量操作
                    if (this.batchButtons && this.batchColumns) {
                        this.Modal_Selection_show = true;
                        this.Modal_Selection_text = btn.text;
                        this.Modal_Selection_name = btn.name;

                        //在需要确认的内容太多的时候，需要让Table可以滚动，以便在不滚动的时候也能看到继续操作的按钮
                        this.$nextTick(() => {
                            let maxHeight = document.querySelector('.TableUI-Selection-Modal').offsetHeight;
                            //给TableUI-Selection添加限高，避免出现Modal的滚动条
                            this.Table_selection_maxHeight = maxHeight * 0.8 - 130;
                        });

                    } else {
                        alert('参数设置错误：请同时设置校验参数：batchColumns与batchButtons，文档：http://km.oa.com/group/acc/docs/show/187139');
                    }

                } else {
                    let name = btn.name;
                    let btnInfo = {
                        btn: name
                    };
                    // 有自定义方法，直接执行自定义操作
                    this.$emit('on-click-batch', btnInfo)

                }
            },

            //点击确认数据确认
            onModalSelectionOk: function () {
                //传输相关数据输入
                this.$emit('on-click-batch', {btn: this.Modal_Selection_name, selection: this.Table_selection});
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
            },

            //排序修改时候，需要处理对应的排序问题
            onTableDragDrop: function (index1, index2) {
                let temp = [];
                temp = this.Table_data.map((item, index) => {
                    if (index == index1) {
                        return this.Table_data[index2];
                    } else if (index == index2) {
                        return this.Table_data[index1];
                    } else {
                        return item;
                    }
                });
                this.Table_data = temp;

                this.$emit('update:list', temp);
            },

            //当需要显示右侧抽屉的时候处理
            onButtonShowDrawer: function () {
                this.Drawer_value = true;
            },

            onButtonChangeFullScreen: function () {
                this.fullScreenStatus = !this.fullScreenStatus;
                this.setViewHeight();
            },

            //page分页页面改变之后触发
            onPageSizeChange: function (pageSize) {
                let page = {
                    pageSize: pageSize,
                    current: 1,
                    total: this.Page_Info.Page_total
                };
                this.$emit('update:page', page);
                this.$emit('on-page-size-change', page);
            },

        },
        watch: {
            //当检测到了参数data更新之后，及时更新到当前数据内
            list: {
                handler(nv, ov) {
                    let [...data] = nv;
                    this.Table_data = data;
                    this.$nextTick(() => {
                        let dom = this.$refs.table.$el.querySelector('.ivu-table-overflowY');
                        if (dom) {
                            dom.scrollTo(0, 0);
                        }
                    })
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
            },
            collapse: {
                handler(nv) {
                    //设置表格数据筛选是否隐藏
                    this.Table_collapse_show = this.collapse;

                },
                deep: false,
                immediate: true
            },
            batchColumns: {
                handler(nv) {
                    //设置表格数据筛选是否隐藏
                    this.Table_selection_columns = this.setColumnsConifg(nv);
                },
                deep: false,
                immediate: true
            },
            //支持动态配置columns
            columns: {
                handler(nv) {
                    //设置columns相关配置，确定TableUI和Checkbox的渲染格式
                    this.Table_columns = this.setColumnsConifg(nv);
                    this.Checkbox_columns = this.setColumnsConifg(nv);

                    this.setCollapseValue();
                },
                deep: true,
                immediate: false
            }
        }

    };
</script>