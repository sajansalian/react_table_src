import React, { Component } from 'react';
import axios from 'axios';
import './liusertable.css';

import {
            Table,
            TableBody,
            TableHeader,
            TableHeaderColumn,
            TableRow,
            TableRowColumn,
        } from 'material-ui/Table';

import { List, ListItem } from 'material-ui/List';
import { blue500 } from 'material-ui/styles/colors';

import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import RaisedButton from 'material-ui/RaisedButton';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
//import ActionHome from 'material-ui/svg-icons/action/home';
import DropDownMenu from 'material-ui/DropDownMenu';
//import FontIcon from 'material-ui/FontIcon';

import SearchBar from 'material-ui-search-bar';
import Pagination from './Pagination';
import UserEditComp from 'my-usermgmt-comp';

import SwipeableViews from 'react-swipeable-views';
import {Tabs, Tab} from 'material-ui/Tabs';

//import SelectField from 'material-ui/SelectField';
//import MenuItem from 'material-ui/MenuItem';
//import TextField from 'material-ui/TextField';

function convertStringToArray(object){
    var arr = Object.keys(object).map(function(k) {
        return {key: k, value: object[k]}
    });

    return arr;
}

const avatarStyle = { margin: 1 };

class LiUserTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
                        mainUserArr: [],
                        pageUserArr: [],
                        subUserArr: [],
                        showCheckboxes: false,
                        edit_open: false,
                        delete_open: false,

                        countAdvSearchComp: 0,
                        advSearchRowIDArr: [0],
                        selectedOption: 1,

                        slideIndex: 0,

                        uid: 0,
                        activePage: 1,
                        sortBy: "full_name",
                        sortDir: "DESC",
                        dummyUserArr: convertObjectToArray({
                            "0000": {
                                    "profile_pix": "",
                                    "full_name": "",
                                    "code": "",
                                    "status": "",
                                    "company_name": "",
                                    "dept": "",
                                    "email": "",
                                    "extn": "",
                                    "ac_status": ""
                                }
                        })
                    };

        this.fieldNamesArray = ["Full Name", "Code", "Status", "Company Name", "Department", "Email", "Extension", "Acnt Status"];

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleAddMore = this.handleAddMore.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
        this.doAdvancedSearch = this.doAdvancedSearch.bind(this);
    }

    /*
    handleComboChange = (event, index, value) => {
        //var compValue = event.nativeEvent.target.textContent; 
        var compValue = event.target.value; 
        var compID = event.target.id;
        this.setState({ [compID]: var compValue  });
    }
    */

    handleTabChange = (value) => {
        this.setState({ slideIndex: value });
    };

    handleOptionChange(changeEvent) {
        this.setState({
            selectedOption: parseInt(changeEvent.target.value, 10)
        });
    }

    handleInputChange(event) {
        const inputValue = event.target.value;
        const compID = event.target.id;

        this.setState({ [compID]: inputValue });
    }

    handleComboChange(event) {
        const compValue = event.target.value;
        const compID = event.target.id;

        this.setState({ [compID]: compValue });
    }

    handleStatusComboChange(event) {
        const compValue = event.target.value;
        const compID = event.target.id;

        this.setState({ [compID]: compValue });    
    }

    handleAcStatusComboChange(event) {
        const compValue = event.target.value;
        const compID = event.target.id;

        this.setState({ [compID]: compValue });
    }

    handleSortChange(event, index, value) {
       this._sortRowsBy(value);
    }

    handleChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageUserArr: pageOfItems });
    }

    handleOpenEdit = (uID) => {
        this.setState({ edit_open: true, uid: uID });
    }

    handleOpenDelete = (uID) => {
        this.setState({ delete_open: true, uid: uID });
    }
    
    handleDialogClose = () => {
        if(this.state.edit_open)
        {
            this.setState({ edit_open: false });
        }
        if(this.state.delete_open)
        {
            this.setState({ delete_open: false });
        }
    }

    handleCellClick(row, column, event) {
        /*
        this.setState({
                            edit_open: true,
                            uid: this.state.pageUserArr[row].key
                        });
        */
    }

    handleToggle(id) {
    }

    _sortRowsBy(cellDataKey) {
        var sortDir1 = this.state.sortDir;
        var sortBy1 = cellDataKey;

        if(sortBy1 === this.state.sortBy) { // if same key, change the sort direction
            sortDir1 = this.state.sortDir === 'ASC' ? 'DESC' : 'ASC';
        } else { // initially in the ascending order
            sortDir1 = 'ASC';
        }

        var rows = this.state.subUserArr.slice();

        rows.sort((a, b) => {
            var sortVal = 0;
            if(a.value[sortBy1] > b.value[sortBy1]) {
                sortVal = 1;
            }
            if(a.value[sortBy1] < b.value[sortBy1]) {
                sortVal = -1;
            }
            if(sortDir1 === 'DESC') {
                sortVal = sortVal * -1;
            }
            return sortVal;
        });

        this.setState({sortBy: sortBy1, sortDir: sortDir1, subUserArr : rows});
    }

    handleAddMore() {
        var myArr = this.state.advSearchRowIDArr;
        myArr.push(this.state.countAdvSearchComp + 1);
        this.setState({
                        countAdvSearchComp: this.state.countAdvSearchComp + 1,
                        advSearchRowIDArr: myArr
                    });
    }

    handleDeleteRow() {
        if(this.state.countAdvSearchComp < 1) 
            return;

        var myArr = this.state.advSearchRowIDArr;
        myArr.pop(this.state.countAdvSearchComp);

        this.setState({
                        countAdvSearchComp: this.state.countAdvSearchComp - 1,
                        advSearchRowIDArr: myArr
                    });
    }

    doAdvancedSearch() {
        var countSearchRow = this.state.countAdvSearchComp;

        var searchTextName = "";
        var searchTextCode = "";
        var searchTextStatus = "";
        var searchTextCompany = "";
        var searchTextDept = "";
        var searchTextEmail  = "";
        var searchTextExtension = "";
        var searchTextAcStatus = "";

        for(var i=0; i <= countSearchRow; i++)
        {
            var searchField = (this.state['search_combo_'+ i] !== undefined) ? this.state['search_combo_'+ i] : "";
            var searchText = (this.state['search_input_'+ i] !== undefined) ? this.state['search_input_'+ i] : "";

            var searchType = this.state.selectedOption;

            if(searchField === "Full Name")
            {
                searchTextName = searchText;
            }
            else if(searchField === "Code")
            {
                searchTextCode = searchText;
            }
            else if(searchField === "Status")
            {
                //searchTextStatus = searchText;
                searchTextStatus =  (this.state['stat_search_combo_'+ i] !== undefined) ? this.state['stat_search_combo_'+ i] : "";

                //console.log("SSSSSSSS===="+ searchTextStatus);
            }
            else if(searchField === "Company Name")
            {
                searchTextCompany = searchText;
            }
            else if(searchField === "Department")
            {
                searchTextDept = searchText;
            }
            else if(searchField === "Email")
            {
                searchTextEmail = searchText;
            }
            else if(searchField === "Extension")
            {
                searchTextExtension = searchText;
            }
            else if(searchField === "Acnt Status")
            {
                //searchTextAcStatus = searchText;
                searchTextAcStatus =  (this.state['ac_stat_search_combo_'+ i] !== undefined) ? this.state['ac_stat_search_combo_'+ i] : "";

                //console.log("PPPPPP===="+ searchTextAcStatus);
            }
        }

        var matchedUsersArr = [];

        this.state.mainUserArr.map((usr) => {
            /*
            var searchTextAcStatusMapped = "";
            if(searchTextAcStatus.toLowerCase() === "disabled")
            {
                searchTextAcStatusMapped = false;
            }
            else if(searchTextAcStatus.toLowerCase() === "enabled")
            {
                searchTextAcStatusMapped = true;        
            }
            */

            //console.log("===" + searchType + "====" + searchTextName + "====" + searchTextCode);

            if(searchType === 1) // AND
            {
                //console.log("and search");

                if(usr.value.full_name.toLowerCase().indexOf(searchTextName.toLowerCase()) !== -1
                && usr.value.code.toLowerCase().indexOf(searchTextCode.toLowerCase()) !== -1
                && usr.value.status.toLowerCase().indexOf(searchTextStatus.toLowerCase()) !== -1
                && usr.value.company_name.toLowerCase().indexOf(searchTextCompany.toLowerCase()) !== -1
                && usr.value.dept.toLowerCase().indexOf(searchTextDept.toLowerCase()) !== -1
                && usr.value.email.toLowerCase().indexOf(searchTextEmail.toLowerCase()) !== -1
                && usr.value.extn.toLowerCase().indexOf(searchTextExtension.toLowerCase()) !== -1
                && usr.value.ac_status.toString().toLowerCase().indexOf(searchTextAcStatus) !== -1
                )
                {
                    matchedUsersArr.push(usr);
                }
            }
            else // OR
            {
                if(
                    (searchTextName !== "" && usr.value.full_name.toLowerCase().indexOf(searchTextName.toLowerCase()) !== -1)
                    || (searchTextCode !== "" && usr.value.code.toLowerCase().indexOf(searchTextCode.toLowerCase()) !== -1)
                    || (searchTextStatus !== "" && usr.value.status.toLowerCase().indexOf(searchTextStatus.toLowerCase()) !== -1)
                    || (searchTextCompany !== "" && usr.value.company_name.toLowerCase().indexOf(searchTextCompany.toLowerCase()) !== -1)
                    || (searchTextDept !== "" && usr.value.dept.toLowerCase().indexOf(searchTextDept.toLowerCase()) !== -1)
                    || (searchTextEmail !== "" && usr.value.email.toLowerCase().indexOf(searchTextEmail.toLowerCase()) !== -1)
                    || (searchTextExtension !== "" && usr.value.extn.toLowerCase().indexOf(searchTextExtension.toLowerCase()) !== -1)
                    || (searchTextAcStatus !== "" && usr.value.ac_status.toString().toLowerCase().indexOf(searchTextAcStatus) !== -1)
                    )
                    {
                        matchedUsersArr.push(usr);
                    }
            }

            return false;
        });

        if(matchedUsersArr.length > 0){
            this.setState({subUserArr: matchedUsersArr});
        }
        else{
            this.setState({subUserArr: this.state.dummyUserArr});
        }
    }

	render() {
        //console.log("in main render");

        var optionList = null;
        optionList = this.fieldNamesArray.map(function(element) {
                        return <option value={element} key={element}>{element}</option>
                    });

        const SearchRowComponent = ((comboID, inputID, cntr) => {
                                            return(
                                                    <div className="LiUserTable_searchRow" key={cntr}>
                                                        <span className="LiUserTable_searchSpan1" id={"type_label_" + cntr}>{(cntr > 0) ? ((this.state.selectedOption === 1) ? "AND" : "OR") : ""} </span>

                                                        <span className="LiUserTable_searchSpan1">
                                                            <select
                                                                name={comboID + cntr}
                                                                id={comboID + cntr}
                                                                value={this.state[comboID + cntr]}
                                                                onChange={this.handleComboChange.bind(this)}>
                                                                <option>---- Select ----</option>
                                                                {optionList}
                                                            </select>
                                                        </span>

                                                        <span className="LiUserTable_searchSpan1">
                                                        {
                                                        this.state[comboID + cntr] === "Status"
                                                        ?
                                                        <select 
                                                            name="status"
                                                            id={"stat_" + comboID + cntr}
                                                            value={this.state["stat_" + comboID + cntr]}
                                                            onChange={this.handleStatusComboChange.bind(this)}
                                                            className="LiUserTable_searchCombo2">
                                                            <option value="">--- Select ---</option>
                                                            <option value="Online">Online</option>
                                                            <option value="Offline">Offline</option>
                                                        </select>
                                                        :
                                                        this.state[comboID + cntr] === "Acnt Status"
                                                        ?
                                                        <select
                                                            name="acnt_status"
                                                            id={"ac_stat_" + comboID + cntr}
                                                            value={this.state["ac_stat_" + comboID + cntr]}
                                                            onChange={this.handleAcStatusComboChange.bind(this)}
                                                            className="LiUserTable_searchCombo2">
                                                            <option value="">--- Select ---</option>
                                                            <option value="true">Enabled</option>
                                                            <option value="false">Disabled</option>
                                                        </select>
                                                        :
                                                        <input type="text"
                                                            name={inputID + cntr}
                                                            id={inputID + cntr}
                                                            onChange={this.handleInputChange.bind(this)}
                                                            className="LiUserTable_searchText" />
                                                        }
                                                        </span>
                                                    </div>
                                                )
                                    });

	    const dialogActions = [
                                    <FlatButton
                                        label="Cancel"
                                        primary={true}
                                        onClick={this.handleDialogClose}
                                    />,
                                    <FlatButton
                                        label="Submit"
                                        primary={true}
                                        keyboardFocused={false}
                                        onClick={this.handleDialogClose}
                                    />
                                ];

		const iconButton = (
                                <IconButton touch={true} iconClassName="material-icons">view_list</IconButton>
					        );

		const iconMenu = ((userID) => { 
                                        return(
                                                <IconMenu
                                                    iconButtonElement={iconButton}
                                                    menuStyle={{ border: '0px solid green' }}
                                                    anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                                                    targetOrigin={{ vertical: 'top', horizontal: 'right'}}
                                                    useLayerForClickAway={true}
                                                    animated={false}
                                                    >
                                                    <MenuItem onClick={this.handleOpenEdit.bind(this, userID)}>Edit</MenuItem>
                                                    <MenuItem onClick ={this.handleOpenDelete.bind(this, userID)}>Delete</MenuItem>
                                                </IconMenu>
                                                );
                                    });

        var sortDirArrow = "";
        if(this.state.sortDir !== null) {
            sortDirArrow = this.state.sortDir === 'DESC' ? ' ⇓' : ' ⇑';
        }

        return (
            <div className="LiUserTable_container">

                <div className="LiUserTable_searchContainer">
                    <Tabs value={this.state.slideIndex} onChange={this.handleTabChange}>
                        <Tab style={{fontSize: '16px', padding: '2px', fontWeight: 600, backgroundColor: '#881b4c', color: '#ffffff'}} label="Basic Search" value={0} />
                        <Tab style={{fontSize: '16px', padding: '2px', fontWeight: 600, backgroundColor: '#881b4c', color: '#ffffff'}} label="Advanced Search" value={1} />
                    </Tabs>

                    <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleTabChange}>
                        <div className="LiUserTable_basic_search_area">
                            <SearchBar
                                dataSource={this.state.mainUserArr}
                                onRequestSearch={(searchText) => ""}
                                onChange={(searchText) => {
                                                            var matchedUsersArr = [];
                                                            this.state.mainUserArr.map((usr) => {
                                                                if(usr.value.full_name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                                                                || usr.value.code.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                                                                || usr.value.status.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                                                                || usr.value.dept.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                                                                || usr.value.email.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                                                                || usr.value.extn.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                                                                || usr.value.ac_status.toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                                                            ) {
                                                                matchedUsersArr.push(usr);
                                                            }
                                                                return false;
                                                            });

                                                            if(matchedUsersArr.length > 0){
                                                                this.setState({subUserArr: matchedUsersArr});
                                                            }
                                                            else{
                                                                this.setState({subUserArr: this.state.dummyUserArr});
                                                            }
                                                        }
                                            }
                                style={{
                                            margin: '0 auto',
                                            maxWidth: 500,
                                            boxShadow: '2px 2px 2px 2px #cccccc'
                                        }} 
                                />
                        </div>


                        <div className="LiUserTable_advanced_search_area">
                            {
                                this.state.advSearchRowIDArr.map(i => {
                                    return SearchRowComponent("search_combo_", "search_input_", i);
                                })
                            }

                            <div>
                                <input type="radio" name="search_type" value="1" id="type_and" checked={this.state.selectedOption === 1} onChange={this.handleOptionChange.bind(this)} /><label htmlFor="type_and">AND</label>
                                <input type="radio" name="search_type" value="2" id="type_or" checked={this.state.selectedOption === 2} onChange={this.handleOptionChange.bind(this)} /><label htmlFor="type_or">OR</label>
                                &#160;&#160;&#160;&#160;                                
                                <a style={{cursor: 'pointer', color: 'blue'}} onClick={this.handleAddMore}>Add</a>
                                &#160;&#160;&#160;&#160;
                                {
                                this.state.countAdvSearchComp > 0
                                ? <a style={{cursor: 'pointer', color: 'blue'}} onClick={this.handleDeleteRow}>Delete</a>
                                : <a style={{cursor: 'pointer', color: 'grey'}} onClick={this.handleDeleteRow}>Delete</a>
                                }                                
                            </div>

                            <div>&#160;</div>

                            <div>
                                <FlatButton style={{color: '#ffffff', backgroundColor: '#881b4c'}} hoverColor={'#cccccc'} label="Search" labelPosition="before" onClick={this.doAdvancedSearch} icon={<FontIcon className="material-icons">search</FontIcon>} />
                            </div>
                        </div>
                    </SwipeableViews>
                </div>

                <br />

                <div style={{float: 'right'}} className="LiUserTable_sortShowHide">
                    <DropDownMenu className="LiUsersTable_sortDropDown"
                        value={this.state.sortBy} onChange={this.handleSortChange} openImmediately={false}>
                        <MenuItem value={'full_name'} primaryText={'Name '} label={'Name -> ' + this.state.sortDir} />
                        <MenuItem value={'code'} primaryText={'Code '} label={'Code -> ' + this.state.sortDir} />
                        <MenuItem value={'status'} primaryText={'Status '} label={'Status -> ' + this.state.sortDir} />
                        <MenuItem value={'dept'} primaryText={'Department '} label={'Department -> ' + this.state.sortDir} />
                        <MenuItem value={'extn'} primaryText={'Extension '} label={'Extension -> ' + this.state.sortDir}/>
                        <MenuItem value={'email'} primaryText={'Email '} label={'Email -> ' + this.state.sortDir} />
                        <MenuItem value={'ac_status'} primaryText={'Acnt status '} label={'Acnt status -> ' + this.state.sortDir}/>
                    </DropDownMenu>
                </div>

                <div style={{clear: 'right'}}>

                <Table onCellClick={this.handleCellClick.bind(this)}>
                    <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes}>
                        <TableRow>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{textAlign: 'center'}}><div className="LiUserTable_header">Avatar</div></TableHeaderColumn>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "full_name")}>Name {this.state.sortBy === 'full_name' ? sortDirArrow : '' }</a></div></TableHeaderColumn>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "code")}>Code {this.state.sortBy === 'code' ? sortDirArrow : '' }</a></div></TableHeaderColumn>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "status")}>Status {this.state.sortBy === 'status' ? sortDirArrow : '' }</a></div></TableHeaderColumn>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "dept")}>Department {this.state.sortBy === 'dept' ? sortDirArrow : '' }</a></div></TableHeaderColumn>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "extn")}>Extension {this.state.sortBy === 'extn' ? sortDirArrow : '' }</a></div></TableHeaderColumn>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "email")}>Email {this.state.sortBy === 'email' ? sortDirArrow : '' }</a></div></TableHeaderColumn>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "ac_status")}>Acnt status {this.state.sortBy === 'ac_status' ? sortDirArrow : '' }</a></div></TableHeaderColumn>
                            <TableHeaderColumn className="LiUserTable_headerColumn" style={{textAlign: 'right'}}><div className="LiUserTable_header">Action</div></TableHeaderColumn>
                        </TableRow>
                    </TableHeader>

                    <TableBody displayRowCheckbox={this.state.showCheckboxes} showRowHover={true}>
                        {
                            this.state.pageUserArr.map((usr) => {
                                if(usr.key > 0) {
                                    return (
                                            <TableRow className="LiUserTable_contentRow" key={usr.key} /*onClick={()=> { let id = usr.key; this.handleToggle.bind(this, id) }} */ >
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{textAlign: 'center'}}>
                                                    {<Avatar src={"../" + usr.value.profile_pix} size={40} style={avatarStyle} />}
                                                </TableRowColumn>
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{}}>{ usr.value.full_name }</TableRowColumn>
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{}}>{ usr.value.code }</TableRowColumn>
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{}}>{ usr.value.status }</TableRowColumn>
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{}}>{ usr.value.dept }</TableRowColumn>
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{}}>{ usr.value.extn }</TableRowColumn>
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{}}>{ usr.value.email }</TableRowColumn>
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{}}>{ usr.value.ac_status === true ? "Enabled" : "Disabled" }</TableRowColumn>
                                                <TableRowColumn className="LiUserTable_rowColumn" style={{textAlign: 'left'}}>
                                                    <List>
                                                        <ListItem rightIconButton={iconMenu(usr.key)} />
                                                    </List>
                                                </TableRowColumn>
                                            </TableRow>
                                        );
                                }
                                else {
                                    return(
                                            <TableRow className="LiUserTable_contentRow" key={"0000"}>
                                                <TableRowColumn>
                                                    <div><span style={{ color: blue500 }}><b>No matching record</b></span></div>
                                                </TableRowColumn>
                                            </TableRow>
                                            );
                                }
                            })
                        }
                    </TableBody>
                </Table>

                </div>

                <div id="LiUserTable_pagination">
                    <Pagination pageSize={8} items={this.state.subUserArr} onChangePage={this.handleChangePage} />
                </div>

                <Dialog
                    title={"Edit User"}
                    titleStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    bodyStyle={{backgroundColor: '#cccccc', padding: '0' }}
                    actionsContainerStyle={{backgroundColor: '#ffffff', padding: '8px' }}                    
                    actions={dialogActions}
                    modal={true}
                    open={this.state.edit_open}
                    onRequestClose={this.handleDialogClose}
					autoScrollBodyContent={true}>
                        <UserEditComp userID={this.state.uid} />
                </Dialog>

                <Dialog
                    title={"Delete User"}
                    titleStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    bodyStyle={{backgroundColor: '#cccccc', padding: '20px' }}
                    actionsContainerStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    actions={dialogActions}
                    modal={true}
                    open={this.state.delete_open}
                    onRequestClose={this.handleDialogClose}
                    autoScrollBodyContent={true}>
                    <div>
                        <br/>
                        Are you sure to delete the record { this.state.uid } ?
                        <br/><br/>
                    </div>
                </Dialog>
            </div>
        );
    }

    componentWillMount() {
        //console.log("will mount");
    }

    componentDidMount() {
        var self = this;
        //console.log("did mount");

        axios.get("user_data.json").then(function (response) {
            var userDataArr = convertObjectToArray(response.data);
            self.setState({
                            mainUserArr: userDataArr,
                            subUserArr: userDataArr
                          });

            self._sortRowsBy(self.state.sortBy); // initial sorting
        })
        .catch(function (error) {
            console.log("AXIOS Error: "+ error);
        });
    }
}

export default LiUserTable;
