({
	doinit : function(component, event, helper) {
        let type = [];
        let obj1 = {};
        obj1.name = 'Comm. End Dt.';
        obj1.is_selected = true;
        
        let obj2 = {};
        obj2.name = 'Rev. End Dt.';
        obj2.is_selected = false;
        
        type.push(obj1);
        type.push(obj2);
        component.set("v.time_type", type);
        component.set("v.show_spinner", false);
	},
    
    saveit : function(component, event, helper) {
        let types = component.get("v.time_type");
        if(!(types[0].is_selected || types[1].is_selected)) {
            alert("please select a type.");
            return;
        }
        
        let type;
        if(types[0].is_selected) type = 1;
        else  type = 2;
        
        component.set("v.show_spinner", true);
        let action = component.get("c.update_time");
        action.setParams({
            "recordId" : component.get("v.recordId"),
            "type" : type
        });
        
        action.setCallback(this, function(response) {
            let title, type, message;
           	let state = response.getState();
            if(state === "SUCCESS") {
                helper.send_wa(component, event, helper);
                title = 'Success';
                type = "success";
                message = "Time update successfully.";
            }
            if(state === "ERROR") {

                title = "Failed."
                type = "error";
                message = "Failed to update time" ;
            }
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title" : title,
                "type": type,
                "message": message
            });	
            toastEvent.fire();
            component.set("v.show_spinner", false);
            $A.get("e.force:closeQuickAction").fire();
            $A.get('e.force:refreshView').fire();
        });
                
        $A.enqueueAction(action);
        
    },
    
    select_handle : function(component, event, helper) {
        let label = event.getSource().get("v.label");
        let value = event.getSource().get("v.checked");
        
        let types = component.get("v.time_type");
        if(label === 'Comm. End Dt.' && value === true) {
            types[1].is_selected = false;
        } 
        
        if(label === 'Rev. End Dt.' && value === true) {
            types[0].is_selected = false;
        }
        
        component.set("v.time_type", types);
    },
    
    closeit :  function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
        $A.get('e.force:refreshView').fire();
    }
})