



  


app = angular.module 'demoControls', [], ->

app.controller 'MainCtrl', ($scope) ->
  $scope.settings =
    modes: rg.modes
    currentMode: rg.modes[0]
    speed: 100

  roboglyphics = new rg.Roboglypics document.getElementsByTagName('canvas')[0], $scope.settings

  $scope.$watch 'settings.currentMode', (nval) ->
    roboglyphics.pen = null #the render loop will pick up the actual value next time around





