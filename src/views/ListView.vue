<template>
    <el-container>
        <el-main>
            <el-table v-loading="loading" :data="tableData" stripe>
                <el-table-column v-for="(item, index) in colnumData.items" :key=index :prop="item.valueName"
                    :label="item.label" />
            </el-table></el-main>
    </el-container>

</template>
<script setup lang=ts>
import { useRoute } from 'vue-router';
import useStore from '@/store/index'
import { ref } from 'vue'
import axios, { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'


const route = useRoute()
const store = useStore()
const tableData = ref([] as any)
const loading = ref(true)
const colnumData = store.data[Number(route.params.index)]

// 修改标题
document.title = colnumData.name

// 接口请求类型
const requestType = colnumData.requestType || 'get'

// 接口请求配置
const config: AxiosRequestConfig = {
    method: requestType,
    url: colnumData.url
}

// 组织搜索条件
if (route.query && Object.keys(route.query).length > 0) {
    if (config.method?.toLocaleLowerCase() === 'get') {
        let query = ''
        for (let key in route.query) {
            query += ('&' + key + '=' + route.query[key])
            config.url += ('?' + query.substring(1, query.length))
        }
    } else {
        config.data = route.query
    }
}


// 请求接口
axios(config)
    .then(res => {
        if (res.status === 200) {
            let list = colnumData.dataName.split('.')
            let data: any = res.data
            try {
                for (let index in list) {
                    data = data[list[index]]
                }
                if (Array.isArray(data)) {
                    tableData.value = tableData.value.concat(data)
                    loading.value = false
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


</script>