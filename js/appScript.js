// 10 AUG 2021
// Harshavardhan Sreedhar
//
//
//
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
//
// Maincontroller
ragaApp.controller('mainController', function($scope, $http) {

    function removeAccents(value) {
        return value.replace(/ā/g, 'a').replace(/ē/g, 'a');
    }

    $scope.ignoreAccents = function(item) {
        if ($scope.search) {
            var search = removeAccents($scope.search).toLowerCase();
            var find = removeAccents(item.name + ' ' + item.Avarohanam + ' ' + item.Arohanam + ' ').toLowerCase();
            return find.indexOf(search) > -1;
        }
        return true;
    };

    //Display list of all the ragas
    $http({
        method: 'POST',
        url: 'mainRagaDatabase.json'
    }).success(function(data, status) {
        $scope.ragaName = data.ragas;
        ragaDatabase = data.ragas;
    });

    //Expand the help section
    $scope.expand = function() {
        $("#helpText").toggle();
    }

});

//ragaController
ragaApp.controller('ragaController', function($scope, $window, $routeParams, $http) {
    //Get name of Raga
    $scope.name = $routeParams.name;
    var buffer = $routeParams.name;

    //Get Raga Details
    var raga = ragaDatabase.filter(function(raga) { return raga.name == buffer });
    console.log(raga);
    $scope.Arohanam = raga[0].Arohanam;
    $scope.Avarohanam = raga[0].Avarohanam;
});

//
//
//
//
//JQuery 
//$(document).ready(function() {
//close controls
var clear;
$('#close').click(function() {
    $(this).parent().hide();
});

//Some utility arrays
var keyList = ['s', 'r1', 'r2', 'g2', 'g3', 'm1', 'm2', 'p', 'd1', 'd2', 'n2', 'n3', 'saHigh'];
var keyListPseudo = ['s', 'r1', 'r2', 'g2', 'g3', 'm1', 'm2', 'p', 'd1', 'd2', 'n2', 'n3', 'saHigh'];

//Declare all the sounds
keyList[0] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/s.ogg', 'sounds/s.mp3'] } });
keyList[1] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/r1.ogg', 'sounds/r1.mp3'] } });
keyList[2] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/r2.ogg', 'sounds/r2.mp3'] } });
keyList[3] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/g2.ogg', 'sounds/g2.mp3'] } });
keyList[4] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/g3.ogg', 'sounds/g3.mp3'] } });
keyList[5] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/m1.ogg', 'sounds/m1.mp3'] } });
keyList[6] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/m2.ogg', 'sounds/m2.mp3'] } });
keyList[7] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/p.ogg', 'sounds/p.mp3'] } });
keyList[8] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/d1.ogg', 'sounds/d1.mp3'] } });
keyList[9] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/d2.ogg', 'sounds/d2.mp3'] } });
keyList[10] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/n2.ogg', 'sounds/n2.mp3'] } });
keyList[11] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/n3.ogg', 'sounds/n3.mp3'] } });
keyList[12] = new Pizzicato.Sound({ source: 'file', options: { path: ['sounds/saHigh.ogg', 'sounds/saHigh.mp3'] } });
var shruti = new Pizzicato.Sound({ source: 'file', options: { loop: true, path: ['sounds/shruti.ogg'] } });

//Set attack to 0.001 for all the notes so it sounds sharp
for (i = 0; i < keyList.length; i++) {
    keyList[i].attack = 0.001;
}

//Create a group of all the notes
swarasGroup = new Pizzicato.Group(keyList)
swarasGroup.addSound(shruti)
swarasGroup.volume = 0.5;

//Add Effects to the group
var dubDelay = new Pizzicato.Effects.DubDelay({
    feedback: 0.7,
    time: 0.6,
    mix: 0.5,
    cutoff: 1800
});

var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 10,
    peak: 5
});

swarasGroup.addEffect(lowPassFilter);
swarasGroup.addEffect(dubDelay)

//CONTROL PANEL for Volume and effetcs
//window.inputKnobsOptions = { fgcolor: "#00ff00", bgcolor: "#000080", knobDiameter: "48" }

function volume(param) {
    swarasGroup.volume = parseFloat(param)
}

function dubDelayFeedback(param) {
    dubDelay.feedback = parseFloat(param)
}

function dubDelayTime(param) {
    dubDelay.time = parseFloat(param)
}

function dubDelayCutoff(param) {
    dubDelay.cutoff = parseInt(param)
}

function filterCutoff(param) {
    lowPassFilter.frequency = parseInt(param)
}

// Tanpura toggle control
$('#shrutiON').on('click', function() {
    if ($("#shrutiON").is(':checked')) {
        shruti.play();
    } else {
        shruti.stop();
    }
});
// Notes help toggle control
$('#notesON').on('click', function() {
    $('.noteHelp').toggle();
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

//on Click Key register
// var pianomessage = '';
// var keyName;
// var a = $('input').val();
// $('#newPiano p').click(function() {
//     keyName = $(this).attr('id').split('K');
//     if (keyName[0] == "saHigh") {
//         keyName[0] = "s";
//     }
//     a = $('input').val() + " " + keyName[0];
//     $('input').val(a);
//     pianomessage = 'Our system detected that you entered keys through the on-screen keyboard. Do you want to try modifying the faux-Swaras?'
// });

///setimeout function

function doSetTimeout(i, time, sequence) {
    var d;
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

// Function to play a sequence.
// Input: Sequence - [Sequence of notes]
// Time: In Milliseconds
function play(sequence, time) {
    for (var i = 0; i <= sequence.length - 1; i++) {
        doSetTimeout(i, time, sequence);
    }
}

//Arohanam Play
$(document).on('click', '#arohanamPlay', function() {
    var arohanam = $('#arohanam').text().split(" ");
    arohanam[arohanam.length - 1] = "saHigh";
    play(arohanam, 700);
});

//Avarohanam play starts here
$(document).on('click', '#avarohanamPlay', function() {
    var avarohanam = $('#avarohanam').text().split(" ");
    avarohanam[0] = "saHigh";
    play(avarohanam, 700);
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
            randomSequence.push(moorchana.length - 1);
        } else {
            randomSequence.push(random + 1);
        }

        if (random + 2 > moorchana.length - 1) {
            randomSequence.push(moorchana.length - 2);
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

//Play a custom sequence
$(document).on('click', '#customSequencePlay', function() {
    var sampleSequence = ["G1", "R1", "S", "P", "M1", "G1", "saHigh"]
    play(sampleSequence, 200)
});




//});