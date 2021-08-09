//$(document).ready(function(){
//close controls
$('#close').click(function() {
    $(this).parent().hide();
});

var keyList = ['s', 'r1', 'r2', 'g2', 'g3', 'm1', 'm2', 'p', 'd1', 'd2', 'n2', 'n3', 'saHigh'];
var keyListPseudo = ['s', 'r1', 'r2', 'g2', 'g3', 'm1', 'm2', 'p', 'd1', 'd2', 'n2', 'n3', 'saHigh'];


keyList[0] = new buzz.sound(["sounds/s.ogg", "sounds/s.mp3"]);
keyList[1] = new buzz.sound(["sounds/r1.ogg", "sounds/r1.mp3"]);
keyList[2] = new buzz.sound(["sounds/r2.ogg", "sounds/r2.mp3"]);
keyList[3] = new buzz.sound(["sounds/g2.ogg", "sounds/g2.mp3"]);
keyList[4] = new buzz.sound(["sounds/g3.ogg", "sounds/g3.mp3"]);
keyList[5] = new buzz.sound(["sounds/m1.ogg", "sounds/m1.mp3"]);
keyList[6] = new buzz.sound(["sounds/m2.ogg", "sounds/m2.mp3"]);
keyList[7] = new buzz.sound(["sounds/p.ogg", "sounds/p.mp3"]);
keyList[8] = new buzz.sound(["sounds/d1.ogg", "sounds/d1.mp3"]);
keyList[9] = new buzz.sound(["sounds/d2.ogg", "sounds/d2.mp3"]);
keyList[10] = new buzz.sound(["sounds/n2.ogg", "sounds/n2.mp3"]);
keyList[11] = new buzz.sound(["sounds/n3.ogg", "sounds/n3.mp3"]);
keyList[12] = new buzz.sound(["sounds/saHigh.ogg", "sounds/saHigh.mp3"]);

var shruti = new buzz.sound(["sounds/shruti.ogg"], { loop: true });

$('#shrutiON').on('click', function() {
    shruti.play();
    if (shruti.getPercent() > 1) {
        shruti.stop();
        $(this).css('background', 'none');
    }
});

$('#notesON').on('click', function() {
    $('.noteHelp').toggle();
});

$(document).ready(function() {
    //Help control for search
    $('#help').on('click', function() {
        alert();
        $('#helpText').toggle();
    });
});

$('#newPiano p').mousedown(function() {
    var keyName = $(this).attr('id').split('K');
    var key;

    for (i = 0; i < keyListPseudo.length; i++) {
        if (keyName[0] == keyListPseudo[i]) {
            key = i;

        }
    }
    keyList[key].stop();
    keyList[key].play();
    if ($(this).hasClass('whiteKey')) {
        $(this).addClass('whiteKeyPressed').removeClass('whiteKey');
    }

    if ($(this).hasClass('blackKey')) {
        $(this).addClass('blackKeyPressed').removeClass('blackKey');

    }

});

$('#newPiano p').mouseup(function() {
    if ($(this).hasClass('whiteKeyPressed')) {
        $(this).delay(100).queue(function() {
            $(this).removeClass('whiteKeyPressed').addClass('whiteKey');
            $(this).dequeue();
        });
    }

    if ($(this).hasClass('blackKeyPressed')) {
        $(this).delay(100).queue(function() {
            $(this).removeClass('blackKeyPressed').addClass('blackKey');
            $(this).dequeue();
        });
    }

});

//});
//on Click Key register
var pianomessage = '';
var keyName;
var a = $('input').val();
$('#newPiano p').click(function() {
    keyName = $(this).attr('id').split('K');
    if (keyName[0] == "saHigh") {
        keyName[0] = "s";
    }
    a = $('input').val() + " " + keyName[0];
    $('input').val(a);
    pianomessage = 'Our system detected that you entered keys through the on-screen keyboard. Do you want to try modifying the faux-Swaras?'
});


//Angular code
var ragaApp = angular.module('ragaApp', ['ngRoute', 'angular.filter']);
var ragaDatabase = undefined;


