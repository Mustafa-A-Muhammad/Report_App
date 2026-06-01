<template>
    <v-form  @submit.prevent="callRequestAddNewProject()" class="">
    <v-container max-width = "400px" class="border-solid roundedmt-2">
            <v-row gap="0" class="ma-1">
                <v-col class ="text-center! ma-1"  >                
                    <v-text-field 
                        v-model="projectName"
                        :rules="firstNameRules"
                        bg-color = "blue-lighten-5"
                        :center-affix="true"
                        label="اسم المشروع"
                    ></v-text-field>
                    </v-col>
                <v-col class ="text-center! ma-1"  >                
                    <v-text-field 
                        v-model="form.projectLoc"
                        bg-color = "blue-lighten-5"
                        :center-affix="true"
                        label="موقع المشروع"
                    ></v-text-field>
                    </v-col>                    
            </v-row>
            <v-row gap="0" class="ma-1">
                <v-col class ="text-center! ma-1"  >                
                    <v-number-input
                        v-model="form.projectInitCost"
                        bg-color = "blue-lighten-5"
                        :center-affix="true"
                        label="القيمة التخمينية"
                        control-variant="hidden"
                    ></v-number-input>
                </v-col>
                <v-col class ="text-center! ma-1"  >                
                    <v-number-input
                        v-model="form.projectFinishDays"
                        bg-color = "blue-lighten-5"
                        :center-affix="true"
                        label="مدة تنفيذ المشروع"
                        control-variant="hidden"
                    ></v-number-input>
                    </v-col>                    
            </v-row>            
                
            <v-row gap="0" class="ma-1">
                <v-col class=""  >
                    <v-date-picker position="relative" class="w-100 pa-0! ma-0!" v-model="selectedDate" hide-header></v-date-picker>
                </v-col>
            </v-row>
            <v-row gap="0" class="ma-1">
                <v-col class="">
                    <v-btn class="" type="submit" block ripple variant="elevated" color="orange-darken-4">Submit</v-btn>
                </v-col>
            </v-row>
                
            
        </v-container>
    </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { v } from 'vue-router/dist/index-D_VEAp3P.js'
import { useDate } from 'vuetify'
import { addProject } from '@/services/payload'
import { applicationState } from '@/stores/ApplicationState'

    const applicationState_ = applicationState();
    const projectName = ref('')
    const selectedDate = ref()
    const form = ref({
            projectName : '',
            projectLoc : '',
            projectInitCost : 0,
            projectFinishDays : 0,
            date : '',
            sector : ''

        })
    const firstNameRules = [
        value => {
        if (value?.length >= 3) return true
        return 'First name must be at least 3 characters.'
        },
    ]
    async function callRequestAddNewProject(){
        form.value.date = selectedDate.value?selectedDate.value.toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA")
        form.value.projectName = projectName.value;
        form.value.sector = applicationState_.state.sector;
        console.log(form.value.date)
        try{
            const res = await addProject(form.value);
            let currentState = applicationState_.state.sector
            applicationState_.state.sector = '';
            applicationState_.state.sector = currentState;
            console.log('Project added:', res);
        }catch(err){
            console.error('Failed to add project:', err);
        }
    }
   
   
  
</script>