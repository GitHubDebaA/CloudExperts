({
	send_wa : function(component, event, helper) {
        let action = component.get("c.send_whatsapp");
        action.setParams({
            "recordId" : component.get("v.recordId")
        });
        
        action.setCallback(this, function(response) {
           	let state = response.getState();
            if(state === "SUCCESS") {
                console.log("wa send successfully");
            }
            if(state === "ERROR") {
                console.log("failed to send wa");                
            }
        });
        
        $A.enqueueAction(action);
	}
})