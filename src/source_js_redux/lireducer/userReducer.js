const initial = 
{ 
    data: [],sort: [],pageUserArr: [],sortDir: "ASC",sortBy: "full_name",sortArrow: "",edit_open: false,delete_open: false,uid: 0,
	dummyUserArr: [{"0000": { "profile_pix": "","full_name": "","code": "","status": "","company_name": "","dept": "","email": "","extn": "","ac_status": ""}}],
	fieldNamesArray: ["Full Name", "Code", "Status", "Company Name", "Department", "Email", "Extension", "Acnt Status"],
	slideIndex: 0,advSearchRowIDArr: [0],countAdvSearchComp: 0,selectedOption: 1,inputField: {},selectField: {},statusCombo: {},accStatusCombo: {},userDataObj: {}
}

export default function(state333 = initial, action) {
    switch(action.type) {
        case "USER_SELECTED": state333 = {...state333, data: [action.payload], sort: [action.payload], pageUserArr: [action.payload], userDataObj: action.dataObj }; state333 = liSortRowsBy(state333, initial.sortBy, initial.sortDir); break;
        case "USER_SORT": state333 = liSortRowsBy(state333, action.sortColumn, action.sortDirection); break;
        case "PAGINATION": state333 = { ...state333, pageUserArr: [action.payload]}; break;
        case "SEARCH_USER": state333 = liSearchUserBy(state333, action.payload); break;
        case "HANDLE_OPEN_EDIT": state333 = lihandleOpenEdit(state333, action.payload); break;
        case "HANDLE_OPEN_DELETE": state333 = liHandleOpenDelete(state333, action.payload); break;
        case "CLOSE_EDIT_DELETE": state333 = liCloseOpenDelete(state333, action.payload); break;
        case "SET_SLIDE_INDEX": state333 = setSlideindex(state333, action.payload); break;
        case "HANDLE_ADD_MORE": state333 = handleAddMore(state333, action.count, action.arr); break;
        case "DELETE_ROW": state333 = handleDeleteRow(state333, action.count, action.arr); break;
        case "HANDLE_OPTION_CHANGE": state333 = handleOptionChange(state333, action.payload); break;
        case "HANDLE_INPUT_CHANGE": state333 = handleInputChange(state333, action.inputValue, action.compId); break;
        case "HANDLE_COMBO_CHANGE": state333 = handleComboChange(state333, action.compValue, action.compId); break;
        case "HANDLE_STATUS_COMBO_CHANGE": state333 = handleStatusComboChange(state333, action.compValue, action.compId); break;
        case "HANDLE_ACC_STATUS_COMBO_CHANGE":  state333 = handleAcStatusComboChange(state333, action.compValue, action.compId); break;
    } return state333;
}

const handleAcStatusComboChange = (state, compValue, compId) => {
    state={...state,
        accStatusCombo: {...state.statusCombo, [compId]: {"compValue": compValue,"compId":compId}},
    }
    return state;
}

const handleStatusComboChange = (state, compValue, compId) => {
    state={...state,
        statusCombo: {...state.accStatusCombo, [compId]: {"compValue": compValue,"compId":compId}},
    }
    return state;
}

const handleComboChange = (state, compValue, compId) => {
    state={...state,
        selectField: {...state.selectField, [compId]: {"compValue": compValue,"compId":compId}},
    }
    return state;
}

const handleInputChange = (state, inputValue, compId) => {
    state={...state,
        inputField: {...state.inputField,[compId]: {"inputValue": inputValue,"compId":compId}},
    }
    return state;
}

const handleOptionChange = (state, changeevent) => {
    state={...state,
        selectedOption: changeevent,
    }
    return state;
}

const handleAddMore = (state, count, arr) => {
    state={...state,
        countAdvSearchComp: count,
        advSearchRowIDArr: arr
    }
    return state;
}

const handleDeleteRow = (state, count, arr) => {
    state={...state,
        countAdvSearchComp: count,
        advSearchRowIDArr: arr
    }
    return state;
}

const setSlideindex = (state,value) => {
    state={...state,
        slideIndex: value
    }
    return state;
}

const liSortRowsBy = (state22, sortByKey, sortDir) => {
        var sortDir1 = (sortDir !== undefined && sortDir !== "") ? sortDir : state22.sortDir;
        var sortBy1 = sortByKey;

        if(sortBy1 === state22.sortBy) { // if same key, change the sort direction
            if(sortDir === undefined || sortDir === ""){ sortDir1 = state22.sortDir === 'ASC' ? 'DESC' : 'ASC'; }
            else{ sortDir1 = sortDir;}
        } else { sortDir1 = 'ASC';}

       
        var rowsSub = liSortRowsBy1(state22.sort[0].slice(),sortBy1,sortDir1)
        var rowsMain = liSortRowsBy1(state22.data[0].slice(),sortBy1,sortDir1)
        
        var sortDirArrow = "";

        if(sortDir1 !== null) { sortDirArrow = sortDir1 === 'DESC' ? ' ⇓' : ' ⇑' }

        state22 = {...state22, data: [rowsMain], sort: [rowsSub], sortBy: sortBy1, sortDir: sortDir1, sortArrow: sortDirArrow, pageUserArr: [rowsSub]};
        return state22;
}

const liSortRowsBy1 = (rowsSub,sortBy1,sortDir1) =>{
    rowsSub.sort((a, b) => {
        var sortVal = 0;
        if(a.value[sortBy1] > b.value[sortBy1]) { sortVal = 1; }
        if(a.value[sortBy1] < b.value[sortBy1]) { sortVal = -1 }
        if(sortDir1 === 'DESC') { sortVal = sortVal * - 1 }
        return sortVal;
    });

    return rowsSub;
}


const liSearchUserBy = (state, matchedUsersArr) => {
    state={...state, sort: [matchedUsersArr], pageUserArr: [matchedUsersArr]}
    return state;
}

const lihandleOpenEdit = (state, uID) => {
    state={...state, edit_open:true, uid: uID}
    return state;
}

const liHandleOpenDelete = (state, uID) => {
    state={...state, delete_open: true, uid: uID }
    return state;
}

const liCloseOpenDelete =(state, close) => {
    if(close==="edit"){
        state={...state,edit_open: false}
    }

    if(close==="delete"){
        state={...state, delete_open: false}
    }
    return state;
}
