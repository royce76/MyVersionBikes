import { LightningElement,wire } from 'lwc';

// Import message service features required for subscribing and the message channel
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext
} from 'lightning/messageService';
import PF from '@salesforce/messageChannel/ProductsFiltered__c';

const CARD_TITLE = "Liste des vélos";
export default class MyProductList extends LightningElement {
  subscription = null; 

  bikes;

  error;
  
  cardTitle = CARD_TITLE;

  @wire(MessageContext)
  messageContext;

  // Encapsulate logic for Lightning message service subscribe
  subscribeToMessageChannel() {
      if (!this.subscription) {
          this.subscription = subscribe(
              this.messageContext,
              PF,
              (message) => this.handleMessage(message),
              { scope: APPLICATION_SCOPE }
          );
      }
  }

  // Handler for message received by component
  handleMessage(message) {
    this.bikes = message.filters;
  }

  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  connectedCallback() {
      this.subscribeToMessageChannel();
  }

}