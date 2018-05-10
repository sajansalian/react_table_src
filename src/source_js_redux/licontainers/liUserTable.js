import React, { Component } from 'react';
import '../../css/liusertable.css';
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
import LiDialogueBox from './lidialogue';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SearchBar from 'material-ui-search-bar';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as LiAction from '../liactions/userAction'
import axios from 'axios'
import Pagination from './Pagination';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import DropDownMenu from 'material-ui/DropDownMenu';

const avatarStyle = { margin: 1 };

class LiUserTable extends Component {
    constructor(){
        super();
    }

    convertObjectToArray(stringVal){
        var arr = Object.keys(stringVal).map(function(k) {
            return {key: k, value: stringVal[k]}
        });

        return arr;
    }

    loadInitialData() {
        var self = this;

        var self = this;
        axios.get("https://business-portal.lisec.com/test/json_users.php?wait_sec=0")
        .then(function(response) {
            self.props.selectUser(self.convertObjectToArray(response.data), response.data);
        })
        .catch(function(error) {
            console.log("AXIOS Error: " + error);
        });
    }

    componentDidMount() {
        this.loadInitialData();
    }

    handleChangePage(pageOfItems) {
        // update state with new page of items~
        //console.log(pageOfItems);
        this.props.pagination(pageOfItems);
    }

    _sortRowsBy(orderBy) {
        //console.log('insoide',orderBy);
       this.props.sortUser(orderBy,"");
    }

    handleOpenDelete = (uID) => {
        this.props.liHandleOpenDelete(uID);
    }
    
    handleOpenEdit = (uID) => {
        this.props.liHandleOpenEdit(uID);
    }

