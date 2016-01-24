
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
// var move_number = 0;
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
    
    // Random start
    // if(Math.random() > 0.5) {
    //     computer_move();
    // }

    function win(val) {
        
        // This is where the modularized ai() could come in handy
        // All we're doing is iterating over the combination just used?
        // Stop the game
            
        $("td").prop("disabled", true);
        
        val.forEach(function(a) {
            $('#' + a).addClass('avail');
        })

    }


    // After player click, add to board
    function add_to_html(id, who) {
        $('#'+id).html("<p>" + who.id + "</p>");
        board_copy.splice(board_copy.indexOf(id), 1);
        who.moves.push(id);

        // if (move_array.length == 3) {
        //     running = false;
        //     console.log("Player " + id + " has just won. give up. Winning combination was: " + combo);
            
        //     combo.forEach(function(a) {
        //         $('#' + a).addClass('avail');
        //     });
            
        //     setTimeout(function() {
        //         $('#restart').trigger('click');
        //     },1500);

    }

    function ai(who) {
        var who = who || player;
        // exit the function if computer already made a move.
        can_move = true;


        // This checks if 'player' has a potential winning move.
        if(player.moves.length >= 2) {
            // Match the combination where player potentially has 2/3
            combinations.forEach(function(val, i) {
                var count = 0;
                
                for (var i = 0; i < player.moves.length; i++) {
                    if(val.indexOf(player.moves[i]) != -1) {
                        count++;
                    };


                    // This also has to work for the computer
                    if(count == 3) {
                        win(val);
                    };

                    // Runs into the problem whereby a count of two doesn't recognize if the combination is full
                    if(count == 2) {
                        var make_move = val.filter(function(v,i) {
                            return player.moves.indexOf(v) < 0;
                        });

                        if(make_move && can_move && $('#'+make_move).is(":empty")) {
                            
                            can_move = false;
                            add_to_html(make_move, computer);
                        }
                    }

                };
            });
        };

    };

    // Is this redundant?
    function computer_move() {
        
        // var who = who || player;
        // exit the function if computer already made a move.
        can_move = true;


        // This checks if 'player' has a potential winning move.
        if(player.moves.length >= 2) {
            // Match the combination where player potentially has 2/3
            combinations.forEach(function(val, i) {
                var count = 0;
                
                for (var i = 0; i < player.moves.length; i++) {
                    if(val.indexOf(player.moves[i]) != -1) {
                        count++;
                    };


                    // This also has to work for the computer
                    if(count == 3) {
                        win(val);
                    };

                    // Runs into the problem whereby a count of two doesn't recognize if the combination is full
                    if(count == 2) {
                        var make_move = val.filter(function(v,i) {
                            return player.moves.indexOf(v) < 0;
                        });

                        if(make_move && can_move && $('#'+make_move).is(":empty")) {
                            
                            can_move = false;
                            add_to_html(make_move, computer);
                        }
                    }

                };
            });
        };

        // Defaults to random move
        if(can_move) {
            var randomMove = board_copy[Math.floor(Math.random()* board_copy.length)];
            add_to_html(randomMove, computer);
        }

    }

    // Main activity
    $("td").click(function(event) {
        if ($(event.target).is(":empty")) {
            var time = 100;
            var target = event.target;
            add_to_html(target.id, player);
            computer_move();

            
            if(board_copy.length == 0) {
                console.log('GAME OVER');
                $("td").prop("disabled", true);
                
                setTimeout(function() {
                    $("#restart").trigger('click');
                }, 400);
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