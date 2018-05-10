import {EventEmitter} from 'events';
import Dispatcher from '../lidispatcher/index';
import ActionTypes from '../liconstants/constant';

import CommonMethod from '../licomponents/commonmethods';

var convertArray = new CommonMethod();

class LiUserTableStore extends EventEmitter {
    constructor(){
        super();
        this.state = {
                        mainUserArr: [],
                        subUserArr: [],
                        userDataObj: {},
                        sortDir: "DESC",
                        sortBy: "full_name",
                        edit_open: '',
                        delete_open: '',
                        uid: ''
                    }
    }

    liRegisterToActions(actionObj) {
        switch(actionObj.actionType) {
            case ActionTypes.SET_INIT_DATA:
                this.liSetInitialData(actionObj.value1, actionObj.value2, actionObj.value3, actionObj.uni_key);
                break;
            case ActionTypes.SORT_ROWS_BY:
                this.liSortRowsBy(actionObj.value1, actionObj.value2, actionObj.uni_key);
                break;
            case ActionTypes.HANDLE_OPEN_EDIT:
                this.liHandleOpenEdit(actionObj.value, actionObj.uni_key);
                break;
            case ActionTypes.HANDLE_OPEN_DELETE:
                this.liHandleOpenDelete(actionObj.value, actionObj.uni_key);
                break;
            case ActionTypes.SET_SEARCH_DATA:
                this.liSetSearchData(actionObj.value, actionObj.uni_key);
                break;
            default:
                console.log("No matching action found in liRegisterToActions")
                break;
        }
    }

    getAllItems() {
        return this.state;
    }

    liSetInitialData = (usersJSNObj, sortCol, sortDir, key) => {
		var dataArr = convertArray.convertObjectToArray(usersJSNObj);
        this.state.mainUserArr = dataArr;
        this.state.subUserArr = dataArr;
        this.state.userDataObj = usersJSNObj;

        //this.liSortRowsBy(this.state.sortBy);
        this.liSortRowsBy(sortCol, sortDir, key);
        this.emit(key);        
    }

    liSortRowsBy = (sortByKey, sortDir, key) => {
        var sortDir1 = (sortDir !== undefined && sortDir !== "") ? sortDir : this.state.sortDir;
        //console.log("HERE1: "+ sortDir1);
        var sortBy1 = sortByKey;
        if(sortBy1 === this.state.sortBy) { // if same key, change the sort direction
            //console.log("CHECK: "+ sortBy1 + " ==== " + this.state.sortBy);
            if(sortDir === undefined || sortDir === "")
            {
                //console.log("HERE2: "+ sortDir1);
                sortDir1 = this.state.sortDir === 'ASC' ? 'DESC' : 'ASC';
            }
            else
            {
                //console.log("HERE3: "+ sortDir1);
                sortDir1 = sortDir;
            }

        } else { // initially in the ascending order
            sortDir1 = 'ASC';
            //console.log("HERE4: "+ sortDir1);
        }

        //console.log("SORT: " + sortBy1 + " === " + sortDir1);

        var rowsSub = this.state.subUserArr.slice();
        rowsSub.sort((a, b) => {
            var sortVal = 0;
            if(a.value[sortBy1] > b.value[sortBy1]) {
                sortVal = 1;
            }
            if(a.value[sortBy1] < b.value[sortBy1]) {
                sortVal = -1;
            }
            if(sortDir1 === 'DESC') {
                sortVal = sortVal * - 1;
            }
            return sortVal;
        });

        var rowsMain = this.state.mainUserArr.slice();
        rowsMain.sort((a, b) => {
            var sortVal = 0;
            if(a.value[sortBy1] > b.value[sortBy1]) {
                sortVal = 1;
            }
            if(a.value[sortBy1] < b.value[sortBy1]) {
                sortVal = -1;
            }
            if(sortDir1 === 'DESC') {
                sortVal = sortVal * - 1;
            }
            return sortVal;
        });

        this.state.sortBy = sortBy1;
        this.state.sortDir = sortDir1;
        this.state.subUserArr = rowsSub;
        this.state.mainUserArr = rowsMain;
        
        //this.emit("SORT_DATA");
        this.emit(key);
    }

    liHandleOpenEdit = (uID, key) => {
        this.state.edit_open = true;
        this.state.uid = uID;
        //this.emit("OPEN_EDIT");
        this.emit(key);
    }

    liHandleOpenDelete = (uID, key) => {
        this.state.delete_open = true;
        this.state.uid = uID;
        //this.emit("OPEN_DELETE");
        this.emit(key);
    }

    liSetSearchData(userArr, key) {
        this.state.subUserArr = userArr;
        //this.emit('SET_SEARCH_DATA');
        this.emit(key);
    }
}

const storeObj = new LiUserTableStore();
Dispatcher.register(storeObj.liRegisterToActions.bind(storeObj))
export default storeObj;
