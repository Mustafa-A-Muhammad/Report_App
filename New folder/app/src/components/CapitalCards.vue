<template>
  <v-container @click.prevent="handleMTSSubmit()">
    <v-row class="ma-2" density="comfortable">
      <v-col
        v-for="card in cards"
        :key="card.content" 
      >
        <v-card class="mx-auto" elevation="2">
          <v-card-title>{{ card.title }}</v-card-title>
          <v-card-text>{{ card.content }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>    
  <v-container>
    <v-form v-model="subFlag" @submit.prevent="callRequestMainToSectorTransfer()">
      <v-row class="ma-2" density="comfortable">
        <v-col>
          <v-text-field
            label="من الصندوق الرئيسي"
            outlined
            readonly
            />
        </v-col>
        <v-col>
          <v-combobox
            :items="applicationState().state.sectorsNames"
            :rules="[(value)=>{if(value) return true; else return false}]"
            label="القطاع"
            v-model="mainItem">
          </v-combobox>
        </v-col>
        <v-col>
          <v-number-input
            v-model="mainSub"
            label="المبلغ"
            control-variant="hidden"
            :rules="[rules.required]"
            hide-details
            >
          </v-number-input>          
        </v-col>
        <v-col>
          <v-date-input v-model="sectorDate"></v-date-input>
        </v-col>
        <v-col>
          <v-btn type="submit" class="ma-2" color="orange-darken-2" block style=" height:100%!;">
                <v-icon
                  icon="mdi-arrow-right"
                    start>
                  </v-icon>
              تاكيد
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
    <v-container>
    <v-form v-model="subFlag2" @submit.prevent="callRequestMainToPartnersTransfer()">
      <v-row class="ma-2" density="comfortable">
        <v-col>
          <v-text-field
            label="من الصندوق الرئيسي"
            outlined
            readonly
            />
        </v-col>
        <v-col>
          <v-combobox
            :items="partners"
            :rules="[(value)=>{if(value) return true; else return false}]"
            label="الشركاء"
            v-model="partnersItem">
          </v-combobox>
        </v-col>
        <v-col>
          <v-number-input
            v-model="partnerSub"
            label="المبلغ"
            control-variant="hidden"
            :rules="[rules.required]"
            hide-details
            >
          </v-number-input>

          
        </v-col>
        <v-col>
          <v-date-input v-model="partnersDate"></v-date-input>
        </v-col>
        <v-col>
          <v-btn type="submit" class="ma-2" color="orange-darken-2" block style=" height:100%!;">
                <v-icon
                  icon="mdi-arrow-right"
                    start>
                  </v-icon>
              تاكيد
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import {requestMainToPartnersTransfer,getPartners,requestMainToSectorTransfer, getCompanyCapital } from '@/services/payload';
import { applicationState } from '@/stores/ApplicationState';
import { onMounted, ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput';
import { ar, da } from 'vuetify/locale';

interface CardDetails {
  title : string,
  content : string
}

const cards = ref([{title : '',content :''}])
const subFlag = ref(false)
const mainSub = ref(0);
const partnerSub = ref(0)
const mainItem = ref('')
const partnersItem = ref('')
const partners = ref([''])
const subFlag2 = ref(false)
const sectorDate = ref(new Date())
const partnersDate = ref(new Date())
const rules = {
  required : (value : number)=>{
          if (!/^\d+$/.test(value+"") || value == 0) {
            return false
          }
          return true}
}

onMounted(()=>{
  handleMTSSubmit()
  loadPartners()
})

async function loadPartners() {
  partners.value = await getPartners()
  partners.value = partners.value.map(partner => {
  return `${partner['First_Name']} ${partner['Second_Name']} ${partner['Third_Name']}`;
});
}

function callRequestMainToPartnersTransfer(){
  if(subFlag2){
    let nameAsObj = partnersItem.value.split(" ");
    requestMainToPartnersTransfer({First_Name : nameAsObj[0],Second_Name :nameAsObj[1],Third_Name : nameAsObj[2], Amount : partnerSub.value, Date : partnersDate.value.toLocaleDateString("en-CA")})
    .then(date=>{
      
    })
  }
  
  
}

function handleMTSSubmit(){
  cards.value = []
  let sectorsSum = 0;
  getCompanyCapital().then((data)=>{
    let data_res = data.data
    data_res.forEach(element => {
      cards.value.push({title : element['Sector_Name'] , content : element['Capital']})

    });
    loadPartners()
    // let arr = data.data.sectorsCapital
    // let arr2 = data.data.sectorsWithdraw
    // data.data.sectorsCapital.forEach(element => {
    //  sectorsSum += parseInt(element['Sector_Capital_Records'])
    // });
    // cards.value.push({title : 'الرئيسية',content : parseInt(data.data.companyCapital)-sectorsSum+''})
    // console.log(Array.isArray(arr))
    // if(Array.isArray(arr) && arr.length > 0)
    // arr.forEach(element => {
    //   let flag = false;
    //   arr2.forEach(element2 => {
    //     console.log('ele :',element2)
    //       if(element['Sector_Name'] == element2['Sector_Name']) 
    //       {
    //         let value = parseInt(element['Sector_Capital_Records']) - parseInt(element2['Sector_Withdraw_Records'])
    //         cards.value.push({title : element['Sector_Name'] , content : value+""})
    //          flag = true;
    //       }

    //   });
    //   if(flag == false) cards.value.push({title : element['Sector_Name'] , content : element['Sector_Capital_Records']+""})

    // });
    // else if(data.data.sectorsWithdraw != undefined){
      
    //   data.data.sectorsWithdraw.forEach(element => {
    //     cards.value.push({title : element['Sector_Name'] , content : element['Sector_Withdraw_Records']})
    //   });
    // }
      console.log('cards length: ',cards.value.length)

  })
}

function callRequestMainToSectorTransfer(){
  if(subFlag.value){
    requestMainToSectorTransfer({sector :mainItem.value, amount: mainSub.value,date : sectorDate.value.toLocaleDateString("en-CA")}).then(data=>{
  
    })
  }
  
  
}

</script>

<style scoped>
.v-card {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
