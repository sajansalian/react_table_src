import Dispatcher from '../lidispatcher';
import ActionTypes from '../liconstants/constant';

class UserTableActions { 
    liSetInitialData(tabledata, sortCol, sortDir, key) {
        Dispatcher.dispatch({
            actionType: ActionTypes.SET_INIT_DATA,
            value1: tabledata,
            value2: sortCol,
            value3: sortDir,
            uni_key: key
        });
    }

    liSortRowsBy(sortCol, sortDir, key) {
        Dispatcher.dispatch({
            actionType: ActionTypes.SORT_ROWS_BY,
            value1: sortCol,
            value2: sortDir,
            uni_key: key
        });
    }

    liHandleOpenEdit(uID, key) {
        Dispatcher.dispatch({
            actionType: ActionTypes.HANDLE_OPEN_EDIT,
            value: uID,
            uni_key: key
        });
    }

    liHandleOpenDelete(uID, key) {
        Dispatcher.dispatch({
            actionType: ActionTypes.HANDLE_OPEN_DELETE,
            value: uID,
            uni_key: key
        });
    }

    liSetSearchData(data, key) {
        Dispatcher.dispatch({
            actionType: ActionTypes.SET_SEARCH_DATA,
            value: data,
            uni_key: key
        });
    }
}

export default new UserTableActions();