// configure our routes
ragaApp.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl: 'ragaHome.html',
            controller: 'mainController'
        })
        .when('/swara', {
            templateUrl: 'swara.html',
            controller: 'mainController'
        })
        .when('/raga', {
            templateUrl: 'ragas.html',
            controller: 'mainController'
        })
        .when('/exercise', {
            templateUrl: 'exercises.html',
            controller: 'mainController'
        })
        .when('/composition', {
            templateUrl: 'composition.html',
            controller: 'mainController'
        })
        .when('/outroduction', {
            templateUrl: 'outroduction.html',
            controller: 'mainController'
        })
        .when('/glossary', {
            templateUrl: 'glossary.html',
            controller: 'mainController'
        })

    // route for the Ragas page
    .when('/ragaDetail/:name', {
        templateUrl: 'ragaDetail.html',
        controller: 'ragaController'
    })

});

ragaApp.controller('mainController', function($scope, $http) {

    function removeAccents(value) {
        return value
            .replace(/ā/g, 'a')
            .replace(/ē/g, 'a');
    }

    $scope.ignoreAccents = function(item) {
        if ($scope.search) {
            var search = removeAccents($scope.search).toLowerCase();
            var find = removeAccents(item.name + ' ' + item.Avarohanam + ' ' + item.Arohanam + ' ').toLowerCase();
            return find.indexOf(search) > -1;
        }
        return true;
    };

    $http({
        method: 'POST',
        url: 'mainRagaDatabase.json'
    }).success(function(data, status) {
        console.log(data);
        $scope.ragaName = data.ragas;
        ragaDatabase = data.ragas;
    });


});

ragaApp.controller('ragaController', function($scope, $routeParams, $http) {
    //get name
    $scope.name = $routeParams.name;
    var buffer = $routeParams.name;
    console.log('buffer is' + buffer);
    //var buffer = ragaDatabase[buffer];
    console.log(ragaDatabase);

    //get Stuff
    var raga = ragaDatabase.filter(function(raga) { return raga.name == buffer });
    console.log(raga);
    $scope.Arohanam = raga[0].Arohanam;
    $scope.Avarohanam = raga[0].Avarohanam;

});

//Arohanam Play
$(document).on('click', '#arohanamPlay', function() {
    var arohanam = $('#arohanam').text().split(" ");
    arohanam[arohanam.length - 1] = "saHigh";
    //avarohanam[0] = "saHigh";
    moorchana = arohanam + avarohanam;
    console.log(arohanam);
    var d;
    for (var i = 0; i <= arohanam.length - 1; i++) {
        setTimeout(function(j) {
            if ($(keyId).hasClass('whiteKeyPressed')) {
                $(keyId).addClass('whiteKey').removeClass('whiteKeyPressed');
            }

            if ($(keyId).hasClass('blackKeyPressed')) {
                $(keyId).addClass('blackKey').removeClass('blackKeyPressed');
            }

            for (z = 0; z < keyListPseudo.length; z++) {
                if (arohanam[j].toLowerCase() == keyListPseudo[z]) {
                    d = z;
                } else {
                    switch (arohanam[j]) {
                        case "G1":
                            d = 2;
                            break;
                        case "R3":
                            d = 3;
                            break;
                        case "N1":
                            d = 9;
                            break;
                        case "D3":
                            d = 10;
                            break;
                        case "saHigh":
                            d = 12;
                            break;
                    }
                }
            }
            keyList[d].stop();
            //keyList[d].play();
            var keyId = "#" + keyListPseudo[d] + "Key";
            console.log(keyId);
            $(keyId).trigger("mousedown");
            $(keyId).trigger("mouseup");

        }, 1000 * i, i);
    }
});
//Arohanam play ends here
//Avarohanam play starts here
$(document).on('click', '#avarohanamPlay', function() {
    var avarohanam = $('#avarohanam').text().split(" ");
    avarohanam[0] = "saHigh";
    var d;
    for (var i = 0; i <= avarohanam.length - 1; i++) {
        setTimeout(function(j) {
            if ($(keyId).hasClass('whiteKeyPressed')) {

                $(keyId).addClass('whiteKey').removeClass('whiteKeyPressed');
            }

            if ($(keyId).hasClass('blackKeyPressed')) {
                $(keyId).addClass('blackKey').removeClass('blackKeyPressed');

            }

            for (z = 0; z < keyListPseudo.length; z++) {
                if (avarohanam[j].toLowerCase() == keyListPseudo[z]) {
                    d = z;
                } else {
                    switch (avarohanam[j]) {
                        case "G1":
                            d = 2;
                            break;
                        case "R3":
                            d = 3;
                            break;
                        case "N1":
                            d = 9;
                            break;
                        case "D3":
                            d = 10;
                            break;
                        case "saHigh":
                            d = 12;
                            break;
                    }
                }
            }
            keyList[d].stop();
            //keyList[d].play();
            var keyId = "#" + keyListPseudo[d] + "Key";
            //console.log(keyId);
            $(keyId).trigger("mousedown");
            $(keyId).trigger("mouseup");

        }, 1000 * i, i);
    }
});

