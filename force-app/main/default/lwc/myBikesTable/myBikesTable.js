import { LightningElement, wire } from 'lwc';

import getProducts from '@salesforce/apex/MyProductController.getProducts';

import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Product__c.Name';
import ID_FIELD from '@salesforce/schema/Product__c.Id';

const columnField = [
  { label:"Image", fieldName:'Picture_URL__c', type:'customImage',
    typeAttributes: {
      altTextImage: { fieldName: 'Name'}
    }
  },
  {label:"Name", fieldName: 'Name', editable: true}
];

export default class MyBikesTable extends LightningElement {
  //When a user edits a cell, the updated value is stored in draft-values
  draftValues = [];

  //Data for my datatable
  @wire(getProducts)
  bikes;

  //Property for my datatable
  columns = columnField;

  subscription = null;

  handleSave(event) {
    const fields = {};
    fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
    fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;

    const recordInput = { fields };

    updateRecord(recordInput)
    .then( () => {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Success',
          message: 'Contact updated',
          variant: 'success'
        })  
      );
      // Display fresh data in the datatable
      return refreshApex(this.bikes).then(() => {
        // Clear all draft values in the datatable
        this.draftValues = [];
      });
    })
    .catch( () => {
      this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error updating or reloading record',
            message: 'oups',
            variant: 'error'
        })
      );
    })
  }

}