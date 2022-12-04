// 7 AUG 2021
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
        .when('/exercise', {
            templateUrl: 'exercises.html',
            controller: 'ragaController'
        })
        .when('/learn', {
            templateUrl: 'glossary.html',
            controller: 'ragaController'
        })
        .when('/ragaDetail/:name', {
            templateUrl: 'ragaDetail.html',
            controller: 'ragaController'
        })
});

ragaApp.service('moorchanaService', function() {
    //Set default value of moorchana to Mayamalava gowla
    this.moorchana = ["S", "R₁", "G₃", "M₁", "P", "D₁", "N₃", "S̄", "S̄", "N₃", "D₁", "P", "M₁", "G₃", "R₁", "S"]
});

ragaApp.controller('effectsController', ['$rootScope', '$scope', 'moorchanaService', function($rootScope, $scope, moorchanaService) {
    $scope.moorchanaService = moorchanaService;

    // PLay button in the effects panel plays seelcted raga's mooorchana if home page or plays the phrasebook's phrase if in Raga Detail page
    $scope.optionsPlay = function() {
        if (window.location.href.includes('/ragaDetail/') || window.location.href.includes('/exercise')) {
            phraseBookPlay();
        } else {
            play(moorchanaService.moorchana, tempo);

            //Track Phraseplay
            analytics.track('Played moorchana', { sequence: moorchanaService.moorchana });
        }
    }
}]);

