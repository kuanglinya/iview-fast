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
            <Select v-model="SelectorUI_items[index]" :label-in-value="true" v-if="initItem.type=='select'" ref="select"
                    :name="index"
                    :disabled="initItem.isDisabled">
                <Option :value="domItem.value" v-for="(domItem,domIndex) in initItem.init" :label="domItem.label"
                        :key="index+'_'+'_'+domIndex">
                </Option>
            </Select>

            <!--时间选择器-->
            <DatePicker2 :placeholder="initItem.init.label"
                         v-model="SelectorUI_items[index]"
                         :unit="initItem.init.unit"
                         v-if="initItem.type=='datePicker'" :name="index" ref="datePicker"></DatePicker2>
        </FormItem>
    </Form>
</template>

<script>
    import DatePicker2 from '~/components/form-ui/components/datePicker2.vue';

    export default {
        name: "selector-ui-formItem",
        pageAuthor: 'xiaosiyan',
        components: {DatePicker2},
        props: {
            'uiInit': {type: Object, default: {}},
            'SelectorUI_items': {type: Object, default: () => ({})},
            'needInline': {type: Boolean, default: false},
            'formID': {type: String, default: ''}
        },
        data() {
            return {
                //此项为Form表单数据的初始化，可以通过修改此配置项来控制form表单的格式和内容
                SelectorUI_init: {},
                changeTimes: 1,


                labelMap: {}
            };
        },
        mounted: function () {

        },
        model: {
            prop: 'SelectorUI_items',
            event: 'update'
        },
        methods: {},
        watch: {
            uiInit: {
                handler(nv, ov) {
                    this.SelectorUI_init = {};
                    this.$set(this, 'SelectorUI_init', nv);
                },
                deep: true,
                immediate: true
            },
            SelectorUI_items: {
                handler(nv, ov) {
                    //如果是特殊数据格式数据，需要额外触发筛选展示
                    this.$nextTick(() => {
                        if (this.$refs.select) {
                            this.$refs.select.forEach((item) => {
                                if (item.publicValue) {
                                    this.labelMap[item.name] = item.publicValue.label;
                                }
                            });
                        }
                        if (this.$refs.datePicker) {
                            this.$refs.datePicker.forEach((item) => {
                                if (item.timeStr1 && item.timeStr2) {
                                    this.labelMap[item.name] = item.timeStr1 + ' ' + item.timeStr2;
                                }
                            });
                        }

                        this.$emit('check-labelMap', this.labelMap);
                    });
                },
                deep: true,
                immediate: true
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>