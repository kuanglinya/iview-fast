<template>
    <div class="page-editDemo-form-Line" :style="Div_width">
        <!--循环formInit用来初始化整个表单内容，此表单默认为多个form和多个formItem的组合-->
        <Form inline>
            <FormItem :label="initItem.label" v-for="(initItem,index) in SelectorUI_init"
                      :key="index+'_'+initItem">

                <!--单纯的字符串-->
                <strong v-if="initItem.type=='text'">{{SelectorUI_items[index]}}</strong>

                <!--文本输入框-->
                <Input v-model="SelectorUI_items[index]" v-if="initItem.type=='input'"
                       :placeholder="initItem.init" :disabled="initItem.init.isDisabled"/>

                <!--搜索框类型-->
                <Input suffix="ios-search" enter-button v-model="SelectorUI_items[index]" v-if="initItem.type=='search'"
                       :placeholder="initItem.init" :disabled="initItem.init.isDisabled"/>

                <!--选择器类型-->
                <Select v-model="SelectorUI_items[index]" v-if="initItem.type=='select'"
                        :disabled="initItem.init.isDisabled">
                    <Option :value="domItem.value" v-for="(domItem,domIndex) in initItem.init"
                            :key="index+'_'+'_'+domIndex">{{domItem.label}}
                    </Option>
                </Select>

                <!--单个按钮类型-->
                <Button :type="initItem.init.type" :name="initItem.init.name"
                        v-if="initItem.type=='button'"
                        @click="formButtonClick(initItem.init)">
                    {{initItem.init.btnText}}
                </Button>

                <!--时间选择器-->
                <DatePicker type="datetime" :placeholder="initItem.init.label"
                            v-model="SelectorUI_items[index]"
                            v-if="initItem.type=='datePicker'"
                            @on-change="pickerDate(SelectorUI_items[index],index)"></DatePicker>

                <!--多个按钮组合类型-->
                <ButtonGroup v-if="initItem.type=='buttonGround'">
                    <Button :type="buttonItem.type" :class="buttonItem.className" :id="buttonItem.id"
                            @click="formButtonClick(buttonItem)" v-for="(buttonItem,buttonIndex) in initItem.init"
                            :key="index+'_'+'_'+buttonIndex"
                            style="margin-right: 8px;">
                        {{buttonItem.label}}
                    </Button>
                </ButtonGroup>
            </FormItem>
        </Form>

    </div>
</template>

<script>
    export default {
        props: {
            'uiInit': {type: Object, default: {}},
            'width': {type: Number, default: 1000},
            'uiItems': {type: Object, default: {}}
        },
        mounted: function () {

            //数据初始化
            this.SelectorUI_init = this.uiInit;
            for (let item in this.uiItems) {
                this.$set(this.SelectorUI_items, item, this.uiItems[item]);
            }

            //设置选择器宽度
            this.Div_width = 'width:' + this.width + 'px';
        },
        data() {
            return {
                //此项为Form表单的数据输出结果，即上传数据接口从此处拿到用户输入上传
                SelectorUI_items: {},
                //此项为Form表单数据的初始化，可以通过修改此配置项来控制form表单的格式和内容
                SelectorUI_init: {},
                //默认表头宽度
                Div_width: 'width:1000px'
            };
        },
        model: {
            prop: 'uiItems',
            event: 'update'
        },
        methods: {
            //时间选择器配套处理函数，得到时间戳和格式化时间字符串，如果使用时间选择器，需要使用此函数
            pickerDate: function (date, index) {
                this.SelectorUI_items[index + '_str'] = date.toLocaleString();
                this.SelectorUI_items[index + '_timestamp'] = date.getTime();
            },
            //点击按钮事件监听(通常为发送请求或者取消)
            formButtonClick: function (btn) {
                this.$emit('select', {btn: btn, select: this.SelectorUI_items});
            }
        },
        watch: {
            SelectorUI_items: {
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
        }
    }
</script>