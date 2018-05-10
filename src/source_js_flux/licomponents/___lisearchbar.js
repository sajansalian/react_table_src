import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import SearchBar from 'material-ui-search-bar';
import Dialog from 'material-ui/Dialog';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import { blue500 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import * as Todoaction from '../liactions/liusertableactions';
import LiUserTableStore from '../listores/liusertablestore';

const avatarStyle = { margin: 1 };

class LiUsersTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
                        subUserArr: [],
                        pageUserArr: [],
                        sortBy: "full_name",
                        sortDir: "DESC",
                        covertstring: []
                     }
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

    render () {        
        const iconButton = (
                                <IconButton touch={true} iconClassName="material-icons">view_list</IconButton>
                            );

        var sortDirArrow = "";
        if(this.state.sortDir !== null) {
            sortDirArrow = this.state.sortDir === 'DESC' ? ' ⇓' : ' ⇑';
        }

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

        return (
            <div className="LiUserTable_container">

                <SearchBar
                    dataSource={this.state.mainUserArr}
                    onRequestSearch={(searchText) => "" }
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
                            }} />
                <br />

                <div style={{clear: 'right'}}>

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

                </div>
            </div>
        )
    }
    componentDidMount() {
        var self = this;
        axios.get("user_data.json").then(function (response) {
            Todoaction.default.liConvertStringToArray(response.data);
        })
        .catch(function (error) {
            console.log("AXIOS Error: "+ error);
        });

        LiUserTableStore.on('CHANGE', () => {
            this.setState({covertstring: LiUserTableStore.state.convertarray});

            var self = this;

            setTimeout(() => {
                self.setState({
                                mainUserArr:  self.state.covertstring,
                                subUserArr:  self.state.covertstring
                                });
    
                self._sortRowsBy(self.state.sortBy); // initial sorting            
            });            
        });
    }
}

export default LiUsersTable;