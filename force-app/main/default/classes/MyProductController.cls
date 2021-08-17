public with sharing class MyProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(){
        List<Product__c> products = [
            SELECT Id, Description__c, Category__c, Material__c, Level__c, Name, MSRP__c, Picture_URL__c 
            FROM Product__c
        ];
        return products;
    }

}
