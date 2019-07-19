const INITIAL_STATE = false

export default function(state = INITIAL_STATE, action){
    
    if(action.menu){
        state = action.menu
    }
    
    
    return state
}