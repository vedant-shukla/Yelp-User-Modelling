var app = angular.module("dataVisualization");
app.controller("dataVisualizationController", function($scope, $http, $rootScope, $window) {
    console.log("loaded");
    d3.csv("js/controllers/Data/Final_Data/US_top_full_user_data.csv", function(topUsersOfUs) {
        $rootScope.topUserList = topUsersOfUs;
        d3.csv("js/controllers/Data/state_wise_business_rating.csv", function(data) {
            $rootScope.responseData = data;

            d3.csv("js/controllers/Data/Final_Data/US_combined_new.csv", function(data) {
                $rootScope.userData = data;
                //console.log($rootScope.userData1);
                d3.csv("js/controllers/Data/Final_Data/US_top_statewise_data_new.csv", function(data) {
                    $rootScope.restaurantDataStateWise = data;
                });
                $window.location.href = "#/yelp";
                //console.log($rootScope.responseData);
            });
            //console.log($rootScope.responseData);
        });
    });
});
