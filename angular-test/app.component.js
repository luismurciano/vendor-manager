var app = {
  template: `
    <div>
      <h1>{{$ctrl.myWelcome}}</h1>
      <h2>{{$ctrl.url}}</h2>
      <ul>
        <li ng-repeat="num in $ctrl.numbers">
          {{ num }}
        </li>
      </ul>
    </div>
  `,
  controller: ['$filter', '$location', '$log','$http', function controller($filter, $location, $log, $http) {
    $log.log('controller:! ', this);
    $http.get("../../angular/welcome.htm")
  .then(function(response) {
      this.myWelcome = response.data;
  }.bind(this));
    var numbers = [
      1,2,3,4,5,6,7,8,9,10,
      11,12,13,14,15,16,17,18,19,20
    ];
    this.url = [$location.absUrl(), $location.host(), 'test'];
    this.numbers = numbers.map(function (number) {
      return $filter('ordinal')(number);
    })

  }]
};

angular
  .module('app')
  .component('app', app);