//
//
// Maincontroller
ragaApp.controller('mainController', ['$rootScope', '$scope', '$http', 'moorchanaService', function($rootScope, $scope, $http, moorchanaService) {

    // Track Homepage entry
    analytics.track('Entered Homepage');

    let ragaDatabase = undefined;
    $scope.moorchanaService = moorchanaService;

    function removeAccents(value) {
        return value.replace(/ā/g, 'a').replace(/ē/g, 'a').replaceAll("\n", " ").replace(/\s\s+/g, ' ').replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃");
    }

    $scope.ignoreAccents = function(item) {
        if ($scope.search) {
            var search = removeAccents($scope.search).toLowerCase();
            var find = removeAccents(item.name + ' ' + item.Avarohanam + ' ' + item.Arohanam + ' ').toLowerCase();
            return find.indexOf(search) > -1;
        }
        return true;
    };

    // Display list of all the ragas
    $http({
        method: 'GET',
        url: 'Raga_Database.json'
    }).success(function(data, status) {
        $scope.ragaName = data.ragas;
        ragaDatabase = data.ragas;

        // Editor's picks
        $scope.EditorsPicks = ['Māyamālava Gowla', 'Hindolam', 'Chārukeshi', 'Shanmukhapriya', 'Kharaharapriya', 'Reethigowla', 'Natabhairavi', 'Vijayanāgari', 'Ghanta', 'Vanaspati'];

        // Moods
        $scope.Meditative = ['Māyamālava Gowla', 'Revati', 'Shanmukhapriya', 'Sāveri', 'Malahari', 'Hindolam', 'Kalyāna Vasantam', 'Bindhumālini', 'Saraswathi', 'Ahir Bhairav'];
        $scope.Ecstatic = ['Kharaharapriya', 'Reethigowla', 'Anandabhairavi', 'Kānadā', 'Bhāgeshri', 'Miyan Malhār'];
        $scope.Mysterious = ['Nāsikabhooshhani', 'Vanaspati', 'Gānamoorti', 'Vāchaspathi', 'Ghanta', 'Kanakāmbari', 'Rāgachoodāmani'];
        $scope.Cinematic = ['Natabhairavi', 'Vijayanāgari', 'Chakravākam', 'Abheri', 'Darbāri Kānada', 'Sāramati', 'Shivaranjani', 'Shubhapanthuvarāli'];
        $scope.Serene = ['Kāmbhoji', 'Bahudāri', 'Mechakalyāni', 'Nāttai Kurinji', 'Dheera Shankarābharanam', 'Mohanam', 'Hamsadhwani', 'Madhyamāvathi'];

        // Ragas of the Day
        {
            let randomRagas = [];
            for (let i = 0; i < 5; i++) {
                let random = Math.floor(Math.random() * (ragaDatabase.length - 1));
                randomRagas.push(ragaDatabase[random].name)
            }

            $scope.RagaOfTheDay = randomRagas;
        }

        // Display list of Melakartha Ragas in different Chakras
        {
            let melakartas = [];
            let oudava = [];
            let shadava = [];
            for (let i = 0; i < ragaDatabase.length; i++) {
                if (ragaDatabase[i].janyaOf == "false") {
                    melakartas.push(ragaDatabase[i].name);
                }

                // oudava shadava ragas
                let moorchana_ = ragaDatabase[i].Arohanam + ragaDatabase[i].Avarohanam
                const moorchana = [...new Set(moorchana_.split(" "))];

                if (moorchana.length == 6 && ragaDatabase[i].Arohanam.split(" ").length == 6 && ragaDatabase[i].Avarohanam.split(" ").length == 6) {
                    oudava.push(ragaDatabase[i].name);
                }

                if (moorchana.length == 7 && ragaDatabase[i].Arohanam.split(" ").length == 7 && ragaDatabase[i].Avarohanam.split(" ").length == 7) {
                    shadava.push(ragaDatabase[i].name);
                }

            }
            $scope.OudavaShort = ['Karnātaka Shuddha Sāveri', 'Tatillatika', 'Revati', 'Vittalapriya', 'Chitthakarshani', 'Bhoopālam', 'Chandrikatodi', 'Kalāsāveri', 'Prabhupriya'];
            $scope.ShadavaShort = ['Mādhavapriyā', 'Vāgeeshwari', 'Amrita Dhanyāsi', 'Divyamālati', 'Shuddha Seemantini', 'Shuddha Todi', 'Alankārapriya', 'Bhāgyashabari', 'Mātangakāmini'];
            $scope.oudava = ['Karnātaka Shuddha Sāveri', 'Tatillatika', 'Revati', 'Vittalapriya', 'Chitthakarshani', 'Bhoopālam', 'Chandrikatodi', 'Kalāsāveri', 'Prabhupriya', 'Udayaravichandrika', 'Gunāvati', 'Sallapa', 'Sūryā', 'Deshyagowla', 'Kalyānakesari', 'Megharanjani', 'Revagupti', 'Rukhmāmbari', 'Tārakagowla', 'Vishārada', 'Mukundamālini', 'Valaji', 'Suddha Gowla', 'Bhārati', 'Hindolam', 'Kātyāyani', 'Kshanika', 'Malkosh', 'Sharadapriya', 'Sushama', 'Sutradhāri', 'Udayarāga', 'Bhānupriya', 'Kadaram', 'Priyadarshani', 'Sāmapriya', 'Shrothasvini', 'Vasanthā', 'Abhogi', 'Karnātaka Hindolam', 'Madhyamāvathi', 'Mahānandhi', 'Nāgavalli', 'Nirmalāngi', 'Ratipatipriya', 'Sārang', 'Sankrāndanapriyā', 'Shivapriyā', 'Shivaranjani', 'Suddha Dhanyāsi', 'Suddha Hindolam', 'Hrudkamali', 'Lavanthika', 'Rājathilaka', 'Madhulika', 'Vasanthi', 'Ambhojini', 'Bhoopāli', 'Deshkār', 'Guhamanohari', 'Jaithshree', 'Madhurakokila', 'Mohanam', 'Nādavalli', 'Nāgaswarāvali', 'Neela', 'Rāgavinodini', 'Sāvithri', 'Veenavadini', 'Dharmalakhi', 'Hamsadhwani', 'Niroshta', 'Rathnabhooshani', 'Suddha Sāveri', 'Tāndavam', 'Vedhāndhagamana', 'Niranjani', 'Vikhavathi', 'Gambheeranāttai', 'Poornapanchamam', 'Parpathi', 'Tāndavapriyā', 'Patalāmbari', 'Hemāngi', 'Samudrapriyā', 'Sumanasaranjani', 'Ānandavalli', 'Hemapriya', 'Kshemakari', 'Yāgini', 'Varada', 'Skandamanorama', 'Hrdhini', 'Pramodhini', 'Shilangi', 'Sunādavinodini', 'Vandanadhārini', 'Amritavarshini'];
            $scope.shadava = ['Mādhavapriyā', 'Vāgeeshwari', 'Amrita Dhanyāsi', 'Divyamālati', 'Shuddha Seemantini', 'Shuddha Todi', 'Alankārapriya', 'Bhāgyashabari', 'Mātangakāmini', 'Vātee Vasantabhairavi', 'Kalindaja', 'Kuvalayabharanam', 'Shuddha Kāmbhoji', 'Bhāvini', 'Chandrachooda', 'Lalitā', 'Poornalalita', 'Sāmantadeepara', 'Bhujāngini', 'Chakranārāyani', 'Kokilā', 'Malayamārutam', 'Pravritti', 'Jeevantikā', 'Chittaranjani', 'Poornashadjam', 'Shree Navarasachandrika', 'Aymmukhan', 'Chandrika', 'Hamsavāhini', 'Vasanthamanohari', 'Chittaranjanii', 'Hamsa ābheri', 'Jatādhāri', 'Kalika', 'Madhyamarāvali', 'Omkāri', 'Pushpalathika', 'Shreeranjani', 'Vasantashree', 'Gayakamandini', 'Srirangapriya', 'Neelamani', 'Sarasānana', 'Chandrahasitham', 'Jana Sammodhini', 'Karnātaka Khamās', 'Vaishnavi', 'Ānandharoopa', 'Hamsavinodhini', 'Kedaram', 'Reetuvilāsa', 'Suranandini', 'Vilāsini', 'Damarugapriya', 'Desharanjani', 'Maghathi', 'Murali', 'Nāttai', 'Jālasugandhi', 'Chandrajyothi', 'Mahathi', 'Suvarnadeepakam', 'Bhavāni', 'Kanchanāvathi', 'Shekharachandrikā', 'Shreekānti', 'Vijayashree', 'Bhinnapauarali', 'Dharmini', 'Mandāri', 'Bhogavasantha', 'Kamalāptapriyā', 'Rasavinodini', 'Seemantinipriyā', 'Hamsānandi', 'Suddhakriyā', 'Sundarāngi', 'Gopikathilakam', 'Shanmukhi', 'Ghantana', 'Shuddha', 'Urmikā', 'Karmukhāvati', 'Vijayanāgari', 'Hamsanādam', 'Kanakakusumāvali', 'Shruthiranjani', 'Gopriya', 'Lalithāngi', 'Rathnakānthi', 'Raviswaroopini', 'Gurupriya', 'Mukthidāyini', 'Triveni', 'Vivāhapriyā', 'Kalyānadāyini', 'Kannadamaruva', 'Sāranga Tārangini'];

            $scope.Indu = melakartas.slice(0, 6);
            $scope.Netra = melakartas.slice(6, 12);
            $scope.Agni = melakartas.slice(12, 18);
            $scope.Veda = melakartas.slice(18, 24);
            $scope.Bana = melakartas.slice(24, 30);
            $scope.Rutu = melakartas.slice(30, 36);
            $scope.Rishi = melakartas.slice(36, 42);
            $scope.Vasu = melakartas.slice(42, 48);
            $scope.Brahma = melakartas.slice(48, 54);
            $scope.Disi = melakartas.slice(54, 60);
            $scope.Rudra = melakartas.slice(60, 66);
            $scope.Aditya = melakartas.slice(66, 72);

            $scope.Oudava = oudava;
            $scope.Shadava = shadava;
            // $scope.ShuddhaMelakartas = melakartas.slice(0, 36);
            // $scope.PratiMelakartas = melakartas.slice(36, 72);
        }

        //splashscreen stuff
        $('document').ready(function() {
            setTimeout(function() {
                $('#splashscreen').hide();
                $('.wrapper').show();

                //initialize phrase scroll length as soon as page loads
                $('.phrase').each(function() {
                    this.style.height = (this.scrollHeight) + 'px';
                });
            }, 2000);
        });
    });

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

    // Homepage Moods toggle functionality
    {
        $('.mood').on('click', function() {
            let mood = '.' + $(this).attr('id');

            $(mood).show();
            $(this).addClass('active');

            $(mood).siblings().hide();
            $(this).siblings().removeClass('active');

        });
    }

    //Search field reveal functionality
    {
        let a = $('#search').val();
        $('#search').on('focus', function() {
            $('#newPiano p').on('click', function(e) {
                e.stopPropagation();
                a = a + " " + $(this).attr('id').split('K')[0];
                $('#search').val(a);
            });
        });

        $(document).on('blur', '#search', function(e) {
            $('#search').off('focus')
        });
    }

    //Melakartas toggle functionality
    {
        $('.chakra').on('click', function() {
            let className = '.' + $(this).attr('id');

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(className).removeClass('selected');
            } else {
                $(this).addClass('active');
                $(className).addClass('selected');
            }

        })
    }

    //Raga Auditioning functionality
    {
        $scope.selected = 'Māyamālava Gowla';

        //Setting the piano to display default Swarasthanas for Māyamālava Gowla
        {
            let moorchana_ = ['S', 'R₁', 'G₃', 'M₁', 'P', 'D₁', 'N₃', 'S̄', 'S̄', 'N₃', 'D₁', 'P', 'M₁', 'G₃', 'R₁', 'S'];

            for (let i = 0; i < moorchana_.length; i++) {
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

                let id = "#" + moorchana_[i] + "Key";
                $(id).html("•").addClass('swaraHelpActive');
            }
        }

        $scope.ragaAudition = function(ragaName) {

            $(".ragaName a").click(function(e) {
                e.stopPropagation();
            });

            //Get Raga Arohanam Avarohanam and Moorchana phrase
            let raga = ragaDatabase.filter(function(raga) { return raga.name == ragaName });

            // Track the name of the Auditioned Raga
            analytics.track('Auditioned Raga', { raga: ragaName });

            let arohanam_ = raga[0].Arohanam.split(" ");
            arohanam = arohanam_.join(" ");

            let avarohanam_ = raga[0].Avarohanam.split(" ");
            avarohanam = avarohanam_.join(" ");

            let moorchana_ = arohanam_.concat(avarohanam_);

            swarasHelpClear();
            for (let i = 0; i < moorchana_.length; i++) {
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

                let id = "#" + moorchana_[i] + "Key";
                $(id).html("•").addClass('swaraHelpActive');
            }
            swarasHelpON();

            $scope.selected = ragaName;

            moorchanaService.moorchana = moorchana_;
        }
    }

}]);

