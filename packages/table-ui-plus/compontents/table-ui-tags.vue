<template>
    <div>
        <Tag v-for="(item,index) in list" :key="'a'+index">{{item}}</Tag>
    </div>
</template>

<script>
    export default {
        name: "table-ui-span",
        pageAuthor: '莫家麟，xiaosiyan',
        data() {
            return {
                list: [],
            }
        },
        props: {
            info: {type: [Object, String, Number, Array], default: ''},
            UI: {type: [String, Object], default: () => ({})},
            setKey: {type: [String, Object], default: ''},
            setTransform: {
                type: [Function], default: () => {
                }
            },
            setParams: {type: [Object, String, Number], default: ''},
        },
        watch: {
            info: {
                handler: function (nv) {
                    let self = this;
                    self.list = [];
                    nv.forEach(function (item) {
                        let showValue = '';
                        if (self.UI.needTransform && self.setTransform) {
                            //如果需要转换，从外部转换过来再次赋值
                            showValue = self.setTransform({
                                key: self.setKey,
                                value: item
                            }, self.setParams.row);

                        } else {
                            //如果不需要转换，直接使用当前值
                            showValue = item;
                        }

                        //只有值不为空的情况下，才需要渲染
                        if (showValue) {
                            self.list.push(showValue)
                        }
                    });
                },
                deep: true,
                immediate: true
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>