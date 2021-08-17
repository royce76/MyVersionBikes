import { api, LightningElement, wire } from 'lwc';
import PF from '@salesforce/messageChannel/ProductsFiltered__c';
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext
} from 'lightning/messageService';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Product__c.FirstName';
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

  @api
  recordId;

  /**
   * Data for my datatable
   */
  bikes;

  /**
   * Property for my datatable
   */
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
    this.bikes = this.bikes.map((bike)=>{
      let mountain = bike.Category__c === 'Mountain' ? 'utility:animal_and_nature': '';
      return {...bike, 'mountainBike': mountain}
    });
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }
}