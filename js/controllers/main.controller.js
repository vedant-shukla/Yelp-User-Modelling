var app = angular.module("dataVisualization");

var stateName = "";

app.controller("mainController", function($scope, $http, $rootScope) {
  $("#statespan").text("US");
  $("#statespan1").text("US");
  $(".textCenter").css("display", "block");
  $(".selectedTwo").css("display", "none");
  $("#map").css("display", "none");
  $(".topRestTitle").css("display", "none");
  $scope.disable = false;
  $scope.stateName = stateName;
  $scope.stateName = null;
  $scope.selectedTwo = false;
  $scope.flag = false;
  $scope.RestaurantBtn = true;
  $rootScope.topUsers = [];
  $scope.category = "Restaurant";
  $scope.update = false;
  var categoryData = new Array();

  for (var i = 0; i < $scope.responseData.length; i++) {
    if ($scope.responseData[i].Category == "Restaurant") {
      categoryData.push({
        Rating: +$scope.responseData[i].Rating,
        State: $scope.responseData[i].State
      });
    }
  }

  var usMap = new USMap(categoryData);
  usMap.drawMap();

  $scope.categoryChange = function(category) {
    $("#topRestaurant").empty();
    $(".topRestTitle").css("display", "none");
    if (category == "Restaurant") {
      $scope.RestaurantBtn = true;
      $scope.ShoppingBtn = false;
      $scope.HealthBtn = false;
      $scope.HomeBtn = false;
      $scope.BeautyBtn = false;
    } else if (category == "Shopping") {
      $scope.RestaurantBtn = false;
      $scope.ShoppingBtn = true;
      $scope.HealthBtn = false;
      $scope.HomeBtn = false;
      $scope.BeautyBtn = false;
    } else if (category == "Health & Medical") {
      $scope.RestaurantBtn = false;
      $scope.ShoppingBtn = false;
      $scope.HealthBtn = true;
      $scope.HomeBtn = false;
      $scope.BeautyBtn = false;
    } else if (category == "Home & Service") {
      $scope.RestaurantBtn = false;
      $scope.ShoppingBtn = false;
      $scope.HealthBtn = false;
      $scope.HomeBtn = true;
      $scope.BeautyBtn = false;
    } else {
      $scope.RestaurantBtn = false;
      $scope.ShoppingBtn = false;
      $scope.HealthBtn = false;
      $scope.HomeBtn = false;
      $scope.BeautyBtn = true;
    }

    console.log(category);
    empty(categoryData);
    $scope.category = category;
    for (var i = 0; i < $scope.responseData.length; i++) {
      if ($scope.responseData[i].Category == $scope.category) {
        categoryData.push({
          Rating: +$scope.responseData[i].Rating,
          State: $scope.responseData[i].State
        });
      }
    }
    usMap.updateData(categoryData);

    if ($scope.flag) {
      $scope.showStateData(stateName);
    } else {
      $scope.topUsersDataUpdate();
    }
  };

  for (var i = 0; i < $scope.topUserList.length; i++) {
    if ($scope.topUserList[i].business_category == $scope.category) {
      $rootScope.topUsers.push({
        UserId: $scope.topUserList[i].user_id,
        UserName: $scope.topUserList[i].name,
        RatingOfUser: Number($scope.topUserList[i].final_score).toFixed(2),
        UserReviewCount: Number($scope.topUserList[i].review_count),
        UsefullReviewCount: Number($scope.topUserList[i].useful),
        FanCount: Number($scope.topUserList[i].fans),
        EliteCount: Number($scope.topUserList[i].elite_count),
        ComplimentCount: Number($scope.topUserList[i].compliment_count),
        MonthCount: Number($scope.topUserList[i].months_since)
      });
    }
  }

  $scope.topUsersDataUpdate = function() {
    empty($rootScope.topUsers);
    for (var i = 0; i < $scope.topUserList.length; i++) {
      if ($scope.topUserList[i].business_category == $scope.category) {
        $rootScope.topUsers.push({
          UserId: $scope.topUserList[i].user_id,
          UserName: $scope.topUserList[i].name,
          RatingOfUser: Number($scope.topUserList[i].final_score).toFixed(2),
          UserReviewCount: Number($scope.topUserList[i].review_count),
          UsefullReviewCount: Number($scope.topUserList[i].useful),
          FanCount: Number($scope.topUserList[i].fans),
          EliteCount: Number($scope.topUserList[i].elite_count),
          ComplimentCount: Number($scope.topUserList[i].compliment_count),
          MonthCount: Number($scope.topUserList[i].months_since)
        });
      }
    }

    $scope.clearSelection();
    $scope.selectedTwo = true;
  };

  $scope.showStateData = function(stateName) {
    $("#topRestaurant").empty();
    $(".topRestTitle").css("display", "none");
    $("#statespan").text(stateName);
    $("#statespan1").text(stateName);
    $scope.clearSelection();
    $scope.flag = true;
    empty($rootScope.topUsers);
    for (var i = 0; i < $scope.userData.length; i++) {
      if ($scope.userData[i].business_category == $scope.category) {
        if ($scope.userData[i].full_state == stateName) {
          if (isNotPresent($rootScope.topUsers, $scope.userData[i])) {
            $rootScope.topUsers.push({
              UserId: $scope.userData[i].user_id,
              UserName: $scope.userData[i].username,
              RatingOfUser: Number((+$scope.userData[i].final_score).toFixed(2)),
              UserReviewCount: Number($scope.userData[i].user_reviews_count),
              UsefullReviewCount: Number($scope.userData[i].useful),
              FanCount: Number($scope.userData[i].fans),
              EliteCount: Number($scope.userData[i].elite_count),
              ComplimentCount: Number($scope.userData[i].compliment_count),
              MonthCount: Number($scope.userData[i].months_since)
            });
          }
        }
      }
    }

    var div1 = $("#topUsersDonut");
    div1.empty();
    for (var i = 0; i < $rootScope.topUsers.length; i++) {
      var elem1 = $("<button/>", {
        text: $rootScope.topUsers[i].UserName,
        id: $rootScope.topUsers[i].UserId,
        class: "nameBtnDonut",
        click: function() {
          $scope.selectUser(this.id);
        },
        disabled: false
      });
      div1.append(elem1);
    }
    var elem1 = $("<button/>", {
      text: "Clear Selection",
      class: "categoryBtn specBtn",
      id: "clear",
      click: function() {
        $scope.clearSelection();
      }
    });
    div1.append(elem1);

    var div = $("#topUsers1");
    div.empty();
    var topUsers = $("#topUsers").empty();
    for (var i = 0; i < $rootScope.topUsers.length; i++) {
      var elem1 = $("<button/>", {
        text: $rootScope.topUsers[i].UserName,
        value: $rootScope.topUsers[i].UserName,
        id: $rootScope.topUsers[i].UserId,
        class: "nameBtn",
        click: function() {
          $scope.selectUser1(this.id, this.value);
        }
      });

      var html = $("<div class='row nameRow'>")
        .append($("<div class='col-md-8 paddingZero'>").append(elem1))
        .append($("<div class='col-md-4 paddingZero rank '>").append("" + $rootScope.topUsers[i].RatingOfUser + ""));
      div.append(html);
    }
  };

  $scope.list = [];
  var count = 0;
  $scope.selectUser = function(id) {
    console.log(id);

    var idEle = "#" + id;
    if (count == 0) {
      count++;
      $(idEle).addClass("nameBtnDonutSpec1");
    } else {
      $(idEle).addClass("nameBtnDonutSpec2");
    }

    if ($scope.list.length == 2) {
      $scope.message = "No More selection";
    } else {
      $scope.list.push(id);
      if ($scope.list.length == 2) {
        $scope.disable = true;
        $("#topUsersDonut")
          .children()
          .prop("disabled", "true");
        $("#clear").prop("disabled", false);

        console.log($scope.list);
        $(".textCenter").css("display", "none");
        $(".selectedTwo").css("display", "block");
        console.log("displaying");
        $scope.displayDonutCharts();
      }
    }
  };

  $scope.clearSelection = function() {
    count = 0;
    $(".textCenter").css("display", "block");
    $(".selectedTwo").css("display", "none");

    $scope.disable = false;
    $("#topUsersDonut")
      .children()
      .removeClass("nameBtnDonutSpec1");
    $("#topUsersDonut")
      .children()
      .removeClass("nameBtnDonutSpec2");

    $("#topUsersDonut")
      .children()
      .prop("disabled", false);
    empty($scope.list);
  };

  $scope.restaurantDataStateWiseList = [];

  $scope.selectUser1 = function(id, name) {
    $(".topRestTitle").css("display", "block");
    console.log(name);
    $("#usernamespan").text(name);
    empty($scope.restaurantDataStateWiseList);

    if ($scope.stateName == null) {
      $scope.stateName = "None";
    }
    console.log($scope.stateName);
    for (var i = 0; i < $rootScope.userData.length; i++) {
      if ($rootScope.userData[i].user_id == id) {
        if ($rootScope.userData[i].business_category == $scope.category) {
          if ($rootScope.userData[i].full_state == $scope.stateName) {
            $scope.restaurantDataStateWiseList.push({
              RestaurantName: $rootScope.userData[i].name,
              RestaurantRating: $rootScope.userData[i].business_review_stars,
              RestaurantLong: $rootScope.userData[i].longitude,
              RestaurantLat: $rootScope.userData[i].latitude
            });
          }
        }
      }
    }

    var div = $("#topRestaurant");
    div.empty();

    for (var i = 0; i < $scope.restaurantDataStateWiseList.length; i++) {
      var long = $scope.restaurantDataStateWiseList[i].RestaurantLong;
      var lat = $scope.restaurantDataStateWiseList[i].RestaurantLat;

      var elem1 = $("<button/>", {
        text: $scope.restaurantDataStateWiseList[i].RestaurantName,
        class: "nameBtn1",
        click: function() {
          initMap(lat, long);
        }
      });

      var html = $("<div class='row nameRow1'>")
        .append($("<div class='col-md-8 paddingZero'>").append(elem1))
        .append(
          $("<div class='col-md-4 paddingZero rank1 '>").append(
            "" + $scope.restaurantDataStateWiseList[i].RestaurantRating + ""
          )
        );
      div.append(html);
    }
  };

  $scope.displayDonutCharts = function() {
    console.log("displaying1");

    $("#UserReviewCount").empty();
    $("#UsefullReviewCount").empty();
    $("#FanCount").empty();
    $("#EliteCount").empty();
    $("#ComplimentCount").empty();
    $("#MonthCount").empty();

    var UserReviewCount = new DonutCharts("UserReviewCount");
    var UsefullReviewCount = new DonutCharts("UsefullReviewCount");
    var FanCount = new DonutCharts("FanCount");
    var EliteCount = new DonutCharts("EliteCount");
    var ComplimentCount = new DonutCharts("ComplimentCount");
    var MonthCount = new DonutCharts("MonthCount");

    $scope.UserReviewCountData = setData("Total Reviews");
    UserReviewCount.create($scope.UserReviewCountData);

    $scope.UsefullReviewCountData = setData("Usefull Reviews");
    UsefullReviewCount.create($scope.UsefullReviewCountData);

    $scope.FanCountData = setData("Fans");
    FanCount.create($scope.FanCountData);

    $scope.EliteCountData = setData("Elite Count");
    EliteCount.create($scope.EliteCountData);

    $scope.ComplimentCountData = setData("Compliments");
    ComplimentCount.create($scope.ComplimentCountData);

    $scope.MonthCountData = setData("Months on Yelp");
    MonthCount.create($scope.MonthCountData);

    $(".user1").text($scope.MonthCountData[0].data[0].cat);
    $(".user2").text($scope.MonthCountData[0].data[1].cat);
  };

  function setData(variableName) {
    $scope.dataset = [];
    $scope.data = [];
    var val;
    for (var i = 0; i < $scope.list.length; i++) {
      for (var j = 0; j < $rootScope.topUsers.length; j++) {
        if ($scope.list[i] == $rootScope.topUsers[j].UserId) {
          if (variableName == "Total Reviews") {
            val = $rootScope.topUsers[j].UserReviewCount;
          } else if (variableName == "Usefull Reviews") {
            val = $rootScope.topUsers[j].UsefullReviewCount;
          } else if (variableName == "Fans") {
            val = $rootScope.topUsers[j].FanCount;
          } else if (variableName == "Elite Count") {
            val = $rootScope.topUsers[j].EliteCount;
          } else if (variableName == "Compliments") {
            val = $rootScope.topUsers[j].ComplimentCount;
          } else {
            val = $rootScope.topUsers[j].MonthCount;
          }

          $scope.data.push({
            cat: $rootScope.topUsers[j].UserName,
            val: val
          });
        }
      }
    }

    $scope.dataset.push({
      type: variableName,
      data: $scope.data
    });

    return $scope.dataset;
  }

  var jsShowStateData = function(stateName) {
    $scope.stateName = stateName;
    $scope.showStateData(stateName);
  };

  function selectUser(id) {
    $scope.selectUser(id);
  }

  function USMap(data) {
    var config = { color1: "#FDEDEC", color2: "#E74C3C", stateDataColumn: "State", valueDataColumn: "Rating" };

    var WIDTH = 700,
      HEIGHT = 350;

    var COLOR_COUNTS = 9;

    var SCALE = 0.7;

    var Interpolate = function(start, end, steps, count) {
      var s = start,
        e = end,
        final = s + ((e - s) / steps) * count;
      return Math.floor(final);
    };

    var Color = function(_r, _g, _b) {
      var r, g, b;
      var setColors = function(_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
      };

      setColors(_r, _g, _b);
      this.getColors = function() {
        var colors = {
          r: r,
          g: g,
          b: b
        };
        return colors;
      };
    };

    var hexToRgb = function(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    };

    var valueFormat = function(d) {
      if (d > 1000000000) {
        return Math.round((d / 1000000000) * 10) / 10 + "B";
      } else if (d > 1000000) {
        return Math.round((d / 1000000) * 10) / 10 + "M";
      } else if (d > 1000) {
        return Math.round((d / 1000) * 10) / 10 + "K";
      } else {
        return d;
      }
    };

    var COLOR_FIRST = config.color1,
      COLOR_LAST = config.color2;

    var rgb = hexToRgb(COLOR_FIRST);

    var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

    rgb = hexToRgb(COLOR_LAST);
    var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

    var MAP_STATE = config.stateDataColumn;
    var MAP_VALUE = config.valueDataColumn;

    var width = WIDTH,
      height = HEIGHT;

    var valueById = d3.map();

    var startColors = COLOR_START.getColors(),
      endColors = COLOR_END.getColors();

    var colors = [];

    for (var i = 0; i < COLOR_COUNTS; i++) {
      var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
      var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
      var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
      colors.push(new Color(r, g, b));
    }

    var quantize = d3.scale
      .quantize()
      .domain([0, 1.0])
      .range(
        d3.range(COLOR_COUNTS).map(function(i) {
          return i;
        })
      );

    var path = d3.geo.path();

    var svg = d3
      .select("#canvas-svg")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    this.updateData = function(data) {
      data.forEach(function(d) {
        var id = name_id_map[d[MAP_STATE]];
        valueById.set(id, Number((+d[MAP_VALUE]).toFixed(2)));
      });

      quantize.domain([
        d3.min(data, function(d) {
          return +d[MAP_VALUE];
        }),
        d3.max(data, function(d) {
          return +d[MAP_VALUE];
        })
      ]);

      d3.select("svg")
        .select("g")
        .selectAll("path")
        .transition()
        .style("fill", function(d) {
          if (valueById.get(d.id)) {
            var i = quantize(valueById.get(d.id));
            var color = colors[i].getColors();
            return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
          } else {
            return "";
          }
        });
    };

    this.drawMap = function() {
      d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", function(error, names) {
        name_id_map = {};
        id_name_map = {};

        for (var i = 0; i < names.length; i++) {
          name_id_map[names[i].name] = names[i].id;
          id_name_map[names[i].id] = names[i].name;
        }
        data.forEach(function(d) {
          var id = name_id_map[d[MAP_STATE]];
          valueById.set(id, Number((+d[MAP_VALUE]).toFixed(2)));
        });

        quantize.domain([
          d3.min(data, function(d) {
            return +d[MAP_VALUE];
          }),
          d3.max(data, function(d) {
            return +d[MAP_VALUE];
          })
        ]);

        d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
          svg
            .append("g")
            .attr("class", "states-choropleth")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter()
            .append("path")
            .attr("transform", "scale(" + SCALE + ")")
            .style("transition", "0.3s all linear")
            .style("fill", function(d) {
              if (valueById.get(d.id)) {
                var i = quantize(valueById.get(d.id));
                var color = colors[i].getColors();
                return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
              } else {
                return "";
              }
            })
            .attr("d", path)
            .on("mousemove", function(d) {
              var html = "";

              html += '<div class="tooltip_kv">';
              html += '<span class="tooltip_key">';
              html += id_name_map[d.id];
              html += "</span>";
              html += '<span class="tooltip_value">';
              html += valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "No data available";
              html += "";
              html += "</span>";
              html += "</div>";

              $("#tooltip-container").html(html);
              $(this).attr("fill-opacity", "0.8");
              $("#tooltip-container").show();

              var coordinates = d3.mouse(this);

              var map_width = $(".states-choropleth")[0].getBoundingClientRect().width;

              if (d3.event.layerX < map_width / 2) {
                d3.select("#tooltip-container")
                  .style("top", d3.event.layerY + 15 + "px")
                  .style("left", d3.event.layerX + 15 + "px");
              } else {
                var tooltip_width = $("#tooltip-container").width();
                d3.select("#tooltip-container")
                  .style("top", d3.event.layerY + 15 + "px")
                  .style("left", d3.event.layerX - tooltip_width - 30 + "px");
              }
            })
            .on("mouseout", function() {
              $(this).attr("fill-opacity", "1.0");
              $("#tooltip-container").hide();
            })
            .on("click", function(d) {
              console.log(d);
              console.log(id_name_map[d.id]);
              stateName = id_name_map[d.id];
              jsShowStateData(id_name_map[d.id]);
            });

          svg
            .append("path")
            .datum(
              topojson.mesh(us, us.objects.states, function(a, b) {
                return a !== b;
              })
            )
            .attr("class", "states")
            .attr("transform", "scale(" + SCALE + ")")
            .attr("d", path);
        });
      });
    };
  }

  function empty(list) {
    list.length = 0;
  }

  function DonutCharts(id) {
    var idName = "#" + id;
    var charts = d3.select(String(idName));
    //console.log(charts);
    var chart_m,
      chart_r,
      color = d3.scale.linear().range([d3.rgb("#28B463"), d3.rgb("#D68910")]);
    //console.log(charts);
    var getCatNames = function(dataset) {
      var catNames = new Array();

      for (var i = 0; i < dataset[0].data.length; i++) {
        catNames.push(dataset[0].data[i].cat);
      }
      return catNames;
    };

    var createCenter = function(pie) {
      var eventObj = {
        mouseover: function(d, i) {
          d3.select(this)
            .transition()
            .attr("r", chart_r * 0.65);
        },

        mouseout: function(d, i) {
          d3.select(this)
            .transition()
            .duration(500)
            .ease("bounce")
            .attr("r", chart_r * 0.6);
        }
      };

      var donuts = charts.selectAll(".donut");

      donuts
        .append("svg:circle")
        .attr("r", chart_r * 0.6)
        .style("fill", "#E7E7E7")
        .on(eventObj);

      donuts
        .append("text")
        .attr("class", "center-txt type")
        .attr("y", chart_r * -1.05)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(function(d, i) {
          return d.type;
        });
      donuts
        .append("text")
        .attr("class", "center-txt value")
        .attr("y", chart_r * -0.05)
        .attr("text-anchor", "middle");
      donuts
        .append("text")
        .attr("class", "center-txt percentage")
        .attr("y", chart_r * 0.15)
        .attr("text-anchor", "middle");
    };

    var setCenterText = function(thisDonut) {
      var sum = d3.sum(thisDonut.selectAll(".clicked").data(), function(d) {
        return d.data.val;
      });
    };

    var pathAnim = function(path, dir) {
      switch (dir) {
        case 0:
          path
            .transition()
            .duration(500)
            .ease("bounce")
            .attr(
              "d",
              d3.svg
                .arc()
                .innerRadius(chart_r * 0.7)
                .outerRadius(chart_r)
            );
          break;

        case 1:
          path.transition().attr(
            "d",
            d3.svg
              .arc()
              .innerRadius(chart_r * 0.7)
              .outerRadius(chart_r * 1.08)
          );
          break;
      }
    };

    var updateDonut = function() {
      var eventObj = {
        mouseover: function(d, i, j) {
          pathAnim(d3.select(this), 1);

          var thisDonut = charts.select(".type" + j);
          thisDonut.select(".percentage").text(function(donut_d) {
            return d.data.val.toFixed(1);
          });
          thisDonut.select(".value").text(function(donut_d) {
            return d.data.cat;
          });
        },

        mouseout: function(d, i, j) {
          var thisPath = d3.select(this);
          if (!thisPath.classed("clicked")) {
            pathAnim(thisPath, 0);
          }
          var thisDonut = charts.select(".type" + j);
          setCenterText(thisDonut);
          thisDonut.select(".percentage").text(function(donut_d) {
            return "";
          });
          thisDonut.select(".value").text(function(donut_d) {
            return "";
          });
        }
      };

      var pie = d3.layout
        .pie()
        .sort(null)
        .value(function(d) {
          return d.val;
        });

      var arc = d3.svg
        .arc()
        .innerRadius(chart_r * 0.7)
        .outerRadius(chart_r);

      var paths = charts
        .selectAll(".donut")
        .selectAll("path")
        .data(function(d, i) {
          return pie(d.data);
        });

      paths
        .enter()
        .append("svg:path")
        .attr("d", arc)
        .style("fill", function(d, i) {
          return color(i);
        })
        .style("stroke", "#FFFFFF")
        .on(eventObj);

      paths.transition().attr("d", arc);

      paths
        .exit()
        .transition()
        .remove();

      console.log("displaying5");
    };

    this.create = function(dataset) {
      chart_m = (150 / dataset.length / 2) * 0.14;
      chart_r = (150 / dataset.length / 2) * 0.85;

      var donut = charts
        .selectAll(".donut")
        .data(dataset)
        .enter()
        .append("svg:svg")
        .attr("width", (chart_r + chart_m) * 2)
        .attr("height", (chart_r + chart_m) * 2 + 20)
        .append("svg:g")
        .attr("class", function(d, i) {
          return "donut type" + i;
        })
        .attr("transform", "translate(" + (chart_r + chart_m) + "," + (chart_r + chart_m + 10) + ")");

      createCenter();
      updateDonut();
    };

    this.update = function(dataset) {
      var donut = charts.selectAll(".donut").data(dataset);

      var i = donut.select(".percentage");
      console.log(i);
      updateDonut();
    };
  }

  function isNotPresent(one, two) {
    for (var i = 0; i < one.length; i++) {
      if (one[i].UserId == two.user_id) {
        return false;
      }
    }
    return true;
  }

  function initMap(lat, long) {
    $("#map").css("display", "block");
    console.log(lat);
    console.log(long);
    var mark = { lat: Number(lat), lng: Number(long) };
    console.log(mark);
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: mark
    });
    var marker = new google.maps.Marker({
      position: mark,
      map: map
    });
  }
});