//ragaController
ragaApp.controller('ragaController', function($scope, $routeParams, $http) {
    //Get name of Raga
    $scope.name = $routeParams.name || 'Māyamālava Gowla';
    var buffer = $routeParams.name || 'Māyamālava Gowla';

    // Track the name of the Raga
    analytics.track('Entered Raga detail page', {
        raga: buffer
    });

    //Display list of all the ragas from the JSON file
    $http({
        method: 'GET',
        url: 'Raga_Database.json'
    }).success(function(data, status) {
        $scope.ragaName = data.ragas;
        let ragaDatabase = data.ragas;

        //Get Raga Arohanam Avarohanam and Moorchana phrase
        let raga = ragaDatabase.filter(function(raga) { return raga.name == buffer });

        let arohanam_ = raga[0].Arohanam.split(" ");
        arohanam = arohanam_.join(" ");
        $scope.Arohanam = arohanam;

        let avarohanam_ = raga[0].Avarohanam.split(" ");
        avarohanam = avarohanam_.join(" ");
        $scope.Avarohanam = avarohanam;

        let shift = avarohanam_.shift();
        let moorchana_ = arohanam_.concat(avarohanam_)
        moorchana = moorchana_.join(" ")
        $scope.Moorchana = moorchana;

        var chakras = ['Indu', 'Nētra', 'Agni', 'Veda', 'Bāna', 'Rutu', 'Rishi', 'Vasu', 'Brahma', 'Disi', 'Rudra', 'Āditya']

        //Show list of janya Ragas if given Raga is a Melakarta Raga
        {
            let janyaRagas = [];
            $scope.JanakaNumber = raga[0].janaka;

            //To show whether Shuddha/Prati madhyama equivalent
            $scope.Madhyama = raga[0].janaka < 36 ? "Prati" : "Shuddha";

            if (parseInt(raga[0].janaka) < 72) {
                let chakraNo = (parseInt(parseInt(raga[0].janaka) / 6));
                $scope.Chakra = chakras[chakraNo];
            } else {
                $scope.Chakra = chakras[11];
            }

            if (parseInt(raga[0].janaka)) {
                $scope.Janaka = true;
            }

            for (let i = 0; i < data.ragas.length; i++) {
                if (data.ragas[i].janyaOf == raga[0].janaka) {
                    janyaRagas.push(data.ragas[i].name);
                }
                //To find Shuddha/Prati Madhyama equivalent Raga
                if (raga[0].janaka < 36 && data.ragas[i].janaka == raga[0].janaka + 36) {
                    $scope.MadhyamaEquivalent = data.ragas[i].name
                } else if (raga[0].janaka > 36 && data.ragas[i].janaka == raga[0].janaka - 36) {
                    $scope.MadhyamaEquivalent = data.ragas[i].name
                }
            }

            $scope.JanyaRagas = janyaRagas;

        }

        // Show Melakartha Raga and related Ragas if this is a Janya Raga
        {
            // Check if this Raga is Janya Raga
            $scope.Janaka = raga[0].janaka === 'false' ? false : true;

            let similarRagas = [];

            for (let i = 0; i < data.ragas.length; i++) {
                if (data.ragas[i].janaka == raga[0].janyaOf) {
                    $scope.JanakaRaga = data.ragas[i].name
                }
                // Previous and next three Ragas
                if (data.ragas[i] === raga[0]) {
                    try {
                        similarRagas.push(data.ragas[i - 3].name)
                        similarRagas.push(data.ragas[i - 2].name)
                        similarRagas.push(data.ragas[i - 1].name)
                        similarRagas.push(data.ragas[i + 1].name)
                        similarRagas.push(data.ragas[i + 2].name)
                        similarRagas.push(data.ragas[i + 3].name)
                    } catch {
                        if (i == 1) {
                            similarRagas.push(data.ragas[i - 1].name)
                            similarRagas.push(data.ragas[i + 1].name)
                            similarRagas.push(data.ragas[i + 2].name)
                            similarRagas.push(data.ragas[i + 3].name)
                        } else if (i == 2) {
                            similarRagas.push(data.ragas[i - 2].name)
                            similarRagas.push(data.ragas[i - 1].name)
                            similarRagas.push(data.ragas[i + 1].name)
                            similarRagas.push(data.ragas[i + 2].name)
                            similarRagas.push(data.ragas[i + 3].name)
                        }
                    }
                }
            }

            $scope.SimilarRagas = similarRagas


        }

        //Retrieve contents of local storage for phrasebook
        if (window.localStorage.getItem(buffer)) {
            let phrases_ = window.localStorage.getItem(buffer);
            phrases = phrases_.split(',')

            //remove the default phrase
            phrases.shift()
            phrases = phrases.filter(item => item)

            $scope.Phrases = phrases;
        }

        //initialize phrase scroll length as soon as page loads
        $('document').ready(function() {
            setTimeout(function() {
                $('.phrase').each(function() {
                    this.style.height = (this.scrollHeight) + 'px';
                });
            }, 2000);
        });


        //Retrieve _FAV key from local storage to check if this raga has been favourited
        let key = (buffer + "_FAV")
        $scope.Favourite = window.localStorage.getItem(key) || 'fav_false';

        //Swarahelp
        {
            swarasHelpClear();
            for (let i = 0; i < moorchana_.length; i++) {
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

                let id = "#" + moorchana_[i] + "Key";
                $(id).html("•").addClass('swaraHelpActive');
            }
            swarasHelpON();
        }

        // Series of events that have to occur on keyup on a phrase in the phrasebook
        {
            //Create an array with all the unique swaras
            const moorchana__ = [...new Set(moorchana.split(" "))];

            // Firstly, clear the previous keyup event and then add a fresh one
            $(document).off('keyup', '.phrase');

            $(document).on('keyup', '.phrase', function(e) {
                //Phrase save pending indicator
                $('h4 span').show();

                //Preserving the cursor position
                let start = $(this)[0].selectionStart;
                let end = $(this)[0].selectionEnd;

                //If user enters a key within the Raga, Automatically convert G -> G₁ etc
                if (e.keyCode === 82 || e.keyCode === 71 || e.keyCode === 77 || e.keyCode === 68 || e.keyCode === 78) {
                    for (let i = 0; i < moorchana__.length; i++) {
                        if (moorchana__[i].includes(e.key.toUpperCase())) {

                            let start = $(this)[0].selectionStart;
                            let end = $(this)[0].selectionEnd;

                            let phrase = $(this).val().replaceAll(e.key, moorchana__[i]);
                            $(this).val(phrase);

                            $(this)[0].selectionStart = start;
                            $(this)[0].selectionEnd = end;
                        }
                    }
                }
                // N̄ D̄ P̄	M̄ Ḡ R̄ S̄
                // Ṉ Ḏ P̱ M̱ G̱ Ṟ S̱
                let phrase = $(this).val().toUpperCase();
                let replacements = {
                    '1': '₁',
                    '2': '₂',
                    '3': '₃',
                    'S]': 'S̄',
                    'S ]': 'S̄',
                    'R₁ ]': 'R̄₁',
                    'R₂ ]': 'R̄₂',
                    'R₃ ]': 'R̄₃',
                    'G₁ ]': 'Ḡ₁',
                    'G₂ ]': 'Ḡ₂',
                    'G₃ ]': 'Ḡ₃',
                    'M₁ ]': 'M̄₁',
                    'M₂ ]': 'M̄₂',
                    'P]': 'P̄',
                    'P ]': 'P̄',
                    'D₁ ]': 'D̄₁',
                    'D₂ ]': 'D̄₂',
                    'D₃ ]': 'D̄₃',
                    'N₁ ]': 'N̄₁',
                    'N₂ ]': 'N̄₂',
                    'N₃ ]': 'N̄₃',
                    '[S': 'S̱',
                    '[R₁': 'Ṟ₁',
                    '[R₂': 'Ṟ₂',
                    '[R₃': 'Ṟ₃',
                    '[G₁': 'G̱₁',
                    '[G₂': 'G̱₂',
                    '[G₃': 'G̱₃',
                    '[M₁': 'M̱₁',
                    '[M₂': 'M̱₂',
                    '[P': 'P̱',
                    '[D₁': 'Ḏ₁',
                    '[D₂': 'Ḏ₂',
                    '[D₃': 'Ḏ₃',
                    '[N₁': 'Ṉ₁',
                    '[N₂': 'Ṉ₂',
                    '[N₃': 'Ṉ₃',
                }

                for (const key in replacements) {
                    phrase = phrase.replaceAll(key, replacements[key]);
                }

                //Resolving the input from 1 -> ₁ etc and preserving the cursor position
                //let phrase = $(this).val().replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").replaceAll("S'", "Ṡ").replaceAll("S '", "Ṡ").toUpperCase();
                $(this).val(phrase);

                $(this)[0].selectionStart = start;
                $(this)[0].selectionEnd = end;

                // Automatic space
                if (e.keyCode != 8) {
                    if (['₁', '₂', '₃', '-', 'P', 'P̄', 'P¯', 'P̱', 'S̱', 'Ṡ', 'S̄', 'S'].includes(phrase.charAt(phrase.length - 1))) {
                        phrase = phrase + ' ';
                        $(this).val(phrase);
                    }
                }

                //Resize the textarea according to input height
                this.style.height = 'auto';

                this.style.height = (this.scrollHeight) + 'px';

                // // Check the input with regular expression - TODO
                // let re = /[RGMDNN̄D̄M̄ḠR̄ṈḎM̱G̱Ṟ]+[₁₂₃]+[ ]\b|S |P̄ |P |P̱ |S̄ |S̄ |- |\s/;
                // if (phrase.match(re)) {
                //     $(this).css('background', '#efefef');
                // } else {
                //     $(this).css('background', '#ffc7c7');
                // }

                //Save message
                $('#toastMessages').text('Don\'t forget to save your changes.');

                // Select this phrase as active
                $(this).parent('.phraseUnit').addClass('active');
                $(this).parent('.phraseUnit').siblings().removeClass('active');

            });

            // Using the keyboard to register notes in the phrasebook
            let swap = {
                'R₂': 'G₁',
                'G₂': 'R₃',
                'D₂': 'N₁',
                'N₂': 'D₃'
            }
            $(document).on('click', '.phrase', function(e) {
                //pianoInput($(this));
                e.stopPropagation();
                let input = $(this);

                $('#newPiano p').unbind("click");
                $('#newPiano p').on('click', function(e) {
                    e.stopPropagation();
                    let swara = $(this).attr('id').replace('Key', '').toUpperCase();

                    //For Ragas like Nattai, where G2 is swapped with R3.
                    if (swara == 'R₂' || swara == 'G₂' || swara == 'D₂' || swara == 'N₂') {
                        for (let i = 0; i < moorchana__.length; i++) {
                            if (swap[swara] == moorchana__[i]) {
                                swara = moorchana__[i];
                            }
                        }
                    }

                    swara = input.val() + swara + ' ';
                    input.val(swara);
                });

            });

            $('body').on('click', function() {
                //$('.phrase').off("click");
                $('#newPiano p').unbind("click");
            });
        }

    });

    // Splashscreen stuff
    setTimeout(function() {
        $('#splashscreen').hide();
        $('.wrapper').show();

        //initialize phrase scroll length as soon as page loads
        $('.phrase').each(function() {
            this.style.height = (this.scrollHeight) + 'px';
        });
    }, 2000);

    // Exercises functionality
    {
        $('.varisai').on('click', function() {
            let varisai = '.' + $(this).attr('id');

            $(this).addClass('active');
            $(this).siblings().removeClass('active');

            $(varisai).show();
            $(varisai).addClass('active');

            $(varisai).siblings('.phraseBook').hide();


            $('.phrase').each(function() {
                this.style.height = (this.scrollHeight) + 'px';
            });

        });
    }
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
// const keyList = ['s', 'r₁', 'r₂', 'g₂', 'g₃', 'm₁', 'm₂', 'p', 'd₁', 'd₂', 'n₂', 'n₃', 'ṡ', '-'];
// const keyListPseudo = ['s', 'r₁', 'r₂', 'g₂', 'g₃', 'm₁', 'm₂', 'p', 'd₁', 'd₂', 'n₂', 'n₃', 'ṡ', '-'];

const keyList = ['S̱', 'Ṟ₁', 'Ṟ₂', 'G̱₂', 'G̱₃', 'M̱₁', 'M̱₂', 'P̱', 'Ḏ₁', 'Ḏ₂', 'Ṉ₂', 'Ṉ₃', 'S', 'R₁', 'R₂', 'G₂', 'G₃', 'M₁', 'M₂', 'P', 'D₁', 'D₂', 'N₂', 'N₃', 'S̄', 'R̄₁', 'R̄₂', 'Ḡ₂', 'Ḡ₃', 'M̄₁', 'M̄₂', 'P̄', 'D̄₁', 'D̄₂', 'N̄₂', 'N̄₃', 'Ṡ', '-'];
const keyListPseudo = ['S̱', 'Ṟ₁', 'Ṟ₂', 'G̱₂', 'G̱₃', 'M̱₁', 'M̱₂', 'P̱', 'Ḏ₁', 'Ḏ₂', 'Ṉ₂', 'Ṉ₃', 'S', 'R₁', 'R₂', 'G₂', 'G₃', 'M₁', 'M₂', 'P', 'D₁', 'D₂', 'N₂', 'N₃', 'S̄', 'R̄₁', 'R̄₂', 'Ḡ₂', 'Ḡ₃', 'M̄₁', 'M̄₂', 'P̄', 'D̄₁', 'D̄₂', 'N̄₂', 'N̄₃', 'Ṡ', '-'];



//Keyboard bindings
const keyBindings = {
    'a': '#SKey',
    'w': '#R₁Key',
    's': '#R₂Key',
    'e': '#G₂Key',
    'd': '#G₃Key',
    'f': '#M₁Key',
    't': '#M₂Key',
    'g': '#PKey',
    'y': '#D₁Key',
    'h': '#D₂Key',
    'u': '#N₂Key',
    'j': '#N₃Key',
    'k': '#S̄Key'
}

// all sounds
// N̄ D̄ P̄	M̄ Ḡ R̄ S̄
// Ṉ Ḏ P̱ M̱ G̱ Ṟ S̱ 
// S R G M P D N 
// Ṡ

//Declare all the sounds
for (let i = 0; i < keyList.length - 1; i++) {
    let sound = 'sounds/' + keyList[i].replace("₁", "1").replace("₂", "2").replace("₃", "3") + '.mp3';
    keyList[i] = new Pizzicato.Sound({ source: 'file', options: { path: sound } });

    //Set attack to 0.001 for all the notes so it sounds sharp
    keyList[i].attack = 0.001;
}

keyList[37] = new Pizzicato.Sound({ source: 'wave', options: { frequency: 22000 } });
const tanpura = new Pizzicato.Sound({ source: 'file', options: { loop: true, path: ['sounds/shruti.mp3'] } });


//Create a group of all the notes
swarasGroup = new Pizzicato.Group(keyList);
swarasGroup.addSound(tanpura);

//
//
//
//
//Add Effects to the group
var dubDelay = new Pizzicato.Effects.DubDelay({
    feedback: 0.7,
    time: 0.6,
    cutoff: 3200,
    mix: 0.10
});

var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 16000,
    peak: 1
});

