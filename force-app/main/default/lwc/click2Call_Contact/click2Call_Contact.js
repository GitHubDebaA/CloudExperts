import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import LightningAlert from 'lightning/alert';
import { NavigationMixin } from 'lightning/navigation';

import GetUserDetails from '@salesforce/apex/Click2Call_Contact_cls.getAllActiveUsers';
import ConnectToCallPRP from '@salesforce/apex/Click2Call_Contact_cls.ConnectToCallPRP';

const CONTACT_FIELDS = ['Contact.Name', 'Contact.Phone', 'Contact.MobilePhone', 'Contact.Whats_App_Number__c'];

export default class Click2Call_Contact extends NavigationMixin(LightningElement) {
    _WireResponse;
    @api recordId;
    @track lstUsers;
    @track contactDetails;
    @track selectedUser;
    @track selectedUserID;
    @track seletedNumber;
    @track selectedUserName;
    @track rememberMe = true;
    @track callBtnStatus = false;

    @wire(GetUserDetails)
    onCallBack(response) {
        console.log("on call back function is running");
        let data = response.data;
        let error = response.error;
        if(data) {
            this.lstUsers = JSON.parse(data);
        } 
        if(error) {
            let errorMsg = error.body.message;
            this.openAlert(errorMsg, "error", "Something went wrong", () => {
                this.navigateToRecord(this.recordId, "Contact");
            });
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: CONTACT_FIELDS })
    onCallBackGetRecord(response) {
        console.log("on call back get record");
        let data = response.data;
        let error = response.error;

        if(data) {
            this.contactDetails = data;
        }
        if(error) {
            let errorMsg = error.body.message;
            this.openAlert(errorMsg, "error", "Something went wrong", () => {
                this.navigateToRecord(this.recordId, "Contact");
            });
        }
    }

    connectedCallback() {
        let C2CInfo = localStorage.getItem("CE_PRP_C2C");
        if(C2CInfo != null) {
            C2CInfo = JSON.parse(C2CInfo);
            this.selectedUserName = C2CInfo.Name;
            this.selectedUser = C2CInfo.MobilePhone;
        }
    }

    async openAlert(message, theme, label, onCallBack) {
        await LightningAlert.open({
            message: message,
            theme: theme, 
            label: label, 
        });
        onCallBack();
    }

    navigateToRecord(recordId, objectApiName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: objectApiName,
                actionName: 'view'
            }
        });
    }

    get UserOptions() {
        let users = [];
        for(let item of this.lstUsers) {
            users.push({ label: item.Name + ' - ' + item.MobilePhone, value: item.Id });
        }

        return users;
    }

    get getContacts() {
        let contactNumbers = [];
        if(this.contactDetails.fields.Phone.value !== null)  contactNumbers.push({label: 'Phone - ' + this.contactDetails.fields.Phone.value, value : this.contactDetails.fields.Phone.value});
        if(this.contactDetails.fields.MobilePhone.value !== null)  contactNumbers.push({label: 'Mobile - ' + this.contactDetails.fields.MobilePhone.value, value : this.contactDetails.fields.MobilePhone.value});
        if(this.contactDetails.fields.Whats_App_Number__c.value !== null)  contactNumbers.push({label: 'WhatsApp No - ' + this.contactDetails.fields.Whats_App_Number__c.value, value : this.contactDetails.fields.Whats_App_Number__c.value});

        return contactNumbers;
    }

    closePage() {
        this.navigateToRecord(this.recordId, "Contact");
    }

    handleInputs(event) {
        let value = event.target.value;
        let name = event.target.name;

        if(name === "Users") {
            this.selectedUserID = value;
            for(let user of this.lstUsers) {
                if(user.Id === value) {
                    console.log("User : " + user);
                    this.selectedUser = user.MobilePhone;
                    this.selectedUserName = user.Name;
                    break;
                }
            }
        }
        if(name === "MobileNumber") this.selectedUser = value;
        if(name === "Contact") this.seletedNumber = value;
        if(name === "Name") this.selectedUserName = value;
        if(name === "RememberMe") this.rememberMe = event.target.checked;
    }

    get loadPage() {
        return this.lstUsers && this.contactDetails;
    }

    ConnectToCall() {
        if(this.selectedUser === null || this.selectedUser === undefined) {
            let msg = "Please choose a User.";
            this.openAlert(msg, "warning", "Required Field Missing", () => {return;});
            return;
        }
        if(this.seletedNumber === null || this.seletedNumber === undefined) {
            let msg = "Please choose a number.";
            this.openAlert(msg, "warning", "Required Field Missing", () => {return;});
            return;
        }
        
        if(this.rememberMe === true) {
            let C2CInfo = JSON.stringify({Name: this.selectedUserName, MobilePhone: this.selectedUser});
            localStorage.setItem("CE_PRP_C2C", C2CInfo);
        }

        this.callBtnStatus = true;

        ConnectToCallPRP({
            recordId: this.recordId,
            callerName: this.selectedUserName,
            caller: this.selectedUser,
            receiver: this.seletedNumber
        }) .then((response) => {
            let msg = "Call Initiated Successfully.";
            let type = "success";
            let label = "Success!";

            if(response !== "SUCCESS") {
                msg = response;
                type = "error";
                label = "Error!";
            }

            this.openAlert(msg, type, label, (response) => {
                if(response !== "SUCCESS") {
                    this.closePage();
                } else {
                    this.callBtnStatus = false;
                    return;
                }
            });
        })
        .catch((error) => {
            let errorMsg = error.body.message;
            this.openAlert(errorMsg, "error", "Error!", () => {
                this.callBtnStatus = false;
                return;
            })
        });
    }
}