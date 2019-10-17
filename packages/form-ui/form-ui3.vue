<style lang="scss">
    .modal-scroll {
        .ivu-modal {
            height: calc(100% - 200px);
            overflow: scroll;
            &::-webkit-scrollbar-corner {
                display: none;
            }
        }
    }
</style>

<template>
    <Modal v-model="FormUI_modal.showModal" :title="FormUI_modal.title"
           :ok-text="FormUI_modal.okText?FormUI_modal.okText:'提交表单'"
           :cancel-text="FormUI_modal.cancelText?FormUI_modal.cancelText:'关闭弹窗'" :transfer="true"
           @on-ok="formModalOnOk"
           @on-cancel="formModalOnCancel" :loading="FormUI_modal.loading"
           :mask-closable="FormUI_modal.maskClosable" :class-name="FormUI_modal.needScroll?'modal-scroll':''"
           :width="FormUI_modal.width">
        <div class="page-editDemo-form">
            <!--循环formInit用来初始化整个表单内容，此表单默认为多个form和多个formItem的组合-->
            <Form :model="FormUI_items" v-for="(item,index) in FormUI_init"
                  :label-width="(FormUI_modal.labelWidth||100)"
                  :key="index" v-if="FormUI_modal.showFormId == item.formId" :style="{'word-break': 'break-all'}">

                <FormItem :label="initItem.label" v-for="(initItem , indexItem) in item.init"
                          :key="index+'_'+indexItem" :prop="index+'.'+indexItem"
                          :rules="initItem.rule">

                    <!--单纯的字符串-->
                    <strong style="word-break: break-all;" v-if="initItem.type=='text'">{{FormUI_items[index][indexItem]}}</strong>

                    <!--文本输入框-->
                    <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='input'"
                           :placeholder="initItem.init" :disabled="initItem.isDisabled"/>

                    <!--数字输入-->
                    <numberInput v-if="initItem.type=='number'"
                                 v-model="FormUI_items[index][indexItem]"
                                 :disabled="initItem.isDisabled"
                                 :placeholder="initItem.init.placeholder"
                                 :max="initItem.init.max"
                                 :min="initItem.init.min"
                                 :step="initItem.init.step"
                                 :defaultValue="initItem.init.defaultValue"
                                 :editable="initItem.init.editable"
                    ></numberInput>

                    <!--屏蔽类型的文本输入框-->
                    <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='disabled'" disabled/>

                    <!--搜索框类型-->
                    <Input search enter-button v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='search'"
                           :placeholder="initItem.init" :disabled="initItem.isDisabled"/>

                    <!--密码类型-->
                    <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='password'" type="password"
                           :placeholder="initItem.init" :disabled="initItem.isDisabled"
                           icon="ios-eye-off-outline"/>

                    <!--选择器类型-->
                    <Select v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='select'"
                            :placeholder="FormUI_items[index][indexItem+'_label']" :disabled="initItem.isDisabled"
                            :clearable='initItem.clearable' :multiple="initItem.multiple"
                            :filterable="initItem.filterable">
                        <Option :value="domItem.value" v-for="(domItem,domIndex) in initItem.init"
                                :key="index+'_'+indexItem+'_'+domIndex">{{domItem.label}}
                        </Option>
                    </Select>

                    <!--开关-->
                    <i-switch v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='switch'"
                              :true-value="initItem.init.openValue" :false-value="initItem.init.closeValue"
                              :disabled="initItem.isDisabled" size="large">
                        <span slot="open">{{initItem.init.openText?initItem.init.openText:'开'}}</span>
                        <span slot="close">{{initItem.init.closeText?initItem.init.closeText:'关'}}</span>
                    </i-switch>

                    <!--单选框-->
                    <RadioGroup v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='radio'">
                        <Radio :label="domItem.value" v-for="(domItem,domIndex) in initItem.init"
                               :disabled="initItem.isDisabled"
                               :key="index+'_'+indexItem+'_'+domIndex">{{domItem.label}}
                        </Radio>
                    </RadioGroup>

                    <!--多选框-->
                    <CheckboxGroup v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='checkbox'">
                        <Checkbox :label="domItem.value" v-for="(domItem,domIndex) in initItem.init"
                                  :key="index+'_'+indexItem+'_'+domIndex" :disabled='domItem.isDisabled'>
                            {{domItem.label}}
                        </Checkbox>
                    </CheckboxGroup>

                    <!--文本输入区域-->
                    <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='textarea'" type="textarea"
                           :autosize="initItem.init"
                           :placeholder="initItem.placeholder" :disabled="initItem.isDisabled"/>

                    <!--级联选择器-->
                    <Cascader :data="initItem.init" v-model="FormUI_items[index][indexItem]"
                              v-if="initItem.type=='cascader'"></Cascader>

                    <!--图片上传-->
                    <picUploader :payload="initItem.init" v-model="FormUI_items[index][indexItem]"
                                 v-if="initItem.type=='picUploader'"></picUploader>

                    <!--图片上传弱限制版-->
                    <imgUploader v-model="FormUI_items[index][indexItem]"
                                 v-if="initItem.type=='imgUploader'" :limit-width="initItem.imgLimitWidth"
                                 :limit-height="initItem.imgLimitHeight"></imgUploader>

                    <!--单个按钮类型-->
                    <Button :type="initItem.init.type" :class="initItem.init.className" :id="initItem.init.id"
                            v-if="initItem.type=='button'"
                            @click="formButtonClick(initItem.init)">
                        {{initItem.init.label}}
                    </Button>

                    <!--时间选择器,重新复写，强制只传递时间戳参数-->
                    <DatePicker2 :placeholder="initItem.init.label||initItem.init" :unit="initItem.init.unit"
                                 v-model="FormUI_items[index][indexItem]"
                                 v-if="initItem.type=='datePicker'"></DatePicker2>

                    <!--多个按钮组合类型-->
                    <ButtonGroup v-if="initItem.type=='buttonGround'">
                        <Button :type="buttonItem.type" :class="buttonItem.className" :id="buttonItem.id"
                                @click="formButtonClick(buttonItem)" v-for="(buttonItem,buttonIndex) in initItem.init"
                                :key="index+'_'+indexItem+'_'+buttonIndex"
                                style="margin-right: 8px;">
                            {{buttonItem.label}}
                        </Button>
                    </ButtonGroup>

                    <!--单纯上传文件-->
                    <input type="file" v-if="initItem.type=='file'" @change="processFile($event,index,indexItem)"/>

                    <!--导入型文件上传 Excel，txt，PDF支持，详细对接人：jadenzhang-->
                    <importUploader v-if="initItem.type=='importUploader'" :text="initItem.init"
                                    v-model="FormUI_items[index][indexItem]" :url="initItem.url"
                                    :list.sync="initItem.list">
                    </importUploader>

                    <!--标签输入框-->
                    <tagsInput v-if="initItem.type=='tagsInput'" :placeholder="initItem.init"
                               v-model="FormUI_items[index][indexItem]">
                    </tagsInput>

                    <!--时长选择器-->
                    <TimePicker v-if="initItem.type=='timePicker'" type="time" v-model="FormUI_items[index][indexItem]"
                                :placeholder="initItem.init" confirm :disabled="initItem.disabled"></TimePicker>

                    <!--标签-->
                    <div v-if="initItem.type=='tag'" :class="initItem.class">
                        <Tag v-model="FormUI_items[index][indexItem]" v-for="(domItem, domIndex) in initItem.init"
                             :key="index+'_'+indexItem+'_'+domIndex">{{domItem.label}}
                        </Tag>
                    </div>

                    <!--自动填充-->
                    <AutoComplete2 v-if="initItem.type=='autoComplete'"
                                   v-model="FormUI_items[index][indexItem]" :placeholder="initItem.init.label"
                                   :data="initItem.init.data" :disabled="initItem.disabled" :show="initItem.init.show"
                    ></AutoComplete2>

                    <!--action选择器-->
                    <!--<actionSelector v-if="initItem.type=='actionSelector'" v-model="FormUI_items[index][indexItem]"-->
                    <!--:title="initItem.title" :open="initItem.open">-->
                    <!--</actionSelector>-->

                    <!--keyList配置器 此配置有非常强的业务耦合，只适合于特殊业务-->
                    <!--<KeyList v-if="initItem.type=='business_keyList'"-->
                    <!--v-model="FormUI_items[index][indexItem]"></KeyList>-->

                    <!--ComicSelector漫画选择器，用来筛选漫画-->
                    <!--<ComicSelector v-if="initItem.type=='comicSelector'"-->
                    <!--v-model="FormUI_items[index][indexItem]"-->
                    <!--:singleSelect="initItem.singleSelect"></ComicSelector>-->

                    <FormUIBusiness :type="initItem.type" :allData="FormUI_items[index][indexItem]"
                                    :index="index"
                                    :indexItem="indexItem"
                                    :init="initItem" @update="updateBusiness"></FormUIBusiness>
                </FormItem>
            </Form>
        </div>
    </Modal>