    handleTabChange = (value) => {
        this.props.setSlideindex(value);

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

    handleAddMore() {
        var myArr = this.props.users.advSearchRowIDArr;
        myArr.push(this.props.users.countAdvSearchComp + 1);

        this.props.handleAddMore(this.props.users.countAdvSearchComp + 1,myArr);
    }

    handleDeleteRow() {
        if(this.props.users.countAdvSearchComp  < 1) 
            return;
        var myArr = this.props.users.advSearchRowIDArr;
        myArr.pop(this.props.users.countAdvSearchComp);

        this.props.handleDeleteRow(this.props.users.countAdvSearchComp - 1,myArr);
    }

    handleOptionChange(changeEvent) {
        this.props.handleOptionChange(parseInt(changeEvent.target.value, 10));
    }

    doAdvancedSearch() {
        var countSearchRow = this.props.users.countAdvSearchComp;
        var searchTextName = "";
        var searchTextCode = "";
        var searchTextStatus = "";
        var searchTextCompany = "";
        var searchTextDept = "";
        var searchTextEmail  = "";
        var searchTextExtension = "";
        var searchTextAcStatus = "";
        var inputComp = [];
        var selectComp = [];
        var statusComp = [];
        var accStatusComp = [];

        inputComp = (this.props.users.inputField);
        selectComp = (this.props.users.selectField);
        statusComp = (this.props.users.statusCombo);
        accStatusComp = (this.props.users.accStatusCombo);

        //console.log(inputComp,selectComp,statusComp,'132456');

        for(var i=0; i <= countSearchRow; i++)
        {
            var searchField = (selectComp['search_combo_'+i] !== undefined) ? this.props.users.selectField['search_combo_' + i].compValue : "";
            var searchText = (inputComp['search_input_'+i] !== undefined) ? this.props.users.inputField['search_input_' + i].inputValue : "";

            var searchType = this.props.users.selectedOption;

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
                searchTextStatus =  (statusComp['stat_search_combo_'+ i] !== undefined) ? this.props.users.statusCombo['stat_search_combo_'+ i].compValue : "";
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
                searchTextAcStatus =  (accStatusComp['ac_stat_search_combo_'+ i] !== undefined) ? this.props.users.accStatusCombo['ac_stat_search_combo_'+ i].compValue : "";
            }
        }

        var matchedUsersArr = [];

        this.props.users.data[0].map((usr) => {
            if(searchType === 1) // AND
            {
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

        //console.log(matchedUsersArr,'shyam132');
        if(matchedUsersArr.length > 0){
            this.props.liSetSearchData(matchedUsersArr);
        }
        else{
            this.props.liSetSearchData(this.convertObjectToArray(this.props.users.dummyUserArr));
        }
    }

    handleInputChange(event) {
        const inputValue = event.target.value;
        const compID = event.target.id;

        this.props.handleInputChange(compID, inputValue);
        //this.setState({ [compID]: inputValue });
    }

    handleComboChange(event) {
        const compValue = event.target.value;
        const compID = event.target.id;

        this.props.handleComboChange(compID, compValue);
    }

    handleStatusComboChange(event) {
        const compValue = event.target.value;
        const compID = event.target.id;

        this.props.handleStatusComboChange(compID, compValue);    
    }

    handleAcStatusComboChange(event) {
        const compValue = event.target.value;
        const compID = event.target.id;

        this.props.handleAcStatusComboChange(compID, compValue);
    }

    handleSortChange(event, index, value) {
        //console.log(value);
        this._sortRowsBy(value);
    }

    render(){
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

        var optionList = null;
        optionList = this.props.users.fieldNamesArray.map(function(element) {
                        return <option value={element} key={element}>{element}</option>
                    });

        const SearchRowComponent = ((comboID, inputID, cntr) => {
            //console.log(this.props.users.selectField[comboID + cntr],'asdasdasdasdasdasd132132')
            return(
                    <div className="LiUserTable_searchRow" key={cntr}>
                        <span className="LiUserTable_searchSpan1" id={"type_label_" + cntr}>{(cntr > 0) ? ((this.props.users.selectedOption === 1) ? "AND" : "OR") : ""} </span>

                        <span className="LiUserTable_searchSpan2">
                            <select
                                name={comboID + cntr}
                                id={comboID + cntr}
                                value={this.props[comboID + cntr]}
                                onChange={this.handleComboChange.bind(this)}>
                                <option>---- Select ----</option>
                                {optionList}
                            </select>
                        </span>

                        <span className="LiUserTable_searchSpan3">
                        {
                        this.props.users.selectField[comboID + cntr] !== undefined
                        ?

                        this.props.users.selectField[comboID + cntr].compValue === "Status"
                        ?
                        <select 
                            name="status"
                            id={"stat_" + comboID + cntr}
                            value={this.props["stat_" + comboID + cntr]}
                            onChange={this.handleStatusComboChange.bind(this)}
                            className="LiUserTable_searchCombo2">
                            <option value="">--- Select ---</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                        :
                        this.props.users.selectField[comboID + cntr].compValue === "Acnt Status"
                        ?
                        <select
                            name="acnt_status"
                            id={"ac_stat_" + comboID + cntr}
                            value={this.props["ac_stat_" + comboID + cntr]}
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

    if(this.props.users.sort.length > 0) {
        return(
            <MuiThemeProvider>

            <div>
                <div className="LiUserTable_searchContainer">
                        <Tabs id="LiUserTable_searchTab" value={this.props.users.slideIndex} onChange={this.handleTabChange}>
                            <Tab id="tab_1" style={{fontSize: '16px', padding: '2px', fontWeight: 600, backgroundColor: '#881b4c', color: '#ffffff'}} label="Basic" value={0} />
                            <Tab id="tab_2" style={{fontSize: '16px', padding: '2px', fontWeight: 600, backgroundColor: 'grey', color: '#ffffff'}} label="Advanced" value={1} />
                        </Tabs>

                        <SwipeableViews index={this.props.users.slideIndex} onChangeIndex={this.handleTabChange}>
                            <div className="LiUserTable_basic_search_area">
                                        <SearchBar
                                            dataSource={this.props.users.data[0]}
                                            onRequestSearch={(searchText) => ""}
                                            onChange={(searchText) => {
                                                                        var matchedUsersArr = [];

                                                                        this.props.users.data[0].map((usr) => {
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
                                                                            this.props.liSetSearchData(matchedUsersArr);
                                                                        }
                                                                        else{
                                                                            this.props.liSetSearchData(this.convertObjectToArray(this.props.users.dummyUserArr));
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
                                this.props.users.advSearchRowIDArr.map(i => {
                                    return SearchRowComponent("search_combo_", "search_input_", i);
                                })
                            }

                            <div className="LiUserTable_addmore" >
                                <input type="radio" name="search_type" value="1" id="type_and" checked={this.props.users.selectedOption === 1} onChange={this.handleOptionChange.bind(this)} /><label htmlFor="type_and">AND</label>
                                <input type="radio" name="search_type" value="2" id="type_or" checked={this.props.users.selectedOption === 2} onChange={this.handleOptionChange.bind(this)} /><label htmlFor="type_or">OR</label>
                                &#160;&#160;&#160;&#160;                                
                                <a style={{cursor: 'pointer', color: 'blue'}} onClick={this.handleAddMore.bind(this)}>Add</a>
                                &#160;&#160;&#160;&#160;
                                {
                                this.props.users.countAdvSearchComp > 0
                                ? <a style={{cursor: 'pointer', color: 'blue'}} onClick={this.handleDeleteRow.bind(this)}>Delete</a>
                                : <a style={{cursor: 'pointer', color: 'grey'}} onClick={this.handleDeleteRow.bind(this)}>Delete</a>
                                }

                                <div>&#160;</div>

                                <FlatButton style={{color: '#ffffff', backgroundColor: '#881b4c'}} hoverColor={'#cccccc'} label="Search" labelPosition="before" onClick={this.doAdvancedSearch.bind(this)} icon={<FontIcon className="material-icons">search</FontIcon>} />
                            </div>
                        </div>
                    </SwipeableViews>
                </div>
                <div style={{float: 'right'}} className="LiUserTable_sortShowHide">
                    <DropDownMenu className="LiUsersTable_sortDropDown"
                        value={this.props.users.sortBy} onChange={this.handleSortChange.bind(this)} openImmediately={false}>
                        <MenuItem value={'full_name'} primaryText={'Name '} label={'Name [' + this.props.users.sortDir + ']'} />
                        <MenuItem value={'code'} primaryText={'Code '} label={'Code [' + this.props.users.sortDir + ']'} />
                        <MenuItem value={'status'} primaryText={'Status '} label={'Status [' + this.props.users.sortDir + ']'} />
                        <MenuItem value={'dept'} primaryText={'Department '} label={'Department [' + this.props.users.sortDir + ']'} />
                        <MenuItem value={'extn'} primaryText={'Extension '} label={'Extension [' + this.props.users.sortDir + ']'}/>
                        <MenuItem value={'email'} primaryText={'Email '} label={'Email [' + this.props.users.sortDir + ']'} />
                        <MenuItem value={'ac_status'} primaryText={'Acnt status '} label={'Acnt status [' + this.props.users.sortDir + ']'}/>
                    </DropDownMenu>
                </div>
               <Table >
                   <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                       <TableRow>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{textAlign: 'center'}}><div className="LiUserTable_header">Avatar</div></TableHeaderColumn>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "full_name")}>Name {this.props.users.sortBy === 'full_name' ? this.props.users.sortArrow : '' } </a></div></TableHeaderColumn>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "code")}>Code {this.props.users.sortBy === 'code' ? this.props.users.sortArrow : '' }</a></div></TableHeaderColumn>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "status")}>Status {this.props.users.sortBy === 'status' ? this.props.users.sortArrow : '' }</a></div></TableHeaderColumn>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "dept")}>Department {this.props.users.sortBy === 'dept' ? this.props.users.sortArrow : '' }</a></div></TableHeaderColumn>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "extn")}>Extension {this.props.users.sortBy === 'extn' ? this.props.users.sortArrow : '' }</a></div></TableHeaderColumn>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "email")}>Email {this.props.users.sortBy === 'email' ? this.props.users.sortArrow : '' }</a></div></TableHeaderColumn>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{}}><div className="LiUserTable_header"><a className="LiUserTable_headerLink" onClick={this._sortRowsBy.bind(this, "ac_status")}>Acnt status{this.props.users.sortBy === 'ac_status' ? this.props.users.sortArrow : '' } </a></div></TableHeaderColumn>
                       <TableHeaderColumn className="LiUserTable_headerColumn" style={{textAlign: 'right'}}><div className="LiUserTable_header">Action</div></TableHeaderColumn>
                       </TableRow>
                   </TableHeader>
                   <TableBody  displayRowCheckbox={false} showRowHover={true} >
                       {
                           this.props.users.pageUserArr[0].map((usr) => {
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
                           })
                       }
                   </TableBody>
               </Table>
               <div id="LiUserTable_pagination">
                    <Pagination pageSize={8} items={this.props.users.sort[0]} onChangePage={this.handleChangePage.bind(this)} />
                </div>
                <LiDialogueBox onDialogClose={this.loadInitialData} myKey="my_dialog_1" />
           </div>
           </MuiThemeProvider>
            );
        }
        else{
             return null;
        }
     }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
                                selectUser: LiAction.selectUser,
                                sortUser : LiAction.sortUser,
                                pagination: LiAction.pagination,
                                liSetSearchData: LiAction.searchUser,
                                liHandleOpenDelete: LiAction.liHandleOpenDelete,
                                liHandleOpenEdit: LiAction.lihandleOpenEdit,
                                setSlideindex: LiAction.setSlideindex,
                                handleAddMore: LiAction.handleAddMore,
                                handleDeleteRow: LiAction.handleDeleteRow,
                                handleOptionChange: LiAction.handleOptionChange,
                                handleInputChange: LiAction.handleInputChange,
                                handleComboChange: LiAction.handleComboChange,
                                handleStatusComboChange: LiAction.handleStatusComboChange,
                                handleAcStatusComboChange: LiAction.handleAcStatusComboChange,
                            }, dispatch)
}
  
function mapStateToProps(state){
    return {
        users: state.user        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiUserTable);
