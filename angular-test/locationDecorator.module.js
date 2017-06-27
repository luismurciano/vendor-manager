var locationDecorator = angular.module('locationDecorator', []);
locationDecorator.config(['$provide', function($provide) {
	$provide.decorator('$location', ['$delegate', '$log', function($delegate, $log) {
    var originalLocation = angular.copy($delegate);
    // $delegate = angular.copy($delegate);
    console.log('$delegate', $delegate);
		// $delegate.absUrl = function () {
    //   return originalLocation.absUrl().replace('localhost:3000','bbva.com')
    // }
    $delegate.host = function () {
      $log.log('originalLocation.host()', originalLocation.host().replace('localhost:3000','bbva.com'))
      return originalLocation.host().replace('localhost','bbva.com');
    }
		return $delegate;
	}]);
}]);
