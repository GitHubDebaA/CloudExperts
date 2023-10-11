({
    waitingTimeId: null,
    setStartTimeOnUI : function(component) {
        component.set("v.ltngIsDisplayed",true);
        var currTime =component.get("v.ltngTimmer");
        if(currTime != undefined) {
            var ss = currTime.split(":");
            var dt = new Date();
            dt.setHours(ss[0]);
            dt.setMinutes(ss[1]);
            dt.setSeconds(ss[2]);
            
            var dt2 = new Date(dt.valueOf() + 1000);
            var temp = dt2.toTimeString().split(" ");
            var ts = temp[0].split(":");
            
            component.set("v.ltngTimmer",ts[0] + ":" + ts[1] + ":" + ts[2]);
            this.waitingTimeId =setTimeout($A.getCallback(() => this.setStartTimeOnUI(component)), 1000);
            if(ts[0]==0 && ts[1]==0 && ts[2]==0 ){
                component.set("v.ltngTimmer","EXPIRED");
                window.clearTimeout(this.waitingTimeId);
                component.set("v.ltngIsDisplayed",false);
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
        console.log('Inside gettime++++++++++++++')
        var action = component.get('c.Rtype');
        action.setParams({
            "recId" : component.get('v.recordId')
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var ttimes= JSON.parse(response.getReturnValue());
            //console.log(ttimes);
            if(state === "SUCCESS"){
                component.set('v.ltngTimmer',ttimes.hour+":"+ttimes.minute+":"+"00");
                component.set('v.ltngDay',ttimes.day);
                console.log('all time'+  component.set('v.ltngDay',ttimes.day));
                console.log('timInv---> '+ ttimes.timInvs)
                //component.set("v.timInv", ttimes.timInvs);
                
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
            }
            
        });
        $A.enqueueAction(action);
    },
    
   
    
})