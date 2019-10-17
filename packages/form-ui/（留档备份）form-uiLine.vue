<template>
    <div class="page-editDemo-form-Line">
        <!--循环formInit用来初始化整个表单内容，此表单默认为多个form和多个formItem的组合-->
        <Form v-model="FormUI_modal" v-for="(item,index) in FormUI_init" :label-width="180" :key="index"
              v-if="FormUI_modal.showFormId == item.formId" inline>
            <FormItem :label="initItem.label" v-for="(initItem , indexItem) in item.init"
                      :key="index+'_'+indexItem">

                <!--单纯的字符串-->
                <strong v-if="initItem.type=='text'">{{FormUI_items[index][indexItem]}}</strong>

                <!--文本输入框-->
                <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='input'"
                       :placeholder="initItem.init" :disabled="initItem.init.isDisabled"/>

                <!--屏蔽类型的文本输入框-->
                <Input v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='disabled'" disabled/>

                <!--搜索框类型-->
                <Input search enter-button v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='search'"
                       :placeholder="initItem.init" :disabled="initItem.init.isDisabled"/>

                <!--选择器类型-->
                <Select v-model="FormUI_items[index][indexItem]" v-if="initItem.type=='select'"
                        :disabled="initItem.init.isDisabled">
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

                <!--级联选择器-->
                <Cascader :data="initItem.init" v-model="FormUI_items[index][indexItem]"
                          v-if="initItem.type=='cascader'"></Cascader>

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
            </FormItem>
        </Form>
    </div>
</template>

<script>
    //图片上传组件，需要单独引用
    import picUploader from '~/components/picUploader.vue';

    export default {
        components: {picUploader},
        props: {
            'uiInit': {type: Object, default: {}},
            'uiModal': {type: Object, default: {}},
        },
        data() {
            return {
                //此项为Form表单的数据输出结果，即上传数据接口从此处拿到用户输入上传
                FormUI_items: {},
                //此项为Form表单数据的初始化，可以通过修改此配置项来控制form表单的格式和内容
                FormUI_init: {},
            };
        },
        model: {
            prop: 'dataAll',
            event: 'update'
        },
        watch: {
            FormUI_items: {
                handler(nv, ov) {
                    // console.clear();
                    let obj = Object.assign({}, nv);
                    this.$emit('update', obj);

                    //旧的数据
                    // console.log(ov);
                },
                deep: true,
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
            }
        }
    }
</script>