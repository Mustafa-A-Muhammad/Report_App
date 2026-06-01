<template>
  <v-container style="width: 80vw;">
    <v-container class="border-solid rounded d-flex align-center justify-center mt-2" fluid >
      <v-row>
        <v-col cols="1">
              <v-checkbox-btn
              v-model="contributorCB"
              color="primary"
              hide-details
            >
            </v-checkbox-btn>
        </v-col>  
        <v-col cols="9"  >
          <v-form :disabled="!contributorCB" >
            <v-row>
                  
              <!-- First field: number input -->
              <v-col >  
                <v-number-input
                  v-model="form.firstNumber"
                  label="المبلغ المقبوض"
                  control-variant="hidden"></v-number-input>
              </v-col>

              <!-- Second field: dropdown -->
              <v-col >
                <v-select
                  v-model="form.selection"
                  :items="dropdownItems"
                  label="المساهم"
                />
              </v-col>

              <!-- Third field: conditional text field -->
              <!-- <v-col >
                <v-text-field
                    :disabled="form.selection !== 'Others'"
                    v-model="form.otherText"
                    label="اسم المساهم"
                />
              </v-col> -->

              <!-- Fourth field: number input -->
              <v-col >
                <v-number-input
                  v-model="form.secondNumber"
                  label="التوقفات "
                  type="number"
                    control-variant="hidden"        />
              </v-col>
            </v-row>
              <v-col cols="4">
                <v-date-input v-model="paymentDate"></v-date-input>
              </v-col>
          </v-form>
        </v-col>
        <v-col cols="2">
                  <v-btn :disabled="!contributorCB" variant="flat" style=" width: 130px; max-width: 200px;height: 50px; background-color:wheat; border-width: 3px; border-color: #F4511E;"
                          v-on:click="sendProjectPaymentContributionData()">
                    تاكيد
                  </v-btn>
              </v-col>
      </v-row>
      

    </v-container>
    <v-container class="border-solid rounded  mt-2" fluid >
      <v-row>
        <v-col cols ="1">
          <v-checkbox-btn
              v-model="investorCB"
              color="primary"
              hide-details>
            </v-checkbox-btn>
        </v-col>
        <v-col>
          <v-form :disabled="!investorCB">
            <v-row>
                  <v-col>
                    <v-text-field
                      v-model="investorForm.First_Name"
                      label="الاسم الاول">  
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="investorForm.Second_Name"
                      label="الاسم الثاني">  
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="investorForm.Third_Name"
                      label="الاسم الثالث">  
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="investorForm.Details"
                      label="ملاحظات">  
                    </v-text-field>
                  </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-number-input
                  v-model="investorForm.Payment"
                  control-variant="hidden"
                  label="المبلغ">  
                </v-number-input>
              </v-col>
              <v-col>
                <v-number-input
                  v-model="investorForm.Sub_Amount"
                  control-variant="hidden"
                  label="توقيفات">  
                </v-number-input>
              </v-col>
              
              <v-col>
                <v-date-input v-model="investorDate"></v-date-input>
              </v-col>
              <v-col>
                <v-btn :disabled="!investorCB" variant="flat" style=" width: 130px; max-width: 200px;height: 50px; background-color:wheat; border-width: 3px; border-color: #F4511E;"
                                v-on:click="sendInvestorContribution()">
                          تاكيد
                        </v-btn>
              </v-col>
              
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="border-solid rounded d-flex align-center justify-center mt-2" fluid >
      <v-row>
        <v-col cols="1">
              <v-checkbox
              v-model="expensesCB"
              color="primary"
              value="expensesCB"
              hide-details
              v-on:update:model-value="()=>console.log(expensesCB)"
            >
            </v-checkbox>
          </v-col>  
          <v-col cols="9">
            <v-form :disabled="!expensesCB">
              <v-row>
                  
                  <v-col cols="3">
                    <v-number-input
                      v-model="form2.expenses"
                      label="المبلغ المصروف"
                      control-variant="hidden">
                    </v-number-input>
                  </v-col>
                  <v-col cols="3">
                  <v-text-field
                    v-model="form2.expensesDetails"
                    label="تفاصيل"/>
                  </v-col cols="3">
                  <v-col cols="3">
                    <v-date-input v-model="expensesDate" ></v-date-input>
                  </v-col>
              </v-row>
              
            </v-form>          
          </v-col>
          <v-col cols="2">
                  <v-btn :disabled="!expensesCB" variant="flat" style=" width: 130px; max-width: 200px; height: 50px; background-color:wheat; border-width: 3px; border-color: #F4511E;"
                          v-on:click="sendProjectExpenses()">
                    تاكيد
                  </v-btn>
              </v-col>
      </v-row>
      
    </v-container>
    <v-container class="border-solid rounded d-flex align-center justify-center mt-2 " fluid >
      <v-row>
        <v-col cols="1">
        </v-col>
        <v-col cols="9">
                    <v-file-input
                      label="المرفقات"
                      v-model="images"
                      multiple
                      counter
                      chips
                      truncate-length="6"
                      accept="image/*">
                    </v-file-input>
          </v-col>
          <v-col cols="2">
                  <v-btn variant="flat" style=" width: 130px; max-width: 200px; height: 50px; background-color:wheat; border-width: 3px; border-color: #F4511E;"
                    v-on:click="apply(images,projectId)">
                    تاكيد
                  </v-btn>
              </v-col>
      </v-row>
    </v-container>
      <v-container class="border-solid rounded mt-2" >
        <v-row>
          <v-col>
            <v-text-field
              label="القيمة التخمينية"
              outlined
              readonly
              :model-value="init_cost"
              required/>
        </v-col>
        <v-col>
          <v-text-field
            label="المصروفات"
            :model-value="expenses"
            readonly
            outlined
            />
        </v-col>
        <v-col>
          <v-text-field
            label="المقبوضات"
            :model-value="payment"
            readonly
            outlined
            />
        </v-col>
        <v-col>
            <v-text-field
              label="التوقفات"
              :model-value="stoppages"
              outlined
              readonly
              />
          </v-col>
          <v-col>
            <v-text-field
            label="الربح"
            :model-value="income"
            outlined
            readonly
            />
          </v-col>
          
        </v-row>
        <v-row>
          <v-col>
            
          </v-col>
          <v-col>
            
          </v-col>
          <v-col>
            <v-text-field
              label="المساهمات"
              :model-value="contribution"
              readonly
              outlined
              />
          </v-col>
          <v-col>
            <v-col>
            <v-btn @click="displayInfo()" color="orange-darken-2" block style=" height:100%!;">
              <v-icon 
                icon="mdi-refresh">

              </v-icon>
            </v-btn>
          </v-col>
          </v-col>
          <v-col>
          
          </v-col>
        </v-row>
    </v-container>
    <v-container class="d-flex align-center justify-center mt-2 " max-width="300px">
      <v-row class="justify-center">
        <v-col cols="9">
          <v-container class="d-flex align-center justify-center">
            <v-btn variant="flat" 
              v-on:click="()=>{
                  markProjectFinish() 
                }"
              style=" width: 200px; height: 50px; background-color:wheat; border-width: 3px; border-color: #F4511E;">
              انهاء المشروع
          </v-btn>
        </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
        :model-value="current === 1"  
        text="Done"
        timer="top"
        timer-color="green"
        contained
        @update:model-value="current = -1"
      ></v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { applicationState } from '@/stores/ApplicationState';
