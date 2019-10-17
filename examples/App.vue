<template>
    <Layout class="page-box" :style="{padding: '10px 14px'}">
        <Content :style="{padding: '0 8px'}">
            <NavHead title="页面title">
                <p>注意事项1</p>
                <p>注意事项2</p>
                <p>注意事项3</p>
            </NavHead>

            <!--FormUI form表单输入相关组件-->
            <FormUI v-model="FormUI_items"
                    :uiInit="FormUI_init"
                    :uiModal="FormUI_modal"
                    @submit="FormUI_submit">
            </FormUI>

            <SelectorUI v-model="SelectorUI_base_items" :uiInit='SelectorUI_base_init'
                        @select="SelectorUI_base_select"></SelectorUI>

            <TableUIPlus :columns="TableUI_base_config"
                         :list.sync="TableUI_base_list"
                         :loading="TableUI_base_loading"
                         :transform="TableUI_base_transform"
                         @on-click-ctrl="TableUI_base_click"
                         :exportList="TableUI_base_exportList"
                         :page.sync="TableUI_base_page"
                         @on-click-page="TableUI_base_pageClick"
                         @on-page-size-change="TableUI_base_pageClick"
                         :draggable="true"
                         ref="table">
            </TableUIPlus>

        </Content>
    </Layout>
</template>

