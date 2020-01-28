const INITIAL_STATE = {
    display: false,
    type: 'success',
    msg: ''
}

export default function(state = INITIAL_STATE, action){
    if(action.config){
        state = action.config
    }
    
    
    return {...state}
}