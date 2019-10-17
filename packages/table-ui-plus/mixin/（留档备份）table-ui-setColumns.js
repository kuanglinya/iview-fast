import TableUIImgPreView from '~/components/table-ui-base/compontents/table-ui-imgPreView.vue';
import TableUIImgView from '~/components/table-ui-base/compontents/table-ui-imgView.vue';
import TableUIActionView from '~/components/table-ui-base/compontents/table-ui-actionView.vue';
import TableUITopicContent from '~/components/table-ui-base/compontents/table-ui-topicContent.vue';
import TableUIButtonGroup from '~/components/table-ui-base/compontents/table-ui-buttonGroup.vue';
import TableUITime from '~/components/table-ui-base/compontents/table-ui-time.vue';


export default {
    components: {
        TableUIImgPreView,
        TableUIActionView,
        TableUIImgView,
        TableUITopicContent,
        TableUIButtonGroup,
        TableUITime
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
                        //设置渲染函数

                        item.render = function (h, params) {
                            let value = params.row[key];

                            switch (item.UI.type) {
                                //图片
                                case 'img': {
                                    return h(TableUIImgView, {
                                            props: {
                                                src: value,
                                                className: UI['class']
                                            }
                                        }
                                    )
                                }
                                //时间显示器（时间戳转本地时间显示）
                                case 'time': {
                                    return h(TableUITime, {
                                        props: Object.assign({
                                            time: value,
                                            unit: UI['unit'],
                                            needBr: UI['needBr']
                                        })
                                    });
                                }
                                //链接类型
                                case 'link': {
                                    //链接显示的文案，如果没有设置文案使用当前value
                                    let text = UI['text'] ? UI['text'] : value;
                                    //是否需要前置地址，如果有前置地址，会加在地址前方
                                    let preHref = UI['preHref'] ? UI['preHref'] : '';

                                    let linkValue = value;
                                    if (UI.needTransform && self.transform) {
                                        //如果需要转换，从外部转换过来再次赋值

                                        linkValue = self.transform({
                                            key: key,
                                            value: value
                                        }, params.row);
                                    }

                                    return h(
                                        'a',
                                        {
                                            attrs: {
                                                href: preHref + linkValue,
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
                                case 'buttonGroupOld': {
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
                                case 'buttonGroup': {
                                    return h(TableUIButtonGroup, {
                                        props: {
                                            vertical: UI.vertical,
                                            list: UI.list,
                                            buttons: value
                                        },
                                        on: {
                                            click: (name) => {
                                                self.onRowClick(name, params.row, params.index, self.Table_clickArgs)
                                            }
                                        }
                                    });
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

                                    //判断文字是否需要转化
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
                                        }
                                    }
                                }
                                //特殊dom节点，用于需要手动控制html的时候
                                case 'dom': {
                                    let name = UI['name'] ? UI['name'] : 'table-ui-dom';
                                    return h('div', {
                                        attrs: {
                                            'data-name': name,
                                            'data-value': value
                                        }
                                    });
                                }
                                //图片预览
                                case 'imgPreView': {
                                    return h(TableUIImgPreView, {
                                        props: {
                                            imgPreView: value,
                                        }
                                    });
                                }
                                //action配置预览
                                case 'action': {
                                    return h(TableUIActionView, {
                                        props: {
                                            actionJson: value || "{}",
                                        }
                                    });
                                }
                                //话题内容
                                case 'topicContent': {
                                    return h(TableUITopicContent, {
                                        props: {
                                            text: value[UI.text] || value.content || "",
                                            imgList: value[UI.imgList] || value.imgList || [],
                                            vid: value[UI.vid] || value.vid || ''
                                        }
                                    });
                                }
                                default: {
                                    console.warn('TableUIPlus,数据结构没有匹配类型');
                                }
                            }
                        };

                        //设置默认宽度
                        item.minWidth = (() => {
                            //只有当没有预设最小宽度的时候才添加最小宽度
                            if (!item.minWidth) {
                                switch (item.UI.type) {
                                    case 'imgPreView': {
                                        return 100;
                                    }
                                    case 'action': {
                                        return 100
                                    }
                                }
                            } else {
                                return item.minWidth;
                            }

                        })();
                    }
                });

                return columnsTemp;
            } else {
                return [];
            }

        },
    }
}