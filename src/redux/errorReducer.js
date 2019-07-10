const INITIAL_STATE = false

export default function(state = INITIAL_STATE, action){
    
    if(action.error){
        state = action.error
    }
    
    
    return state
}