import {requestAddInvestorToProjectContribution,requestProjectFinish , getSectorsCapital, sendProjectImages, setProjectDetails, setProjectPaymentContribution, requestProjectMonetary } from '../services/payload';
import { ref, watch ,shallowRef, onMounted, onUpdated, inject, onBeforeUpdate} from 'vue'
import { useRouter } from 'vue-router';
import { VDateInput } from 'vuetify/labs/VDateInput'


interface Header {
  title: string;
  value: string;
}


let headers = [
  { title: 'القطاع', value: 'sector_name' },
  { title: ' المجموع من المشاريع', value: 'investment_total' },
  { title: 'المجموع من المساهمين', value: 'partners_total' },
  { title: ' المجموع الكلي', value: 'combined_total' },
]

const paymentDate = ref(new Date())
const expensesDate = ref(new Date());
const form = ref({
  firstNumber: null,
  selection: '',
  otherText: '',
  secondNumber: null,
})
const form2 = ref({
  expenses : 0,
  expensesDetails : '',
  date : ''
});
const investorForm = ref({
  First_Name : '',
  Second_Name : '',
  Third_Name : '',
  Payment : 0,
  Details : '',
  Date : '',
  Sub_Amount : 0,
  Project_ID : 0
})
let current = shallowRef(-1);
const investorDate = ref(new Date())
const contributorCB= ref(false);
const investorCB = ref(false)
const expensesCB = ref(false);
const images = ref<File[]>([]);
const image = ref('');
const projectId = ref(0);
const router = useRouter();
let current_inject = inject('tabData')
let tabChanges = ref(current_inject);
const init_cost = ref(0);
const expenses = ref(0);
const income = ref(0);
const stoppages = ref(0);
const payment = ref(0);
const contribution = ref(0);
projectId.value = 0;
const sectorsCapital = ref<[]>([]);

