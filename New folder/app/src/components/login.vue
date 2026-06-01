<template>
    <v-form v-on:submit.prevent="submit_method">
        <v-text-field
            v-model="username"
            label="اسم المستخدم"
            :rules="rules.username"
            clearable
        ></v-text-field>

        <v-text-field
            v-model="password"
            label="رمز الدخول"
            type="password"
            :rules="rules.password"
        ></v-text-field>
        <v-btn class="mt-2" type="submit" block>تسجيل الدخول</v-btn>
    </v-form>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/AuthState.ts'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const username = ref('');
const password = ref('');
const rules = {username:[(v: string) => !!v || 'مطلوب'],
            password:[(v: string) => !!v || 'مطلوب']}  

onMounted(() => {
    if (authStore.checkAuthOnStartup()) {
        router.push('/main/1')
    }
})
async function submit_method() {
    try {
           const response = await authStore.login(username.value,password.value );
              if (response) {
                console.log("log in response : ",response)
                router.push('/main/1')
              }

    } catch (error) {
        // Handle login error, e.g., show error message
    }
    
}
</script>