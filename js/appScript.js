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

// Variables
var interval;
var count = 0;
var temp;
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

//
//
//
//
//Add Effects to the group
var dubDelay = new Pizzicato.Effects.DubDelay({
    feedback: 0.70,
    time: 0.6,
    cutoff: 3200,
    mix: 0.5
});

var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 16000,
    peak: 1
});

swarasGroup.addEffect(lowPassFilter);
swarasGroup.addEffect(dubDelay)

//CONTROL PANEL for Volume and effetcs
//window.inputKnobsOptions = { fgcolor: "#00ff00", bgcolor: "#000080", knobDiameter: "48" }
// When a knob is moved, these functions assign values to the effects
function volume(obj, param) {
    swarasGroup.volume = parseFloat(param)
    obj.next().text(param)
}

function filterCutoff(obj, param) {
    lowPassFilter.frequency = parseInt(param);
    var freq
    if (parseInt(param) > 1000) {
        freq = String(parseInt(param) / 1000) + " kHz";
    } else {
        freq = param + " Hz";
    }
    obj.next().text(freq)
}

function dubDelayFeedback(obj, param) {
    dubDelay.feedback = parseFloat(param);

    //Setting warning colors to the value in case of crazy high feedback
    if (parseFloat(param) <= 0.7) {
        obj.next().css('color', '#a0a0a0');
    } else if (parseFloat(param) >= 0.7 && parseFloat(param) < 0.8) {
        obj.next().css('color', '#e2bc00');
    } else if (parseFloat(param) >= 0.8 && parseFloat(param) <= 0.9) {
        obj.next().css('color', '#ff0000');
        obj.next().css('text-shadow', 'none');
    } else if (parseFloat(param) >= 0.9) {
        obj.next().css('text-shadow', '0px 0px 9px #ff0000');
    }

    obj.next().text(param)
}

function dubDelayTime(obj, param) {
    dubDelay.time = parseFloat(param)
    obj.next().text(param)
}

function dubDelayCutoff(obj, param) {
    dubDelay.cutoff = parseInt(param)
    var freq
    if (parseInt(param) > 1000) {
        freq = String(parseInt(param) / 1000) + " kHz";
    } else {
        freq = param + " Hz";
    }
    obj.next().text(freq)
}

function dubDelayMix(obj, param) {
    dubDelay.mix = parseFloat(param)
    obj.next().text(parseFloat(param))
}

// Presets - takes all the values as parameters and assigns these value to the Knob and the display text

function preset(volumeParam, filterCutoffParam, dubDelayFeedbackParam, dubDelayTimeParam, dubDelayCutoffParam, dubDelayMixParam) {
    // Set the volume
    volume($('#volumeKnob'), volumeParam)
    $('#volumeKnob').attr('value', volumeParam)
    let elem = document.getElementById("volumeKnob"); // get existing input-knob element
    elem.refresh();

    filterCutoff($('#filterCutoffKnob'), filterCutoffParam)
    $('#filterCutoffKnob').attr('value', filterCutoffParam)
        //$('#filterCutoffKnob').refresh()

    dubDelayFeedback($('#dubDelayFeedbackKnob'), dubDelayFeedbackParam)
    $('#dubDelayFeedback').attr('value', dubDelayFeedbackParam)

    dubDelayTime($('#dubDelayTimeKnob'), dubDelayTimeParam)
    $('#dubDelayTime').attr('value', dubDelayTimeParam)

    dubDelayCutoff($('#dubDelayCutoffKnob'), dubDelayCutoffParam)
    $('#dubDelayCutoff').attr('value', dubDelayCutoffParam)

    dubDelayMix($('#dubDelayMixKnob'), dubDelayMixParam)
    $('#dubDelayMix').attr('value', dubDelayMixParam)



    // swarasGroup.volume = parseFloat(param)
    // $('#volumeKnob').attr('value', volume).next().text(volume);

    // $('#filterCutoffKnob').attr('value', filter)
    // if (parseInt(filter) > 1000) {
    //     $('#filterCutoffKnob').next().text(String(parseInt(filter) / 1000) + " kHz");
    // } else {
    //     $('#filterCutoffKnob').next().text(String(filter + " Hz"));
    // }

    // $('#dubDelayFeedback').attr('value', feedback).next().text(feedback);

    // //Setting warning colors to the value in case of crazy high feedback
    // if (parseFloat(feedback) <= 0.7) {
    //     $('#dubDelayFeedback').next().css('color', '#a0a0a0');
    // } else if (parseFloat(feedback) >= 0.7 && parseFloat(feedback) < 0.8) {
    //     $('#dubDelayFeedback').next().css('color', '#e2bc00');
    // }

    // $('#dubDelayTime').attr('value', time).next().text(time);

    // $('#dubDelayCutoff').attr('value', cutoff).next().text(cutoff);

    // if (parseInt(filter) > 1000) {
    //     $('#dubDelayCutoff').next().text(String(parseInt(cutoff) / 1000) + " kHz");
    // } else {
    //     $('#dubDelayCutoff').next().text(String(cutoff + " Hz"));
    // }

    // $('#dubDelayMix').attr('value', mix).next().text(mix);
}

