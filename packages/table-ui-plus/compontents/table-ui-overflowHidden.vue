<template>
    <div class="drop-box-content" >
        <div class="slot-component" v-bind:class="boxHide ? 'hide' : ''">
            <div ref="drop_content">
                <slot  name="slot-component"></slot>
            </div>
        </div>

        <Poptip v-if="isTips" trigger="hover" title="Tooltip" :transfer="true" placement="right-start" content="content"
                class="poptip">
            <Icon type="ios-alert-outline" color="red" size="18"/>
            <div class="tips-con" slot="content">
                <p>内容已经溢出，请去除不必要数据</p>
                <p class="meth1">方法一：表头筛选</p>
                <Button class="tips-btn" type="warning" @click="onButtonShowDrawer()" size="small">表头筛选</Button>
                <p>方法二：拉开屏幕宽度</p>
                <div>
                    <p class="meth3">方法三：点击下面的下拉按钮</p>
                    <Icon v-show="isDropDown" class="tips-drop-down" type="ios-arrow-dropdown" size="18"/>
                </div>
            </div>
        </Poptip>
        <div v-if="isDrop" class="drop-box">
            <Icon v-show="isDropUp" class="drop-up" @click="dropUp()" type="ios-arrow-dropup" size="18"/>
            <Icon v-show="isDropDown" class="drop-down" @click="dropDown()" type="ios-arrow-dropdown" size="18"/>
        </div>

    </div>
</template>

<script>
    import bus from '../../event-bus.js';
    import ResizeObserver from 'resize-observer-polyfill';

    export default {
        name: "table-ui-overflowHidden",
        pageAuthor: '莫家麟，xiaosiyan',
        props: {
            'minwidth': {type: Number, default: 0},
            'maxHeight': {type: Number, default: 0},
        },
        data() {
            return {

                menuKey: 1,
                // 是否打开提示按钮
                isTips: false,

                // 是否打开下拉两个按钮位
                isDrop: false,
                // 是否显示上缩按钮
                isDropUp: false,
                // 是否显示下拉按钮
                isDropDown: false,
                // 是否对内容进行隐藏
                boxHide: false,

                // 单元格宽度
                width: null,
                //单元格高度
                height: null,
                // 现单元格宽度，用于避免因下拉导致的页面刷新
                nowWidth: null,

                maxMidHeight:58


            }
        },
        methods: {
            onButtonShowDrawer() {
                bus.$emit('show-drawer');
            },
            viewWidth() {
                let _that = this;
                const ro = new ResizeObserver((entries, observer) => {
                    for (const entry of entries) {
                        const {left, top, width, height} = entry.contentRect;
                        _that.width = width;
                        _that.height = height;
                    }
                });
                ro.observe(this.$refs.drop_content);
            },
            dropUp() {
                this.nowWidth = this.width;
                this.isDropDown = true;
                this.isDropUp = false;
                this.boxHide = true;
                this.isTips = true;

            },
            dropDown() {
                this.nowWidth = this.width;
                this.isDropUp = true;
                this.isDropDown = false;
                this.boxHide = false;
                this.isTips = false;
            },
            updateViewSize() {
                let _that = this;
                if (this.height > _that.maxMidHeight) {
                    this.isDrop = true;
                    this.isDropDown = true;
                    // 高度大于55 说明内容达到3行且溢出
                    this.isTips = true;
                    this.boxHide = true;

                } else {
                    this.isTips = false;
                    this.isDrop = false;
                    this.isDropUp = false;
                    this.isDropDown = false;
                    this.boxHide = false;

                }


            }
        },
        mounted: function () {
            this.viewWidth();
        },
        watch: {
            width: {
                handler(nv) {

                    let _that = this;
                    // 宽度不同，窗口被拖动
                    if (this.nowWidth !== nv) {


                        if (nv < _that.minwidth) {
                            if (this.height > _that.maxMidHeight) {
                                this.isDrop = true;
                                this.isDropDown = true;
                                // 高度大于55 说明内容达到3行且溢出
                                this.isTips = true;
                                this.boxHide = true;

                            } else {
                                this.isTips = false;
                                this.isDrop = false;
                                this.isDropUp = false;
                                this.isDropDown = false;
                                this.boxHide = false;
                            }

                        } else {


                            if(+_that.maxHeight !== 0 && (_that.height > _that.maxHeight)){
                                this.isDrop = true;
                                this.isDropDown = true;
                                // 高度大于55 说明内容达到3行且溢出
                                this.isTips = true;
                                this.boxHide = true;
                            }else{
                                this.$set(_that, 'isTips', false);
                                this.boxHide = false;
                                this.isTips = false;
                                this.isDrop = false;
                                this.isDropUp = false;
                                this.isDropDown = false;
                            }




                        }
                    }

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

    .tips-con {
        p {
            margin: 3px 0;
        }
    }

    .drop-box-content {
        position: relative;
        width: 100%;
        height: 100%;

        .poptip {
            position: absolute;
            right: -14px;
            top: 3px;
        }
        .drop-box {
            display: flex;
            justify-content: flex-end;
            height: 1px;
            .drop-up {
                cursor: pointer;
                position: absolute;
                right: -14px;
                bottom: 0;
                z-index: 100;

            }
            .drop-down {
                cursor: pointer;
                position: absolute;
                right: -14px;
                bottom: 0;
                z-index: 99;

            }
        }

        .slot-component {
            &.hide {
                display: block;
                cursor: pointer;
                overflow: hidden;

                height: 55px;
            }
        }
    }

    .tips-drop-down {
        display: inline-block;
        vertical-align: middle;
    }

    .tips-btn {
        vertical-align: middle;
        display: inline-block;
        margin-left: 3px;
    }

    .meth1 {
        vertical-align: middle;
        display: inline-block;
    }

    .meth3 {
        vertical-align: middle;
        display: inline-block;
    }
</style>