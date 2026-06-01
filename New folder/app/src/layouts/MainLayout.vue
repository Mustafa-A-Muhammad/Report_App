<template>
  <v-card fluid style="overflow: scroll; scrollbar-width: none; -ms-overflow-style: none;">
    <v-layout >
      <v-app-bar color="primary">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{Username}}</v-toolbar-title>
          <template v-slot:append>
            <v-btn v-on:click="useAuthStore().logout(router)" icon="mdi-dots-vertical"></v-btn>
        </template>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list
          density="compact"
          
          v-on:click:select="(element_)=>{
              let arr = applicationState_.state.sectorsNames
              if(element_.id != 'الرئيسية') mainAct = false;
              else mainAct = true;
              applicationState_.state.sector = arr[currentTapState.indexOf(true)] || 'الرئيسية';
          }">
          
          <v-list-item
            v-for="(item,i) in items"
            :active="currentTapState[i]"
            :key="item"
            :value="item"
            align="center"
            v-on:click="()=>{
              for(let i = 0; i < currentTapState.length; i++)currentTapState[i] = false;
              currentTapState[i] = true;
              }"
          >
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>

      </v-navigation-drawer>

      <v-main style="height: 100vh" class="pd-0 md-0">
        <v-tabs
        align-tabs="center"
        color="blue"
        v-model="current_tap"
        stacked
      >
        <v-tab  :value="1" >
          <v-icon icon="mdi-briefcase-outline"></v-icon>
          مشاريع
        </v-tab>
        <v-tab  :value="2">
          <v-icon icon="mdi-account-hard-hat-outline"></v-icon>
          موظفين
        </v-tab>
        <v-tab  :value="3">
          <v-icon icon="mdi-cash"></v-icon>
          مصاريف
        </v-tab>
        <v-tab  :value="4">
          <v-icon icon="mdi-human-male-board"></v-icon>
          ادارة
        </v-tab>
        <v-tab :value="5">
          <v-icon icon="mdi-chart-bar"></v-icon>
          تقارير
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="current_tap" :transition="false" class="pa-0"  fluid>
        <v-tabs-window-item :value="1" class="pa-0" >
            <v-container class="d-flex pa-0" fluid>
              <projects-view v-if="mainAct != true"></projects-view>
          </v-container>
        </v-tabs-window-item>
        <v-tabs-window-item :value="2" class="pa-0">
          <staff-view></staff-view>
        </v-tabs-window-item>
        <v-tabs-window-item :value="3" class="pa-0">
            <expenses-view></expenses-view>
        </v-tabs-window-item>
        <v-tabs-window-item :value="4">
          <company-main></company-main>
        </v-tabs-window-item> 
        <v-tabs-window-item :value="5">
          <report></report>
        </v-tabs-window-item>
      </v-tabs-window>
      
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUpdated, provide, ref, watch } from 'vue'
import {getProjects,getDrawerItems} from '../services/AuthService'
import api from '../services/Api.js'
import { v } from 'vue-router/dist/index-D_VEAp3P.js'
import EditProject from '@/components/EditProject.vue';
import ProjectsCard from '@/components/ProjectsCard.vue';
import StaffView from '../views/StaffView.vue';
import ExpensesView from '@/views/ExpensesView.vue';
import { useAuthStore } from '@/stores/AuthState';
import { applicationState } from '@/stores/ApplicationState.js';
import { requestCurrentDep } from '@/services/payload.js';
import { useRouter } from 'vue-router';
import ProjectsView from '@/views/ProjectsView.vue';
import CompanyMain from './CompanyMain.vue';
import Report from '@/components/Report.vue';

const currentTapState = ref ([true,false , false , false , false , false])
const src_ = ref< string[]>([]);
const router = useRouter();
const Username = useAuthStore().user;
const mainAct = ref(false);
let items = ['']

    onMounted(() => {
      let arr = ['']
      // currentTapState.value[0] = true;
      getDrawerItems(currentTapState.value).then((res) => {
        items = res
        console.log('final :',items)
        applicationState_.state.sectorsNames = items.map(row=> row['Sector_Name'])
        arr = applicationState_.state.sectorsNames;
        applicationState_.state.sector = arr[0]? arr[0] : '' ;
        items = arr;
        mainAct.value = true;
        // ret("Sec1")
      }).catch((err) => {
        console.error('Failed to fetch drawer items:', err);
      }); 
      
    })
    
    const current_tap = ref(1);

  

  const drawer = ref(false)
  const drawerTap = ref('')
  const group = ref(0)
  const applicationState_ = applicationState();

  // watch(drawerTap, () => {
  //   drawer.value = false
  // })
</script>