<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col >
        <v-card elevation="6">
          <v-card-title class="text-h5 text-center">
            اضافة مستخدم
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <!-- Username -->
              <v-text-field
                v-model="username"
                label="اسم المستخدم"
                prepend-icon="mdi-account"
                required
              />

              <!-- Password -->
              <v-text-field
                v-model="password"
                label="رمز الدخول"
                type="password"
                prepend-icon="mdi-lock"
                required
              />

              <!-- Role -->
              <v-row class="mt-4" align="center">
                <v-col cols="auto" class="d-flex align-center">
                  <span class="text-subtitle-1">المستوى :</span>
                </v-col>
                <v-col class="d-flex align-center">
                  <v-radio-group v-model="role" inline hide-details>
                    <v-radio label="Admin" value="admin" hide-details />
                    <v-radio label="User" value="user" hide-details/>
                  </v-radio-group>
                </v-col>
              </v-row>

              <!-- Sector Access -->
              <v-row class="mt-4" align="center">
                <v-col cols="auto" class="d-flex align-center">
                  <span class="text-subtitle-1">صلاحيات الافرع :</span>
                </v-col>
                <v-col class="d-flex align-center">
                  <v-row>
                    <v-col cols="auto" v-for="sector in sectors_eng" :key="sector" class="d-flex align-center">
                      <v-checkbox
                        v-model="roleAccess"
                        :label="sectors[sectors_eng.indexOf(sector)]"
                        :value="sector"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <!-- Module Access -->
              

              <!-- Submit Button -->
              <v-btn type="submit" color="primary" block class="mt-4">
                Submit
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { requestAddUser } from '@/services/payload'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const role = ref('user')
const roleAccess = ref([])

const sectors = ['المقاولات', 'التصميم', 'الاشراف', 'معمل الخشب','التجاري']
const sectors_eng = ['Contracting', 'Design', 'Supervision', 'Wood_Workshop','Commercial']

function handleSubmit() {
  const formData = {
    email: username.value,
    password: password.value,
    role: role.value,
    roleAccess: roleAccess.value
  }
  console.log('Form submitted:', formData)
  requestAddUser(formData);
  alert('Form submitted! Check console for data.')
}
</script>
