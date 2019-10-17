<!--本组件用于处理App内的Action配置跳转-->
<template>
    <Card class="action-selector">
        <Divider v-if="title">{{title}}</Divider>
        <div class="action-name">
            <Cascader :data="actionMap" v-model="actionNameArr" @on-change="selectAction"></Cascader>
        </div>
        <div class="action-params">
            <Form :label-width="150">
                <FormItem :label="item.label" v-for="(item,index) in paramsMapActive" :key="item.value"
                          :error="errorMsg[item.value]" style="margin-bottom: 20px;">
                    <InputNumber v-if="item.type=='number'"
                                 v-model="actionValue.params[item.value]"
                                 :min="0"
                                 style="width:calc(100% - 150px)"/>

                    <Input v-if="item.type=='string'"
                           v-model="actionValue.params[item.value]"
                           type="text"
                           style="width:calc(100% - 150px)"/>

                    <Input v-if="item.type=='string_11'"
                           v-model="actionValue.params[item.value]"
                           type="text"
                           style="width:calc(100% - 150px)"/>

                    <Input v-if="item.type=='string_url'"
                           v-model="actionValue.params[item.value]"
                           type="url"/>

                    <Select v-if="item.type=='enum'"
                            v-model="actionValue.params[item.value]"
                            style="width:calc(100% - 150px)">
                        <Option v-for="enumItem in item.params[actionRoute]" :value="enumItem.value"
                                :key="enumItem.value">{{ enumItem.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
        </div>


        <div v-if="Object.keys(successInfo).length>0">
            <Divider>相关数据校验</Divider>
            <Collapse v-model="Collapse_showList">
                <Panel :name="index" v-for="(item,index) in successInfo" :key="index">
                    {{index}}相关
                    <p slot="content">
                        <strong>相关信息：</strong>
                        <span class="text-info" v-for="(item_text,index_text) in item.data.info.texts"
                              :key="index_text">{{item_text}}</span>
                        <strong>相关图片：</strong>
                        <img v-for="(item_img,index_img) in item.data.info.pics" :key="index_img" class="img-info"
                             :src="item_img">
                    </p>
                </Panel>
            </Collapse>
        </div>
    </Card>
</template>


<script>

    import PageMixin from '~/common/page-mixin.js';
    import ActionMixin from '~/common/action-mixin.js';

    export default {
        mixins: [PageMixin, ActionMixin],
        components: {},
        props: {
            allData: {type: Object, default: () => ({})},
            title: {type: String, default: '跳转相关参数设定'},
            open: {type: Boolean, default: false}
        },
        data() {
            return {
                //用来记录最后结果，返回的value就是此值
                actionValue: {
                    name: '',
                    params: {}
                },
                //actionMap--数据来源于ActionMixin

                //用来内部映射枚举类型数据
                actionRoute: '',
                //用来内部记录当前action路径
                actionNameArr: [],

                //paramsMap--数据来源于ActionMixin
                //params显示控制器
                paramsMapActive: [],

                //用来提供错误校验提示
                errorMsg: {},
                successInfo: {},

                //信息展示框打开展示列表
                Collapse_showList: [],

                //labelMap--数据来源于ActionMixin
            };
        },
        computed: {},
        model: {
            event: 'update',
            prop: 'allData'
        },
        watch: {
            actionValue: {
                handler: function (nv, ov) {
                    let self = this;
                    this.ajax({
                        url: '/General/Check/Action/picker',
                        data: {action: JSON.stringify(nv)},
                        method: 'post'
                    }).then(function (res) {
                        self.errorMsg = {};
                        if (res.status == 2) {
                            self.$emit('update', nv);
                            for (let i in res.data) {
                                if (res.data[i].status == 2) {
                                    //如果校验成功，直接提示相关数据
                                    self.$set(self.errorMsg, i, '');
                                    self.$set(self.successInfo, i, res.data[i]);
                                } else {
                                    //如果校验失败，添加对应的错误说明文案
                                    self.$set(self.errorMsg, i, res.data[i].msg);
                                }
                            }
                        }
                    })
                },
                deep: true,
                immediate: true
            },
            successInfo: {
                handler: function (nv) {
                    let self = this;
                    if (this.open) {
                        this.$set(this, 'Collapse_showList', Object.keys(nv));
                    }
                },
                deep: true,
                immediate: false
            },
            allData: {
                handler: function (nv) {
                    window.ref = this.$refs;
                    let self = this;

                    if (nv && nv.name) {
                        //把后台返回的字符串恢复成数组形式
                        this.actionNameArr = nv.name.split('/');

                        //设置对应的paramsMapActive参数，初始化选择框
                        let paramsList = Object.keys(nv.params);
                        self.paramsMapActive = [];
                        self.actionRoute = '';
                        paramsList.forEach(function (item) {
                            let temp = self.paramsMap.filter(function (element) {
                                if (item == element.value) {
                                    //如果是枚举类型的数据，需要额外的做一层路径转化
                                    if (element.type == 'enum') {
                                        self.actionRoute = self.actionNameArr.join('_');
                                    }
                                    return true;
                                }
                            });

                            self.paramsMapActive = self.paramsMapActive.concat(temp);
                        });

                        //设置对应的输入值
                        this.actionValue = nv;
                    }
                },
                deep: true,
                immediate: true
            }
        },
        beforeMount: function () {
        },
        methods: {
            selectAction: function (value, selectedData) {
                let paramsDefault = selectedData.pop();

                //重新选择action之后，需要重置校验提示信息
                this.successInfo = {};

                //筛选出当前的应该展示的额外参数
                this.paramsMapActive = this.paramsMap.filter(function (element) {
                    if (paramsDefault['paramsDefault'][element.value] != undefined) {
                        return true;
                    }
                });
                //转化路径，为了匹配枚举类型参数
                this.actionRoute = value.join('_');

                //转化路径
                this.actionValue.name = value.join('/');

                //每次选择完重置params参数，避免上次选择完的参数残留
                this.actionValue.params = {};

                //type==number类型给定默认值为0
                this.paramsMapActive.forEach((item) => {
                    if (item.type == 'number') {
                        this.$set(this.actionValue.params, item.value, 0);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .img-info {
        display: block;
        width: 100%;
        margin-top: 10px;
    }

    .text-info {
        display: block;
        font-size: 12px;
    }

    .action-name {
        margin-bottom: 20px;
    }
</style>