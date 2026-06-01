<template>
  <v-container>
    <v-form v-model="partnerValid" @submit.prevent="handleSubmit">
      <v-row class="pa-1" align="center" justify="center" density="comfortable">
        <v-col >
          <v-text-field
            v-model="fieldOne"
            label="الاسم الاول"
            outlined
            hide-details
            :rules="[rules.required]"          
          />
        </v-col>

        <v-col >
          <v-text-field
            v-model="fieldTwo"
            label="الاسم الثاني"
            outlined
            hide-details
            :rules="[rules.required]"          
          />
        </v-col>

        <v-col >
          <v-text-field
            v-model="fieldThree"
            label="الاسم الثالث"
            outlined
            hide-details
            :rules="[rules.required]"

          />
        </v-col>
        <v-col class="text-center">
          <v-btn type="submit" color="primary" raised style="height: 56px; width:100%;">
            اضافة
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  <v-container >
    <v-form v-model="contributionFlag" @submit.prevent="()=>{console.log(date);if(contributionFlag){addPartnerCont()}}">
      <v-row class="pa-1" align="center" justify="center" density="comfortable">
        <v-col>
          <v-combobox
            v-model="partnerName"
            label = "الشركاء"
            :items="partnersCombo"
            :rules="[(value)=>{if(value)return true; else return false}]"
            hide-details>
          </v-combobox>
        </v-col>
        <v-col>
          <v-number-input
            v-model="partnerContAmount"
            label="المبلغ"
            control-variant="hidden"
            :rules="[rules.requiredNumber]"
            hide-details
            >
          </v-number-input>
        </v-col>
        <v-col>
          <v-date-input 
            v-model="date"
            hide-details
            :rules="[(value)=>{if(value) return true;else return false}]">

          </v-date-input>
        </v-col>
        <v-col>
          <v-btn type="submit" color="primary" raised style="height: 56px; width: 100%;">
            تمويل
          </v-btn>
        </v-col>
          
      </v-row>
    </v-form>
  </v-container>
  <v-container>
    <v-data-table
      :items="partners"
      :headers="headers"
      class="mt-4"
      density="comfortable"
    ></v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import { addNewPartner, getPartners, requestAddPartnerCont } from '../services/payload'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { applicationState } from '@/stores/ApplicationState'


const fieldOne = ref('')
const fieldTwo = ref('')
const fieldThree = ref('')
const partnerValid = ref(false)
const partners = ref([])
const partnersCombo = ref([''])
const contributionFlag = ref(false)
const partnerName = ref('');
const partnerContAmount = ref(0);
const date = ref(new Date())
const headers = [
  { title: 'First Name', key: 'First_Name' },
  { title: 'Second Name', key: 'Second_Name' },
  { title: 'Third Name', key: 'Third_Name' },
]

const rules = {
  required: (value) => {
            if (!value || value.trim() === '') {
              return 'Field cannot be empty'
            }
            if (/\s/.test(value)) {
              return 'Spaces are not allowed'
            }
            return true
          },
  requiredNumber :(value : number)=>{
          if (value == 0 ) {
            return false
          }
          return true
  }
}

async function loadPartners() {
  partners.value = await getPartners()
  partnersCombo.value = partners.value.map(partner => {
  return `${partner['First_Name']} ${partner['Second_Name']} ${partner['Third_Name']}`;
});
}

onMounted(() => {
  loadPartners()
})

onUpdated(()=>{
  loadPartners();
})

async function addPartnerCont(){
  let partnerName_ = partnerName.value.split(" ")
  let partnerContAmount_ = partnerContAmount.value
  requestAddPartnerCont({name : partnerName_,amount : partnerContAmount_,date : date.value.toLocaleDateString("en-CA"),sector : applicationState().state.sector})
}



async function handleSubmit() {
  const payload = {
    First_Name: fieldOne.value,
    Second_Name: fieldTwo.value,
    Third_Name: fieldThree.value,
  }

  try {
    if (partnerValid.value) {
      const result = await addNewPartner(payload)
      console.log('Form submitted:', result)
      await loadPartners()
    }
  } catch (error) {
    console.error('Unable to submit form:', error)
  }
}
</script>