// For tanpura continuity
var delay = new Pizzicato.Effects.Delay({
    feedback: 0.7,
    time: 1,
    mix: 0.5
});

swarasGroup.addEffect(lowPassFilter);
swarasGroup.addEffect(dubDelay);
swarasGroup.volume = 0.3;

tanpura.addEffect(delay);

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

function tanpuraVolume(obj, param) {
    tanpura.volume = parseFloat(param);
    if (param >= 0.1) {
        tanpura.play();
    } else {
        tanpura.stop();
    }
}

// Presets - takes all the values as parameters and assigns these value to the Knob and the display text

function preset(filterCutoffParam, dubDelayFeedbackParam, dubDelayTimeParam, dubDelayCutoffParam, dubDelayMixParam) {
    // Set the values for individual parameters
    // volume($('#volumeKnob'), volumeParam)
    // $('#volumeKnob').attr('value', volumeParam)
    // let elem = document.getElementById("volumeKnob"); // get existing input-knob element
    // volumeKnob.value = volumeParam;

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
// Keyboard to piano bindings
function keyBind() {
    for (const [key, value] of Object.entries(keyBindings)) {
        keyboardJS.bind(key, (e) => {
            e.preventRepeat();
            $(value).trigger("mousedown");
        }, (e) => {
            $(value).trigger("mouseup");
        });
    }
}
keyBind();

// // On Click Key register on the search bar and phrase
// function keyRegister() {
//     let a = $('#search').val();
//     $('#newPiano p').unbind("click");

//     $('#search').on('focus', function() {
//         $('#newPiano p').on('click', function(e) {
//             e.stopPropagation();
//             a = a + " " + $(this).attr('id').split('K')[0];
//             $('#search').val(a);
//         });
//     });

//     $('#search').on('blur', function(e) {
//         $('#search').off('focus')
//     });
// }
// keyRegister();

function pianoInput(input) {
    $('#newPiano p').unbind("click");
    $('#newPiano p').on('click', function(e) {
        e.stopPropagation();
        input.val(input.val() + $(this).attr('id').replace('Key', ' ').toUpperCase());
    });
}

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
        if (sequence[count].toUpperCase() == keyListPseudo[z]) {
            index = z;
        } else {
            switch (sequence[count]) {
                case "G̱₁":
                    index = 2;
                    break;
                case "Ṟ₃":
                    index = 3;
                    break;
                case "Ṉ₁":
                    index = 9;
                    break;
                case "Ḏ₃":
                    index = 10;
                    break;
                case "G₁":
                    index = 14;
                    break;
                case "R₃":
                    index = 15;
                    break;
                case "N₁":
                    index = 21;
                    break;
                case "D₃":
                    index = 22;
                    break;
                case "Ḡ₁":
                    index = 26;
                    break;
                case "R̄₃":
                    index = 27;
                    break;
                case "N̄₁":
                    index = 33;
                    break;
                case "D̄₃":
                    index = 34;
                    break;
            }
        }
    }
    try {
        keyList[index].stop();
    } catch (error) {
        console.log(error);
        console.log('Execution stopped as an unknown swara was encountered.');
    }


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
    if (index > 11 && index < 25) {
        var keyId = "#" + keyListPseudo[index] + "Key";
        $(keyId).trigger("mousedown");
        $(keyId).trigger("mouseup");

        count++
        if (count >= sequence.length) {
            clearInterval(interval);
            temp = '';
            $('.controls .button').removeClass('active')
            $('.phraseBookControl .button').removeClass('active')
        }
    } else {
        keyList[index].play();

        count++
        if (count >= sequence.length) {
            clearInterval(interval);
            temp = '';
            $('.controls .button').removeClass('active')
            $('.phraseBookControl .button').removeClass('active')
        }
    }
}

