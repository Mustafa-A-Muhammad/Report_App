<template>

    <v-tabs
      v-model="tab"
      align-tabs="center"
      color="deep-purple-accent-4">
      <v-tab :value="1">الشركاء</v-tab>
      <v-tab :value="2">الصندوق</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <three-text-form></three-text-form>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <capital-cards></capital-cards>
      </v-tabs-window-item>
    </v-tabs-window>
</template>

<script setup lang="ts">
import CapitalCards from '@/components/CapitalCards.vue';
import Report from '@/components/Report.vue';
import ThreeTextForm from '@/components/ThreeTextForm.vue';
import { ref } from 'vue'

const tab = ref(0)

</script>
