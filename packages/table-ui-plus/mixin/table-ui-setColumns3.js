import TableUIImgPreView from '../compontents/table-ui-imgPreView.vue';
import TableUIImgView from '../compontents/table-ui-imgView.vue';
import TableUIButton from '../compontents/table-ui-button.vue';
import TableUIButtonGroup from '../compontents/table-ui-buttonGroup.vue';
import TableUITime from '../compontents/table-ui-time.vue';

import TableUILink from '../compontents/table-ui-link.vue';
import TableUIDom from '../compontents/table-ui-dom.vue';
import TableUIDropDown from '../compontents/table-ui-dropDown.vue';
import TableUISpan from '../compontents/table-ui-span.vue'
import TableUITags from '../compontents/table-ui-tags.vue'

export default {
    components: {
        TableUIImgPreView,
        TableUIImgView,
        TableUIButtonGroup,
        TableUITime,
        TableUILink,
        TableUIDom,
        TableUIDropDown,
        TableUISpan,
        TableUITags,
        TableUIButton
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
                            item.level = 2;                     //m--如果没有写level，默认为重要数据，默认展示，手动隐藏
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
                                case 'img': {
                                    return h(TableUIImgView, {
                                            props: {
                                                src: value,
                                                className: UI['class']
                                            }
                                        }
                                    )
                                }
                                case 'time': {
                                    console.log('debugger--time');
                                    return h(TableUITime, {
                                        props: Object.assign({
                                            time: value,
                                            unit: UI['unit'],
                                            needBr: UI['needBr']
                                        })
                                    });
                                }
                                case 'link': {
                                    return h(TableUILink, {
                                        props: Object.assign({
                                            UI: {
                                                text: UI['text'] ? UI['text'] : value,
                                                prefHref: UI['preHref'] ? UI['preHref'] : '',
                                                needTransform: UI.needTransform  // UI--内容是否需要转换
                                            },
                                            setKey: key,                    // 该字段的key
                                            setTransform: self.transform,   // 传递"值"的转化函数
                                            setParams: params,              // 传递'行'的各key和value
                                        })
                                    });

                                }
                                case 'button': {
                                    if (value && key) {
                                        //按钮
                                        return h(TableUIButton, {
                                            props: {
                                                config: UI,
                                                button: value
                                            },
                                            on: {
                                                click: (name) => {
                                                    self.onRowClick(name, params.row, params.index, self.Table_clickArgs)
                                                }
                                            }
                                        });

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
                                case 'tags': {
                                    if (value && value.length > 0) {
                                        return h(TableUITags, Object.assign({
                                                props: {
                                                    info: value,                  // 该字段的value
                                                    UI: {
                                                        needTransform: UI.needTransform  // UI--内容是否需要转换
                                                    },
                                                    setKey: key,                  // 该字段的key
                                                    setTransform: self.transform, // 传递"值"的转化函数
                                                    setParams: params             // 传递'行'的各key和value
                                                }
                                            })
                                        )
                                    } else {
                                        break;
                                    }
                                }

                                //需要额外处理的字符串
                                case 'span': {
                                    if (value) {
                                        return h(TableUISpan, Object.assign({
                                                props: {
                                                    UI: {
                                                        style: UI.style,                 // UI--判断是否由后台配置特殊样式
                                                        text: UI.text,                   // UI--内容类型
                                                        type: UI.type,                   // UI--格式类型
                                                        minWidth: UI.minWidth || 150,    // UI--低于此宽度添加缩略样式 ，默认150
                                                        maxHeight: UI.maxHeight || 0,
                                                        needTransform: UI.needTransform  // UI--内容是否需要转换
                                                    },
                                                    styleInfo: {                     // 后台参数
                                                        style: value.style || '',           // 后台参数--样式配置
                                                        text: value.text,             // 后台参数--文字信息
                                                        value: value                  // 后台参数--文字信息（当文字不需要从子字段额外读取时直接赋值）
                                                    },
                                                    setKey: key,                    // 该字段的key
                                                    setTransform: self.transform,   // 传递"值"的转化函数
                                                    setParams: params,              // 传递'行'的各key和value
                                                },

                                            })
                                        )
                                    } else {
                                        return h(TableUISpan, Object.assign({
                                                props: {
                                                    UI: {
                                                        style: UI.style,                 // UI--判断是否由后台配置特殊样式
                                                        text: UI.text,                   // UI--内容类型
                                                        type: UI.type,                   // UI--格式类型
                                                        minWidth: UI.minWidth || 150,    // UI--低于此宽度添加缩略样式 ，默认150
                                                        needTransform: UI.needTransform  // UI--内容是否需要转换
                                                    },
                                                    setKey: key,                    // 该字段的key
                                                    setTransform: self.transform,   // 传递"值"的转化函数
                                                    setParams: params,              // 传递'行'的各key和value
                                                },

                                            })
                                        )
                                    }

                                }

                                //下拉按钮
                                case 'dropDown': {
                                    if (value && key) {
                                        return h(TableUIDropDown, Object.assign({
                                            props: {
                                                UI: {
                                                    list: UI.list,                   // UI-- 下拉列表参数
                                                    btnText: UI.btnText || '下拉菜单', // UI-- 按钮名称
                                                    btnType: UI.btnType,             // UI-- 按钮样式类型
                                                    iconType: UI.type || 'default',  // UI-- icon 图标
                                                },
                                                button: value
                                            },
                                            on: {
                                                'on-click': (name) => {
                                                    self.onRowClick(name, params.row, params.index, self.Table_clickArgs);
                                                }
                                            }
                                        }))
                                    }
                                    break;
                                }

                                //---mo
                                case 'dom': {
                                    return h(TableUIDom, {
                                            props: {
                                                UI: {
                                                    data_name: UI['name'] ? UI['name'] : 'table-ui-dom',
                                                },
                                                data_value: value
                                            }
                                        }
                                    )

                                }
                                //图片预览
                                case 'imgPreView': {
                                    return h(TableUIImgPreView, {
                                        props: {
                                            imgPreView: value,
                                        }
                                    });
                                }

                                case 'topicContent': {
                                    return self.$loadTableUIComponents(h, {
                                        type: item.UI.type,
                                        value,
                                        UI
                                    });
                                }

                                default: {
                                    return self.$loadTableUIComponents(h, {
                                        type: item.UI.type,
                                        value,
                                        UI
                                    });
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