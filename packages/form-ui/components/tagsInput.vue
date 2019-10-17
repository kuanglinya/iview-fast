<style>
    .tagsInput-tags {
        border: 1px solid #dcdee2;
        box-sizing: border-box;
        border-radius: 4px;
        min-height: 40px;
        margin-bottom: 10px;
        padding: 5px;
    }
</style>
<template>
    <div class="tagsInput">
        <div class="tagsInput-tags" style="margin-bottom: 10px;">
            <Tag v-for="(item,index) in Tags_list" :key="index" :closable="Tags_closable" :checkable="Tags_checkable"
                 :name="index"
                 @on-close="Tag_handleClose">
                {{item}}
            </Tag>
        </div>
        <Input v-model="Input_value" :placeholder='Input_placeholder'
               icon="ios-add-circle-outline"
               @on-enter="Input_onEnter" @on-click="Input_onClick"/>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                Input_placeholder: '',
                Input_value: '',

                Tags_list: [],
                Tags_closable: true,
                Tags_checkable: true
            }
        },
        props: {
            'placeholder': {type: String, default: ''},
            'dataAll': {
                type: Array, default: function () {
                    return [];
                }
            }
        },
        model: {
            prop: 'dataAll',
            event: 'update'
        },
        methods: {
            //添加数据到TagsList内
            AddTags: function () {
                if (this.Input_value) {
                    this.Tags_list.push(this.Input_value);
                    this.Input_value = '';
                }
            },

            //输入框按钮点击之后，添加Tag标签
            Input_onEnter: function () {
                this.AddTags();
            },
            Input_onClick: function () {
                this.AddTags();
            },

            //tag点击关闭按钮
            Tag_handleClose: function (event, name) {
                this.Tags_list.splice(name, 1);
            }
        },
        watch: {
            placeholder: {
                handler(nv, ov) {
                    this.Input_placeholder = nv;
                },
                deep: false,
                immediate: true
            },
            Tags_list: {
                handler(nv, ov) {
                    this.$emit('update', nv);
                },
                deep: false,
                immediate: false
            },
            dataAll: {
                handler(nv, ov) {
                    this.Tags_list = nv;
                },
                deep: false,
                immediate: true
            }
        },
        mounted: function () {
        }
    }
</script>