$('#presets ul li a').on('click', function() {
    $(this).css('background-color', '#ffe600');
    $(this).parent('li').siblings().children('a').css('background-color', '#ffffff');

});

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

//
// On Screen Keyboard
var keyBindings = {
    'a': '#sKey',
    'w': '#r1Key',
    's': '#r2Key',
    'e': '#g2Key',
    'd': '#g3Key',
    'f': '#m1Key',
    't': '#m2Key',
    'g': '#pKey',
    'y': '#d1Key',
    'h': '#d2Key',
    'u': '#n2Key',
    'j': '#n3Key',
    'k': '#saHighKey'
}

for (const [key, value] of Object.entries(keyBindings)) {
    keyboardJS.bind(key, (e) => {
        e.preventRepeat();
        if ($(value).hasClass('whiteKey')) {
            $(value).addClass('whiteKeyPressed').removeClass('whiteKey');
        } else if ($(value).hasClass('blackKey')) {
            $(value).addClass('blackKeyPressed').removeClass('blackKey');
        }
        var keyName = String(value).substring(1).split('K');
        for (i = 0; i < keyListPseudo.length; i++) {
            if (keyName[0] == keyListPseudo[i]) {
                keyList[i].stop();
                keyList[i].play();
            }
        }
    }, (e) => {
        if ($(value).hasClass('whiteKeyPressed')) {
            $(value).removeClass('whiteKeyPressed').addClass('whiteKey');
        } else if ($(value).hasClass('blackKeyPressed')) {
            $(value).removeClass('blackKeyPressed').addClass('blackKey');
        }
    });
}

// On Click Key register on the search bar
var pianomessage = '';
var keyName;
var a = $('#search').val();
$('#newPiano p').click(function() {
    keyName = $(this).attr('id').split('K');
    if (keyName[0] == "saHigh") {
        keyName[0] = "s";
    }
    a = $('#search').val() + " " + keyName[0];
    $('#search').val(a);
    pianomessage = 'Our system detected that you entered keys through the on-screen keyboard. Do you want to try modifying the faux-Swaras?'
});

//
//
//
// Play function
// Timeline - does the actual playing
function timeline(sequence, repeat) {
    if ($(keyId).hasClass('whiteKeyPressed')) {

        $(keyId).addClass('whiteKey').removeClass('whiteKeyPressed');
    }

    if ($(keyId).hasClass('blackKeyPressed')) {
        $(keyId).addClass('blackKey').removeClass('blackKeyPressed');

    }

    for (z = 0; z < keyListPseudo.length; z++) {
        if (sequence[count].toLowerCase() == keyListPseudo[z]) {
            d = z;
        } else {
            switch (sequence[count]) {
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

    count++
    if (count >= sequence.length) {
        clearInterval(interval);
        temp = ''
    }
}

//Play function does the time setting
function play(sequence, time) {
    stop();
    temp = sequence;
    interval = setInterval('timeline(temp)', time);
}
// Stop function stops any currently scheduled sequences
function stop() {
    clearInterval(interval);
    count = 0;
    temp = ''
}

//Arohanam Play
$(document).on('click', '#arohanamPlay', function() {
    var arohanam = $('#arohanam').text().split(" ");
    arohanam[arohanam.length - 1] = "saHigh";
    play(arohanam, 700);
});

//Avarohanam play
$(document).on('click', '#avarohanamPlay', function() {
    var avarohanam = $('#avarohanam').text().split(" ");
    avarohanam[0] = "saHigh";
    play(avarohanam, 700);
});

//Randomize play
// Generates a sequence of 300 notes and pushes them and their next two notes to an array totalling 900 notes.
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