
var board = ["tl", "tc", "tr", "ml", "mc", "mr", "bl", "bc", "br"];
var combinations = [
    ["tl", "tc", "tr"],
    ["ml", "mc", "mr"],
    ["bl", "bc", "br"],
    ["tl", "mc", "br"],
    ["tr", "mc", "bl"],
    ["tl", "ml", "bl"],
    ["tc", "mc", "bc"],
    ["tr", "mr", "br"]
];
var board_copy = board.slice();
var can_move = true;
var time = 100;
var player = {
        name: 'player',
        id: 'X',
        moves: [],
        movesInCombo: []
    },
    computer = {
        name: 'computer',
        id: '0',
        moves: [],
        movesInCombo: []
    };

$(document).ready(function() {
    
    $(".options").click(function(event) {
        player.id = event.target.id;
        if (player.id == '0') {
            player.id = '0';
            computer.id = 'X';
        } else {
            player.id = 'X';
            computer.id = '0';
        }
    });

    // Random start
    // if(Math.random() > 0.5) {
    //     computer_move();
    // }


    function check_for_move(who) {
        combinations.forEach(function(val, i) {
            var count = 0;
            
            for (var i = 0; i < who.moves.length; i++) {
                if(val.indexOf(who.moves[i]) != -1) {
                    count++;
                };

                if(count == 3) {
                    win(val);
                };

                if(count == 2) {  
                    var make_move = val.filter(function(v,i) {
                        return who.moves.indexOf(v) < 0;
                    });

                    if(make_move && can_move && $('#'+make_move).is(":empty")) {
                        can_move = false;
                        add_to_html(make_move[0], computer);
                    }
                }
            };
        });
    }

    function win(val) {
        $("td").prop("disabled", true);
        
        val.forEach(function(a) {
            $('#' + a).addClass('avail');
        })
        restart();
    }

    function restart() {
        console.log('GAME OVER');
        $("td").prop("disabled", true);
        
        setTimeout(function() {
            $("#restart").trigger('click');
        }, 400);
    }

    // After player click, add to board
    function add_to_html(id, who) {
        $('#'+id).html("<p>" + who.id + "</p>");
        board_copy.splice(board_copy.indexOf(id), 1);
        who.moves.push(id);
    }

    function computer_move() {
        // exit the function if computer already made a move.
        can_move = true;

        // This and the player conditions are redundant
        if(computer.moves.length >= 2) {
            check_for_move(computer);
        }

        if(player.moves.length >= 2 && can_move) {
            check_for_move(player);
        };

        // Defaults to random move
        if(can_move) {
            var randomMove = board_copy[Math.floor(Math.random()* board_copy.length)];
            add_to_html(randomMove, computer);
            // check for the win here?
        }
    }

    // Main activity
    $("td").click(function(event) {
        if ($(event.target).is(":empty")) {
            var target = event.target;
            add_to_html(target.id, player);
            computer_move();
            if(board_copy.length == 0) {
                restart();
            }
        }
    })

    // RESET GAME
    $("#restart").click(function() {
        board_copy = board.slice();
        can_move = true;
        player.moves = [];
        player.movesInCombo = [];
        computer.moves = [];
        computer.movesInCombo = [];
        $("td").prop("disabled", false);
        $("td").each(function() {
            $(this).removeClass('avail').removeClass('loser').text("");
        })
    })
});