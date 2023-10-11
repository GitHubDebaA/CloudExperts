/*
 * Last Modified By : Pranil Ganvir 
 * Last Modified Date: 15-05-23
 * After Time start,  Working_Today_In_This__c will be checked
 */ 
public class gettimeTasklist { 
    @AuraEnabled
    public static string Rtype(string recId){
        system.debug('ait'+recId);
        list<Time__c> tt=[select id,name,Start_Time__c,Running_Time__c, Task_List__c, createdDate, Task_List__r.Hours_Minutes__c 
                          from Time__c 
                          where Task_List__c =: recId Order by createdDate DESC]; 
        
        timerWrap ttu=new timerWrap();
        integer dday=0;
        integer hhour=0;
        integer mminute=0;
        integer ssecond=0;
        if(tt.size()>0) {
            if(tt[0].Running_Time__c>=1440) {
                dday=integer.valueof(tt[0].Running_Time__c/1440);
                hhour=Integer.valueof(((tt[0].Running_Time__c - (dday*1440))/60));
                mminute=Integer.valueof(tt[0].Running_Time__c-(dday*1440)-(hhour*60));
                ssecond=0;
            }
            else{
                dday=0;
                hhour=integer.valueof(tt[0].Running_Time__c/60);
                mminute= integer.valueof((tt[0].Running_Time__c-(hhour*60)));
                ssecond=0;
            }
            ttu.day=string.valueof(dday);
            ttu.hour=string.valueof(hhour);
            ttu.minute=string.valueof(mminute);
            ttu.second=string.valueof(ssecond);
        } 
        
        system.debug('timezone'+ttu);
        return Json.serialize(ttu);   
    }
    
    @AuraEnabled
    public static string starttime(string recId){
        try{
            Task_List__c task = [SELECT Name, Id, Task__c, Description__c, Status__c,Estimated_Hours__c, Testing_Done__c, Milestone__c,
                                 Project__c, Task_List_Age__c, In_Hours__c, Minutes__c, Total_Minutes__c, MOM__c, Roll_Up__c, Incurred_By__c, Start_Date_Time__c, 
                                 End_Date_Time__c, Time_Count__c, Task_Type__c, Total_Minutes1__c, Case__c, Hours_Minutes__c, Committed_End_Date_Time__c, No_of_Technical_Details__c,
                                 Testing_Details__c, Available_in_Production__c, caseno__c, incurred_by_Formula__c, caseid__c, Task_Name__c, Approval_Status__c, Case_Subject__c,
                                 Key_Contacts_Email__c, Key_Contacts_Email_1__c, Time_updated__c, count__c, Email_Sent_to_client__c, Manager_Remarks__c, Rev_End_Date_Time__c, 
                                 Revised_Est_Time__c, IncurredBy_Count__c, Testing_User__c, Training_Task__c, Contact_Person__c, MetaData_Name__c, MetaData_Type__c,
                                 Object_API_Name__c, Count_of_Active_Time_sheet__c, Test_Class_Required__c, Test_Class_Completed__c, Client_Confirmation_Required__c,
                                 Project_Status__c, Est_Mints_Manager__c, Can_we_email_description_to_Client__c, Verification_Date__c, Task_Done_in_Sandbox_Or_Production__c,
                                 Steps_to_Reproduce__c, Actual_Output__c, Expected_Output__c,Working_Today_In_This__c FROM Task_List__c
                                 WHERE Id =: recId
                                ];
            
            task.Working_Today_In_This__c = true;
            Update task;
            
            Time__c tst=new Time__c();
            tst.Milestone_LU__c = task.Milestone__c;
            tst.Project1__c = task.Project__c; 
            tst.Task_List__c =task.Id;
            tst.Start_Time__c=system.Now();
            tst.Description__c = task.Description__c;
            tst.End_Time__c = null; 
            tst.Incurred_By1__c = task.Incurred_By__c; 
            tst.MOM_LU__c = task.MOM__c; 
            tst.Status__c = 'Started'; 
            insert tst;
            
            
        }
        catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            System.debug('The following exception has occurred line: ' + e.getLineNumber());
        } 
        return recId;   
    }
    
    @AuraEnabled
    public static string endtime(string recId){
        try { 
            list<Time__c> tt=[select id,name,Start_Time__c,Running_Time__c,End_Time__c, Task_List__c, createdDate 
                              from Time__c 
                              where Task_List__c =: recId Order by createdDate DESC];
            
            Time__c utt = new Time__c(); 
            if(tt.size()>0) {
                utt.id = tt[0].id; 
                utt.End_Time__c = system.now();
                utt.Status__c = 'Completed';
            }
            update utt;
            
            
        } 
        catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
        }
        return recId;   
    }
    
    @AuraEnabled
    public static string timeinfo(string recId){
        list<Time__c> tt=[select id,name,Start_Time__c,Running_Time__c,End_Time__c, Task_List__c, createdDate 
                          from Time__c 
                          where Task_List__c =: recId Order by createdDate DESC];
        system.debug(tt.size());
        string messageinfo='';
        if(tt.size()==0) {
            messageinfo='start';
            system.debug('inside size1');
        }
        else{
            if(tt[0].End_Time__c!=null) {
                system.debug('inside end');
                messageinfo='start' ;   
            } 
            else if(tt[0].End_Time__c==null){ 
                system.debug('inside start');
                messageinfo='end';     
            }
        }
        return messageinfo;    
    }
    
    
    /*@AuraEnabled
    public static Task_List__c timeInves(string recId){
        system.debug('id is -->'+recId);
        Task_List__c ttList=[select Id,Name, Hours_Minutes__c from Task_List__c  where id =: recId ];
        
        string timinv;
        
        /*for(Time__c t : ttList){
            system.debug('Total_Running_Time__c---->'+t.Total_Running_Time__c);
            system.debug('t.Task_List__r.Hours_Minutes__c---->'+t.Task_List__r.Hours_Minutes__c);
            timinv = t.Total_Running_Time__c + t.Task_List__r.Hours_Minutes__c;
              system.debug('timinv---->'+timinv);
        }
        
        return ttList;    
    }
    */
    
    
    public class timerWrap{
        public string day{get;set;}
        public string hour{get;set;}
        public string minute{get;set;}
        public string second{get;set;}
        public string timInvs{get;set;}
        
    }
    
}