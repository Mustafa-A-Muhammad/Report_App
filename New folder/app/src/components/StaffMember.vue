<template>
    <v-container class="border-solid rounded d-flex align-center justify-center mt-2 align-center; justify-center;" >
        <v-row class="align-center justify-center">
            <v-col cols="1">
               <v-checkbox-btn
                    v-model="editCB"
                    color="primary"
                    hide-details>
                </v-checkbox-btn> 
            </v-col >
            <v-col cols="3">
                <v-label :text="staffMemberPropsInstance.name"></v-label>
            </v-col>
            <v-col cols='8'>
                <v-form :disabled="!editCB">
                    <v-row class="align-center justify-center">
                        <v-col>
                            <v-number-input
                                v-model="form.salary"
                                label="الراتب"
                                control-variant="hidden"
                                hide-details></v-number-input>
                        </v-col>
                        <v-col>
                            <v-number-input
                                v-model="form.bonus"
                                label="الحوافز"
                                control-variant="hidden"
                                hide-details></v-number-input>
                        </v-col>
                        <v-col>
                            <v-number-input
                                v-model="form.cuts"
                                label="الاستقطاع"
                                control-variant="hidden"
                                hide-details></v-number-input>
                        </v-col>
                        <v-col>
                            <v-btn :disabled="!editCB" variant="flat" style=" width: 130px; max-width: 200px; background-color:wheat; border-width: 3px; border-color: #F4511E;"
                                    v-on:click.prevent="requestStaffSalaryReg()">
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
import api from '@/services/Api';
import { applicationState } from '@/stores/ApplicationState';
import { onMounted, onUpdated, ref } from 'vue'

onUpdated(()=>{
    console.log("Staff Updated")
})

onMounted(()=>{
    console.log("staff mounted")
})

interface StaffMemberProps{
    id : string;
    name: string;
    
}


const staffMemberPropsInstance = defineProps<StaffMemberProps>();
const editCB = ref(false);
const form = ref({
    id : 0,
    salary : 0,
    bonus : 0,
    cuts: 0,
    sector : applicationState().state.sector
})

function requestStaffSalaryReg(){
    form.value.id = parseInt(staffMemberPropsInstance.id,10);
    api.post('/staff/salary/'+form.value.id,form.value).then((data)=>{
        console.log(data);
    })
}
</script>