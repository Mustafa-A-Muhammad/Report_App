<template>
    <v-container class ="border-solid rounded d-flex align-center justify-center mt-2 align-center; justify-center;" >
        <v-row>
            <V-col cols="1">
                <v-checkbox
                    v-model="expensesCB"
                    color="primary"
                    value="primary"
                    hide-details
          ></v-checkbox>
            </V-col>
            <v-col cols="11">
                <v-form :disabled="!expensesCB">
                    <v-row>
                        <v-col>
                            <v-number-input
                                v-model="form.expenses"
                                label="المبلغ"
                                control-variant="hidden"
                                hide-details></v-number-input>
                        </v-col>
                        <V-col >
                            <v-combobox
                                v-model="form.type"
                                label="نوع المصروف"
                                :items="['موجودات', 'نهائية', 'تشغيلية']"
                                hide-details
                            >
                            </v-combobox>
                        </V-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="form.details"
                                label="الوصف"
                                control-variant="hidden"
                                hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn :disabled="!expensesCB" variant="flat" style=" width: 130px; max-width: 200px;height: 50px; background-color:wheat; border-width: 3px; border-color: #F4511E;"
                                    @click="callRequestExpensesReg()">
                                تاكيد   
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { requestExpensesReg } from '../services/payload';
import { applicationState } from '@/stores/ApplicationState';


const expensesCB = ref(false);
let secToNum : number = 0;

const form = ref({
    expenses : 0,
    type :  '',
    details : '',
    sector : ' ',
    sectorToNum : ' ',
    date : new Date().toLocaleDateString()
})

function callRequestExpensesReg(){
  form.value.sector = applicationState().state.sector
  form.value.sectorToNum = applicationState().state.sector
    requestExpensesReg(form.value)
}

watch(applicationState().state,()=>{
    form.value.sectorToNum = applicationState().state.sector;
})
</script>