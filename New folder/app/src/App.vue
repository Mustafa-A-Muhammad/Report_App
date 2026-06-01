<script setup lang="ts">
import ProjectsCard from './components/ProjectsCard.vue';
import NewProject from './components/NewProject.vue';
import EditProject from './components/EditProject.vue';
import { RouterView } from 'vue-router';
import ProjectsView from './views/ProjectsView.vue';
const arr : Array<string> =['https://cdn.vuetifyjs.com/images/cards/sunshine.jpg', 'https://cdn.vuetifyjs.com/images/cards/hotel.jpg', 'https://cdn.vuetifyjs.com/images/cards/docks.jpg']
</script>

<template>
    <RouterView></RouterView>
</template>