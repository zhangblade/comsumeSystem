<template>

    <div class="search_box">
        <slot name="mutil_before"></slot>
        <Select v-show="condition.list.length>1" class="condition_pre" v-model="current.key">
            <Option v-for="(option, index) in condition.list" :value="option.value" :key="option.value" @click.native="changeQueryKey(option, index)">{{ option.label }}</Option>
        </Select>
        <Input :style="customWidth" class="condition_comm" v-if="current.type == 'input'" v-model="current.val" :placeholder="'请输入'+ current.label"  @keyup.enter.native="fnSearch"/>
        <Select :style="customWidth" class="condition_comm" v-if="current.type == 'select'" v-model="current.val">
            <Option v-for="option in condition[current.key]" :value="option.value" :key="option.value">{{ option.label }}</Option>
        </Select>
        <slot name="before"></slot>
        <Button v-if="condition.list.length || showSearchBtn" class="condition_btn_submit" @click="fnSearch()">{{ searchBtnText }}</Button>
        <slot name="right"></slot>
    </div>
</template>

<script>

export default {
    name: 'searchbox',
    data () {
        return {
            
        }
    },
    props: {
        condition: {
            type: Object,
            default: () => {}
        },
        current: {
            type: Object,
            default: () => {}
        },
        customWidth: {
            type: Object,
            default: () => {
                return {
                    'width': '240px'
                }
            }
        },
        showSearchBtn: {
            type: Boolean,
            default: false
        },
        searchBtnText: {
            type: String,
            default: '查询'
        },
    },
    created() {
        
    },
    methods: {
        fnSearch(){
            this.$emit('fnSearch')
        },
        changeQueryKey(option, index){
            this.$emit('changeQueryKey', option, index)
        },
    },
}
</script>

<style lang="less" scoped>
    .condition_pre{
        width: 100px;
        margin-right: 5px;
    }
    .condition_comm{
        margin-right: 5px;
    }
</style>

