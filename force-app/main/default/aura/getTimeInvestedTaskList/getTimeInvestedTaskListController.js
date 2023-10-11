({
    doInit : function(component, event, helper) {
        console.log("diinit get called!!");
        //var tt=component.get("v.ltngHour")+":"+component.get("v.ltngMinute")+":"+component.get("v.ltngSecond");
        component.set("v.ltngTimmer","00:00:00");
        //component.set("v.ltngDay1","0");
        component.set("v.ltngTimmer1","00:00:00");
        helper.gettime(component,event,helper);
        helper.timeinfo(component,event,helper);
        helper.setStartTimeOnUI(component);
       
        helper.gettime2(component,event,helper);
        component.set("v.timeinv", true);
    },
    handleStartClick : function(component, event, helper) {
        console.log("start button clicked!!");

        var hours=component.get("v.ltngHour");
        var minutes=component.get("v.ltngMinute");
        var seconds=component.get("v.ltngSecond");
        var tt=component.get("v.ltngHour")+":"+component.get("v.ltngMinute")+":"+component.get("v.ltngSecond");
        
        if(tt=="0:0:0" || tt=="00:00:00"){
            alert("Please enter some value for timer!!");
            
        }
        else{
            component.set("v.ltngTimmer",hours+":"+minutes+":"+seconds);
            helper.setStartTimeOnUI(component);
        }
        component.set('v.timeinv', 'False');
    },
    handleStopClick : function(component, event, helper) {
        component.set('v.timeinv', 'False');
        console.log("stop button clicked!!");
        var currtt=component.get("v.ltngTimmer");
        var ss = currtt.split(":");
        component.set("v.ltngHour",ss[0]);
        component.set("v.ltngMinute",ss[1]);
        component.set("v.ltngSecond",ss[2]);
        helper.setStopTimeOnUI(component);
        component.set('v.timeinv', 'False');
    },
    handleResetClick : function(component, event, helper) {
        console.log("Reset button clicked!!");
        helper.setResetTimeOnUI(component);
        component.set('v.timeinv', 'False');
    } ,
    starttiming : function(component, event, helper) {
        component.set('v.timeinv', 'False');
        var action = component.get('c.starttime');
        action.setParams({
            'recId' : component.get('v.recordId')
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var type;
            var msg;
            var title;
            var ttu=component.get('v.recordId');
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/"+ttu
            });
            urlEvent.fire();
            if (state === "SUCCESS") {
                type="success";
                msg = 'Time Started Successfully!!!';
                title="Time Started!!!";
            }
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": title,
                "type": type,
                "message": msg
            });  
            toastEvent.fire();
            window.location.reload();
            component.set('v.timeinv', 'False');
            
        });  
        $A.enqueueAction(action);    
    },
    endtiming : function(component, event, helper) {
        component.set('v.timeinv', 'False');
        var action = component.get('c.endtime');
        action.setParams({
            'recId' : component.get('v.recordId')
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var type;
            var msg;
            var title;
            var ttu=component.get('v.recordId');
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/"+ttu
            });
            urlEvent.fire();
            if (state === "SUCCESS") {
                type="success";
                msg = 'Time Stopped Successfully!!!';
                title="Time Stopped!!!";
            }
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": title,
                "type": type,
                "message": msg
            });  
            toastEvent.fire();
            window.location.reload();
            component.set('v.timeinv', 'False');
            
        });  
        $A.enqueueAction(action);    
    },
    
    
})