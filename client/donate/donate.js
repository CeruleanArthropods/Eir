angular.module('eir.donate', ['ngRoute'])

.controller('donateCtrl', function ($scope, patientsFactory, donorsFactory, $routeParams, conditionFactory) {

  $scope.patient = {};
  $scope.donor = {};

  // this will allow you to display patient info on the donate page

  $scope.getPatients = function() {
    patientsFactory.getPatient($routeParams.id)
      .then(function(res) {
        $scope.patient = res[0];
        $scope.getConditionName();
        
        if($scope.patient.progress === 0) {
          $scope.text = "Be the first to donate towards " + $scope.patient.first_name + "'s cause!";
        } else {
          $scope.text = "Let's reach " + $scope.patient.first_name + "'s goal!";
        }

        $scope.decimalProgress = $scope.patient.progress/$scope.patient.goal;
        $scope.percentProgress = Math.round(($scope.patient.progress/$scope.patient.goal)*100);

        $scope.progressBar();
      
      })
      .catch(function(err) {
        console.log('ERROR patientsFactory.getPatient: ' + err);
      });
  }

  $scope.getPatients();

  // called after patient reocrd is returned. condtion is in a seperate table 
  $scope.getConditionName = function() {
    conditionFactory.getCondition($scope.patient.condition_id)
      .then(function (res){
        var conditionName = res[0].condition_name;
        $scope.patient.condition_name = conditionName;
      })
      .catch(function (err){
        console.warn('Err donateCtrl - could not find condition name: ', err);
      });
  };

  // on form submit, send the new donor info to the server; POST req
  $scope.handleSubmit = function(newDonor) {
    newDonor.patient_id = $routeParams.id;

    donorsFactory.submitDonationForm(newDonor)
      .then(function(res) {
        $scope.donor = {};

        $scope.getPatients();
        $scope.thankYou = "Thank you!"

      })
      .catch(function(err) {
        console.log('ERROR donorsFactory.submitDonationForm: ', err)
      });
  };


  // D3 STUFF

  $scope.progressBar = function() {

    $scope.circle && $scope.circle.destroy();

    $scope.circle = new ProgressBar.Circle('.patient-progress', {
      color: '#FCB03C',
      trailColor: '#fff68f',
      strokeWidth: 3,
      trailWidth: 5,
      fill: '#FFFFFF',
      svgStyle: {
        display: 'block',
        // width: 100%
      },
      text: {
        value: $scope.percentProgress + '% funded',
        style: {
            // Text color.
            // Default: same as stroke color (options.color)
            color: '#f00',
            position: 'relative',
            left: '50%',
            top: '-50%',
            padding: 0,
            // margin: auto,
            // You can specify styles which will be browser prefixed
            transform: {
                prefix: true,
                value: 'translate(-50%, -50%)'
            }
        },
        // alignToBottom: true
      }

    });

    $scope.circle.animate($scope.decimalProgress);
  }

});
