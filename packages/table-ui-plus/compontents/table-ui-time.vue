<template>
    <div>
        <span>{{timeStr1}}</span>
        <br v-if="needBr">
        <span>{{timeStr2}}</span>
    </div>
</template>

<script>
    export default {
        name: "table-ui-date",
        pageAuthor: 'xiaosiyan',
        data() {
            return {
                timeStr1: '',
                timeStr2: ''
            }
        },
        props: {
            time: {type: [String, Number], default: ''},
            unit: {type: String, default: 'ms'},
            needBr: {type: Boolean, default: false}
        },
        watch: {
            time: {
                handler: function (nv) {
                    if (Number(nv)) {
                        let timeNumber = 0;
                        if (this.unit.toLowerCase() === 's') {
                            timeNumber = Number(nv) * 1000;
                        } else {
                            timeNumber = Number(nv);
                        }

                        let timeDate = new Date(timeNumber);

                        this.timeStr1 = `${timeDate.getFullYear()}-${timeDate.getMonth() + 1}-${timeDate.getDate()}`;
                        this.timeStr2 = `${timeDate.getHours()}:${timeDate.getMinutes() }:${timeDate.getSeconds()}`;
                    }
                },
                immediate: true,
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>