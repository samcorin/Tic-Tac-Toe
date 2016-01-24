
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

var Player = function(name, id) {
    this.name = name;
    this.id = id;
    this.moves = [];
    this.movesInCombo = [];
    this.score = 0;
}
Player.prototype.reset = function() {
    this.moves = [];
    this.movesInCombo = [];
}

var player = new Player('player', 'X');
var computer = new Player('computer', '0');

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
    if(Math.random() > 0.5) {
        computer_move();
    }

    function check_for_move(who) {
        combinations.forEach(function(val, i) {
            var count = 0;
            for (var i = 0; i < who.moves.length; i++) {
                if(val.indexOf(who.moves[i]) != -1) {
                    count++;
                };
                if(count == 3) {
                    can_move = false;
                    win(val, who);
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

    function win(val, who) {
        who.score++;
        console.log(who.id + " WINS!");
        $("td").prop("disabled", true);
        
        val.forEach(function(a) {
            $('#' + a).addClass('winner');
        })
        setTimeout(function() {
            restart();
        }, 300)
    }

    function restart() {
        console.log('GAME OVER');
        $("td").prop("disabled", true);
        
        setTimeout(function() {
            $("#restart").trigger('click');
        }, 400);
    }

    function add_to_html(id, who) {
        $('#'+id).html("<p>" + who.id + "</p>");
        board_copy.splice(board_copy.indexOf(id), 1);
        who.moves.push(id);
    }

    function computer_move() {
        can_move = true;
        if(computer.moves.length >= 2) {
            check_for_move(computer);
        }

        if(player.moves.length >= 2 && can_move) {
            check_for_move(player);
        };

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
            setTimeout(function() {
                computer_move();
            }, time+=150)
            
            if(board_copy.length == 0) {
                setTimeout(function() {
                    restart();
                }, 300)
            }
        }
    })

    // RESET GAME
    $("#restart").click(function() {
        $('.player_score').text(player.score);
        $('.computer_score').text(computer.score);
        board_copy = board.slice();
        can_move = true;
        player.reset();
        computer.reset();
        $("td").prop("disabled", false);
        $("td").each(function() {
            $(this).removeClass('winner').text("");
        });
    });
});