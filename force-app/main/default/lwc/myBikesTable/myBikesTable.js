/* import { LightningElement, wire } from 'lwc';

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

} */

import { LightningElement, wire } from 'lwc';

import getProducts from '@salesforce/apex/MyProductController.getProducts';

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

  //Only to refresh datable
  @wire(getProducts)
  bikes;

  //Data for my datatable
  velo;

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
  // Velo get all bikes filtered to feed datatable
  handleMessage(message) {
    this.velo = message.filters;
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  /**
   * 
   * @param {event} event
   * save one single row in datatable 
   */
  handleSave(event) {
    //fields will save the new record
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
      // Keep all bikes has been filtered
      const velofilter = this.velo;
      // Display fresh data in the datatable
      return refreshApex(this.bikes).then(() => {
        const newBike = [];
        //Once bikes has been refresh, keep in a const variable named refreshVelo
        const refreshVelo = this.velo;
        for (const velo of refreshVelo) {
          for(const bike of velofilter) {
            if(velo.Id === bike.Id) {
              newBike.push(velo);
            }
          }
        }
        //Because this.bikes has been refresh, this.velo too.
        //So to keep filters in same states when bikes is updated, like datatable
        //Values of Velo get the const newBike
        this.velo = newBike;
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
