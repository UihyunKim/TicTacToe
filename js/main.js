// jshint esversion: 6
$(document).ready(function() {
    // click 'start'
    $('#start').submit(function (e) {
        e.preventDefault();
        console.log($('.select1 input[type="radio"]:checked').val());
        console.log($('.select2 input[type="radio"]:checked').val());

        // show dashboard
        $('header.dashboard').css('visibility', 'initial');

        // change phase1 -> 2
        phase.toggle('phase2');

        // SELECT1 marking me.vs && you.are
        var s1Val = $('.select1 input[type="radio"]:checked').val();
        me.vs = s1Val.indexOf('com') >= 0 ? 'com' : 'user';
        you.are = me.vs;

        if (s1Val.indexOf('com') >= 0) {
            // on dashboard
            $('.user.you .turn').text('').text('com');

            // on data
            me.vs = 'com';
            you.are = 'com';

        } else if (s1Val.indexOf('user') >= 0) {
            // on dashboard
            $('.user.you .turn').text('').text('user');

            // on data
            me.vs = 'user';
            you.are = 'user';

        }


        // SELECT2 marking me.player && you.player on data
        var s2Val = $('.select2 input[type="radio"]:checked').val();
        // SELECT2 marking players on dashboard && data
        if (s2Val.indexOf('o') >= 0) {
            // on dashboard
            $('.user.me .player i').removeClass().addClass('fa fa-circle');
            $('.user.you .player i').removeClass().addClass('fa fa-times');

            // on data
            me.player = 'o';
            you.player = 'x';
        } else if (s2Val.indexOf('x') >= 0) {
            // on dashboard
            $('.user.me .player i').removeClass().addClass('fa fa-times');
            $('.user.you .player i').removeClass().addClass('fa fa-circle');

            // on data
            me.player = 'x';
            you.player = 'o';
        }

        dashboard.nextTurn();

        console.log('me.player: ' + me.player);
        console.log('you.player: ' + you.player);

        // if "com" && "x" at first turn
        if (you.player == 'x' && you.are == 'com') {
            you.auto();
        }
    });

    // click 'continue'
    $('header .continue').click(function (e) {
        e.preventDefault();
        // hide continue button
        $(this).hide();
        // add 'selectable' class on all pads
        $('.pads').removeClass("selectable");
        $('.pads').addClass("selectable");
        // empty check arrays
        me.check = [];
        you.check = [];
        // ini fa-icons on pads
        $('.pads i').removeClass();
        // after win(game.over)
        // remove yellow background-color
        $('.pads').css('background-color', 'white');

        // if "com" && "x" at first turn
        if (you.player == 'x' && you.are == 'com') {
            you.auto();
        }

        // hide continue button
        $('.continue').hide();
    })

    // click 'reset all'
    $('div.reset').click(function (e) {
        e.preventDefault();
        // add 'selectable' class on all pads
        $('.pads').removeClass("selectable");
        $('.pads').addClass("selectable");
        // init score
        $('.score').text('0');
        // init score arrays
        me.score = 0;
        you.score = 0;
        // hidden dashboard
        $('header.dashboard').css('visibility', 'hidden');
        // phase 2 -> 1
        phase.toggle('phase1')
        // empty check arrays
        me.check = [];
        you.check = [];
        // ini fa-icons on pads
        $('.pads i').removeClass();
        // after win(game.over)
        // remove yellow background-color
        $('.pads').css('background-color', 'white');
    });

    // click pads
    $('.pads.selectable').click(function (e) {
        if (!$(this).hasClass('selectable')) {
            return false;
        }
        // making unselectable, marking checked following its player(o, x)
        $(this).removeClass('selectable');
        $('i', this).addClass('fa fa-' + (turn.next().player === 'x' ? 'times' : 'circle'));

        // add number on ~.check array
        turn.next().check.push(+this.id.replace(/\D/g,''));
        console.log('me.check' + ' : ' + me.check);
        console.log('you.check' + ' : ' + you.check);

        // check if winner exist
        console.log("who's turn.next: " + turn.next().string);
        console.log("who's turn.prev: " + turn.prev().string);
        console.log("turn.prev().check: " + turn.prev().check);
        if (game.winner(turn.prev().check)) {
            console.log("Game Over!!!");
            console.log(game.winNumbers);
            game.over();

            // prevent click from next turn
            $('.pads').removeClass("selectable");
        } else {
            if (game.tie()) {
                // display continue button
                $('header .continue').show();
            } else {
                // you.auto when com's turn
                if (turn.next().string == 'you' && you.are == 'com') {
                    you.auto();
                }

                // changing next turn on dashboard
                dashboard.nextTurn();
            }

        }
    })

    // begin the game
    var dashboard = {
        nextTurn: function () {
            // marking "who's turn" between two
            $('.user .player i').css('color', 'lightgray');
            $('.user.' + turn.next().string + ' .player i').css('color', 'black');
        }
    };

    var phase = {
        // This always has parameter, phase1 or phase2
        toggle: function (parem) {
            if (parem === 'phase1') {
                $('.phase1').css('display', 'block');
                $('.phase2').css('display', 'none');
            } else if (parem === 'phase2') {
                $('.phase1').css('display', 'none');
                $('.phase2').css('display', 'flex');
            } else {
                console.log("parem of f(toggle) is invalid");
            }
        }
    };

    var pads = {
    }

    var game = {
        // winning condition
        // horizontal(-): 123, 456, 789
        // vertical(|): 147, 258, 369
        // diagonal(X): 159, 357
        wins: ['123', '456', '789', '147', '258', '369', '159', '357'],
        winner: function (candidate) {
            for (var win of this.wins) {
                var result = [];
                for (var el of win.split('')) {
                    if (candidate.indexOf(+el) >= 0) {
                        console.log("el found!: " + el);
                        result.push(el);
                    } else {
                        break;
                    }
                }
                if (result.length === 3) {
                    this.winNumbers = result;
                    return result;
                }
            }
            return false;
        },
        winNumbers: null,
        over: function () {
            // making winnumbs noticeable
            for (var el of this.winNumbers) {
                var $id = '#pad' + el;
                $($id).css('background-color', 'yellow');
            }
            // update score
            turn.prev().score++;
            console.log("turn.prev().score: " + turn.prev().score);
            var $score = '.user.' + turn.prev().string + ' .score';
            $($score).text(turn.prev().score);
            // display continue button
            $('header .continue').show();
        },
        tie: function () {
            console.log("check: " + me.check.length, you.check.length);
            return me.check.length + you.check.length === 9 ? true : false;
        }
    }

    var turn = {
        next: function () {
            // if on same race, x turn
            if(me.check.length === you.check.length) {
                return me.player === 'x' ? me : you;
            }
            // if on different race, small number turn
            else {
                return me.check.length < you.check.length ? me : you;
            }
        },
        // just reverse the return value of turn.next
        prev: function () {
            return this.next() === me ? you : me;
        }
    }

    var me = {
        string: 'me',
        vs: null,
        player: null,
        score: 0,
        marker: null,
        check: []
    };

    var you = {
        string: 'you',
        are: null,
        player: null,
        score: 0,
        marker: null,
        check: [],
        auto: function () {
            // making random number between 1 ~ 9
            do {
                var num = Math.floor(Math.random() * 9) + 1;
                var pad = '#pad' + num;
            } while (!$(pad).hasClass('selectable'));
            $(pad).trigger('click');
        }
    };




}); // end of document
