const
    [
        Game,
        HardLogicPlayer,
        RegularPlayer,
        RandomPlayer,
    ] = [
            require(`./Game/Game`),
            require(`./Game/Players/HardLogicPlayer`),
            require(`./Game/Players/RegularPlayer`),
            require(`./Game/Players/RandomPlayer`),
        ];

let
    simulation = (numSim, players) => {
        let
            blue = false,
            red = true,
            stats = {
                playerStats: {
                    p0: {
                        name: players[0].name.slice(5, players[0].name.length - 5),
                        color: blue,
                        captures: 0,
                        submissions: 0,
                    },
                    p1: {
                        name: players[1].name.slice(5, players[1].name.length - 5),
                        color: red,
                        captures: 0,
                        submissions: 0,
                    },
                },
                flagStats: {
                    games: 0,
                    board: [
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    ],
                },
            },
            i = 0,
            newPlayers,
            playerTypes = [HardLogicPlayer, RandomPlayer, RegularPlayer]

        console.log(`RUNNING...`);

        while (i < numSim) {
            if (i % 100 == 0) console.log(`${i}/${numSim} GAMES PLAYED...`);
            newPlayers = []
            for (let i = 0; i < players.length; i++) {
                for (let j = 0; j < playerTypes.length; j++) {
                    if (players[i] instanceof playerTypes[j]) {
                        newPlayers.push(new playerTypes[j](players[i].name, players[i].color))
                    }
                }
            }
            game = new Game(
                newPlayers,
                true,
                stats
            );
            i++;
        }
        stats.playerStats.p0.total = stats.playerStats.p0.captures + stats.playerStats.p0.submissions;
        stats.playerStats.p1.total = stats.playerStats.p1.captures + stats.playerStats.p1.submissions;
        console.table(stats.playerStats);
    },
    play = (players) => {
        game = new Game(players, false);
    },
    main = () => {
        // play([
        //     new RegularPlayer(`Griffin`, false),
        //     new HardLogicPlayer(`HardLogicPlayer`, true),
        // ]);

        play([
            new HardLogicPlayer(`HardLogicPlayer`, false),
            new RandomPlayer(`RandomPlayer`, true),
        ]);
        // play([
        //     new RandomPlayer(`RandomPlayer`, false),
        //     new HardLogicPlayer(`HardLogicPlayer`, true),
        // ]);
        // simulation(500, [new HardLogicPlayer(`HardLogicPlayer`, false), new RandomPlayer(`RandomPlayer`, true)]);
    }

main();
