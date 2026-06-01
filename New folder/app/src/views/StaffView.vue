<template>
    <v-container>
            <v-tabs
            v-model="tab"
            align-tabs="center"
            bg-color="primary-blue"
            stacked>
                <v-tab value="1" v-on:click="()=>ret()">
                    <v-icon icon="mdi-account-hard-hat-outline"></v-icon>
                </v-tab>

                <v-tab value="2">
                    <v-icon icon="mdi-folder-edit-outline"></v-icon>
                </v-tab>

            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item 
                    value="1"
                >
                  <v-row class="mt-2 align-center justify-center">
                    <v-col>
                      <v-form v-on:submit.prevent="callAddStaffMember()">
                        <v-row class="h-100 align-strech justify-center">
                          <v-col>
                            <v-text-field
                              v-model="staffAdd.firstName"
                              label="الاسم الاول"
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="staffAdd.secondName"
                              label="الاسم الثاني"
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="staffAdd.thirdName"
                              label="الاسم الثالث"
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-btn type="submit" density="default" size="x-large" variant="flat" style="  width: 130px; max-width: 200px; background-color:wheat; border-width: 3px; border-color: #F4511E;" block >
                              اضافة
                          </v-btn>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                       <StaffMember 
                        v-for="value in resource"
                        :id="value['id']"
                        :name="value['name']">

                    </StaffMember>
                    </v-col>
                   </v-row>
                </v-tabs-window-item>
                <v-tabs-window-item value="2">
                    <AddUser></AddUser>
                </v-tabs-window-item>
            </v-tabs-window>
    </v-container>
</template>

<script setup lang="ts">
import { getStaff } from '@/services/AuthService';
import StaffMember from '@/components/StaffMember.vue';
import {onMounted, onUpdated, ref, watch} from 'vue'
import AddUser from '@/components/AddUser.vue';
import { useAuthStore } from '@/stores/AuthState';
import { applicationState } from '@/stores/ApplicationState';
import {addStaffMember} from '@/services/payload'

const resource = ref([])
const tab = ref(1);
const staffAdd = ref({
  firstName : '',
  secondName : '',
  thirdName : '',
  sector : ' '
});

onUpdated(()=>{
    
    ret();
});
onMounted(()=>{
    ret();
})

async function ret()
{
    
    resource.value = await getStaff(applicationState().state.sector);
    console.log("resource : ", resource.value)
}

function callAddStaffMember(){
  staffAdd.value['sector'] = applicationState().state.sector
  
  addStaffMember(staffAdd.value)
}

watch(applicationState().state,async()=>{
    ret();
})

</script>