//Randomize play starts here
$(document).on('click', '#randomizePlay', function() {
    var arohanam = $('#arohanam').text().split(" ");
    arohanam[arohanam.length - 1] = "saHigh";

    var avarohanam = $('#avarohanam').text().split(" ");
    avarohanam[0] = "saHigh";
    var shift = avarohanam.shift();

    var moorchana = arohanam.concat(avarohanam);
    console.log("Moorchana is: ")
    console.log(moorchana)

    var randomSequence = [];

    // Generate 90 Random numbers in sequence of 3
    for (a = 0; a < 300; a++) {
        var random = Math.floor(Math.random() * (moorchana.length - 1));
        randomSequence.push(random);

        if (random + 1 > moorchana.length - 1) {
            randomSequence.push(moorchana.length - 2);
        } else {
            randomSequence.push(random + 1);
        }

        if (random + 2 > moorchana.length - 1) {
            randomSequence.push(moorchana.length - 3);
        } else {
            randomSequence.push(random + 2);
        }
    }
    console.log("Random sequence is: ")
    console.log(randomSequence)

    //Mapping the random numbers with the moorchana to another array
    var randomSequenceNotes = [];
    for (b = 0; b <= randomSequence.length - 1; b++) {
        randomSequenceNotes.push(moorchana[randomSequence[b]])
    }
    console.log("Random sequence to be played is: ")
    console.log(randomSequenceNotes)

    //Call the play() function to play the sequence
    play(randomSequenceNotes, 400)

});

// Function to play a sequence.
// Input: Sequence - [Sequence of notes]
// Time: In Milliseconds
function play(sequence, time) {
    var d;
    for (var i = 0; i <= sequence.length - 1; i++) {
        setTimeout(function(j) {
            if ($(keyId).hasClass('whiteKeyPressed')) {

                $(keyId).addClass('whiteKey').removeClass('whiteKeyPressed');
            }

            if ($(keyId).hasClass('blackKeyPressed')) {
                $(keyId).addClass('blackKey').removeClass('blackKeyPressed');

            }

            for (z = 0; z < keyListPseudo.length; z++) {
                if (sequence[j].toLowerCase() == keyListPseudo[z]) {
                    d = z;
                } else {
                    switch (sequence[j]) {
                        case "G1":
                            d = 2;
                            break;
                        case "R3":
                            d = 3;
                            break;
                        case "N1":
                            d = 9;
                            break;
                        case "D3":
                            d = 10;
                            break;
                        case "saHigh":
                            d = 12;
                            break;
                    }
                }
            }
            keyList[d].stop();
            //keyList[d].play();
            var keyId = "#" + keyListPseudo[d] + "Key";
            //console.log(keyId);
            $(keyId).trigger("mousedown");
            $(keyId).trigger("mouseup");

        }, time * i, i);
    }
}

$(document).on('click', '#customSequencePlay', function() {
    var sampleSequence = ["G1", "R1", "S", "P", "M1", "G1", "saHigh"]
    play(sampleSequence, 200)
});