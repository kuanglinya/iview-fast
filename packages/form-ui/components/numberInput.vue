<style>

</style>
<template>
    <InputNumber v-model="value"
                 :placeholder="placeholder"
                 :disabled="disabled"
                 :style="{width:'100%'}"
                 :max="max"
                 :min="min"
                 :step="step"
                 :precision="precision"
                 :editable="editable">
    </InputNumber>
</template>
<script>
    export default {
        data() {
            return {
                value: 0
            }
        },
        props: {
            'dataAll': {type: [String, Number], default: 0},
            'placeholder': {type: [String], default: ''},
            'disabled': {type: [Boolean], default: false},
            'max': {type: [Number], default: NaN},
            'min': {type: [Number], default: NaN},
            'step': {type: [Number], default: NaN},
            'precision': {type: [Number], default: NaN},
            'defaultValue': {type: [Number], default: NaN},
            'editable': {type: [Boolean], default: true}
        },
        methods: {},
        model: {
            prop: 'dataAll',
            event: 'update'
        },
        watch: {
            dataAll: {
                handler(nv, ov) {
                    if (typeof (nv) === 'number') {
                        this.value = nv;
                    } else if (typeof (nv) === 'string') {
                        this.value = +nv;
                    }
                },
                deep: false,
                immediate: true
            },
            value: {
                handler(nv, ov) {
                    this.$emit('update', nv);
                },
                deep: false,
                immediate: true
            }
        },
        mounted: function () {
            if (this.defaultValue && !this.dataAll) {
                this.value = this.defaultValue;
            }
        }
    }
</script>
