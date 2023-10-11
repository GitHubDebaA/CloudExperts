({
    waitingTimeId: null,
    setStartTimeOnUI: function(component) {
        component.set("v.ltngIsDisplayed", true);
        var currTime = component.get("v.ltngTimmer");
        
        if (currTime) {
            var ss = currTime.split(":");
            var dt = new Date();
            dt.setHours(ss[0]);
            dt.setMinutes(ss[1]);
            dt.setSeconds(ss[2]);
            
            var dt2 = new Date(dt.valueOf() + 1000);
            var temp = dt2.toTimeString().split(" ");
            var ts = temp[0].split(":");
            
            component.set("v.ltngTimmer", ts[0] + ":" + ts[1] + ":" + ts[2]);
            this.waitingTimeId = setTimeout($A.getCallback(() => this.setStartTimeOnUI(component)), 1000);
            
            if (ts[0] == 0 && ts[1] == 0 && ts[2] == 0) {
                component.set("v.ltngTimmer", "EXPIRED");
                window.clearTimeout(this.waitingTimeId);
                component.set("v.ltngIsDisplayed", false);
            }
        }
    },
    
    
    setStopTimeOnUI : function(component) {
        component.set("v.ltngIsDisplayed",false);
        window.clearTimeout(this.waitingTimeId);
    },
    setResetTimeOnUI : function(component) {
        component.set("v.ltngIsDisplayed",false);
        component.set("v.ltngHour","0");
        component.set("v.ltngMinute","0");
        component.set("v.ltngSecond","0");
        component.set("v.ltngTimmer","00:00:00");
        window.clearTimeout(this.waitingTimeId);
    },
    gettime : function(component,event,helper){
        var action = component.get('c.Rtype');
        action.setParams({
            'recId' : component.get('v.recordId')
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var ttimes= JSON.parse(response.getReturnValue());
            //console.log(ttimes);
            if(state === "SUCCESS"){
                component.set('v.ltngTimmer',ttimes.hour+":"+ttimes.minute+":"+"00");
                component.set('v.ltngDay',ttimes.day);
                component.set('v.timeinv', true);
            }
            
            
        });
        $A.enqueueAction(action);
    },
    timeinfo : function(component,event,helper){
        var action = component.get('c.timeinfo');
        action.setParams({
            'recId' : component.get('v.recordId')
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var ttimes= response.getReturnValue();
            //console.log(ttimes);
            if(state === "SUCCESS"){
                
                component.set('v.timeinfo',ttimes);
                component.set('v.timeinv', true);
                
            }
            
        });
        $A.enqueueAction(action);
    },
    
    fetchTimeInvs : function(component,event,helper){
        console.log('fetchTimeInvs method Inside');
        var action = component.get('c.fetchTimeInvs');
        action.setParams({
            'recId' : component.get('v.recordId')
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var ttimes= response.getReturnValue();
            //console.log('ttimes.Hours_Minutes__c----->' +ttimes.Hours_Minutes__c);
            if(state === "SUCCESS"){
                
                component.set('v.timeInvst',ttimes.Hours_Minutes__c);
                component.set('v.timeinv', true);
            }
            
        });
        $A.enqueueAction(action);
    },
    
    gettime2 : function(component,event,helper){
        // console.log('Inside gettime2');
        var action = component.get('c.Rtype1');
        action.setParams({
            'recId' : component.get('v.recordId')
        });
        
        console.log('Inside gettime2------------2');
        action.setCallback(this,function(response){
            var state = response.getState();
            
            console.log('Inside gettime2---State-->'+state);
            var ttimes= JSON.parse(response.getReturnValue());
            console.log(ttimes);
            if(state === "SUCCESS"){
                if (ttimes && ttimes.hour1 == '0' && ttimes.minute1 == '0') {
                    //console.log('ttimes.hour1 -------------------->'+ttimes.hour1);
                    //console.log('ttimes.minute1 -------------->'+ttimes.minute1);
                    
                    component.set('v.ltngTimmer1',"00"+":"+"00"+":"+"00");
                    component.set('v.ltngDay1',"0");
                    component.set('v.timeinv', true);
                    
                }else{
                    //console.log('ttimes.hour1 -------------------->'+ttimes.hour1);
                    //console.log('ttimes.minute1 -------------->'+ttimes.minute1);
                    
                    component.set('v.ltngTimmer1',ttimes.hour1+":"+ttimes.minute1+":"+"00");
                    component.set('v.ltngDay1',ttimes.day1);
                    component.set('v.timeinv', true);
                }
                
            }
        });
        $A.enqueueAction(action);
    },
})