import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService, logout as logoutService } from '../services/AuthService'
import { tr } from 'vuetify/locale'
import { useRoute } from 'vuetify/lib/composables/router.mjs'

export const useAuthStore = defineStore('auth', () => {
  // 🔹 State
  const accessToken = ref<string>('')
  const refreshToken = ref<string>('')
  const user = ref<null | { id: number; name: string; role: string }>(null)
  let expire =0;

  // 🔹 Getters (computed)
  const isAuthenticated = computed(() => !!accessToken.value)
  const userRole = computed(() => user.value?.role ?? 'guest')
  const isAdmin = computed(() => user.value?.role === 'admin')

  // 🔹 Actions
  async function login(email: string , password: string ) {
    try {
        console.log("login_AuthState" , email , password);
        const requestResponse = await loginService(email, password )
        if (requestResponse != undefined){
        accessToken.value = requestResponse.data.accessToken 
        refreshToken.value = requestResponse.data.refreshToken
        user.value = requestResponse.data.user.email
        console.log(requestResponse.data);
        // Persist tokens
        localStorage.setItem('access_token', accessToken.value)
        localStorage.setItem('refresh_token',refreshToken.value)

        return true
        }
        else return false
    } catch (error) {
        console.error('Login failed:', error)
        return false
    }

    
    
  }

  async function logout(router : any) {
    await logoutService()
    accessToken.value = ''
    refreshToken.value = ''
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/');
  }

  function checkAuthOnStartup() {
    const storedAccessToken = localStorage.getItem('access_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    if (storedAccessToken && storedRefreshToken) {
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken
      return true;
    }
    else return false
  }
  // 🔹 Expose state, getters, actions
  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    userRole,
    isAdmin,
    login,
    logout,
    checkAuthOnStartup
  }
})