</template>

<script>
    //组件，需要单独引用
    import picUploader from './components/picUploader.vue';
    import importUploader from './components/importUploader.vue';
    import tagsInput from './components/tagsInput.vue';
    import DatePicker2 from './components/datePicker2.vue';
    import AutoComplete2 from './components/autoComplete2.vue';
    import imgUploader from './components/imgUploader.vue';
    import numberInput from './components/numberInput.vue';


    export default {
        components: {
            picUploader,
            importUploader,
            tagsInput,
            DatePicker2,
            AutoComplete2,
            imgUploader,
            numberInput,
            FormUIBusiness: {
                render: function (createElement) {
                    let $attrs = this.$attrs;
                    return this.$loadFormUIComponents(createElement, $attrs);
                }
            }
        },
        props: {

            'uiInit': {type: Object, default: () => ({})},
            'uiModal': {type: Object, default: () => ({})},
            'FormUI_items': {type: Object, default: () => ({})},
            'uiLoading': {type: Boolean, default: false}
        },
        data() {
            return {
                //此项为Form表单数据的初始化，可以通过修改此配置项来控制form表单的格式和内容
                FormUI_init: {},
                //用来控制显示modal相关
                FormUI_modal: {},
            };
        },
        model: {
            prop: 'FormUI_items',
            event: 'update'
        },
        watch: {
            //更新内部参数
            uiInit: {
                handler(nv, ov) {
                    //更新form配置表
                    this.FormUI_init = nv;
                },
                deep: true,
                immediate: false
            },
            //更新内部参数赋值
            uiLoading: {
                handler(nv, ov) {
                    this.FormUI_modal.loading = nv;

                    //旧的数据
                    // console.log(ov);
                },
                deep: false,
                immediate: false
            }
        },
        beforeMount: function () {
            //数据初始化
            this.FormUI_init = this.uiInit;
            this.FormUI_modal = this.uiModal;

            for (let item in this.FormUI_init) {
                console.log(item);
                //避免FormUI_items添加对象报错
                this.$set(this.FormUI_items, item, {});


                for (let initItem in this.FormUI_init[item].init) {
                    //如果是actionPicker的话，需要额外初始化子对象
                    if (this.FormUI_init[item].init[initItem]['type'] == 'actionPicker') {
                        this.FormUI_items[item][initItem] = {};
                    }

                    //如果是时间选择器，接受时间戳类型预处理成对象
                    if (this.FormUI_init[item].init[initItem]['type'] == 'datetime') {
                        let time = this.FormUI_items[item][initItem];
                        if (typeof time == 'number') {
                            if (String(time).length == 13) {
                                this.FormUI_items[item][initItem] = new Date(time);
                            }
                            if (String(time).length == 10) {
                                this.FormUI_items[item][initItem] = new Date(time * 1000);
                            }
                        }
                    }

                    //如果是匹配到有rule的话，那就需要按类型补充默认参数
                    if (this.FormUI_init[item].init[initItem].rule) {
                        this.FormUI_init[item].init[initItem].rule = this.setFormUICheck(this.FormUI_init[item].init[initItem].rule);
                    }
                }
            }
            //校验接口参数的时候，需要补充参数
        },
        methods: {
            //时间选择器配套处理函数，得到时间戳和格式化时间字符串，如果使用时间选择器，需要使用此函数
            pickerDate: function (date, index, indexItem) {
                this.FormUI_items[index][indexItem + '_str'] = date.toLocaleString();
                this.FormUI_items[index][indexItem + '_timestamp'] = date.getTime();
            },
            //点击按钮事件监听(通常为发送请求或者取消)
            formButtonClick: function (btn) {
                if (btn.className == 'btn-submit') {
                    //发送请求
                    this.$emit(btn.method, btn);
                } else if (btn.className == 'btn-cancel') {
                    //取消按钮
                } else {
                    this.$emit('button', btn);
                }
            },
            //Modal的确认事件
            formModalOnOk: function () {
                const self = this;
                if (this.FormUI_modal.showFormId && this.FormUI_init) {
                    for (let i in this.FormUI_init) {
                        if (this.FormUI_init[i] && (this.FormUI_init[i].formId == this.FormUI_modal.showFormId)) {
                            this.$emit('submit', {
                                form: this.FormUI_items[i],
                                id: this.FormUI_modal.showFormId,
                                prop: this.FormUI_modal.prop,
                                inoperative: this.FormUI_modal.inoperative
                            });
                        }
                    }
                }
            },
            //Modal的取消事件
            formModalOnCancel: function (res) {
                this.FormUI_modal.showStatus = false;
                this.FormUI_modal.title = '';
            },
            //input 的file类型
            processFile(event, index, indexItem) {

                this.$set(this.FormUI_items[index], indexItem, event.target.files[0]);
            },
            //FormUI校验函数
            setFormUICheck(rule) {
                if (rule.type) {
                    let rex = '';
                    let rex_length = 0;
                    let defaultMessage = false;

                    function checkLength(value) {
                        rex_length = Number(rule.length);
                        switch (rule.type) {
                            case'length_Max' : {
                                defaultMessage = '文字长度超长';
                                if (value.length < rex_length) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            case 'length_Min': {
                                defaultMessage = '文字长度过短';
                                if (value.length > rex_length) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }

                    switch (rule.type) {
                        case 'integer': {
                            rex = new RegExp(/^[1-9]\d*$/);
                            defaultMessage = '不符合正整数匹配';
                            break;
                        }
                        case 'regexp': {
                            if (rule.pattern) {
                                rex = new RegExp(rule.pattern);
                                defaultMessage = '不符合正则表达式校验规则';
                            } else {
                                console.warn('regexp校验缺少对应的pattern');
                            }
                            break;
                        }
                        case 'email': {
                            rex = new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/);
                            defaultMessage = '不符合邮箱匹配';
                            break;
                        }
                    }

                    let base = {
                        required: true,
                        trigger: 'change',
                        validator: function (config, value, callback) {
                            if (rex) {
                                if (rex.test(value)) {
                                    this.FormUI_modal.inoperative = false;
                                    callback();
                                } else {
                                    this.FormUI_modal.inoperative = true;
                                    callback(new Error(rule.message ? rule.message : defaultMessage));
                                }
                            } else if (rule.length) {
                                if (checkLength(value)) {
                                    this.FormUI_modal.inoperative = false;
                                    callback();
                                } else {
                                    this.FormUI_modal.inoperative = true;
                                    callback(new Error(rule.message ? rule.message : defaultMessage));
                                }
                            }
                        }
                    };

                    return Object.assign(base, rule);
                }
            },
            updateBusiness(nv, index, indexItem) {
                //更新FormUI的数据
                this.$set(this.FormUI_items[index], indexItem, nv);
            }
        }
    }
</script>