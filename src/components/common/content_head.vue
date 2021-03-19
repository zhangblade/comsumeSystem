<template>
    <Row class="content_header">
        <Col style="margin-bottom: 4px;" :xs="{ span: 24}" :sm="{ span: 10 }" :md="{ span: 8 }" :lg="{ span: 8 }">
            <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="showAddModule">增加</Button>
            <Button class="btn" type="error" icon="ios-trash-outline" @click="removeMultipleUser">批量删除</Button>
        </Col>
        <Col style="margin-bottom: 4px;" :xs="{ span: 24 }" :sm="{ span: 10, offset: 4 }" :md="{ span: 8, offset: 8 }" :lg="{ span: 8, offset: 8 }" :xl="{ span: 6, offset: 10 }" :xxl="{ span: 5, offset: 11 }">
            <Input search enter-button="查询" placeholder="账号、姓名等" type="text" v-model="searchParams" @on-search='searchRole()' />
        </Col>
    </Row>
</template>
<script>
export default {
    name: 'content_head',
    props: {
        showRMBtn: {
            type: Boolean,
            default: true
        },
        placeHolder: {
            type: String,
            default: ''
        }
    }
}
</script>