let dropdownItems=[''];
dropdownItems.pop();
applicationState().state.sectorsNames.forEach(item=>{
  if(item != 'الرئيسية') dropdownItems.push(item)
})
// Validation rule: must contain at least 3 spaces
// Rule: must start & end with letters, and contain at least 2 spaces


function apply(par1 , par2 ){
  sendProjectImages(par1 , par2);  
  current.value = 1;
}

function sendInvestorContribution(){
  investorForm.value.Project_ID = projectId.value
  investorForm.value.Date = investorDate.value.toLocaleDateString("en-CA")
  requestAddInvestorToProjectContribution(investorForm.value);
}

async function markProjectFinish(){
  console.log("marking pressed : ", projectId.value )
  requestProjectFinish(projectId.value);
}

async function displayInfo(){
  const res = await requestProjectMonetary(projectId.value)
  init_cost.value = res['Init_Cost'];
  expenses.value = res['Expenses'];
  contribution.value = res['Sector_Contribution']
  payment.value = res['Total_Contribution'];
  income.value = res['Income'];
  stoppages.value = res['Stoppages']
}

function sendProjectPaymentContributionData(){
  setProjectPaymentContribution (projectId.value,{
    sector : form.value.selection,
    amount: form.value.firstNumber,
    contributor: form.value.selection === 'Others' ? form.value.otherText : form.value.selection,
    stoppages: form.value.secondNumber,
    details :"Project payment",
    date : paymentDate.value?.toLocaleDateString("en-CA")
  });
  
}

function sendProjectExpenses(){
  form2.value.date = expensesDate.value.toLocaleDateString("en-CA")
  setProjectDetails(projectId.value,form2.value);
}

watch(tabChanges,()=>{
  projectId.value = Number(router.currentRoute.value.params.id);
  console.log("Edit Updated watch :", projectId.value)
})

watch(router.currentRoute,()=>{
  projectId.value = Number(router.currentRoute.value.params.id);
  
})

onBeforeUpdate(()=>{
  projectId.value = Number(router.currentRoute.value.params.id);
  console.log("Edit Updated :",projectId.value)
})

onMounted(async()=>{
  projectId.value = Number(router.currentRoute.value.params.id);
  console.log("project ID :",Number(router.currentRoute.value.params.id))
  getSectorsCapital().then(data=>{
    if(data) sectorsCapital.value = data;
    else sectorsCapital.value =[]
  })
}
)

onUpdated(async()=>{
  
})
  
</script>
