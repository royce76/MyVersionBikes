import { LightningElement, wire } from 'lwc';
import PF from '@salesforce/messageChannel/ProductsFiltered__c';
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext
} from 'lightning/messageService';

const columnField = [
  /* {
    label:"Image",
    fieldName:'Picture_URL__c',
    type:'myImage',
    typeAttributes: {
      Name:{ fieldName : 'Name'}
    }
  } */
];

export default class MyBikesTable extends LightningElement {
  @wire(MessageContext)
  messageContext;

  bikes;
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
    console.log(this.bikes);
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }
}