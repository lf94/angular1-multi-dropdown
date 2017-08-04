# AngularJS multi-dropdown component
Supports down to AngularJS 1.4.

Currently no usage examples, but just look at the source. It is small.

No need to build anything, just include it:

```
import './angular1-multi-dropdown';
```

or

```
<script src="./angular1-multi-dropdown/index.js"></script>
```

and in your Angular code:

```
angular.module('app', ['MultiDropdownWidget'])
```

in a template/HTML:

```
<multi-dropdown
  data="[ [{prefix:'e', text: 'electric', value: '12321'}], [] ]" <!-- two dropdowns      -->
  on-selects="[]"                                                 <!-- no select handlers -->
  options="[{ select: 0}, {}]"                  <!-- select the 1st entry in 1st dropdown --> 
  ></multi-dropdown>
```
