/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your PanelCompList ViewModel code goes here
 */
define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojlistview', 'ojs/ojbutton'],
  function (ko, ArrayDataProvider) {

    function PanelCompListViewModel() {
      var self = this;

      var data = [{
          id: 0,
          name: 'Benchmarks',
          content: 'Benchmark KPI Data'
        },
        {
          id: 1,
          name: 'Roles',
          content: 'Roles to be added'
        },
        {
          id: 2,
          name: 'Org Chart',
          content: 'Org Chart to be included'
        },
        {
          id: 3,
          name: 'Reports',
          content: 'Reports to be included'
        },
        {
          id: 4,
          name: 'Controls & Risks',
          content: 'Controls & Risks to be included'
        },
        {
          id: 5,
          name: 'Assets',
          content: 'Assets to be included'
        },
        {
          id: 6,
          name: 'Rapid Move Delivery',
          content: 'Contents to be added for Rapid Move Delivery'
        }
      ];
      this.dataProvider = new ArrayDataProvider(data, {
        keys: data.map(function (value) {
          return value.id;
        })
      });
      this.content = ko.observable("");


      this.gotoList = function (event, ui) {
        document.getElementById("listview").currentItem = null;
        this.slide();
      }.bind(this);

      this.gotoContent = function (event) {
        if (event.detail.value != null && event.detail.value.length > 0) {
          var row = data[event.detail.value];
          this.content(row.content);
          this.slide();
        }
      }.bind(this);

      this.slide = function () {
        document.getElementById('region1').classList.toggle("demo-region-hide");
        document.getElementById('region2').classList.toggle("demo-region-hide");
      }




      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new PanelCompListViewModel();
  }
);