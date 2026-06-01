<template>
    <v-card class="ma-3x" min-width="300px" max-width="344px">
        <v-carousel :cycle="cycleTrigger" interval="1000"  height="250px" :key="projectID">
            <v-carousel-item 
            v-for="(value , i) in srcs"
            :src="value"
            image-class="imageClass"

            >
            </v-carousel-item>
            
        </v-carousel>

        <v-card-title class="text-right">
            {{ project.projectName }}
        </v-card-title> 

        <v-card-actions>
        <v-btn
            :color="statusColor"
            :ripple="false"
            variant="outlined"
            v-on:click="()=>console.log('test')"
        >{{state}}</v-btn>

        <v-spacer></v-spacer>

        <v-btn
            color="red"
            variant="elevated"
            v-on:click.prevent="()=>{
                _router.push('/main/'+project.projectID)
                $emit('tabChanges')
                }"

        >تعديل</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { getProjectImages, getSectorsCapital } from '@/services/payload';
import { inject, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fileTypeFromBuffer } from "file-type";
import { B } from 'vue-router/dist/index-D_VEAp3P.js';
import '../assests/style.css';
import { applicationState } from '@/stores/ApplicationState';

interface ProjectDetails {
  projectName: string;
  projectState: string;
  resources: string[];
  projectID: number;
  numberOfDays : number;
  date : string
}


const statusColor = ref('');
let state : string = ''
const srcs = ref<string[]>([]);
let cycleTrigger = ref(true);
const project = defineProps<ProjectDetails>();
let tab = ref(inject('tabData'));
const applicationState_ = applicationState();


let timeoutId;

// Helper function to calculate days remaining
const calculateDaysRemaining = (): number => {
  const startDate = new Date(project.date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + project.numberOfDays);
  console.log(startDate.getDate(), " : ", endDate.getDate())
  const currentDate = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(daysRemaining, 0);
};

// Helper function to update state based on project status
const updateState = (): void => {
  if(project.projectState === 'Pending'){
    statusColor.value = 'yellow';
    const daysRemaining = calculateDaysRemaining();
    state = project.projectState + " : " + daysRemaining + " days left";
  }
  else {
    statusColor.value = 'green';
    state = project.projectState
  }
};



onBeforeUpdate(async ()=>{
  project.resources.forEach(url => URL.revokeObjectURL(url));
  srcs.value.forEach(url => URL.revokeObjectURL(url));
  project.resources.length = 0;
  cycleTrigger.value = true;
  srcs.value.length = 0;
  if(tab.value === '1'){
    updateState();
    const response = await getProjectImages(project.projectID);
    if(response?.status === 200){
        for (let i in response.data){
            let bytes = new Uint8Array(response.data[i].imgae.data);
            let bytesType = await fileTypeFromBuffer(bytes);
            project.resources.push(URL.createObjectURL(new Blob([bytes], { type: bytesType?.mime })));
        }
        srcs.value = project.resources;
    
    }else {
        while(project.resources.length > 0) project.resources.pop;

    }
  }
  
 })    

onMounted(async()=>{
    
    updateState();
    
    const response = await getProjectImages(project.projectID);
    if(response?.status === 200){
        for (let i in response.data){
            let bytes = new Uint8Array(response.data[i].imgae.data);
            let bytesType = await fileTypeFromBuffer(bytes);
            project.resources.push(URL.createObjectURL(new Blob([bytes], { type: bytesType?.mime })));
        }
        srcs.value = project.resources;
    
    }else {
        while(project.resources.length > 0) project.resources.pop;

    }
    
});


watch(applicationState_.state,()=>{
  project.resources.forEach(url => URL.revokeObjectURL(url));
  srcs.value.forEach(url => URL.revokeObjectURL(url));
  project.resources.length = 0;
  cycleTrigger.value = true;
  srcs.value.length = 0;
})

watch(tab,()=>{
  project.resources.forEach(url => URL.revokeObjectURL(url));
  srcs.value.forEach(url => URL.revokeObjectURL(url));
  project.resources.length = 0;
  cycleTrigger.value = true;
  srcs.value.length = 0;
  if(tab.value =='1'){
    updateState();
    
    let response;
    getProjectImages(project.projectID).then(async (data)=>{
      response = data;
    if(response?.status === 200){
        
        for (let i in response.data){
            let bytes = new Uint8Array(response.data[i].imgae.data);
            let bytesType = await fileTypeFromBuffer(bytes);
            project.resources.push(URL.createObjectURL(new Blob([bytes], { type: bytesType?.mime })));
        }
        srcs.value = project.resources;
    
    }else {
        while(project.resources.length > 0) project.resources.pop();
        srcs.value = project.resources;
    }
    });
    
}
})

const _router = useRouter()



</script>   

<style scoped>


</style>