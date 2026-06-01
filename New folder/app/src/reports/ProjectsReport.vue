<template>
  <v-container>
    <V-row justify="center" align="center">
      <v-col>
        <v-number-input
          v-model="projectName"
          hide-details
          label="معرف المشروع"
          :rules="[(value)=>{if(value)return true; else return false}]">
        </v-number-input>
      </v-col>
  
      <v-col>
        <v-btn @click="handleSubmit()" color="orange-darken-2" style="align-self: stretch;">
          <v-icon icon="mdi-reload">

          </v-icon>
        </v-btn>
      </v-col>
    </V-row>
  </v-container>
  <v-container>
    <v-row>
      <V-col>
        <v-data-table :headers="headers_" :items="items" >

        </v-data-table>
      </V-col>
    </v-row>
    <v-row>
        <v-col>
          <v-data-table :headers="headers_2" :items="items2"></v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table :headers="headrs_3" :items="items3"></v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table :headers="headers_4" :items="items4"></v-data-table>
        </v-col>
      </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { VDateInput } from 'vuetify/labs/VDateInput';
import { getProjects } from '@/services/AuthService';
import { requestProjectReport } from '@/services/payload'
import { applicationState } from '@/stores/ApplicationState';
import {ref} from 'vue'
import { da } from 'vuetify/locale';
import { useRouter } from 'vue-router';

  const headers_ = ref([
    {title : 'ID', value: 'ID'},
    {title : 'اسم المشروع',value : 'Project_Name'},
    {title : 'الربح' , value : 'Net_Income'},
    {title : 'مدة التنفيذ' , value : 'Days_To_Finish'},
    {title : 'الحالة' , value : 'Status'},
    {title : 'التاريخ' , value : 'Date'},
    ])

  const headers_2 = ref([
    {title : 'المبلغ', value : 'Withdraw_Amount'},
    {title : 'تفاصيل', value : 'Details'},
    {title : 'اسم القطاع', value : 'Sector_Name'},
    {title : 'تاريخ', value : 'Date'},
  ])

  const headrs_3 = ref([
    {title : 'الاسم الاول' , value : 'First_Name'},
    {title : 'الاسم الثاني' , value : 'Second_Name'},
    {title : 'الاسم الثالث' , value : 'Third_Name'},
    {title : 'المبلغ', value : 'Payment'},
    {title : 'التوقفات' , value : 'Sub_Amount'},
    {title : 'التفاصيل', value : 'Details'},
    {title : 'التاريخ', value : 'Date'}
  ])

  const headers_4 = ref([
    {title : 'المبلغ المصروف' , value : 'Expenses'},
    {title : 'التفاصيل' , value : 'Expenses_Details'},
    {title : 'التاريخ' , value : 'Date'}
  ])

  const items = ref([])
  const items2 = ref([])
  const items3 = ref([])
  const items4 = ref([])
  const projectName = ref(0);
  const projectDate = ref()
  let router = useRouter();

  function handleSubmit(){
    let id = router.currentRoute.value.params.id as string
    if(projectName.value != null){
      requestProjectReport({Project_ID : projectName.value}).then(data=>{
      items2.value = data.sector_contribution
      items3.value = data.investors_contribution
      items4.value = data.expenses
    })
    }
    console.log(projectDate.value)
    let date ;
    if(projectDate.value != null)
      date = projectDate.value.toLocaleDateString("en-CA");
    else date = ''
    if(projectDate.value != null){
      console.log(projectDate.value.toLocaleDateString("en-CA"))
    }
    getProjects(applicationState().state.sector,{project_name : projectName.value,project_date : date}).then(data=>{
      items.value = data
    })
  }

</script>