const INITIAL_STATE = {}

export default function(state = INITIAL_STATE, action){
    
    if(action.user){
        state = action.user
    } 
    
    return {...state}
}