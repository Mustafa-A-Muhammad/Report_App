import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import EditProject from '@/components/EditProject.vue'
import ProjectsCard from '@/components/ProjectsCard.vue'
import AddUser from '@/components/AddUser.vue'
import NewProject from '@/components/NewProject.vue'
import StaffMember from '@/components/StaffMember.vue'
import StaffView from '@/views/StaffView.vue'
import Percentage from '@/components/percentage.vue'
import { handleExpiredToken } from '@/services/AuthService'
import CompanyMain from '@/layouts/CompanyMain.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path :'/',component : AuthView},
    {path :'/main/:id',component : MainLayout},
    {path :'/editproject/:id',component : EditProject},
    {path :'/newProject', component: NewProject},
    {path : '/percentage/:id', component : Percentage},
    {path : '/companyMain', component : CompanyMain}
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/') {
    if (handleExpiredToken(router)) {
      return next('/')
    }
  }
  next()
})

export default router