// Play function does the time setting with setInterval
function play(sequence, time) {
    stop();
    //Clean array elements with empty strings
    sequence = sequence.filter(item => item);

    temp = sequence;
    interval = setInterval('timeline(temp)', time);
}

// Stop function stops any currently scheduled sequences
function stop() {
    clearInterval(interval);
    count = 0;
    temp = '';
    $('.controls .button').removeClass('active');
    $('.phraseBookControl .button').removeClass('active');

    fadeout('.controls .button#stop');
    fadeout('.phraseBookControl .button#stop');
    fadeout('.options .button#stop');
}

//Arohanam Play
function arohanamPlay() {
    let arohanam = $('#arohanam').text().split(" ");
    play(arohanam, tempo);

    //Track Arohanam
    analytics.track('Played Arohanam', { sequence: arohanam });
}

//Avarohanam play
function avarohanamPlay() {
    let avarohanam = $('#avarohanam').text().split(" ");
    play(avarohanam, tempo);

    //Track Avarohanam
    analytics.track('Played Avarohanam', { sequence: avarohanam });
}

//Randomize play
// Generates a sequence of 300 notes and pushes them and their next two notes to an array totalling 900 notes.
function randomizePlay() {
    let arohanam = $('#arohanam').text().split(" ");
    arohanam[arohanam.length - 1] = "S̄";

    let avarohanam = $('#avarohanam').text().split(" ");
    avarohanam[0] = "S̄";
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

    //Mapping the random numbers with the moorchana to another array
    let randomSequenceNotes = [];
    for (let b = 0; b <= randomSequence.length - 1; b++) {
        randomSequenceNotes.push(moorchana[randomSequence[b]])
    }

    //Call the play() function to play the sequence
    play(randomSequenceNotes, tempo)

    //Track Random
    analytics.track('Played Random Sequence', { sequence: randomSequenceNotes });

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
        $(this).removeClass('active');

        // Track new phrase
        analytics.track('Added new phrase');
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

    $('#newPiano p').mousedown(function() {
        var keyName = $(this).attr('id').split('K');
        var key;

        for (i = 0; i < keyListPseudo.length; i++) {
            if (keyName[0].toUpperCase() == keyListPseudo[i]) {
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

        //Remove the pressed keys from other siblings if mouseup happens on a key other than the intended key but of same color
        $(this).siblings('.whiteKeyPressed').removeClass('whiteKeyPressed').addClass('whiteKey');
        $(this).siblings('.blackKeyPressed').removeClass('blackKeyPressed').addClass('blackKey');

    });

    //Disable and resume keyboard input on .phrase:focus and search:focus
    $(document).on('focus', '.phrase', function() {
        keyboardJS.pause();
    });

    $(document).on('blur', '.phrase', function() {
        keyboardJS.resume();
    });

    $(document).on('focus', '#search', function() {
        keyboardJS.pause();
    });

    $(document).on('blur', '#search', function() {
        keyboardJS.resume();
    });

});

// Phrase Delete button
function deletePhrase() {
    $('.phraseUnit.active').each(function() {
        $(this).remove();
    });

    fadeout('#deletePhrase');

    // Track phrase delete
    analytics.track('Deleted phrase');
}

function phraseBookPlay() {
    let sequence = [];
    let count = 0;
    let selection = window.getSelection().toString();
    // Firstly check if a text is highlighted. If it is, play it.
    if (typeof window.getSelection != "undefined" && selection.length > 0) {
        sequence = selection.replaceAll("\n", " ").replace(/\s\s+/g, ' ').replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").split(" ");
        play(sequence, tempo);
    } else {

        // If no phrase is highlighted, firstly, check how many phrases are selected
        $('.phraseBook.active > .phraseUnit').each(function() {
            // Play selected items
            if ($(this).hasClass('active')) {
                count++;
            }
        });

        // If one or more phrases are selected, play the selected items or play everything
        if (count > 0) {
            $('.phraseBook.active > .phraseUnit').each(function() {
                // Play selected items
                if ($(this).hasClass('active')) {
                    let phrase = $(this).children('.phrase').val().trim().replaceAll("\n", " ").replace(/\s\s+/g, ' ').replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").replaceAll("|", " ").split(" ");

                    sequence = sequence.concat(phrase);

                    if (sequence.length > 0) {
                        try {
                            play(sequence, tempo);
                        } catch (error) {
                            console.error("somethings wrong");
                        }
                    }
                    count++;
                } else {
                    $('#playPhrase').removeClass('active');
                }
            });
        } else {
            $('.phraseBook.active > .phraseUnit').each(function() {
                let phrase = $(this).children('.phrase').val().trim().replaceAll("\n", " ").replace(/\s\s+/g, ' ').replaceAll("1", "₁").replaceAll("2", "₂").replaceAll("3", "₃").replaceAll("|", " ").split(" ");
                sequence = sequence.concat(phrase);
                if (sequence) {
                    play(sequence, tempo);
                }
            });
        }
    }

    //Track Phraseplay
    analytics.track('Played phrase', { sequence: sequence });

}

// Phrasebook Save function using Local storage
function savePhrase() {
    let href = window.location.href.split('/');
    let raga_ = href.pop() || href.pop();
    let raga = raga_.replaceAll("%C4%80", "Ā").replaceAll("%C4%81", "ā").replaceAll("%20", " ").replaceAll("%C4%93", "ē")

    window.localStorage.removeItem(raga)
    var phrases_ = ''
    $('.phraseUnit').each(function() {
        phrases_ += "," + $(this).children('.phrase').val();
    });

    let phrases = phrases_.substring(1);
    window.localStorage.setItem(raga, phrases);

    $('h4 span').hide();

    $('#toastMessages').text('Your phrases are being saved');
    setTimeout(function() {
        $('#toastMessages').text('');
    }, 1000)

    fadeout('#savePhrase');

    // Track save phrase
    analytics.track('Saved Phrases');
}

// Octave convertion functions
// const keyList = ['S̱', 'Ṟ₁', 'Ṟ₂', 'G̱₂', 'G̱₃', 'M̱₁', 'M̱₂', 'P̱', 'Ḏ₁', 'Ḏ₂', 'Ṉ₂', 'Ṉ₃', 
// 'S', 'R₁', 'R₂', 'G₂', 'G₃', 'M₁', 'M₂', 'P', 'D₁', 'D₂', 'N₂', 'N₃', 
// 'S̄', 'R̄₁', 'R̄₂', 'Ḡ₂', 'Ḡ₃', 'M̄₁', 'M̄₂', 'P̄', 'D̄₁', 'D̄₂', 'N̄₂', 'N̄₃', 'Ṡ', '-'];

function minusOne() {
    let selection = window.getSelection().toString();
    if (typeof window.getSelection != "undefined" && selection.length > 0) {

        var isT = window.getSelection().containsNode(textarea, true);
        if (isT) {
            $(this).attr('id', 'highlighted');
        }

        let options = {
            'S': 'S̱',
            'S̄': 'S̱',
            'R': 'Ṟ',
            'R̄': 'Ṟ',
            'G': 'G̱',
            'Ḡ': 'G̱',
            'M': 'M̱',
            'M̄': 'M̱',
            'P': 'P̱',
            'P̄': 'P̱',
            'D': 'Ḏ',
            'D̄': 'Ḏ',
            'N': 'Ṉ',
            'N̄': 'Ṉ'
        }

        for (const key in options) {
            selection = selection.replaceAll(key, options[key])
        }

        replaceSelectedText(selection);
    }
}


// Variable tempo
function time() {
    let bpm = parseInt($('#tempo').val());
    if (bpm > 600) {
        $('#tempo').val('600');
    } else if (bpm < 50) {
        $('#tempo').val('50');
    }

    let ms = 60000 / bpm;
    if (!Number.isNaN(ms)) {
        tempo = ms;
    }
}
time()

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

        //Track Unfavorited
        analytics.track('Unfavorited', { raga: raga });

    } else {
        window.localStorage.setItem(key, 'fav_true');
        $('#favourite').addClass('fav_true');
        $('#favourite').removeClass('fav_false');

        //Track Favorited
        analytics.track('Favorited', { raga: raga });
    }
}

//Resize phrasebook features
function enlargePhraseBook() {
    $('.phraseBook').addClass('enlarge');
    $('.resize').removeClass('fa-expand').addClass('fa-compress-alt').attr('onclick', "minimizePhraseBook()");
    $('body').css('overflow-y', 'hidden');
}

function minimizePhraseBook() {
    $('.phraseBook').removeClass('enlarge');
    $('.resize').addClass('fa-expand').removeClass('fa-compress-alt').attr('onclick', "enlargePhraseBook()");
    $('body').css('overflow-y', 'scroll');
}

//Clear Swaras help when there is no Raga selected
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

function fadeout(id) {
    setTimeout(function() {
        $(id).removeClass('active');
    }, 1000);
}

$('#piano').on('click', function() {
    if (!$(this).hasClass('active')) {
        $('#pianoWrapper').addClass('active');
        $('#screen').addClass('active');
        $(this).addClass('active');

    } else {
        $('#pianoWrapper').removeClass('active');
        $('#screen').removeClass('active');
        $(this).removeClass('active');
    }
})