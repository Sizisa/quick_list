<template>
    <el-container>
        <el-header>Header</el-header>
        <el-main>
            <el-button type="primary" plain :icon="Plus"
                @click="currentIndex = -1; showEditDialog = true;">新增</el-button>
            <el-popconfirm title="该操作会读取剪切板中的配置，并将配置覆盖！" cancel-button-text="取消" width="190" confirm-button-text="确定"
                @confirm="readConfig">
                <template #reference>
                    <el-button type="primary" plain :icon="Connection">读取配置</el-button>
                </template>
            </el-popconfirm>
            <el-button type="success" plain :icon="Download" @click="exportConfig">导出配置</el-button>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="100" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="date" label="创建时间" width="180">
                    <template #default="scope">
                        {{ dayjs(scope.row.date).format('YYYY-MM-DD HH:mm') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="openPage(scope)">查看</el-button>
                        <el-button link type="primary" size="small"
                            @click="currentIndex = scope.$index; showEditDialog = true;">编辑</el-button>
                        <el-button link type="primary" size="small" @click="remove(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>


    <!-- 新增 -->
    <el-dialog v-model="showEditDialog" title="编辑" width="500" destroy-on-close>
        <EditListConfig ref="editConfigRef" :currentIndex=currentIndex></EditListConfig>
        <template #footer>
            <div style="text-align: center">
                <el-button @click="showEditDialog = false">取消</el-button>
                <el-button type="primary" @click="save">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="showSearchDialog" title="搜索" width="500" destroy-on-close>
        <el-form-item v-for="(value, key) in searchLabel" :label="key">
            <el-input v-model="searchData[value]" />
        </el-form-item>
        <template #footer>
            <div style="text-align: center">
                <el-button type="primary" @click="search">
                    搜索
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { Plus, Connection, Download } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import EditListConfig from './EditListConfig.vue';
import useStore from '@/store/index'
import { ElMessage } from 'element-plus';
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'

const store = useStore()

const tableData = store.data

const currentIndex = ref(-1);

const searchLabel = reactive<any>({})
const searchData = reactive<any>({})


//编辑配置的弹窗
const editConfigRef = ref()

//是否显示编辑弹窗
const showEditDialog = ref(false)

const showSearchDialog = ref(false)

//保存配置
const save = function () {
    editConfigRef.value.save()
    showEditDialog.value = false
}

//读取配置
const readConfig = function () {
    navigator.clipboard.readText().then(
        clipText => {
            try {
                let data = JSON.parse(clipText)
                if (Array.isArray(data)) {
                    store.data.splice(0, store.data.length)
                    store.data.push(...data)
                    ElMessage.success('读取成功')
                }
            } catch (e) {
                ElMessage.error('配置格式错误！')
            }


        });
}

//导出配置
const exportConfig = function () {
    const blob = new Blob([JSON.stringify(store.data)], { type: "application/json" });
    saveAs(blob, "data.json");
}

const remove = function (scope: any) {
    store.data.splice(scope.$index, 1)
}

const openPage = function (scope: any) {
    currentIndex.value = scope.$index
    // 遍历对象的键并删除它们
    for (let key in searchLabel) {
        if (searchLabel.hasOwnProperty(key)) {
            delete searchLabel[key];
        }
    }
    for (let key in searchData) {
        if (searchData.hasOwnProperty(key)) {
            delete searchData[key];
        }
    }
    if (tableData[scope.$index].searchItems && tableData[scope.$index].searchItems.length > 0) {
        for (let item of tableData[scope.$index].searchItems) {
            searchLabel[item.label] = item.valueName
        }
        showSearchDialog.value = true
    } else {
        window.open(window.location.href + 'list/' + (currentIndex.value), '_blank')
    }


}

const search = function () {
    let query = ''

    for (let key in searchData) {
        query += ('&' + key + '=' + searchData[key])
    }

    window.open(window.location.href + 'list/' + (currentIndex.value) + '?' + query.substring(1, query.length), '_blank')
}
</script>

<style scoped></style>