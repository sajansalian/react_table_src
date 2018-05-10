import axios from 'axios';
import store from '../store'
import { darkBlack } from 'material-ui/styles/colors';

export const selectUser = (data,dataObj) => {
    //console.log('inisde 3',data);
    return{        
            type: "USER_SELECTED",
            payload: data,
            dataObj: dataObj      
    }    
};

export const sortUser = (sortCol, sortDir) => {
    //console.log('inisde 3',sortCol,sortDir);
    return{        
            type: "USER_SORT",
            sortColumn: sortCol,
            sortDirection: sortDir      
    }    
};

export const pagination = (pageofItems) => {
    return{        
            type: "PAGINATION",
            payload: pageofItems
    }    
};
export const searchUser = (matchedUsersArr) => {
    return{
            type: "SEARCH_USER",
            payload: matchedUsersArr
    }    
};
export const lihandleOpenEdit = (uID) => {
    return{        
            type: "HANDLE_OPEN_EDIT",
            payload: uID
    }
    
};
export const liHandleOpenDelete = (uID) => {
    return{
            type: "HANDLE_OPEN_DELETE",
            payload: uID
    }
    
};
export const closeEditDelete = (close) => {
    return{
        
            type: "CLOSE_EDIT_DELETE",
            payload: close
    }
    
};

export const setSlideindex = (value) => {
    return{        
            type: "SET_SLIDE_INDEX",
            payload: value
    }    
};

export const handleAddMore = (countAdvSearchComp, myArr) => {
    return{        
            type: "HANDLE_ADD_MORE",
            count: countAdvSearchComp,
            arr: myArr
    }    
};

export const handleDeleteRow = (countAdvSearchComp, myArr) => {
    return{
        
            type: "DELETE_ROW",
            count: countAdvSearchComp,
            arr: myArr
    }    
};

export const handleOptionChange = (changeEvent) => {
    return{        
            type: "HANDLE_OPTION_CHANGE",
            payload: changeEvent
    }    
};

export const handleInputChange = (compID, inputValue) => {
    return{        
            type: "HANDLE_INPUT_CHANGE",
            inputValue: inputValue,
            compId: compID
    }    
};

export const handleComboChange = (compID, compValue) => {
    return{
            type: "HANDLE_COMBO_CHANGE",
            compValue: compValue,
            compId: compID
    }    
};

export const handleStatusComboChange = (compID, compValue) => {
    return{
        
            type: "HANDLE_STATUS_COMBO_CHANGE",
            compValue: compValue,
            compId: compID
    }    
};

export const handleAcStatusComboChange = (compID, compValue) => {
    return{
        
            type: "HANDLE_ACC_STATUS_COMBO_CHANGE",
            compValue: compValue,
            compId: compID
    }    
};
