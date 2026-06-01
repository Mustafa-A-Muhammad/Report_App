<template>
  <v-container>
    <v-tabs
      v-model="tab"
      align-tabs="center"
      color="deep-purple-accent-4"
    >
      <v-tab :value="1">مشاريع</v-tab>
      <v-tab :value="2">شركاء</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <projects-report></projects-report>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <partners-report></partners-report>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
  <v-container>
    <!-- <v-data-table
      :headers="headers"
      :items="data"
      class="mt-4"
      density="comfortable"
    /> -->
  </v-container>
</template>

<script setup lang="ts">
import ProjectsReport from '@/reports/ProjectsReport.vue';
import PartnersReport from '@/reports/PartnersReport.vue';
import { ref } from 'vue'

interface ReportTableProps {
  headers: Array<Record<string, unknown>>
  data: Array<Record<string, unknown>>
}

const tab = ref('1')
// const props = defineProps<ReportTableProps>()

// const { headers, data } = props
</script>
