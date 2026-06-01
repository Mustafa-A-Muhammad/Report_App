 import id from "vuetify/lib/locale/id.mjs";
import api from "./Api";
import { applicationState } from "@/stores/ApplicationState";
import { useAuthStore } from "@/stores/AuthState";
import { da } from "vuetify/locale";


export async function sendProjectImages(file , id) {
  const formData = new FormData();
  file.forEach(element => {
    formData.append("file", element);    
  });
  formData.append("projectId", id);
   try{
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  } catch (err) {
    console.error("Upload failed:", err);
  }

}

export async function getProjectImages(id) {
  try {
    const response = await api.get(`/images/${id}`);
    if(response?.status === 200) return response;
    //return URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
  } catch (error) {
    return null;
  }
}

export async function getSectorsCapital(){
  try {
    const response = await api.get("/sectors/capital");
    if(response?.status === 200) return response.data.projects;
  } catch (error) {
    return null;
  }
}

export async function getCompanyCapital() {
  try {
    const response = await api.get('/company-capital');
    if (response.data) return response.data;
    return null;
  } catch (error) {
    console.error('getCompanyCapital failed:', error);
    return null;
  }
}

export async function requestAddPartnerCont(payload){
  console.log(payload)
  api.post('/partner/contribution',payload).then(res=>{
    console.log(res.data)
  })
}

export async function setProjectPaymentContribution(projectId, contribution) {
  try {
    const response = await api.post("/payment/contribution", {
      projectId,
      contribution
    });
    if(response?.status === 200) return response.data;
  } catch (error) {

  }
}

export async function setProjectDetails(projectID, details) {
  try{
    const response = await api.post("/project/details",{
      projectID,
      details
    })
    if(response.status === 2000) return response.data

  }catch(err){

  }
}

export async function requestCurrentDep(){
  
}

export async function addNewPartner(requestBody) {
  try {
    const response = await api.post('/partner/add', requestBody)
    return response.data
  } catch (error) {
    console.error('sendTextInputs failed:', error)
    throw error
  }
}

export async function getPartners() {
  try {
    const response = await api.get('/partners')
    return response.data
  } catch (error) {
    console.error('getPartners failed:', error)
    return []
  }
}

export async function requestPartnerContribution(partnerID) {
  try {
    const response = await api.post('/partner-contribution', { partnerID })
    return response.data
  } catch (error) {
    console.error('requestPartnerContribution failed:', error)
    return null
  }
}

export async function getPartnersContribution() {
  try {
    const response = await api.get('/partner-contribution')
    return response.data
  } catch (error) {
    console.error('getPartnersContribution failed:', error)
    return null
  }
}

export async function requestProjectMonetary(projectID) {
  try {
    const response = await api.get(`/project/monetary/${projectID}`);
    if (response.data) return response.data;
    return null;
  } catch (error) {
    console.error('requestProjectMonetary failed:', error);
    return null;
  }
}

export async function addProject(project) {
  try {
    const response = await api.post('/project/add', project);
    return response.data;
  } catch (error) {
    console.error('addProject failed:', error);
    throw error;
  }
}

export async function requestProjectFinish(projectID ){
  if(projectID !== undefined && projectID !== null){
    api.get('/projects/'+projectID).then((data)=>{
    });
  }
}



export async function requestExpensesReg(data){
  const currentSector = applicationState().state.sector;
  console.log(' current sector :',applicationState().state.sector)
  return api.post(`/sector/expenses/${currentSector}`,{data},{headers:{Authorization : 'Bearer'+' '+ useAuthStore().accessToken}}).then((data)=>{
    return data.data
  });
}

export async function requestMaterialsExpenses() {
  let currentSector = applicationState().state.sector
  // if(applicationState().state.sectorsNames.indexOf(applicationState().state.sector)+1 != 0)
  //   currentSector =applicationState().state.sectorsNames.indexOf(applicationState().state.sector)+1;
  // else currentSector = 6;
  return api.get('/materials/expenses/'+currentSector).then((data)=>{
  return data.data;
  });
  
}

export async function requestTaxesExpenses(){
  const currentSector = applicationState().state.sector;
  return api.get(`/taxes/expenses/${currentSector}`,{headers:{Authorization : 'Bearer'+' '+ useAuthStore().accessToken}}).then((data)=>{
    return data.data
  });
}

export async function requestStaffExpenses(){
  const currentSector = applicationState().state.sector;
  return api.get(`/staff/expenses/${currentSector}`,{headers:{Authorization : 'Bearer'+' '+ useAuthStore().accessToken}}).then((data)=>{
    return data.data
  });
}

export async function requestAddUser(payload ){
  api.post('/register',{payload}).then((data)=>{
    console.log(data);
  })
}

export async function addStaffMember(payload){
  api.post('/staff/add',payload).then((data)=>{
    
  });
}

export async function requestMainToSectorTransfer(payload){
  api.post('/main-sector-transfer',payload).then(data=>{
    console.log(data.data)
  })
}

export async function requestMainToPartnersTransfer(payload){
  api.post('/main-partner-transfer',payload).then(data=>{
    console.log(data.data)
  })
}

export async function requestAddInvestorToProjectContribution(payload ={}) {
  api.post('/investor-to-project-contribution',payload).then(data=>{
    console.log(data)
  })
}

export async function requestProjectReport(payload ={}) {
  return api.post('/projects-report',payload).then(data=>{
    return data.data;
  })
}


