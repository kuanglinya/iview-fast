<template>
    <div class="box" >
        <TableOverflowHidden
                :minwidth="minWidth"
                :maxHeight="UI.maxHeight"
        >
         <span :style="addStyle" v-text="showInfo" slot="slot-component"></span>
        </TableOverflowHidden>
    </div>

</template>

<script>
    export default {
        name: "table-ui-span",
        pageAuthor: '莫家麟，xiaosiyan',
        props: {
            UI: {type: [Object,String], default: () => ({})},
            setKey: {type: [Object,String], default: () => ({})},
            styleInfo: {type: [Object,String], default: ''},
            setTransform: {type: [Function],  default: () => ({})},
            setParams: {type: [Object], default: () => ({})},
            minWidth:{type: Number, default:300},
        },
        data() {
            return {
                addStyle: {},
                showInfo: '',

            }
        },
        methods: {
        },
        created() {},
        mounted() {
        },

        watch: {
            UI: {
                handler: function (nv) {

                    let self = this;
                    let style = {};
                    let text = this.styleInfo.value || '-';

                    // 如果字段为空且不需要转换 则增加 - 字符
                    // if(!nv.needTransform && !text){
                    //     text = '-'
                    // }

                    if (nv) {
                        if (typeof nv.style == 'object') {

                            //如果style是对象形式的话直接添加样式
                            style = this.UI.style;

                        }
                        else if (typeof nv.style == 'string') {
                            //如果style是字符串的话，说明需要从后台数据读取

                            if (this.styleInfo[nv.style] && typeof  this.styleInfo[nv.style] == 'object') {
                                //只有当读取的数据为对象的时候，才会赋值
                                style = this.styleInfo[nv.style];
                            } else {
                                console.warn('TableUIPlus-UI type为"span"的项后台数据结构与渲染不匹配');
                            }
                        }
                    }


                    //判断文字是否需要从子字段额外读取，当UI.style为字符串时，通常此值也需要设置
                    if (nv.text && typeof nv.text == 'string') {
                        text = this.styleInfo[nv.text] || '-';

                    }

                    if (nv.needTransform && this.setTransform) {
                        //如果需要转换，从外部转换过来再次赋值
                        text = this.setTransform({
                            key: self.setKey,
                            value: text
                        }, self.setParams.row)

                    }


                    this.addStyle = style;
                    this.showInfo = text;

                },
                deep: true,
                immediate: true
            }
        }
    }
</script>

<style lang="scss" scoped>

  .box-poptip {
      margin-right: 5px;
      margin-bottom: 5px;
      display: inline-block;
  }

  .tips-con{
      p{
          margin: 3px 0;
      }
  }

</style>