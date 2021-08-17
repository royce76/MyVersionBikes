import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/MyProductController.getProducts';

import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import PRODUCT from '@salesforce/schema/Product__c';

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import PF from '@salesforce/messageChannel/ProductsFiltered__c';

const MAX_PRICE = 10000;
export default class MyProductFilter extends LightningElement {

  maxPrice = MAX_PRICE;

  /**
   * property filters with name, price, and picklist
   */
  filters = {
    Name : "",
    MSRP__c : MAX_PRICE
  };

  products;

  /**
   * property for picklist
   */
  category;
  level;
  material;

  error;

  /**
   * 
   * @param {object} {data,error}
   * publish first message with all bikes before using event onchange 
   */
  @wire(getProducts)
  wiredProducts({data,error}) {
    if(data) {
      this.products = data;
      this.error = undefined;
      const message = {filters: this.products};
      publish(this.messageContext, PF, message);
    }else if(error) {
      this.products = undefined;
      this.error = error;
    }
  }

  @wire(MessageContext)
  messageContext;

  @wire(getObjectInfo, { objectApiName: PRODUCT })
  productInfo;

  /**
   * 
   * @param {obejct} PRODUCT
   * get picklist values from category, material and level
   */
  @wire(getPicklistValuesByRecordType, {objectApiName: PRODUCT, recordTypeId: '$productInfo.data.defaultRecordTypeId'})
  wiredListOfPicklistProduct({data, error}) {
    if(data) {
      this.category = this.categoryPicklist(data.picklistFieldValues);
      this.level = this.levelPicklist(data.picklistFieldValues);
      this.material = this.materialPicklist(data.picklistFieldValues);
      this.error = undefined;
    } else if(error) {
      this.listOfPicklistProduct = undefined;
      this.error = error;
    }
  }

  categoryPicklist(data) {
    const categoryArray = [];
    Object.keys(data).forEach((x)=>{
      if(x === 'Category__c') {
        categoryArray.push(data[x].values);
      }
    });
    
    return categoryArray[0];
  }

  levelPicklist(data) {
    const levelArray = [];
    Object.keys(data).forEach((x)=>{
      if(x === 'Level__c') {
        levelArray.push(data[x].values);
      }
    });
    
    return levelArray[0];
  }

  materialPicklist(data) {
    const materialArray = [];
    Object.keys(data).forEach((x)=>{
      if(x === 'Material__c') {
        materialArray.push(data[x].values);
      }
    });
    
    return materialArray[0];
  }

  /**
   * 
   * @param {eventListenener} event
   * publish a new bikes objects array
   */
  handleChange(event) {
    /**
     * Lazy initialize filters with all values initially set
     * filters property grow up with pickList
     */
    if (!this.filters.Category__c) {
      this.filters.Category__c = this.category.map(
          (item) => item.value
      );
      this.filters.Level__c = this.level.map(
          (item) => item.value
      );
      this.filters.Material__c = this.material.map(
          (item) => item.value
      );
    }

    const value = event.target.dataset.value;
    const fields = event.target.dataset.fieldName;
    
    if(fields === 'Category__c' || fields === 'Level__c' || fields === 'Material__c') {
      if(event.target.checked) {
        if(!this.filters[fields].includes(value)){
          this.filters[fields].push(value);
        }
      } else {
        this.filters[fields] = this.filters[fields].filter((x) => x !== value);
      }
    }
    if(fields === 'Name') {
      this.filters[fields] = event.target.value.toUpperCase();
    }
    if(fields === 'MSRP__c') {
      this.filters[fields] = event.target.value;
    }
    const bikes = this.products;
    const bikesFiltered = this.filterProducts(bikes);   
    
    const message = {filters: bikesFiltered};
    publish(this.messageContext, PF, message);
    
  }

  /**
   * 
   * @param {object} datas 
   * @returns bikes objects array
   */
  filterProducts(datas) {
    const datasFiltered = [];
    for(const data of datas) {
      if(
        data.Name.includes(this.filters.Name) &&
        data.MSRP__c <= this.filters.MSRP__c &&
        this.filters.Category__c.includes(data.Category__c) &&
        this.filters.Level__c.includes(data.Level__c) &&
        this.filters.Material__c.includes(data.Material__c)
      ) {
        datasFiltered.push(data);
      }
    }
    return datasFiltered;
  }

}