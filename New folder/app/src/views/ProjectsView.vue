<template>
    <v-container fluid>
            <v-tabs
            v-model="tab"
            align-tabs="center"
            bg-color="primary-blue"
            >
                <v-tab value="1" :click="ret()">
                    <v-icon icon="mdi-account-hard-hat-outline"></v-icon>
                </v-tab>

                <v-tab value="2">
                    <v-icon icon="mdi-folder-edit-outline"></v-icon>
                </v-tab>
                <v-tab value="3">
                    <v-icon icon="mdi-file-edit-outline"></v-icon>
                </v-tab>
                <v-tab value="4" :disabled="!projectFinishFlag">
                    <v-icon icon="mdi-check-outline"></v-icon>
                </v-tab>

            </v-tabs>        
            <v-tabs-window v-model="tab" fluid>
                <v-tabs-window-item  value="1" fluid>
                    <v-container >
                        <v-row>
                            <v-col v-for="value in items_projects" cols="4" >
                                <ProjectsCard @tabChanges="()=>{tab = '2'}" :project-name="value['Project_Name']" :project-state="value['Status']" :project-i-d="value['ID']" :resources="[]" :number-of-days="value['Days_To_Finish']" :date="value['Date']"></ProjectsCard>
                            </v-col>
                        </v-row>                    
                    </v-container>
                    
                </v-tabs-window-item>
                <v-tabs-window-item value="2" >
                    <EditProject @projectFinish="()=>{projectFinishFlag = true; tab = '4'}"></EditProject>
                </v-tabs-window-item>
                <v-tabs-window-item value="3">
                    <NewProject></NewProject>
                </v-tabs-window-item>
                <v-tabs-window-item  value="4" fluid >
                  <percentage @projectFinishDone="()=>{tab= '1'}"></percentage>
                </v-tabs-window-item>
            </v-tabs-window>
    </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, onMounted, onUpdated, provide, ref, watch } from 'vue';
import {getProjects} from '../services/AuthService.js'
import ProjectsCard from '@/components/ProjectsCard.vue';
import { applicationState } from '@/stores/ApplicationState.js';
import EditProject from '@/components/EditProject.vue';
import NewProject from '@/components/NewProject.vue';
import percentage from '@/components/percentage.vue';

const tab = ref('1');
const items_projects = ref([]);
const projectFinishFlag = ref(false)
const applicationState_ = applicationState();
provide('tabData',tab)

onBeforeMount(()=>{
})

// onMounted(()=>{
//     ret()
    
// })

async function ret(){
    console.log(" sector req :",applicationState_.state.sector)
    getProjects(applicationState_.state.sector).then((data)=>{
        if(data) items_projects.value = data;
        //tab.value = '2'
    });
  }

watch(applicationState_.state,()=>{
  ret();
  projectFinishFlag.value = false;
})

watch(tab,()=>{
  if(tab.value != '4')
    projectFinishFlag.value = false;
})

</script>