<template>
  <v-container>
      <v-row justify="center" align="center">
      <v-col>
        <v-number-input v-model="filtter" hide-details label="معرف الشريك" ></v-number-input>
      </v-col>
      <V-col>
        <v-btn style="align-self: stretch;" @click="getData()" color="orange-darken-2" >
          <v-icon 
            icon="mdi-reload">
          </v-icon>
        </v-btn>
      </V-col>
    </v-row>
    </v-container>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="items"></v-data-table>        
      </v-col>
    </v-row>
    <v-row>
        <v-col>
          <v-data-table :headers="headers2" :items="items2"></v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table :headers="headrs_3" :items="items3"></v-data-table>
        </v-col>
      </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {requestPartnerContribution, getPartnersContribution, requestProjectReport } from '@/services/payload';
import { v } from 'vue-router/dist/index-D_VEAp3P.js';
import { ref } from 'vue';

const headers = ref<any>([
  {title : 'ID', value: 'ID'},
  {title : 'الاسم الاول',value : 'First_Name'},
  {title : 'الاسم الثاني' , value : 'Second_Name'},
  {title : 'الاسم الثالث' , value : 'Third_Name'},
])

const headers2 = ref<any>([
  {title : 'ID', value: 'ID'},
  {title : 'الاسم الاول',value : 'First_Name'},
  {title : 'الاسم الثاني' , value : 'Second_Name'},
  {title : 'الاسم الثالث' , value : 'Third_Name'},
  {title : 'المبلغ' , value : 'Amount'},
  {title : 'تاريخ ' , value : 'date'},
])
const headrs_3 = ref<any>([
  {title : 'المجموع', value: 'total'},
  
])
const filtter = ref(0);
const items = ref<any>([])
const items2 = ref<any>([])
const items3 = ref<any>([])    

function getData(){
  console.log(filtter.value)
if(filtter.value != 0){
  requestPartnerContribution(filtter.value).then((res)=>{
    console.log(res)
    items2.value = Array.isArray(res['data_'])? res['data_'] : []
    items3.value = Array.isArray(res['total'])? res['total'] : []
    console.log(res['total'])
  })
}
getPartnersContribution().then((res)=>{
  console.log(res)
  items.value = Array.isArray(res)? res : []})
}

</script>