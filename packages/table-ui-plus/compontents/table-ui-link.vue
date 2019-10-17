<template>
    <div>
        <a v-if="!isSpan" target="_blank" :href="linkValue">{{text}}</a>
        <span v-else v-text="text"></span>
    </div>
</template>

<script>
    export default {
        name: "table-ui-link",
        pageAuthor: '莫家麟，xiaosiyan',
        data() {
            return {
                text: null,
                isSpan: false
            }
        },
        props: {
            UI: {type: [String, Object, Array], default: ''},
            setKey: {type: [String, Object], default: ''},
            setTransform: {type: [Function, Boolean], default: false},
            setParams: {type: [Object, String, Number], default: ''},
        },
        watch: {
            UI: {
                handler(nv) {
                    let self = this
                    let value = nv.text;
                    let data
                    if (nv.needTransform && self.setTransform) {
                        data = self.setTransform({
                            key: self.setKey,
                            value: nv.text
                        }, self.setParams.row);

                        if (typeof data === 'object') {
                            this.isSpan = data.isSpan;
                            this.text = data.text;
                            this.linkValue = data.href;

                        } else {
                            this.text = nv.text
                            this.linkValue = nv.prefHref + data
                        }
                    } else {
                        this.text = nv.text

                        if (nv.href && nv.href !== '') {
                            this.linkValue = nv.href
                        } else {
                            this.linkValue = nv.prefHref + value
                        }

                    }


                },
                deep: true,
                immediate: true
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>