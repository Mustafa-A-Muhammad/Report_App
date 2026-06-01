import { ca, da } from 'vuetify/locale';
import api from './Api'
import { useAuthStore } from '@/stores/AuthState';

export const login = async (email , password ) => {
  console.log("api", email, password);
  try {
     const response = await api.post('/login', { "email" : email, "password" : password })
     return response
  } catch (error) {
     console.error('Login failed:', error)
  }
  
}

export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getProjects = async (sector_,payload_ ={}) => {
  try {
     return api.post('/projects',{sector : sector_,payload : payload_}).then((data)=>{
      const response = data.data.projects;
      return response
     });
    
  }
    catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  }

export const getStaff = async (sector)=>{
  try{
    console.log('getStaff called with sector:', sector);
    const response = await api.get('/staff/'+sector);
    console.log(response.data);
    return response.data

  }catch(error){
    console.error('Failed to fetch staff:', error);
  }
}

export const getExpenses = async (value )=>{
  try{
      console.log('getExpenses called with value:', value);
      const response = await api.get(`/expenses/${value}`,{headers:{Authorization : 'Bearer'+' '+ useAuthStore().accessToken
      }});
      console.log(response.data);
      return response.data
    }catch(error){
      console.error('Failed to fetch expenses:', error);
    }
}

function parseJwt(token) {
  try {
    const parts = token.split('.')
    if (parts.length < 2 || parts[1] === undefined) return null
    let payload = parts[1]
    payload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const pad = payload.length % 4
    if (pad === 2) payload += '=='
    else if (pad === 3) payload += '='
    else if (pad === 1) payload += '=='
    const decoded = atob(payload)
    const json = decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(json)
  } catch (error) {
    return null
  }
}

export const handleExpiredToken = (router) => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    router.push('/')
    return true
  }
  const payload = parseJwt(token)
  if (!payload || typeof payload.exp !== 'number') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/')
    return true
  }
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp < now) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/')
    return true
  }
  return false
}

export const getDrawerItems = async (currentTapState) => {
  // items = [
  //   {
  //     title: 'مقاولات',
  //     value: 'foo',
  //     icon: 'mdi-office-building',
  //   },
  //   {
  //     title: 'تصميم',
  //     value: 'bar',
  //     icon: 'mdi-pencil'
  //   },
  //   {
  //     title: 'معمل الخشب',
  //     value: 'fizz',
  //     icon: 'mdi-factory'
  //   },
  //   {
  //     title: 'الاشراف',
  //     value: 'buzz',
  //     icon: 'mdi-account-supervisor'
  //   },
  //   {
  //     title: 'التجاري',
  //     value: 'commercial',
  //     icon: 'mdi-google-my-business'
  //   }];
  try {
    return api.post('/drawer-items',{currentTapState}).then((res)=>{
      console.log(res);
      return res.data;
    });
    
  } catch (error) {
    console.error('Failed to fetch drawer items:', error);
    return [{}]
  }
}
