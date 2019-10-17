<style lang="scss">
    .TableUIPlus-Modal-FullScreen {
        .ivu-modal-body {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    }
</style>

<template>
    <div>
        <Modal v-model="fullScreen"
               fullscreen
               title=""
               :footer-hide="true"
               :closable="false"
               class-name="TableUIPlus-Modal-FullScreen"
               :styles="{'margin-top':0}"
        >
            <slot name="table-plus-x" v-if="fullScreen">

            </slot>
        </Modal>
        <!--modal 放在前面 先渲染modal里面的slot，再渲染当前页面的slot也就是table 可以避免当前table高度的计算错误出现双滚动-->
        <div>
            <slot name="table-plus-x" v-show="!fullScreen">

            </slot>
        </div>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                fullScreen: false
            }
        },
        components: {},
        props: {
            'fullScreenStatus': {type: Boolean, default: false},
        },
        mounted() {

        },
        methods: {},
        watch: {
            'fullScreenStatus': {
                handler(nv) {
                    this.fullScreen = nv
                    this.$emit('update:fullScreenStatus', nv)
                },
                deep: true,
                immediate: true
            },

        }

    };
</script>