// 10 AUG 2021
// Harshavardhan Sreedhar
//
//
//
//Angular code
var ragaApp = angular.module('ragaApp', ['ngRoute', 'angular.filter']);

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
        .when('/ragaDetail/:name', {
            templateUrl: 'ragaDetail.html',
            controller: 'ragaController'
        })
});
//
// Maincontroller
ragaApp.controller('mainController', function($scope, $http) {
    let ragaDatabase = undefined;

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
        console.log("here")

        //Ragas of the Day
        {
            let randomRagas = [];
            for (let i = 0; i < 5; i++) {
                let random = Math.floor(Math.random() * (ragaDatabase.length - 1));
                randomRagas.push(ragaDatabase[random].name)
            }

            $scope.RagaOfTheDay = randomRagas;
            console.log(randomRagas);
        }
    });

    console.log(ragaDatabase)
        // Random Beginner tips
        {
            let tips = {
                0: "Use the 🎹 button to enter inputs using the onscreen keyboard",
                1: "Use the FOGGY preset in the presets section to turn your sequence into a wisp of Raga smoke",
                2: "Use the MISTY preset to make your sequences sound like you're on a mountain top",
                3: "Use the FLTR CUTOFF knob to adjust the brightness of the sound",
                4: "Use the FEEDBACK knob to adjust the delay feedback on your sequence",
                5: "Use the DRY/WET knob to adjust how much delay you would like on your sequence",
                6: "Use the CUTOFF knob to adjust the Cutoff frequency of the delay",
                7: "Use the DRY/WET knob to adjust the amount of delay on your sequence",
                8: "Use the PHRASING NOTEBOOK to enter any notes about a Raga",
                9: "Use the PHRASING NOTEBOOK to compose and play notes in a Raga",
                10: "Use the 🔧 icon in the Phrasing notebook to resolve the Swaras/Notes to the right format eg. 1 to ₁",
                11: "Use the RANDOM button to generate a short, random sequence in a given Raga",
                12: "Use the RANDOM button to generate a short, random sequence in a given Raga",
                13: "Use the RANDOM button to generate a short, random sequence in a given Raga",
                14: "Use the SAVE button to save your notes locally",
                15: "Use Keyboard Shortcuts A, S, D, F, etc to play the on-screen keyboard",
                16: "Hold the shift button while adjusting the knobs to adjust finer values",
            }

            let random = Math.floor(Math.random() * (15));
            $scope.Tip = tips[random];
        }


    //Display list of favourite ragas
    {
        const items = {...localStorage };
        let favourites = []

        for (let item in items) {
            if (item.includes('_FAV')) {
                let x = item.split('_');
                favourites.push(x[0].replaceAll("%C4%80", "Ā").replaceAll("%C4%81", "ā").replaceAll("%20", " ").replaceAll("%C4%93", "ē"));
            }
        }

        $scope.Favourites = favourites;
    }



});

//ragaController
ragaApp.controller('ragaController', function($scope, $routeParams, $http) {
    //Get name of Raga
    $scope.name = $routeParams.name;
    var buffer = $routeParams.name;

    console.log(buffer);
    //Display list of all the ragas from the JSON file
    $http({
        method: 'GET',
        url: 'mainRagaDatabase.json'
    }).success(function(data, status) {
        $scope.ragaName = data.ragas;
        let ragaDatabase = data.ragas;

        //Get Raga Arohanam Avarohanam and Moorchana phrase
        let raga = ragaDatabase.filter(function(raga) { return raga.name == buffer });

        let arohanam_ = raga[0].Arohanam.replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").split(" ");
        arohanam = arohanam_.join(" ");
        $scope.Arohanam = arohanam;

        let avarohanam_ = raga[0].Avarohanam.replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").split(" ");
        avarohanam = avarohanam_.join(" ");
        $scope.Avarohanam = avarohanam;

        arohanam_[arohanam_.length - 1] = "Ṡ";
        let shift = avarohanam_.shift();
        avarohanam[0] = "Ṡ";
        let moorchana_ = arohanam_.concat(avarohanam_)
        moorchana = moorchana_.join(" ")
        $scope.Moorchana = moorchana;

        //Retrieve contents of local storage for phrasebook
        if (window.localStorage.getItem(buffer)) {
            let phrases_ = window.localStorage.getItem(buffer);
            phrases = phrases_.split(',')

            //remove the default phrase
            phrases.shift()
            phrases = phrases.filter(item => item)

            $scope.Phrases = phrases;
        }

        //Retrieve _FAV key from local storage to check if this raga has been favourited
        let key = (buffer + "_FAV")
        $scope.Favourite = window.localStorage.getItem(key) || 'fav_false';

        //Swarahelp
        {
            for (let i = 0; i < moorchana_.length; i++) {
                console.log(moorchana_[i]);

                switch (moorchana_[i]) {
                    case "G₁":
                        moorchana_[i] = 'R₂';
                        break;
                    case "R₃":
                        moorchana_[i] = 'G₂';
                        break;
                    case "N₁":
                        moorchana_[i] = 'D₂';
                        break;
                    case "D₃":
                        moorchana_[i] = 'N₂';
                        break;
                }

                let id = "#" + moorchana_[i].toLowerCase() + "Key"
                console.log(id)

                $(id).html("•").addClass('swaraHelpActive');
            }
            swarasHelpON();
        }

    });
});

