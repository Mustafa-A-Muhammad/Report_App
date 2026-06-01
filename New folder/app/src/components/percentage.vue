<template>
  <v-container>
    <v-form>
      <!-- Static row: label + number input -->
      <v-row class="mb-4">
        <v-col cols="8">
          <div>{{applicationState().state.sector}}</div>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model.number="staticNumber"
            type="number"
            label="Value"
            hide-details
            dense
          />
        </v-col>
      </v-row>

      <v-divider color="warning" :thickness="9"/>

      <!-- Dynamic rows: rendered from fetched labels -->
      <v-row
        v-for="(label, index) in dynamicRows"
        :key="label + index"
        class="mt-4"
      >
        <v-col cols="8">
          <div>{{ label }}</div>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model.number="dynamicValues[index]"
            type="number"
            :label="`Value ${index + 1}`"
            hide-details
            dense
          />
        </v-col>
          <v-divider />
      </v-row>
      <v-row>
        <v-col></v-col>
        <v-col>
          <v-btn block color="red"
            variant="elevated"
            v-on:click="callRequestIncomeDist(); $emit('projectFinishDone')">
            تاكيد
          </v-btn>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../services/Api'
import { useRouter } from 'vue-router'
import { applicationState } from '../stores/ApplicationState'

const departmentCB = ref(false)
const staticNumber = ref<number | null>(null)
const dynamicRows = ref<string[]>([])
const dynamicValues = ref<number[]>([])
const router = useRouter()
const appState = applicationState()

async function fetchLabels() {
  try {
    const projectId = router.currentRoute.value?.params?.id
    const sector = appState.state?.sector ?? ''
    const body = { sector, projectId }
    console.log(body)
    const res = await api.post('/percentage-labels', body)
    const data = res?.data
    if (Array.isArray(data) && data.length) {
      dynamicRows.value = data
      dynamicValues.value = dynamicRows.value.map(() => 0)
      return
    }
  } catch (e) {
    // network or parse error - fall back to defaults
  }

  // fallback labels
  dynamicRows.value = ['Label A', 'Label B', 'Label C']
  dynamicValues.value = [0, 0, 0]
}

onMounted(() => {
  fetchLabels()
})

function callRequestIncomeDist(){
  console.log(dynamicValues.value, ' : ', staticNumber.value)
}

</script>