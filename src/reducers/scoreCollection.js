const scoreReducer = (state = [], action) => {
    switch(action.type) {
        case 'UPDATE':
            return [...state, [action.payloadPlayer, action.payloadScore, action.payloadPref, action.payloadPref2]];
        case 'DELETE':
            return state.filter(function(e) { return e[0] !== action.payloadPlayer })
        default:
            return state;
    }
}

export default scoreReducer;