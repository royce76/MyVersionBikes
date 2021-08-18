import { LightningElement, wire } from 'lwc';
import PF from '@salesforce/messageChannel/ProductsFiltered__c';

import {
  subscribe,
  publish,
  APPLICATION_SCOPE,
  MessageContext
} from 'lightning/messageService';

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
  @wire(MessageContext)
  messageContext;

  //When a user edits a cell, the updated value is stored in draft-values
  draftValues = [];

  //Data for my datatable
  bikes;

  //Property for my datatable
  columns = columnField;

  subscription = null;

  subscribeToMessageChannel() {
    if(!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        PF,
        (message)=> this.handleMessage(message) ,
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  // Handler for message received by component
  handleMessage(message) {
    this.bikes = message.filters;
    /* this.bikes = this.bikes.map((bike)=> {
      let mountain = bike.Category__c === 'Mountain' ? 'utility:animal_and_nature': '';
      return {...bike, 'mountainBike': mountain}
    }); */
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  handleSave(event) {
    const fields = {};
    fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
    fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;

    const recordInput = { fields };

    updateRecord(recordInput)
    .then( (result) => {
      console.log(result);
      console.log(this.bikes);
      for (const item of this.bikes) {
        console.log(item);
      }
    })
    .then( () => {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Success',
          message: 'Contact updated',
          variant: 'success'
        })
      );
    }).catch( () => {
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