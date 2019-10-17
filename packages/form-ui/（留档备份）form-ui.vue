<template>
    <Modal v-model="FormUI_modal.showModal" :title="FormUI_modal.title"
           :ok-text="FormUI_modal.okText?FormUI_modal.okText:'提交表单'"
           :cancel-text="FormUI_modal.cancelText?FormUI_modal.cancelText:'关闭弹窗'" :z-index="2000" :transfer="true"
           @on-ok="formModalOnOk"
           @on-cancel="formModalOnCancel" :loading="FormUI_modal.loading">
        <div class="page-editDemo-form">
            <!--循环formInit用来初始化整个表单内容，此表单默认为多个form和多个formItem的组合-->
            <Form v-model="FormUI_modal" v-for="(item,index) in FormUI_init" :label-width="180"
                  :key="index"
                  v-if="FormUI_modal.showFormId == item.formId">
                <FormItem :label="initItem.label" v-for="(initItem , indexItem) in item.init"
                          :key="index+'_'+indexItem" :rules="initItem.rule" :prop="'initItem.' + indexItem + '.value'">
                    <!--单纯的字符串-->
                    <strong v-if="initItem.type=='text'">{{FormUI_items[index][indexItem]}}</strong>

                    <!--文本输入框-->
                    <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='input'"
                           :placeholder="initItem.init.label||initItem.init" :disabled="initItem.init.isDisabled"/>

                    <!--屏蔽类型的文本输入框-->
                    <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='disabled'" disabled/>

                    <!--搜索框类型-->
                    <Input search enter-button v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='search'"
                           :placeholder="initItem.init" :disabled="initItem.init.isDisabled"/>

                    <!--选择器类型-->
                    <Select v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='select'"
                            :placeholder="FormUI_items[index][indexItem+'_label']">
                        <Option :value="domItem.value" v-for="(domItem,domIndex) in initItem.init"
                                :key="index+'_'+indexItem+'_'+domIndex">{{domItem.label}}
                        </Option>
                    </Select>

                    <!--开关-->
                    <i-switch v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='switch'"
                              :true-value="initItem.init.openValue" :false-value="initItem.init.closeValue"
                              :disabled="initItem.init.isDisabled" size="large">
                        <span slot="open">{{initItem.init.openText?initItem.init.openText:'开'}}</span>
                        <span slot="close">{{initItem.init.closeText?initItem.init.closeText:'关'}}</span>
                    </i-switch>

                    <!--单选框-->
                    <RadioGroup v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='radio'">
                        <Radio :label="domItem.value" v-for="(domItem,domIndex) in initItem.init"
                               :key="index+'_'+indexItem+'_'+domIndex">{{domItem.label}}
                        </Radio>
                    </RadioGroup>

                    <!--多选框-->
                    <CheckboxGroup v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='checkbox'">
                        <Checkbox :label="domItem.value" v-for="(domItem,domIndex) in initItem.init"
                                  :key="index+'_'+indexItem+'_'+domIndex">{{domItem.label}}
                        </Checkbox>
                    </CheckboxGroup>

                    <!--文本输入区域-->
                    <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='textarea'" type="textarea"
                           :autosize="initItem.init"
                           :placeholder="initItem.init.label" :disabled="initItem.init.isDisabled"/>

                    <!--级联选择器-->
                    <Cascader :data="initItem.init" v-model="FormUI_items[index][indexItem]"
                              v-if="initItem.type=='cascader'"></Cascader>

                    <!--图片上传-->
                    <picUploader :payload="initItem.init" v-model="FormUI_items[index][indexItem]"
                                 v-if="initItem.type=='picUploader'"></picUploader>

                    <!--单个按钮类型-->
                    <Button :type="initItem.init.type" :class="initItem.init.className" :id="initItem.init.id"
                            v-if="initItem.type=='button'"
                            @click="formButtonClick(initItem.init)">
                        {{initItem.init.label}}
                    </Button>

                    <!--时间选择器-->
                    <DatePicker type="datetime" :placeholder="initItem.init.label"
                                v-model="FormUI_items[index][indexItem]"
                                v-if="initItem.type=='datePicker'"
                                @on-change="pickerDate(FormUI_items[index][indexItem],index,indexItem)"></DatePicker>

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
                                    v-model="FormUI_items[index][indexItem]">
                    </importUploader>
                </FormItem>
            </Form>
        </div>
    </Modal>
</template>


<script>
    //图片上传组件，需要单独引用
    import picUploader from '~/components/picUploader.vue';
    import importUploader from '~/components/importUploader.vue'

    export default {
        components: {picUploader, importUploader},
        props: {
            'uiInit': {type: Object, default: {}},
            'uiModal': {type: Object, default: {}},
            'uiItems': {type: Object, default: {}},
            'uiLoading': {type: Boolean, default: false}
        },
        data() {
            return {
                //此项为Form表单的数据输出结果，即上传数据接口从此处拿到用户输入上传
                FormUI_items: {},
                //此项为Form表单数据的初始化，可以通过修改此配置项来控制form表单的格式和内容
                FormUI_init: {},
                //用来控制显示modal相关
                FormUI_modal: {}
            };
        },
        model: {
            prop: 'uiItems',
            event: 'update'
        },
        watch: {
            //这里监听有点问题，如果deep为true的话，被引用的时候会导致FormUI_items被监听触发两次
            //如果为如果deep为false的话，只会触发一次，但是本身这个handler函数也不会触发
            FormUI_items: {
                handler(nv, ov) {
                    // console.clear();
                    let obj = Object.assign({}, nv);
                    this.$emit('update', obj);

                    //新的数据
                    console.log('监听当前Form表单数据2:');
                    console.log(obj);

                    //旧的数据
                    // console.log(ov);
                },
                deep: false,
                immediate: false
            },
            uiInit: {
                handler(nv, ov) {
                    //更新form配置表
                    this.FormUI_init = nv;
                },
                deep: true,
                immediate: false
            },
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

            let item = '';
            for (item in this.FormUI_init) {
                console.log(item);
                this.$set(this.FormUI_items, item, {});
            }

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
                } else if (btn.className == 'btn-cancel') {
                    //取消按钮
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
                                id: this.FormUI_modal.showFormId
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
            }
        }
    }
</script>