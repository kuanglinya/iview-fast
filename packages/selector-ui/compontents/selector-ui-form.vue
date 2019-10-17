<template>
    <Form :inline="needInline">
        <FormItem :label="initItem.label" v-for="(initItem,index) in SelectorUI_init"
                  :key="index+'_'+initItem">

            <!--单纯的字符串-->
            <strong v-if="initItem.type=='text'">{{SelectorUI_items[index]}}</strong>

            <!--文本输入框-->
            <Input v-model="SelectorUI_items[index]" v-if="initItem.type=='input'"
                   :placeholder="initItem.init" :disabled="initItem.isDisabled"/>

            <!--搜索框类型-->
            <Input suffix="ios-search" enter-button v-model="SelectorUI_items[index]" v-if="initItem.type=='search'"
                   :placeholder="initItem.init" :disabled="initItem.isDisabled"/>

            <!--选择器类型-->
            <Select v-model="SelectorUI_items[index]" v-if="initItem.type=='select'"
                    :disabled="initItem.isDisabled">
                <Option :value="domItem.value" v-for="(domItem,domIndex) in initItem.init"
                        :key="index+'_'+'_'+domIndex">{{domItem.label}}
                </Option>
            </Select>

            <!--时间选择器-->
            <DatePicker2 :placeholder="initItem.init.label"
                         v-model="SelectorUI_items[index]"
                         :unit="initItem.init.unit"
                         v-if="initItem.type=='datePicker'"></DatePicker2>


            <!--单个按钮类型-->
            <Button :type="initItem.init.type" :name="initItem.init.name"
                    v-if="initItem.type=='button'"
                    @click="formButtonClick(initItem.init)">
                {{initItem.init.btnText}}
            </Button>

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
</template>

<script>
    import DatePicker2 from '../../form-ui/components/datePicker2.vue';

    export default {
        name: "selector-ui-formItem",
        pageAuthor: 'xiaosiyan',
        components: {DatePicker2},
        props: {
            'uiInit': {type: Object, default: () => ({})},
            'SelectorUI_items': {type: Object, default: () => ({})},
            'needInline': {type: Boolean, default: false},
            'formID': {type: String, default: ''}
        },
        data() {
            return {
                //此项为Form表单数据的初始化，可以通过修改此配置项来控制form表单的格式和内容
                SelectorUI_init: {},
                changeTimes: 1
            };
        },
        model: {
            prop: 'SelectorUI_items',
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
            uiInit: {
                handler(nv, ov) {
                    this.SelectorUI_init = {};
                    this.$set(this, 'SelectorUI_init', nv);
                },
                deep: true,
                immediate: true
            }
        }

    }
</script>

<style lang="scss" scoped>

</style>