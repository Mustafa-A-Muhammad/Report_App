import { defineStore } from "pinia";
import { ref, computed } from 'vue'



export const applicationState = defineStore('ApplicationState',()=>{
    interface State{
        loggedUserName : string;
        loginState : boolean;
        sector : string;
        sectorsNames: Array<string>
    }
    //State
    const state = ref<State>({
        loggedUserName : ' ',
        loginState : false,
        sector : ' ',
        sectorsNames : []
    });

    
    
    return {state };
});