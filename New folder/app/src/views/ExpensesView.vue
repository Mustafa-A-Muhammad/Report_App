<template>
    <expenses-entry></expenses-entry>
    <v-container>
        <v-tabs
            v-model="tab"
            align-tabs="center"
            color="deep-purple-accent-4"
            >
                <v-tab v-on:click="expen(1)" :value="1">موجودات</v-tab>
                <v-tab v-on:click="expen(2)" :value="2">نهائية</v-tab>
                <v-tab v-on:click="expen(3)" :value="3">موظفين</v-tab>
        </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item :value="1">
                    <v-data-table :headers="headers" :items="items"></v-data-table>        
                </v-tabs-window-item>
                <v-tabs-window-item :value="2">
                    <v-data-table :headers="headers" :items="items2"></v-data-table>        
                </v-tabs-window-item>
                <v-tabs-window-item :value="3">
                    <v-data-table :headers="headers" :items="items3"></v-data-table>        
                </v-tabs-window-item>
            </v-tabs-window>
        
    </v-container>
</template>

<script setup lang="ts">
import ExpensesEntry from '@/components/ExpensesEntry.vue';
import { getExpenses } from '@/services/AuthService';
import {requestStaffExpenses,requestMaterialsExpenses, requestTaxesExpenses} from '@/services/payload'
import { applicationState } from '@/stores/ApplicationState';
import {onUpdated, ref, watch} from 'vue'

const items = ref<any>([])
const items2 = ref<any>([])
const items3 = ref<any>([])
const tab = ref(1);
let headers;

watch(applicationState().state, ()=>{
    expen(tab.value);
})

function expen(value:number){
    console.log('clicked')
    if(value === 1){
        requestMaterialsExpenses().then((res)=>{
            console.log(res)
            headers = [
              {title : 'المصروف', value : 'Name'},
              {title : 'المبلغ', value : 'Withdraw_Amount'},
              {title : 'التاريخ' , value : 'Date'}
            ]
            items.value = Array.isArray(res)? res : []
        })
    }
    if(value === 2){
        requestTaxesExpenses().then((data)=>{
            console.log(data)
            headers = [
              {title : 'المصروف', value : 'Name'},
              {title : 'المبلغ', value : 'Withdraw_Amount'},
              {title : 'التاريخ' , value : 'Date'}
            ]
            items2.value = Array.isArray(data)? data : []
        })
    }
    if(value === 3){
        requestStaffExpenses().then((data)=>{
            headers = [
              {title : 'الاسم الاول', value : 'First_Name'},
              {title : 'الاسم الثاني', value : 'Second_Name'},
              {title : 'الراتب', value : 'Withdraw_Amount'},
              {title : 'الحوافز', value : 'Bonus'},
              {title : 'الاستقطاعات', value : 'Cuts'}
            ]
            items3.value = Array.isArray(data)? data : []
        })
    }
}

</script>