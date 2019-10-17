<template>
    <div>
        <div :data-name="data_name" :data-value="data_value"></div>
    </div>
</template>

<script>
    export default {
        name: "table-ui-date",
        pageAuthor: '莫家麟，xiaosiyan',
        data() {
            return {
                data_name:null
            }
        },
        props: {
            UI: {type: [String,Object], default: ''},
            data_value: {type: String, default: ''},
        },
        watch:{
            UI: {
                handler: function (nv) {
                   this.data_name = nv.data_name
                },
                deep:true,
                immediate: true,
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>