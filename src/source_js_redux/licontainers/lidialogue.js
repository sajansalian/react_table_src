import React, { Component } from 'react';
//import LiUserTableStore from '../listores/liusertablestore';

import Dialog from 'material-ui/Dialog';
import UserEditComp from 'useredit-new'; 
import FlatButton from 'material-ui/FlatButton';

import {bindActionCreators} from 'redux';

import * as LiAction from '../liactions/userAction';
import { connect } from 'react-redux';

import axios from 'axios';

class LiDialogueBox extends Component {
    constructor(props) {
        super(props);
        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleDeleteData = this.handleDeleteData.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
    }

    componentWillMount() {        
    }

    handleUpdateData = (updatedUserDataObj) => {
        var self = this;
        axios.get("https://business-portal.lisec.com/test/json_users_update.php?user_code=" + this.props.users.uid + "&user_obj=" + JSON.stringify(updatedUserDataObj))
        .then(function(response) {
            console.log("UPDATE success: " + response);

            self.handleDialogClose();
            self.props.onDialogClose();
        })
        .catch(function(error) {
            console.log("AXIOS Error: " + error);
        });
    }

    handleDeleteData = () => {
        var self = this;        
        axios.get("https://business-portal.lisec.com/test/json_users_delete.php?user_code=" + this.props.users.uid)
        .then(function(response) {
            console.log("DELETE success: " + response);

            self.handleDialogClose();
            self.props.onDialogClose();
        })
        .catch(function(error) {
            console.log("AXIOS Error: " + error);
        });
    }

    handleDialogClose = () => {
        var close;
        if(this.props.users.edit_open)     
        {
            close="edit";
            this.props.closeEditDelete(close);
        }

        if(this.props.users.delete_open)
        {
            close="delete";
            this.props.closeEditDelete(close);
        }
    }

    render () {
        const dialogActions = [
                                    <FlatButton
                                        label="Cancel"
                                        primary={true}
                                        onClick={this.handleDialogClose}
                                    />,
                                    <FlatButton
                                        label="Delete"
                                        primary={true}
                                        keyboardFocused={false}
                                        onClick={this.handleDeleteData}
                                    />
                                ];

        return (
            <div>
                 <Dialog
                    title={"Edit User: " + this.props.users.uid}
                    titleStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    bodyStyle={{backgroundColor: '#cccccc', padding: '0' }}
                    actionsContainerStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    modal={true}
                    open={this.props.users.edit_open}
                    onRequestClose={this.handleDialogClose}
					autoScrollBodyContent={true}>
                        <UserEditComp userID={this.props.users.uid} dataObj={this.props.users.userDataObj} onSubmitAction={this.handleUpdateData} onCancelAction={this.handleDialogClose}/>
                </Dialog>

                <Dialog
                    title={"Delete User: " + this.props.users.uid}
                    titleStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    bodyStyle={{backgroundColor: '#cccccc', padding: '20px' }}
                    actionsContainerStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    modal={true}
                    actions={dialogActions}
                    open={this.props.users.delete_open}
                    onRequestClose={this.handleDialogClose}
                    autoScrollBodyContent={true}>
                    <div>
                        <br/>
                        Do you want to delete the record {this.props.users.uid} ?
                        <br/><br/>
                    </div>
                </Dialog>
            </div>
        )
    }   
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
                                liHandleOpenDelete:LiAction.liHandleOpenDelete,
                                liHandleOpenEdit:LiAction.lihandleOpenEdit,
                                closeEditDelete:LiAction.closeEditDelete
                            }, dispatch)
}
  
function mapStateToProps(state){
    return {
        users: state.user        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiDialogueBox);
