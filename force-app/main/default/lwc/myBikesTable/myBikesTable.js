import { LightningElement, wire } from 'lwc';
import PF from '@salesforce/messageChannel/ProductsFiltered__c';
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext
} from 'lightning/messageService';

const columnField = [
  {
    label:"Image",
    fieldName:'Picture_URL__c',
    type:'customImage',
    typeAttributes: {
      altTextImage:{ fieldName : 'Name'}
    }
  },
  {label: "type", fieldName: 'mountainBike', type: 'text'}
];

export default class MyBikesTable extends LightningElement {
  @wire(MessageContext)
  messageContext;

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
      let mountain = bike.Category__c === 'Mountain' ? 'Mountain Bike': '';
      return {...bike, 'mountainBike': mountain}
    });
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }
}