//
//
//
//
//JQuery 

// Variables
var interval;
var count = 0;
var tempo;
const keyList = ['s', 'r₁', 'r₂', 'g₂', 'g₃', 'm₁', 'm₂', 'p', 'd₁', 'd₂', 'n₂', 'n₃', 'ṡ'];
const keyListPseudo = ['s', 'r₁', 'r₂', 'g₂', 'g₃', 'm₁', 'm₂', 'p', 'd₁', 'd₂', 'n₂', 'n₃', 'ṡ'];

//Keyboard bindings
const keyBindings = {
    'a': '#sKey',
    'w': '#r₁Key',
    's': '#r₂Key',
    'e': '#g₂Key',
    'd': '#g₃Key',
    'f': '#m₁Key',
    't': '#m₂Key',
    'g': '#pKey',
    'y': '#d₁Key',
    'h': '#d₂Key',
    'u': '#n₂Key',
    'j': '#n₃Key',
    'k': '#ṡKey'
}

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
// When a knob is moved, these functions assign values to the effects
function volume(obj, param) {
    swarasGroup.volume = parseFloat(param)
    obj.next().text(param)
    originalVolume = parseFloat(swarasGroup.volume)
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
    // Set the values for individual parameters
    volume($('#volumeKnob'), volumeParam)
    $('#volumeKnob').attr('value', volumeParam)
    let elem = document.getElementById("volumeKnob"); // get existing input-knob element
    volumeKnob.value = volumeParam;

    filterCutoff($('#filterCutoffKnob'), filterCutoffParam);
    $('#filterCutoffKnob').attr('value', filterCutoffParam);
    filterCutoffKnob.value = filterCutoffParam;

    dubDelayFeedback($('#dubDelayFeedbackKnob'), dubDelayFeedbackParam);
    $('#dubDelayFeedbackKnob').attr('value', dubDelayFeedbackParam);
    dubDelayFeedbackKnob.value = dubDelayFeedbackParam;

    dubDelayTime($('#dubDelayTimeKnob'), dubDelayTimeParam);
    $('#dubDelayTimeKnob').attr('value', dubDelayTimeParam);
    dubDelayTimeKnob.value = dubDelayTimeParam;

    dubDelayCutoff($('#dubDelayCutoffKnob'), dubDelayCutoffParam);
    $('#dubDelayCutoffKnob').attr('value', dubDelayCutoffParam);
    dubDelayCutoffKnob.value = dubDelayCutoffParam;

    dubDelayMix($('#dubDelayMixKnob'), dubDelayMixParam);
    $('#dubDelayMixKnob').attr('value', dubDelayMixParam);
    dubDelayMixKnob.value = dubDelayMixParam;
}

