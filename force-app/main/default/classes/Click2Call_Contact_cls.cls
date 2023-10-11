public with sharing class Click2Call_Contact_cls {
    @AuraEnabled(cacheable=true)
    public static string getAllActiveUsers(){
        try {
            List<User> lstUsers = [SELECT Username, Id, Name, Email, IsActive, Phone, MobilePhone 
            FROM User WHERE IsActive = true ORDER BY Name ASC NULLS LAST];

            return JSON.serialize(lstUsers);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string ConnectToCallPRP(String recordId, String callerName, String caller, String receiver){
        try {
            System.debug('recordId : ' + recordId);
            System.debug('Caller : ' + caller);
            System.debug('receiver : ' +  receiver);

            Contact ECon = [SELECT Id, Name, AccountId FROM Contact WHERE Id =: recordId];

            String rval = PRP_Click2Call.connectCall(caller, receiver);
            
            System.debug('return value : ' + rval);

            List<String> lstResponse = rval.split('\\|');
            String refId = lstResponse.size() > 0 ? lstResponse[0] : null;
            String callId = lstResponse.size() > 1 ? lstResponse[1] : null;
            String status = lstResponse.size() > 3 ? lstResponse[3] : null;
            System.debug('refId : ' + refId);
            System.debug('callId : ' + callId);
            System.debug('status : ' + status);

            Call_Details__c callDetails = new Call_Details__c();
            callDetails.Account__c = ECon.AccountId;
            callDetails.Contact__c = recordId;
            callDetails.Receiver__c = receiver;
            callDetails.Caller_No__c = caller;
            callDetails.Caller_Name__c = callerName;
            callDetails.Status__c = status;
            callDetails.PRP_Call_Id__c = callId;

            insert callDetails;
            return status;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}