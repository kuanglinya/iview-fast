//通用的架构性组件
import TableUIPlus from './table-ui-plus/table-ui-plus5.vue';
import FormUI from './form-ui/form-ui3.vue';
import SelectorUI from './selector-ui/selector-ui2.vue';
import NavHead from './nav-head.vue';

//工具类组件对外提供(后期
import TableUIFullScreen from './table-ui-plus/compontents/table-ui-full-screen.vue';
import TableOverflowHidden from "./table-ui-plus/compontents/table-ui-overflowHidden.vue";
import TagsInput from './form-ui/components/tagsInput.vue';
import DatePicker2 from './form-ui/components/datePicker2.vue';
import imgUploader from './form-ui/components/imgUploader.vue';


//TableUI的render渲染函数对外提供，让普通的TableUI也可以直接使用配置
import setColumns from './table-ui-plus/mixin/table-ui-setColumns3.js';

export default {
    install: function (Vue, iVIewFastLoader) {
        //组件库的基础导入
        Vue.mixin({
            components: {
                TableUIPlus,
                FormUI,
                SelectorUI,
                NavHead,

                TableUIFullScreen,
                TableOverflowHidden,
                TagsInput,
                DatePicker2,
                imgUploader
            }
        });

        //获取对应组件的Loader
        function getLoader(loader, type) {
            if (iVIewFastLoader && (loader === 'TableUI' || loader === 'FormUI')) {
                let loaderName = loader + 'Loader';
                //找到匹配的loader并且返回
                if (iVIewFastLoader[loaderName] && Array.isArray(iVIewFastLoader[loaderName])) {
                    return iVIewFastLoader[loaderName].find(function (element) {
                        return (element.type === type && element.components);
                    });
                }
            } else {
                return false;
            }
        }

        //TableUI的自有组件加载
        Vue.prototype.$loadTableUIComponents = function (createElement, {type, value, UI}) {
            let loader = getLoader('TableUI', type);
            if (loader) {
                if (loader.type && loader.components) {

                    // Vue.component(loader.type, loader.components);

                    //TableUI的子组件只做渲染显示用，所以不会处理双向绑定问题
                    return createElement(loader.components, {
                        props: typeof loader.props === 'function' ? loader.props({value, UI}) : {},
                    });

                } else {
                    console.warn('TableUI的初始化Loader配置项不能缺少type或者components');
                }
            }
        };

        //FormUI的自由组件加载
        Vue.prototype.$loadFormUIComponents = function (createElement, $attrs) {
            let self = this;

            let loader = getLoader('FormUI', $attrs.type);

            if (loader) {
                if (loader.type && loader.components) {

                    // Vue.component(loader.type, loader.components);

                    //FormUI的子组件需要处理v-model问题，所以需要在render模式下自行处理数据向上传递
                    return createElement(loader.components, {
                        props: typeof loader.props === 'function' ? loader.props($attrs.init) : {},
                        on: {
                            update: function (nv) {
                                self.$emit('update', nv, $attrs.index, $attrs.indexItem);
                            }
                        }
                    });
                } else {
                    console.warn('FormUI的初始化Loader配置项不能缺少type或者components');
                }
            }

        };

        //TableUI的render渲染模式对外导出
        Vue.prototype.$setTableUIColumnsConifg = setColumns.methods.setColumnsConifg;


    }

}