<script>

    /**
     * 文档地址：
     * 1. TableUI:http://km.oa.com/group/acc/docs/show/187139
     * 2. FormUI:http://km.oa.com/group/acc/docs/show/187042
     * 3. Selector:http://km.oa.com/group/acc/docs/show/190784
     * */

    export default {
        pageAuthor: null,
        pageApiPath: '',
        /** mounted（必要）
         *  组件配置完毕开始执行，可以理解为是页面加载完毕
         * */
        mounted() {

            //页面加载完毕，通常发送一个请求给服务器拿到当前数据
            this.get_index();

            //在分页模式下，如果导出所有数据，需要额外设定数据项
            this.get_export();


        },

        /** methods（必要）
         *  用来存放此组件所需函数的地方，可以理解为放函数的集合
         *  需要使用函数时候，使用 this.funName 的方式就可寻找到
         *  methods这个命名空间不会显示展示出来
         *
         *  以TableUI_ 和 FormUI_ 开头的函数，
         *  是绑定在<TableUI>和<FormUI>上的默认函数或者配套使用的默认函数
         *  不需要的话不用动就好，需要的话在内部写入对应的处理就好
         *
         *  PS: TableUI 可能在一个页面上出现多个，注意一一对应绑定
         * */
        methods: {
            //显示第一个表单
            showForm1: function () {
                this.$set(this.FormUI_items.form1, 'item21', {cp_info: '啦啦啦啦', cp_id: '1234567'});
                // this.$set(this.FormUI_items.form1, 'item20', {
                //     name: "comic/view",
                //     params: {chapter_id: 3, comic_id: 2}
                // });
                this.FormUI_showModal({formId: 'form1', title: '这里是form1，输入需要的数据', maskClosable: false});
            },
            showForm2: function () {
                this.FormUI_showModal({formId: 'form2', title: '这里是form2，输入需要的数据'});
            },

            //这个ajax请求纯粹作为demo展示使用，使用的时候需要自己导入axios来处理请求

            exportTable: function () {
                this.$refs.table.exportCsv();
            },

            ajax: function () {
                return new Promise((resolve) => {
                    resolve(JSON.parse(this.resJSON));
                })
            },

            //获取当日表格的数据
            get_index: function () {
                const self = this;
                self.TableUI_base_loading = true;
                debugger;
                this.ajax({
                    url: '/VersionManage/ChannelManage/index',
                    method: 'post',
                    data: {
                        action: '',
                        channel_category: this.SelectorUI_base_items.channel_category,
                        select_type: this.SelectorUI_base_items.select_type || '',
                        select_value: this.SelectorUI_base_items.select_value || '',
                        channel_state: this.SelectorUI_base_items.channel_state,
                        page_index: this.TableUI_base_page.current,
                        page_size: this.TableUI_base_page.pageSize
                    }
                }).then(function (res) {
                    debugger;
                    self.TableUI_base_loading = false;
                    if (res.data) {
                        self.TableUI_base_list = res.data.list;
                        self.TableUI_base_page.total = res.data.total;
                    } else {
                        self.TableUI_base_list = [];
                    }
                })
            },

            //获取需要导出的数据(当前筛选条件之下)
            get_export: function () {
                const self = this;
                this.ajax({
                    url: '/VersionManage/ChannelManage/export',
                    method: 'post',
                    data: {
                        channel_category: this.SelectorUI_base_items.channel_category,
                        select_type: this.SelectorUI_base_items.select_type || '',
                        select_value: this.SelectorUI_base_items.select_value || '',
                        channel_state: this.SelectorUI_base_items.channel_state,
                    }
                }).then(function (res) {
                    if (res.data) {
                        self.TableUI_base_exportList = res.data.list;
                    } else {
                        self.TableUI_base_exportList = [];
                    }
                })
            },


            //TableUI 点击按钮之后触发的函数
            TableUI_base_click: function (obj) {
                //判断点击的是哪个按钮，具体参数在 TableUI_base_config 设置中
                switch (obj.btn) {
                    case 'xxx': {
                        //do something
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },

            //部分数据可能要进行的数据转化
            TableUI_base_transform: function (obj) {
                switch (obj.key) {
                    case 'tag_info': {
                        return ('test_' + obj.value)
                    }
                    default: {
                        break;
                    }
                }
            },

            //点击分页按钮处理
            TableUI_base_pageClick: function (obj) {
                console.log('当前页码:' + obj);
                this.get_index();
            },

            //FormUI 点击提交表单按钮之后触发的函数
            FormUI_submit: function (res) {
                // 创建动画
                switch (res.id) {
                    case 'form2' : {
                        this.ajax({
                            url: '/operation/tools/animate/content.php',
                            method: 'post',
                            data: {
                                action: 'createAnimate',
                                animation_name: res.form.item1,
                                related_comic: res.form.item2,
                                cover: res.form.item3
                            }
                        }).then(function (res) {
                            console.log(res);
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },

            //FormUI 输入时候选择搜索触发的函数
            FormUI_select: function (res) {

            },

            //FormUI 展示表单弹窗
            FormUI_showModal: function (obj) {

                this.FormUI_modal.showModal = true;
                this.FormUI_modal.showFormId = obj.formId;
                this.FormUI_modal.title = obj.title;
                this.FormUI_modal.prop = obj.prop;

                if (obj.hasOwnProperty('maskClosable')) {
                    this.FormUI_modal.maskClosable = obj.maskClosable;
                }
            },

            //SelectorUI 提交搜索
            SelectorUI_base_select: function (obj) {
                switch (obj.btn.name) {
                    case 'search': {
                        this.get_index();
                        break;
                    }
                    case 'showForm1': {
                        this.showForm1();
                        break;
                    }
                    case 'showForm2': {
                        this.showForm2();
                        break;
                    }
                    case 'export': {
                        this.exportTable();
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        },

        /** data（必要）
         *  用来存放此组件所需数据的地方，可以理解为放数据的集合
         *  需要使用数据时候，使用 this.dataName 的方式就可寻找到
         *  data这个命名空间不会显示展示出来
         *
         *  以TableUI_ 和 FormUI_ 开头的数据，
         *  是绑定在<TableUI>和<FormUI>上的配套数据
         *  PS：TableUI 在一个页面上可能存在多份，注意一一对应绑定
         * */
        data() {
            return {
                //用于判断是否显示弹窗
                show: false,

                //DEMO展示的假数据
                resJSON: `{"status":2,"msg":"","data":{"list":[{"channel_id":0,"channel_category":"第三方电子市场","channel_category_id":"2","channel_name":"谷歌市场（官方）","channel_desc":"谷歌市场（官方）","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":0,"last_modify_time":"2018/09/01 00:00:00","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":1,"channel_category":"第三方电子市场","channel_category_id":"2","channel_name":"应用宝","channel_desc":"应用宝","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":2,"last_modify_time":"2019/01/17 19:40:40","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":2,"channel_category":"第三方电子市场","channel_category_id":"2","channel_name":"安智市场","channel_desc":"安智市场","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":0,"last_modify_time":"2018/09/01 00:00:00","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":3,"channel_category":"第三方电子市场","channel_category_id":"2","channel_name":"豌豆荚/PP","channel_desc":"豌豆荚/PP","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":0,"last_modify_time":"2018/09/01 00:00:00","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":4,"channel_category":"厂商电子市场","channel_category_id":"1","channel_name":"三星","channel_desc":"","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":0,"last_modify_time":"2018/09/01 00:00:00","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":5,"channel_category":"厂商电子市场","channel_category_id":"1","channel_name":"魅族","channel_desc":"","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":0,"last_modify_time":"2018/09/01 00:00:00","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":6,"channel_category":"厂商电子市场","channel_category_id":"1","channel_name":"华为","channel_desc":"","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":2,"last_modify_time":"2019/09/16 15:14:19","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":7,"channel_category":"官网","channel_category_id":"3","channel_name":"Pc","channel_desc":"PC官网","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":0,"last_modify_time":"2018/09/01 00:00:00","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":8,"channel_category":"厂商电子市场","channel_category_id":"1","channel_name":"联想","channel_desc":"","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":0,"last_modify_time":"2018/09/01 00:00:00","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}},{"channel_id":9,"channel_category":"第三方电子市场","channel_category_id":"2","channel_name":"移动MM","channel_desc":"移动MM","channel_state":"常规有效","channel_state_id":"2","creator":"","gray_channel_flag":0,"last_modify_time":"2019/09/01 00:03:14","action_bar":{"edit":{"type":"primary","label_name":"编辑","icon":"ios-create-outline"}}}],"total":"197"}}`,

                //基础（base）表格初始化
                TableUI_base_config: [
                    {type: 'selection', width: 60, align: 'center', title: '序号'},
                    {'title': '渠道ID', 'key': 'channel_id', sortable: true},
                    {'title': '渠道类型', 'key': 'channel_category'},
                    {'title': '渠道名称', 'key': 'channel_name'},
                    {'title': '渠道描述', 'key': 'channel_desc', level: 3},
                    {'title': '渠道状态', 'key': 'channel_state'},
                    {'title': '更新时间', 'key': 'last_modify_time'},

                    // {
                    //     'title': '操作',
                    //     key: 'action_bar',
                    //     UI: {
                    //         type: 'buttonGroup',
                    //         list: [
                    //             {
                    //                 btnText: 'lalall',
                    //                 name: 'edit',
                    //                 key: {
                    //                     name: 'edit',
                    //                     type: 'type',
                    //                     icon: 'icon',
                    //                     isHidden: 'is_show',
                    //                     btnText: 'label_name'
                    //                 }
                    //             }
                    //         ]
                    //     }
                    // },
                    {
                        'title': '操作2',
                        key: 'action_bar',
                        UI: {
                            type: 'dropDown',
                            btnText: '下拉菜单22',
                            btnType: 'primary',
                            list: [
                                {
                                    btnText: 'down1',
                                    name: 'name1',
                                    isHidden: 'edit'
                                },
                                {
                                    btnText: 'down2',
                                    name: 'name2',
                                    isHidden: 'edit2'
                                },
                                {
                                    btnText: 'down3',
                                    name: 'name3',
                                    isHidden: 'edit'
                                }
                            ]
                        }

                    }
                ],
                TableUI_base_list: [],
                TableUI_base_loading: true,
                TableUI_base_page: {
                    total: 10,
                    pageSize: 10,
                    current: 1
                },
                TableUI_base_exportList: [],

                //基础（base）表格的选择器初始化
                SelectorUI_base_items: {
                    channel_category: '99',
                    channel_state: '2'
                },
                SelectorUI_base_init: {
                    channel_category: {
                        type: 'select',
                        label: '渠道类型选择',
                        init: [
                            {
                                value: '1',
                                label: '厂商电子市场'
                            },
                            {
                                value: '2',
                                label: '第三方电子市场'
                            },
                            {
                                value: '3',
                                label: '官网'
                            },
                            {
                                value: '4',
                                label: '合作&运营'
                            },
                            {
                                value: '5',
                                label: '投放'
                            },
                            {
                                value: '6',
                                label: '其他'
                            },
                            {
                                value: '99',
                                label: '全部'
                            }
                        ],
                        drawer: true
                    },
                    select_type: {
                        type: 'select',
                        label: '渠道ID/渠道名称',
                        init: [
                            {
                                value: '1',
                                label: '渠道ID'
                            },
                            {
                                value: '2',
                                label: '渠道名称'
                            }
                        ],
                        drawer: true
                    },
                    select_value: {
                        type: 'search',
                        label: '筛选条件',
                        init: '输入搜索字段',
                        drawer: true
                    },
                    channel_state: {
                        type: 'select',
                        label: '渠道状态选择',
                        init: [
                            {
                                value: '1',
                                label: '常规无效'
                            },
                            {
                                value: '2',
                                label: '常规有效'
                            },
                            {
                                value: '3',
                                label: '临时新增'
                            }
                        ]
                    },
                    btn1: {
                        type: 'button',
                        label: '搜索',
                        init: {
                            type: 'primary',
                            name: 'search',
                            btnText: '搜索'
                        }
                    },
                    btn2: {
                        type: 'button',
                        label: '操作',
                        init: {
                            type: 'primary',
                            name: 'showForm1',
                            btnText: '显示表单U1'
                        }
                    },
                    btn3: {
                        type: 'button',
                        label: '操作',
                        init: {
                            type: 'primary',
                            name: 'showForm2',
                            btnText: '显示表单U2'
                        }
                    },
                    btn4: {
                        type: 'button',
                        label: '操作',
                        init: {
                            type: 'primary',
                            name: 'export',
                            btnText: '导出数据'
                        }
                    }
                },

                //FromUI 的弹窗相关参数控制(通常不需要修改)
                FormUI_modal: {
                    showModal: false,
                    showFormId: '',
                    formId: '',
                    title: '',
                    okText: '',                 //此值为空的时候，默认显示提交表单
                    cancelText: '',              //此值为空的时候，默认显示关闭弹窗
                    prop: ''                    //用来传递额外参数
                },
                //FromUI 的用户数据部分，即用户在页面上的输入会保存在此（改变这里的数据，UI也会对应变化，不推荐）
                FormUI_items: {},
                //FromUI 的初始化部分，可以通过修改此配置项来控制form表单的格式和内容（里面的demo基本涵盖了所有情况，不要的就删了就行）
                FormUI_init: {
                    form1: {
                        title: '第一个表单',
                        formId: 'form1',
                        init: {
                            item1: {
                                type: 'input',
                                label: '文本输入框',
                                init: '初始字段1'
                            },
                            item2: {
                                type: 'disabled',
                                label: '文本输入框',
                                init: '初始字段2'
                            },
                            item3: {
                                type: 'search',
                                label: '搜索框1',
                                init: '初始字段3'
                            },
                            item4: {
                                type: 'search',
                                label: '搜索框2',
                                init: '初始字段4'
                            },
                            item5: {
                                type: 'select',
                                label: '选择器1',
                                init: [
                                    {
                                        value: 'beijing',
                                        label: '北京'
                                    },
                                    {
                                        value: 'shanghai',
                                        label: '上海'
                                    },
                                    {
                                        value: 'hangzhou',
                                        label: '杭州'
                                    }
                                ]
                            },
                            item6: {
                                type: 'select',
                                label: '选择器2',
                                init: [
                                    {
                                        value: 'beijing',
                                        label: '北京'
                                    },
                                    {
                                        value: 'shanghai',
                                        label: '上海'
                                    },
                                    {
                                        value: 'hangzhou',
                                        label: '杭州'
                                    }
                                ]
                            },
                            item7: {
                                type: 'switch',
                                label: '开关',
                                init: {
                                    openValue: 1,
                                    closeValue: 0
                                }
                            },
                            item8: {
                                type: 'radio',
                                label: '单选框',
                                init: [
                                    {
                                        value: 'Male',
                                        label: '男'
                                    },
                                    {
                                        value: 'Female',
                                        label: '女'
                                    }
                                ]
                            },
                            item9: {
                                type: 'checkbox',
                                label: '多选框',
                                init: [
                                    {
                                        value: 'sleep',
                                        label: '睡'
                                    },
                                    {
                                        value: 'eat',
                                        label: '吃'
                                    },
                                    {
                                        value: 'run',
                                        label: '跑'
                                    },
                                    {
                                        value: 'movie',
                                        label: '电影'
                                    }
                                ]
                            },
                            item10: {
                                type: 'textarea',
                                label: '文本输入区域',
                                init: {
                                    minRows: 2,
                                    maxRows: 5,
                                    label: '提示文案'
                                }
                            },
                            item11: {
                                type: 'cascader',
                                label: '级联选择器',
                                init: [
                                    {
                                        value: 'beijing',
                                        label: '北京',
                                        children: [
                                            {
                                                value: 'gugong',
                                                label: '故宫'
                                            },
                                            {
                                                value: 'tiantan',
                                                label: '天坛'
                                            },
                                            {
                                                value: 'wangfujing',
                                                label: '王府井'
                                            }
                                        ]
                                    },
                                    {
                                        value: 'jiangsu',
                                        label: '江苏',
                                        children: [
                                            {
                                                value: 'nanjing',
                                                label: '南京',
                                                children: [
                                                    {
                                                        value: 'fuzimiao',
                                                        label: '夫子庙',
                                                    }
                                                ]
                                            },
                                            {
                                                value: 'suzhou',
                                                label: '苏州',
                                                children: [
                                                    {
                                                        value: 'zhuozhengyuan',
                                                        label: '拙政园',
                                                    },
                                                    {
                                                        value: 'shizilin',
                                                        label: '狮子林',
                                                    }
                                                ]
                                            }
                                        ],
                                    }
                                ]
                            },
                            item12: {
                                type: 'picUploader',
                                label: '图片上传',
                                init: {
                                    width: 240,         //图片宽度 Number
                                    height: 226,        //图片高度 Number
                                    scale: 0.5          //缩放大小 Number
                                }
                            },
                            item15: {
                                type: 'datePicker',
                                label: '时间选择器',
                                init: {
                                    label: '请选择时间'
                                }
                            },
                            item18: {
                                type: 'ugcUploader',
                                label: '腾讯云视频'
                            },
                            item19: {
                                type: 'file',
                                label: '上传普通文件'
                            },
                            item20: {
                                type: 'actionSelector',
                                label: '上传action',
                                title: '',
                                open: true
                            },
                            item21: {
                                type: 'autoComplete',
                                label: '自动填充',
                                init: {
                                    data: [],
                                    label: '在此输入，自动填充',
                                    show: 'cp_info'
                                }
                            },
                            item22: {
                                type: 'importUploader',
                                label: '导入文件',
                            },
                            item23: {
                                type: 'imgUploader',
                                label: '上传图片'
                            },
                            item24: {
                                type: 'comicSelector',
                                label: '选择漫画',
                                singleSelect: true
                            },
                            item25: {
                                type: 'number',
                                label: '数字',
                                init: 'number',
                                disabled: false
                            },
                            config_content: {
                                type: 'business_keyList',
                                label: '配置参数设置',
                                init: {}
                            }
                        }
                    },
                    form2: {
                        title: '第二个表单',
                        formId: 'form2',
                        init: {
                            config_content: {
                                type: 'business_keyList',
                                label: '配置参数设置',
                                init: {}
                            },
                            item24: {
                                type: 'comicSelector',
                                label: '选择漫画',
                                singleSelect: true
                            },
                        }
                    }
                },

                hightlightcode: `       <SelectorUI v-model="SelectorUI_base_items" :uiInit='SelectorUI_base_init'
                        @select="SelectorUI_base_select"></SelectorUI>`
            }
        },

        /**
         * watch(非必须，推荐)
         * 用来监听 data 内部数据变化的地方（比如表单输入导致的数据变化）
         * 非必须部分，保留可以更方便的观察数据变化
         * */
        watch: {
            //监听form表单数据变化，为了方便检测前端输入，和业务逻辑没有关系，不需要可以删除
            FormUI_items: {
                handler(nv) {
                    // console.clear();
                    let obj = Object.assign({}, nv);
                    //新的数据
                    console.log('当前Form表单数据:');
                    console.log(obj);
                },
                deep: true,
                immediate: false
            },

            TableUI_base_list: {
                handler(nv) {
                    let obj = Object.assign({}, nv);
                    //新的数据
                    console.log('当前TableBase数据:');
                    console.log(obj);
                },
                deep: true,
                immediate: false
            },
            SelectorUI_base_items: {
                handler(nv) {
                    // console.clear();
                    let obj = Object.assign({}, nv);
                    //新的数据
                    console.log('当前SelectorUI_base_items数据:');
                    console.log(obj);
                },
                deep: true,
                immediate: false
            },

            'FormUI_items.form1.item21': {
                handler(nv) {
                    let self = this;
                },
                deep: true,
                immediate: false
            },
        }
    };
</script>

<style lang="scss" scoped>
    /*如果需要，在这里写入这个页面的css*/
    .example-code {
        border-radius: 5px;
        border: 1px solid #eeeeee;
        margin: 10px 0;
    }

    .example-code code {
        padding: 0 20px;
    }

    /deep/
    .img-cover {
        display: block;
        width: 200px;
        height: auto;
    }

    /*布局相关控制*/
    .page-box {
        min-height: 100% !important;
        .ivu-layout-content {
            height: 100% !important;
        }
        .page-Demo {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            .demo-layTop {
                height: 40px;
                flex: none;
            }
            .demo-layDown {
                flex: auto;
                overflow: scroll;
            }
        }
    }


</style>