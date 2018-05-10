import React, { Component } from 'react';
import '../../css/liusertable.css';

import log4javascript from "log4javascript";

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import SearchBar from 'material-ui-search-bar';
//import Dialog from 'material-ui/Dialog';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import { blue500 } from 'material-ui/styles/colors';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
//import SelectField from 'material-ui/SelectField';

import SwipeableViews from 'react-swipeable-views';
import {Tabs, Tab} from 'material-ui/Tabs';

import UserTableActions from '../liactions/liusertableactions';
import LiUserTableStore from '../listores/liusertablestore';
import Pagination from './Pagination';
import LiDialogueBox from './lidialogue';
import CommonMethod from './commonmethods';

import Loader from 'react-loader-advanced';

const commonMethods = new CommonMethod();

const avatarStyle = { margin: 1 };

class LiUserTable extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            sortBy: "full_name",
            mainUserArr: [],
            subUserArr: [],
            convertedString:[],
            pageUserArr: [],
            showCheckboxes: false,

            countAdvSearchComp: 0,
            advSearchRowIDArr: [0],
            selectedOption: 1,
            slideIndex: 0,

            showLoader: true,

            activePage: 1,

            dummyUserArr: [commonMethods.convertObjectToArray({
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
                        })]
        }

        this.fieldNamesArray = ["Full Name", "Code", "Status", "Company Name", "Department", "Email", "Extension", "Acnt Status"];

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);

        this.handleAddMore = this.handleAddMore.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
        this.doAdvancedSearch = this.doAdvancedSearch.bind(this);
        this.loadInitialData = this.loadInitialData.bind(this);        
    }

    handleTabChange = (value) => {
        this.setState({ slideIndex: value });

        if(value === 0)
        {
            document.getElementById("tab_1").style.backgroundColor = "#881b4c"; //active

            document.getElementById("tab_2").style.backgroundColor = "grey";
        }
        else if(value === 1)
        {
            document.getElementById("tab_2").style.backgroundColor = "#881b4c"; //active

            document.getElementById("tab_1").style.backgroundColor = "grey";
        }
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
            }
        }

        var matchedUsersArr = [];

        this.state.mainUserArr.map((usr) => {
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
            UserTableActions.liSetSearchData(matchedUsersArr, this.props.myKey);
        }
        else{
            UserTableActions.liSetSearchData(this.state.dummyUserArr, this.props.myKey);
        }
    }

    handleSortChange(event, index, value) {
        this._sortRowsBy(value);
    }

    _sortRowsBy(orderBy) {
        UserTableActions.liSortRowsBy(orderBy, "", this.props.myKey);
    }
    
    handleOpenDelete = (uID) => {
        UserTableActions.liHandleOpenDelete(uID, this.props.myKey);
    }
    
    handleOpenEdit = (uID) => {
        UserTableActions.liHandleOpenEdit(uID, this.props.myKey);
    }

    render(){
        const spinner = <span>LOADING... <img src="images/Ellipsis.gif" alt="Loading" /></span>

        var optionList = null;
        optionList = this.fieldNamesArray.map(function(element) {
                        return <option value={element} key={element}>{element}</option>
                    });

        const SearchRowComponent = ((comboID, inputID, cntr) => {
                                            return(
                                                    <div className="LiUserTable_searchRow" key={cntr}>
                                                        <span className="LiUserTable_searchSpan1" id={"type_label_" + cntr}>{(cntr > 0) ? ((this.state.selectedOption === 1) ? "AND" : "OR") : ""} </span>

                                                        <span className="LiUserTable_searchSpan2">
                                                            <select
                                                                name={comboID + cntr}
                                                                id={comboID + cntr}
                                                                value={this.state[comboID + cntr]}
                                                                onChange={this.handleComboChange.bind(this)}>
                                                                <option>---- Select ----</option>
                                                                {optionList}
                                                            </select>
                                                        </span>

                                                        <span className="LiUserTable_searchSpan3">
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

        var sortDirArrow = "";

        if(this.state.sortDir !== null) {
            sortDirArrow = this.state.sortDir === 'DESC' ? ' ⇓' : ' ⇑';
        }
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
                                                    >
                                                    <MenuItem onClick={this.handleOpenEdit.bind(this, userID)}>Edit</MenuItem>
                                                    <MenuItem onClick={this.handleOpenDelete.bind(this, userID)}>Delete</MenuItem>
                                                </IconMenu>
                                                );
                                    });

        return(
            <div className="LiUserTable_container">
				
				<div className="LiUserTable_heading">{this.props.tableHeading}</div>

				<br />

                <div className="LiUserTable_searchContainer">
                    <Tabs id="LiUserTable_searchTab" value={this.state.slideIndex} onChange={this.handleTabChange}>
                        <Tab id="tab_1" style={{fontSize: '16px', padding: '2px', fontWeight: 600, backgroundColor: '#881b4c', color: '#ffffff'}} label="Basic" value={0} />
                        <Tab id="tab_2" style={{fontSize: '16px', padding: '2px', fontWeight: 600, backgroundColor: 'grey', color: '#ffffff'}} label="Advanced" value={1} />
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
                                                                UserTableActions.liSetSearchData(matchedUsersArr, this.props.myKey);
                                                            }
                                                            else{
                                                                UserTableActions.liSetSearchData(this.state.dummyUserArr, this.props.myKey);
                                                            }
                                                        }
                                            }
                                style={{
                                            margin: '0 auto',
                                            maxWidth: 500,
                                            boxShadow: '2px 2px 2px 2px #cccccc'
                                        }} />
                        </div>

                        <div className="LiUserTable_advanced_search_area">
                            {
                                this.state.advSearchRowIDArr.map(i => {
                                    return SearchRowComponent("search_combo_", "search_input_", i);
                                })
                            }

                            <div className="LiUserTable_addmore" >
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

                                <div>&#160;</div>

                                <FlatButton style={{color: '#ffffff', backgroundColor: '#881b4c'}} hoverColor={'#cccccc'} label="Search" labelPosition="before" onClick={this.doAdvancedSearch} icon={<FontIcon className="material-icons">search</FontIcon>} />
                            </div>
                        </div>
                    </SwipeableViews>
                </div>
              
                <div style={{float: 'right'}} className="LiUserTable_sortShowHide">
                    <DropDownMenu className="LiUsersTable_sortDropDown"
                        value={this.state.sortBy} onChange={this.handleSortChange} openImmediately={false}>
                        <MenuItem value={'full_name'} primaryText={'Name '} label={'Name [' + this.state.sortDir + ']'} />
                        <MenuItem value={'code'} primaryText={'Code '} label={'Code [' + this.state.sortDir + ']'} />
                        <MenuItem value={'status'} primaryText={'Status '} label={'Status [' + this.state.sortDir + ']'} />
                        <MenuItem value={'dept'} primaryText={'Department '} label={'Department [' + this.state.sortDir + ']'} />
                        <MenuItem value={'extn'} primaryText={'Extension '} label={'Extension [' + this.state.sortDir + ']'}/>
                        <MenuItem value={'email'} primaryText={'Email '} label={'Email [' + this.state.sortDir + ']'} />
                        <MenuItem value={'ac_status'} primaryText={'Acnt status '} label={'Acnt status [' + this.state.sortDir + ']'}/>
                    </DropDownMenu>
                </div>

                <div style={{clear: 'right'}}>

                <Loader 
                    show={this.state.showLoader}
                    message={spinner}
                    backgroundStyle={{backgroundColor: '#ffffff'}}
                    contentStyle={{minHeight: '400px', backgroundColor: '#ffffff'}}>

                <Table>
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

                </Loader>

                </div>

                <div id="LiUserTable_pagination">
                    <Pagination pageSize={8} items={this.state.subUserArr} onChangePage={this.handleChangePage} />
                </div>
                
                <LiDialogueBox onDialogClose={this.loadInitialData} myKey="my_dialog_1" />
            </div>
        );
    }

    handleChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageUserArr: pageOfItems });
    }

    loadInitialData () {
        var self = this;

        axios.get("https://business-portal.lisec.com/test/json_users.php?wait_sec=0")
        .then(function(response) {
            //console.log("%cInitial data AJAX ...", 'background: yellow; color: blue; ');

            //console.time("Timer1");

            UserTableActions.liSetInitialData(response.data, "full_name", "ASC", self.props.myKey);

            //console.timeEnd("Timer1");

            self.setState({
                            showLoader: false
                        });
        })
        .catch(function(error) {
            console.log("AXIOS Error: " + error);
        });
    }

    componentDidMount() {
        this.loadInitialData();

        // logger
        window.myLogger = log4javascript.getLogger();
        
        var ajaxAppender = new log4javascript.AjaxAppender('xyz');
        window.myLogger.setLevel(log4javascript.Level.ALL);

        ajaxAppender.setBatchSize(2); // send in batches of 10
        ajaxAppender.setSendAllOnUnload(); // send all remaining messages on window.beforeunload()

        window.myLogger.addAppender(ajaxAppender);

        //report all user console errors
        window.onerror = function(message, url, lineNumber) {
            console.log("on error");
            var errorMsg = "Console error: " + url + " : " + lineNumber + ": " + message;
            window.myLogger.error(errorMsg);
            return true;
        };
        // logger
    }

    componentWillMount() {
        LiUserTableStore.on(this.props.myKey, () => {
                this.setState({
                                mainUserArr: LiUserTableStore.getAllItems().mainUserArr
                            });
        });

        LiUserTableStore.on(this.props.myKey, () => {
                this.setState({
                                sortBy: LiUserTableStore.getAllItems().sortBy,
                                sortDir: LiUserTableStore.getAllItems().sortDir,
                                subUserArr: LiUserTableStore.getAllItems().subUserArr,
                                mainUserArr: LiUserTableStore.getAllItems().mainUserArr
                            });
        });

        LiUserTableStore.on(this.props.myKey, () => {
                this.setState({
                                subUserArr: LiUserTableStore.getAllItems().subUserArr
                            });
        });
    }

}

export default LiUserTable;