//
// On Screen Keyboard
for (const [key, value] of Object.entries(keyBindings)) {
    keyboardJS.bind(key, (e) => {
        e.preventRepeat();
        if ($(value).hasClass('whiteKey')) {
            $(value).addClass('whiteKeyPressed').removeClass('whiteKey');
        } else if ($(value).hasClass('blackKey')) {
            $(value).addClass('blackKeyPressed').removeClass('blackKey');
        }
        var keyName = String(value).substring(1).split('K');
        for (let i = 0; i < keyListPseudo.length; i++) {
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
function keyRegister() {
    let pianomessage = '';
    let keyName;
    let a = $('#search').val();
    $('#newPiano p').click(function() {
        keyName = $(this).attr('id').split('K');
        if (keyName[0] == "Ṡ") {
            keyName[0] = "Ṡ";
        }
        a = $('#search').val() + " " + keyName[0];
        $('#search').val(a);
        pianomessage = 'Our system detected that you entered keys through the on-screen keyboard. Do you want to try modifying the faux-Swaras?'
    });
}
keyRegister();

//
//
//
// Play function
// Timeline - does the actual playing
// var originalVolume = parseFloat(swarasGroup.volume)

function timeline(sequence, repeat) {
    let temp;

    if ($(keyId).hasClass('whiteKeyPressed')) {
        $(keyId).addClass('whiteKey').removeClass('whiteKeyPressed');
    }

    if ($(keyId).hasClass('blackKeyPressed')) {
        $(keyId).addClass('blackKey').removeClass('blackKeyPressed');
    }

    let index;
    for (z = 0; z < keyListPseudo.length; z++) {
        if (sequence[count].toLowerCase() == keyListPseudo[z]) {
            index = z;
        } else {
            switch (sequence[count]) {
                case "G₁":
                    index = 2;
                    break;
                case "R₃":
                    index = 3;
                    break;
                case "N₁":
                    index = 9;
                    break;
                case "D₃":
                    index = 10;
                    break;
                case "Ṡ":
                    index = 12;
                    break;
            }
        }
    }
    keyList[index].stop();

    //Function to place the swara sequence in the sequence window
    function displaySequence() {
        var seq = sequence.slice(count - 9, count + 1).toString().replaceAll(",", "  ").replaceAll(/[0-9]/g, "&emsp;");
        if (count > 8) {
            $('#sequencePast').text(seq);
        }
    }
    displaySequence()

    //Set a random volume - functionality disabled as the sound is getting choppy with this function.
    // function randomVolume() {
    //     var min = originalVolume - 0.15;
    //     var max = originalVolume;
    //     var rndmVolume = Math.random() * (max - min) + min;
    //     swarasGroup.volume = rndmVolume;
    //     console.log("Random volume is: " + swarasGroup.volume)
    // }
    // randomVolume();

    //Not triggering .play(), just simulating a mouseclick on the piano
    var keyId = "#" + keyListPseudo[index] + "Key";
    $(keyId).trigger("mousedown");
    $(keyId).trigger("mouseup");

    count++
    if (count >= sequence.length) {
        clearInterval(interval);
        temp = '';
        $('.controls .button').removeClass('active')
    }
}

// Play function does the time setting with setInterval
function play(sequence, time) {
    stop();
    //Clean array elements with empty strings
    sequence = sequence.filter(item => item);

    temp = sequence;
    interval = setInterval('timeline(temp)', time);

    //Display the first 8 notes in the sequence that is going to play now
    var seqPast = sequence.slice(count, count + 9).toString().replaceAll(",", " ");
    $('#sequencePast').text(seqPast);
}

// Stop function stops any currently scheduled sequences
function stop() {
    clearInterval(interval);
    count = 0;
    temp = '';
    $('.controls .button').removeClass('active');
}

//Arohanam Play
function arohanamPlay() {
    let arohanam = $('#arohanam').text().split(" ");
    arohanam[arohanam.length - 1] = "Ṡ";
    play(arohanam, 700);
}

//Avarohanam play
function avarohanamPlay() {
    let avarohanam = $('#avarohanam').text().split(" ");
    avarohanam[0] = "Ṡ";
    play(avarohanam, 700);
}

//Randomize play
// Generates a sequence of 300 notes and pushes them and their next two notes to an array totalling 900 notes.
function randomizePlay() {
    let arohanam = $('#arohanam').text().split(" ");
    arohanam[arohanam.length - 1] = "Ṡ";

    let avarohanam = $('#avarohanam').text().split(" ");
    avarohanam[0] = "Ṡ";
    let shift = avarohanam.shift();

    let moorchana = arohanam.concat(avarohanam);
    let randomSequence = [];

    // Generate 90 Random numbers in sequence of 3
    for (let a = 0; a < 300; a++) {
        let random = Math.floor(Math.random() * (moorchana.length - 1));
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
    let randomSequenceNotes = [];
    for (let b = 0; b <= randomSequence.length - 1; b++) {
        randomSequenceNotes.push(moorchana[randomSequence[b]])
    }
    console.log("Random sequence to be played is: ")
    console.log(randomSequenceNotes)

    //Call the play() function to play the sequence
    play(randomSequenceNotes, 400)

}

//All event listeners here
$(document).ready(function() {
    // Button functionality
    $(document).on('click', '.button', function() {
        $(this).addClass('active');
    });

    $(document).on('click', '.preset', function() {
        $(this).addClass('active');
        $(this).siblings().children('.button').removeClass('active')
    });

    //Phasebook functionalities
    $(document).on('click', '#newPhrase', function() {
        $(this).parent().parent().append('<div class="phraseUnit"> <div class="phraseSelection"></div> <textarea class="phrase"></textarea></div>');
        $(this).removeClass('active')
    });

    //Phrase selection button
    $(document).on('click', '.phraseSelection', function() {
        if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
        } else {
            $(this).parent().addClass('active')
        }
    });

    //close controls
    $('#close').click(function() {
        $(this).parent().hide();
    });

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
});

// Phrase Delete button
function deletePhrase() {
    $('.phraseUnit.active').each(function() {
        $(this).remove();
    });
}

function phraseBookPlay() {
    let sequence = [];
    let count = 0;

    // Firstly, check how many phrases are selected
    $('.phraseUnit').each(function() {
        // Play selected items
        if ($(this).hasClass('active')) {
            count++;
        }
    });

    // If one or more phrases are selected, play the selected items or play everything
    if (count > 0) {
        $('.phraseUnit').each(function() {
            // Play selected items
            if ($(this).hasClass('active')) {
                let phrase = $(this).children('.phrase').val().trim().replaceAll("\n", " ").replace(/\s\s+/g, ' ').replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").split(" ");

                sequence = sequence.concat(phrase);
                console.log("sequence is: ")
                console.log(sequence)

                if (sequence.length > 0) {
                    try {
                        play(sequence, 400);
                    } catch (error) {
                        console.error("somethings wrong");
                    }
                }
                count++;
            } else {
                console.log("error")
                $('#playPhrase').removeClass('active');
            }
        });
    } else {
        $('.phraseUnit').each(function() {
            let phrase = $(this).children('.phrase').val().trim().replaceAll("\n", " ").replace(/\s\s+/g, ' ').replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").split(" ");
            sequence = sequence.concat(phrase);
            console.log("sequence is: ")
            console.log(sequence)
            if (sequence) {
                play(sequence, 400);
            }
        });
    }

}

// 🔧 - resolve a phrase from 1 to ₁
function resolvePhrase() {
    //Perform play action only on phrases that are selected
    var sequence = [];
    $('.phraseUnit').each(function() {
        if ($(this).hasClass('active')) {
            var phrase = $(this).children('.phrase').val().replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").toUpperCase();
            $(this).children('.phrase').val(phrase);
        } else {
            console.log('Selected phrases resolved with 0 errors');
        }
    });
}

// Local storage stuff
function savePhrase() {
    let href = window.location.href.split('/');
    let raga_ = href.pop() || href.pop();
    let raga = raga_.replaceAll("%C4%80", "Ā").replaceAll("%C4%81", "ā").replaceAll("%20", " ").replaceAll("%C4%93", "ē")
    console.log(raga)

    window.localStorage.removeItem(raga)
    var phrases_ = ''
    $('.phraseUnit').each(function() {
        phrases_ += "," + $(this).children('.phrase').val();
    });

    let phrases = phrases_.substring(1)
    console.log(phrases);
    window.localStorage.setItem(raga, phrases);
}

// TODO - variable tempo
function time() {
    let bpm = parseInt($('#tempo').val());
    let ms = 60000 / bpm;
    if (!Number.isNaN(ms)) {
        tempo = ms;
        console.log(ms)
    }

}

// Set Favourites function
function favourite() {
    let href = window.location.href.split('/');
    let raga_ = href.pop() || href.pop();
    let raga = raga_.replaceAll("%C4%80", "Ā").replaceAll("%C4%81", "ā").replaceAll("%20", " ").replaceAll("%C4%93", "ē")
    let key = raga + '_FAV';

    if ($('#favourite').hasClass('fav_true')) {
        window.localStorage.removeItem(key);
        $('#favourite').addClass('fav_false');
        $('#favourite').removeClass('fav_true');
    } else {
        window.localStorage.setItem(key, 'fav_true');
        $('#favourite').addClass('fav_true');
        $('#favourite').removeClass('fav_false');
    }
}

//Autosave feature
$('document').on('keyup', '.phrase', function() {
    console.log("keyup");
});

//Resize phrasebook features
function enlargePhraseBook() {
    $('.phraseBook').addClass('enlarge');
    $('.resize').removeClass('fa-expand').addClass('fa-compress-alt').attr('onclick', "minimizePhraseBook()");
}

function minimizePhraseBook() {
    $('.phraseBook').removeClass('enlarge');
    $('.resize').addClass('fa-expand').removeClass('fa-compress-alt').attr('onclick', "enlargePhraseBook()");;
}

//Turn off Swaras help
function swarasHelpClear() {
    $('#newPiano > p').text("");
    $('.setOfBlackKeys > p').text("");
}

//Turn swaras help ON or OFF
function swarasHelpON() {
    if ($("#notesON").is(':checked')) {
        $('#newPiano p').removeClass('notesHelpOFF');
    } else {
        $('#newPiano p').addClass('notesHelpOFF');
    }
}