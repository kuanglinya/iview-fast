<style scoped>

</style>

<template>
    <DatePicker type="datetime" v-model="DatePicker_date"
                :placeholder="placeholder" ref="dataPicker"></DatePicker>
</template>


<script>
    export default {
        components: {},
        props: {
            placeholder: {type: String, default: ''},
            allDate: {type: [Number, String], default: ''},
            // value: {type: [Number, String, Object], default: {}}
            unit: {type: String, default: 'ms'},
            name: {type: String, default: ''}
        },
        model: {
            prop: 'allDate',
            event: 'update'
        },
        computed: {
            DatePicker_unit: function () {
                if (this.unit.toLowerCase() == 's') {
                    return 1000;
                } else {
                    return 1;
                }
            },
        },
        data() {
            return {
                //时间对象
                DatePicker_date: '',

                //格式化之后的时间字符串
                timeStr1: '',
                timeStr2: ''

            };
        },
        watch: {
            DatePicker_date: {
                deep: false,
                immediate: true,
                handler: function (nv, ov) {
                    if (nv) {
                        this.$emit('update', (nv.getTime() / this.DatePicker_unit));
                    } else {
                        if (this.allDate) {
                            this.$emit('update', '');
                        }
                    }
                }
            },
            allDate: {
                deep: false,
                immediate: true,
                handler: function (nv, ov) {
                    if (Number(nv)) {
                        this.$set(this, 'DatePicker_date', new Date(Number(nv) * this.DatePicker_unit));

                        this.timeStr1 = `${this.DatePicker_date.getFullYear()}-${this.DatePicker_date.getMonth() + 1}-${this.DatePicker_date.getDate()}`;
                        this.timeStr2 = `${this.DatePicker_date.getHours()}:${this.DatePicker_date.getMinutes() }:${this.DatePicker_date.getSeconds()}`;
                    } else {
                        if (this.DatePicker_date) {
                            this.DatePicker_date = '';
                        }
                    }
                }
            }
        }
    }
</script>

