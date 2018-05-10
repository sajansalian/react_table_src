import React, { Component } from 'react';
import LiUserTableStore from '../listores/liusertablestore';

import Dialog from 'material-ui/Dialog';
//import UserEditComp from 'my-usermgmt-comp'; 

import UserEditComp from 'useredit-new'; 
import FlatButton from 'material-ui/FlatButton';

import axios from 'axios';

class LiDialogueBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
                        edit_open: false,
                        delete_open: false,
                        uid: 0
                    };
        
        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleDeleteData = this.handleDeleteData.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
    }

    handleUpdateData = (updatedUserDataObj) => {
        var self = this;
        axios.get("https://business-portal.lisec.com/test/json_users_update.php?user_code=" + this.state.uid + "&user_obj=" + JSON.stringify(updatedUserDataObj))
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
        axios.get("https://business-portal.lisec.com/test/json_users_delete.php?user_code=" + this.state.uid)
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
        if(this.state.edit_open)
        {
            this.setState({ edit_open: false });
        }

        if(this.state.delete_open)
        {
            this.setState({ delete_open: false });
        }
    }

    render () {
        //console.log(this.state.userDataObj[this.state.uid]);

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
                    title={"Edit User: " + this.state.uid}
                    titleStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    bodyStyle={{backgroundColor: '#cccccc', padding: '0' }}
                    actionsContainerStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    modal={true}
                    open={this.state.edit_open}
                    onRequestClose={this.handleDialogClose}
					autoScrollBodyContent={true}>
                        <UserEditComp userID={this.state.uid} dataObj={this.state.userDataObj} onSubmitAction={this.handleUpdateData} onCancelAction={this.handleDialogClose}/>
                </Dialog>

                <Dialog
                    title={"Delete User: " + this.state.uid}
                    titleStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    bodyStyle={{backgroundColor: '#cccccc', padding: '20px' }}
                    actionsContainerStyle={{backgroundColor: '#ffffff', padding: '8px' }}
                    modal={true}
                    actions={dialogActions}
                    open={this.state.delete_open}
                    onRequestClose={this.handleDialogClose}
                    autoScrollBodyContent={true}>
                    <div>
                        <br/>
                        Do you want to delete the record {this.state.uid} ?
                        <br/><br/>
                    </div>
                </Dialog>
            </div>
        )
    }

    componentWillMount() {
        
        LiUserTableStore.on(this.props.myKey, () => {
                                                    this.setState({
                                                                    edit_open: LiUserTableStore.getAllItems().edit_open,
                                                                    uid: LiUserTableStore.getAllItems().uid,
                                                                    userDataObj: LiUserTableStore.getAllItems().userDataObj
                                                                });
                                                });

        LiUserTableStore.on(this.props.myKey, () => {
                                                    this.setState({
                                                                    delete_open: LiUserTableStore.getAllItems().delete_open,
                                                                    uid: LiUserTableStore.getAllItems().uid
                                                                });                
                                                });
    }
}

export default LiDialogueBox;
