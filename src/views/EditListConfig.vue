<template>
    <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="列表名称">
            <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="接口地址">
            <el-select v-model="form.requestType" style="width: 100px">
                <el-option v-for="item in requestOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-model="form.url" style="width:290px;" />
        </el-form-item>
        <el-form-item label="数据节点">
            <el-input v-model="form.dataName" @blur="changeDataNode" />
        </el-form-item>
        <el-row>
            <span style="padding-right: 10px;padding-bottom: 10px;">表头设置</span>
            <el-button type="primary" plain size="small" @click="addCol">新增</el-button>
        </el-row>
        <draggable v-model="form.items" item-key="index" handle=".drag-handle" class="drag-area" animation="300">
            <template #item="{ element, index }">
                <div>
                    <el-form-item>
                        <!-- 拖动把手 -->
                        <span class="drag-handle"></span>
                        <!-- 表头文本 -->
                        <span style="padding-right: 5px;">表头{{ index + 1 }}</span>
                        <el-input v-model="element.valueName" style="width:150px" placeholder="数据节点" />
                        <span style="padding: 0 5px;">-</span>
                        <el-input v-model="element.label" style="width:150px" placeholder="表头" />
                        <el-button link type="primary" size="small" @click="removeCol(index)">删除</el-button>
                    </el-form-item>
                </div>
            </template>
        </draggable>
        <el-row>
            <span style="padding-right: 10px;padding-bottom: 10px;">搜索条件</span>
            <el-button type="primary" plain size="small" @click="addSearch">新增</el-button>
        </el-row>
        <draggable v-model="form.searchItems" item-key="index" animation="300" handle=".drag-handle" class="drag-area">
            <template #item="{ element, index }">
                <div>

                    <el-form-item>
                        <!-- 拖动把手 -->
                        <span class="drag-handle"></span>
                        <!-- 表头文本 -->
                        <span style="padding-right: 5px;">搜索{{ index + 1 }}</span>
                        <el-input v-model="element.label" style="width:150px" placeholder="搜索条件" />
                        <span style="padding: 0 5px;">-</span>
                        <el-input v-model="element.valueName" style="width:150px" placeholder="属性名" />
                        <el-button link type="primary" size="small" @click="removeSearch(index)">删除</el-button>
                    </el-form-item>
                </div>
            </template>
        </draggable>
    </el-form>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useStore from '@/store/index'
import draggable from 'vuedraggable'

interface Item {
    label: string
    valueName: string
}

interface Form {
    items: Item[]
    name: string,//列表名称
    url: string,//接口地址
    requestType: string,//请求方法
    dataName: string,//列表对应json中的名称，可以多级比如data.class.students,最后students必须是一个list，默认为data
    date: Date,
    searchItems: Item[]//搜索条件
}

const props = defineProps(['currentIndex'])

const store = useStore()
//表单
const form = reactive<Form>({
    name: '',
    url: '',
    requestType: 'GET',
    dataName: '',
    date: new Date(),
    items: [],
    searchItems: []
})

//请求选项
const requestOption = [{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }]


//将 store 中的数据复制给 form
const init = function () {
    if (props.currentIndex != undefined && props.currentIndex !== -1) {
        let data: any = store.data[props.currentIndex]
        form.name = data.name
        form.url = data.url
        form.requestType = data?.requestType
        form.dataName = data.dataName
        form.date = data.date
        form.items.splice(0, form.items.length)
        if (data.items) {
            form.items.push(...data.items)
        }

        form.searchItems.splice(0, form.searchItems.length)
        if (data.searchItems) {
            form.searchItems.push(...data.searchItems)
        }
    }
}

init()

//添加列
const addCol = function () {
    form.items.push({ label: '', valueName: '' })
}

//删除列
const removeCol = function (index: number) {
    form.items.splice(index, 1)
}

//添加搜索条件
const addSearch = function () {
    form.searchItems.push({ label: '', valueName: '' })
}

// 删除搜索条件
const removeSearch = function (index: number) {
    form.searchItems.splice(index, 1)
}

//修改数据节点
const changeDataNode = function () {
    if (form.items.length <= 1) {
        if (form.url !== null && form.url !== '' && form.dataName !== null && form.dataName !== '') {
            axios({
                method: form.requestType.toLowerCase() || 'get',
                url: form.url
            }).then(res => {
                if (res.status === 200) {
                    let list = form.dataName.split('.')
                    let data = res.data
                    try {
                        for (let index in list) {
                            data = data[list[index]]
                        }
                        if (Array.isArray(data)) {
                            form.items.splice(0, 1)
                            for (let key in data[0]) {
                                form.items.push({ label: '', valueName: key })
                            }
                        } else {
                            ElMessage.error('解析返回数据异常，最后数据节点必须为数组')
                        }
                    } catch (e) {
                        ElMessage.error('解析返回数据异常，请检查接口的数据节点是否正确')
                    }
                } else {
                    ElMessage.error('接口请求异常，请检查')
                }
            })
                .catch(() => {
                    ElMessage.error('接口请求异常，请检查接口')
                })

        }
    }
}


// 保存搜索条件
const save = function () {
    if (props.currentIndex != undefined && props.currentIndex === -1) {
        store.data.push(form)
    } else {
        store.data[props.currentIndex].name = form.name
        store.data[props.currentIndex].url = form.url
        store.data[props.currentIndex].requestType = form.requestType
        store.data[props.currentIndex].dataName = form.dataName
        store.data[props.currentIndex].date = form.date
        store.data[props.currentIndex].items.splice(0, store.data[props.currentIndex].items.length)
        store.data[props.currentIndex].items.push(...form.items)
        if (store.data[props.currentIndex].searchItems) {
            store.data[props.currentIndex].searchItems.splice(0, store.data[props.currentIndex].searchItems.length)
            store.data[props.currentIndex].searchItems.push(...form.searchItems)

        } else {
            store.data[props.currentIndex].searchItems = form.searchItems
        }
    }
}


defineExpose({
    save,
})

</script>

<style scoped>
/* 可以给把手添加一些视觉提示，比如改变颜色或大小等 */
.drag-handle::before {
    content: '☰';
    display: inline-block;
    font-size: 20px;
    /* 调整大小 */
    color: #cccccc;
    /* 调整颜色 */
    cursor: move;
}
</style>