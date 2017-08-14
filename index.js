/*
 * Supports down to AngularJS 1.4.
 * In theory should support down to Angular 1.3 and probably further.
 */

angular
  .module('MultiDropdownWidget', [])
  .directive('multiDropdown', function() {
    return {
      restrict: 'E',
      bindToController: {
        columns:   '=', 
        onSelects: '=',
        options:   '='
      },
      scope: {},
      controller: function() {
        var $ctrl = this;

        var constructHeading = function(e) { return (e && (e.prefix || e.text)) || ' ' };
        var clearNextHeadingMaybe = function(idx) {
          if(!$ctrl.options) return;
          
          if($ctrl.options[idx].clearNextHeading) {
            if((idx + 1) >= $ctrl.state.dropdown.length) return;
            
            $ctrl.state.dropdown[idx + 1].heading = '';
          }
        };
        var getCustomStyleMaybe = function(i) { return $ctrl.options && $ctrl.options[i] && $ctrl.options[i].style };
        $ctrl.getCustomStyleMaybe = getCustomStyleMaybe;
        
        var selectDropdownItemMaybe = function(i) {
          if($ctrl.options && $ctrl.options[i] && $ctrl.options[i].select >= 0) {
            $ctrl.onSelect($ctrl.columns[i][$ctrl.options[i].select], i);
          } 
        };
        
        // Initialize the state
        $ctrl.state = {
          dropdown: (new Array($ctrl.columns.length || 0)).fill(null)
        };
        
        // Setup the state
        $ctrl.state.dropdown = $ctrl.state.dropdown.map(function(d, idx) {
          var cur = $ctrl.columns[idx];
          return {
            heading: constructHeading(cur[0]),
            show: false
          };
        });

        
        // Update the heading; toggle visibilty; fire select handler
        $ctrl.onSelect = function(item, index) {
          $ctrl.state.dropdown[index].heading = constructHeading(item);
          clearNextHeadingMaybe(index);

          $ctrl.state.dropdown[index].show = false;

          $ctrl.onSelects[index](item);
        };
        
        $ctrl.toggle = function(index) {
          $ctrl.state.dropdown[index].show = !$ctrl.state.dropdown[index].show;
        };
        
        $ctrl.getHeading = function(index) {
          return $ctrl.state.dropdown[index].heading;
        };
        
        $ctrl.columns.forEach(function(d, idx) {
          selectDropdownItemMaybe(idx);
        });
      },
      controllerAs: '$ctrl',
      template: tpl
    };
  });

var tpl = `
<style>
.multi-dropdown {
  --hover-color: #f8f8f8;
}
.multi-dropdown { 
  display: inline-block;
}
.multi-dropdown > .selector {
  padding: 0.55em;
}
.multi-dropdown > .selector:hover {
  background-color: var(--hover-color);
  cursor: pointer;
}
.multi-dropdown > .selector > .selected {
  display: inline-block;
  min-width: 1em;
  text-align: center;
}
.multi-dropdown > .selector .arrow {
  font-size: 0.5em;
  position: relative;
  left: -0.1em;
}
.multi-dropdown > .selector.opened {
  background-color: var(--hover-color);
}
.multi-dropdown > .menu {
  list-style: none;
  position: absolute;
  z-index: 2;
  padding: 0;
  margin: 0 0 0 -1px;
  -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
  box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
  background-color: white;
  border: 1px solid #CCC;
  white-space: nowrap;
  max-height: 200px;
  overflow-y: scroll;
}
.multi-dropdown > .menu > li:hover {
  background-color: var(--hover-color);
  cursor: pointer;
}
</style>

<div 
  class="multi-dropdown" 
  ng-repeat="dropdown in $ctrl.columns"
  >
  <div 
    class="selector"
    ng-class="{ 'opened': $ctrl.state.dropdown[$index].show }"
    ng-click="$ctrl.toggle($index)"
    >
    <span class="selected" style="{{ $ctrl.getCustomStyleMaybe($index) }}">{{  $ctrl.getHeading($index) }}</span>
    <span class="arrow glyphicon glyphicon-triangle-bottom"></span>
  </div>
  <ul class="menu"
    ng-show="$ctrl.state.dropdown[$index].show"
    >
    <li 
      ng-repeat="item in dropdown"
      ng-click="$ctrl.onSelect(item, $parent.$index)"
      >
      {{item.prefix }} {{ item.text }}
    </li>
  </ul>
</div>
`;
