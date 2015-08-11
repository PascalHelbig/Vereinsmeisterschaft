angular.module('championship', [])
    .controller('MainCtrl', function ($http, $scope, $filter) {
        $scope.clubs = [];
        $http.get('regatten.json').then(function (regatten) {
            var clubs = {};
            $scope.regatten = regatten.data;
            angular.forEach(regatten.data, function (regatta, regattaNr) {
                angular.forEach(regatta.results, function (result, club) {
                    if (result.length >= 3) {
                        var points = (result[0] + result[1] + result[2]) / regatta.competitors;
                        points = points * 10;
                        // club first time appear?
                        if (angular.isUndefined(clubs[club])) {
                            clubs[club] = {};
                        }
                        clubs[club][regattaNr] = {rankings: result, points: points};
                    }
                });
            });

            // Für jeden Verein die besten 5 Ergebnisse werten:
            angular.forEach(clubs, function (regatten, club) {
                // Alle Regatten in ein Array packen:
                var regattenArray = [];
                angular.forEach(regatten, function (regatta, number) {
                    regatta.regatta = parseInt(number);
                    regattenArray.push(regatta);
                });

                // Regatten der Vereine nach Punkte sortieren:
                regattenArray = $filter('orderBy')(regattenArray, 'points');

                var sum = 0;
                angular.forEach(regattenArray, function (regatta, i) {
                    // Werte nur die besten fünf:
                    clubs[club][regatta.regatta].count = (i < 5);
                    if (i < 5) {
                        sum += clubs[club][regatta.regatta].points;
                    }
                });
                clubs[club].points = sum;
                clubs[club].length = regattenArray.length;
            });

            console.log(clubs);

            // Clubs sortieren:
            // Vereine mit 5 Wertungen:
            var platz = 1;
            var fuenfWertungen = [];
            angular.forEach(clubs, function (club, name) {
                if (club.length >= 5) {
                    fuenfWertungen.push({name: name, points: club.points});
                }
            });
            fuenfWertungen = $filter('orderBy')(fuenfWertungen, 'points');
            angular.forEach(fuenfWertungen, function (club) {
                clubs[club.name].sort = platz++;
            });

            // Vereine mit 1 bis 4 Wertungen sortieren:
            for (var i = 4; i > 0; i--) {
                var aktuelleWertung = [];
                angular.forEach(clubs, function (club, name) {
                    if (club.length == i) {
                        aktuelleWertung.push({name: name, points: club.points});
                    }
                });
                aktuelleWertung = $filter('orderBy')(aktuelleWertung, 'points');
                angular.forEach(aktuelleWertung, function (club) {
                    clubs[club.name].sort = platz++;
                });
            }
            console.log(clubs);
            angular.forEach(clubs, function(club, name) {
                club.name = name;
                $scope.clubs.push(club);
            });
        });
    });