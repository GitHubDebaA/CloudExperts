public with sharing class PRP_Click2Call {
    public static String connectCall(String soruce, String receiver) {
        try {
            PRP_Click2Call__mdt click2call = [SELECT Id, Label, cURL__c, UserId__c, Password__c, Source__c 
            FROM PRP_Click2Call__mdt WHERE Label =: 'Click2Call'];

            String curl = click2call.cURL__c;
            String endpoint = curl + 'uname=' + click2call.UserId__c + '&pass=' + click2call.Password__c + '&reqid=1&aparty=' + soruce + '&bparty=' + receiver + '&source=WEBGUI';
            System.debug('endpoint url : ' +  endpoint);

            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint);
            request.setMethod('GET');

            Http hnew = new Http();
            HttpResponse response = hnew.send(request);

            System.debug('Response code : ' + response.getStatusCode());
            System.debug('Response body : ' + response.getBody());

            return response.getBody();
        } catch(Exception e) {
            System.debug('error in PRP_Click2Call.connectCall');
            System.debug('error line number' + e.getLineNumber());
            System.debug('error message : ' + e.getLineNumber());

            return e.getMessage();
        }
    }
}