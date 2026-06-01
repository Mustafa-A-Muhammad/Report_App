// main.js
import { createApp } from 'vue'
import router from './router/index.ts'
import { createPinia } from 'pinia'// Vuetify imports
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as _components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
  components:_components,
  directives,
})

createApp(App)
.use(vuetify)
.use(router)
.use(createPinia())
.mount('#app')
