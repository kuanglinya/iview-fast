<template>
    <Dropdown style="margin-left: 20px" @on-click="itemClick" placement="bottom-start" :transfer="transfer">
        <Button :type="btnType">
            {{btnText}}
            <Icon :type="iconType"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem :name="item.name" v-for="item in listData" :key="item.name"
                          v-text="item.btnText"></DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
    export default {
        name: "table-ui-down",
        pageAuthor: '莫家麟，xiaosiyan',
        data() {
            return {
                listData: [],
                transfer: true,
                btnText: '',
                btnType: '',
                iconType: ''
            }
        },
        methods: {
            itemClick: function (name) {
                this.$emit('on-click', name)
            }
        },
        props: {
            UI: {type: [String, Object, Array], default: ''},
            button: {type: [Object, Number, Array], default: () => ({})},
        },
        watch: {
            UI: {
                handler: function (nv) {
                    let _that = this
                    let dropDownList = [];

                    if (nv.list && nv.list.length > 0) {
                        nv.list.forEach(function (dropDownItem, dropDownIndex) {
                            //按钮必须要有对应名字和字符串显示
                            if (dropDownItem.name && dropDownItem.btnText) {
                                //如果存在isHidden属性，不进行渲染
                                if (_that.button[dropDownItem['isHidden']]) {
                                    //do nothing
                                } else {
                                    dropDownList.push(dropDownItem)
                                }
                            }
                        });
                        this.listData = dropDownList

                    }
                    this.btnText = nv.btnText || '下拉菜单'
                    this.btnType = nv.btnType || 'default'
                    this.iconType = nv.iconType


                },
                deep: true,
                immediate: true,
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>