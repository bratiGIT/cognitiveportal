define(['ojs/ojcore', 'knockout', 'jquery', 'appController','ojs/ojmodel', 'ojs/ojcollectiondataprovider'
      ,'restModule','ojs/ojarraydataprovider','ojs/ojcollectiondataprovider','ojs/ojknockout'],
  function (oj, ko, $, app, Model, CollectionDataProvider, restModule, ArrayDataProvider,CollectionDataProvider) {
     /** This module will not return a new instance of it. Wherever this module is required, 
      * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
     return function IndPainPointSolution(params) {         
      var self = this;      
      
      self.solutions = ko.observable([]);
    
      self.solutions(params.solutions);
      
      
    }
    
  });