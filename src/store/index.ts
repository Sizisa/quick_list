import { defineStore } from "pinia"


interface Item {
    label: string
    valueName: string
}

interface Form {
    items: Item[]
    name: string,//列表名称
    url: string,//接口地址
    requestType:string,//请求方式
    dataName: string,//列表对应json中的名称，可以多级比如data.class.students,最后students必须是一个list，默认为data
    date: Date,
    searchItems: Item[]
}
const useStore = defineStore('config', {
    state: ():{data:Form[]} => ({
        data:[]
    }),
    getters: {
    },
    persist: true,
})



export default useStore