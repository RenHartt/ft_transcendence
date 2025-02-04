    let players = [];
    let matches = []
    let currentMatchIndex = 0;
    let tournament = false;
    const MAX_PLAYERS = 4;
    let finalists = [];
    let matchInProgress = false; // Empêche les matchs de se lancer en boucle
    let isFinal = false;

    function showPopupTour(title, message, type, callback = null) {
        let existingPopup = document.querySelector(".popup");
        if (existingPopup) existingPopup.remove(); // Supprime une popup déjà existante
    
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <h2>${title}</h2>
            <p>${message}</p>
            <button id="closePopup">OK</button>
        `;
    
        document.body.appendChild(popup);
    
        document.getElementById("closePopup").addEventListener("click", () => {
            popup.remove();
            setTimeout(() => {
                if (callback) callback(); // Exécute le callback après un court délai
            }, 300);
        });
    }
    

    function startPongGameTournanment() {
        let canvas = document.createElement("canvas");
        let pongContainer = document.getElementById("pong-container");
        canvas.width = 500;
        canvas.height = 300;
        let ctx = canvas.getContext("2d");
        pongContainer.innerHTML = "";
        pongContainer.appendChild(canvas);
        gameState.generalScore = {};
        
        let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
        let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex'));
        if (currentIndex < storedMatches.length) {
            const [player1, player2] = storedMatches[currentIndex];

            gameState.generalScore[player1] = gameState.generalScore[player1] || 0;
            gameState.generalScore[player2] = gameState.generalScore[player2] || 0;

            gameState.scoreP1 = 0;
            gameState.scoreP2 = 0;
        } else if (currentIndex == storedMatches.length) {
            let finalists = JSON.parse(localStorage.getItem('finalists'));
            let player1 = finalists[0];
            let player2 = finalists[1];
            gameState.generalScore[player1] = gameState.generalScore[player1] || 0;
            gameState.generalScore[player2] = gameState.generalScore[player2] || 0;
        
            gameState.scoreP1 = 0;
            gameState.scoreP2 = 0;
        }

        gameState.gameRunning = true;

        const paddleWidth = 8;
        const paddleHeight = 60;
        const paddleSpeed = 6;
        const ballSize = 14;
        
        let playerY = canvas.height / 2 - paddleHeight / 2;
        let aiY = playerY;
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp") window.upPressed = true;
            if (e.key === "ArrowDown") window.downPressed = true;
            if (e.key === "w") window.wPressed = true;
            if (e.key === "s") window.sPressed = true;
        });
        document.addEventListener("keyup", (e) => {
            if (e.key === "ArrowUp") window.upPressed = false;
            if (e.key === "ArrowDown") window.downPressed = false;
            if (e.key === "w") window.wPressed = false;
            if (e.key === "s") window.sPressed = false;
        });

        function resetBall() {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
        }

        function update() {
            if (!gameState.gameRunning) return;
            
            if (window.wPressed && playerY > 0) playerY -= paddleSpeed;
            if (window.sPressed && playerY < canvas.height - paddleHeight) playerY += paddleSpeed;
            if (window.upPressed && aiY > 0) aiY -= paddleSpeed;
            if (window.downPressed && aiY < canvas.height - paddleHeight) aiY += paddleSpeed;

            ballX += gameState.BallSpeedX;
            ballY += gameState.BallSpeedY;

            if (ballY <= 0 || ballY >= canvas.height - ballSize) {
                gameState.BallSpeedY *= -1;
            }
            
            if (
                ballX <= paddleWidth &&
                ballY >= playerY &&
                ballY <= playerY + paddleHeight
            ) {
                gameState.BallSpeedX *= -1;
                ballX = paddleWidth + 1;
            }
            if (
                ballX >= canvas.width - paddleWidth - ballSize &&
                ballY >= aiY &&
                ballY <= aiY + paddleHeight
            ) {
                gameState.BallSpeedX *= -1;
                ballX = canvas.width - paddleWidth - ballSize - 1;
            }

            if (ballX <= 0) {
                gameState.scoreP2++;
                resetBall();
            }
            if (ballX >= canvas.width) {
                gameState.scoreP1++;
                resetBall();
            }
        }

        function updateScore() {
            const pongScore = document.getElementById("pong-score");
            if (!gameState.gameRunning) return;
        
            let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
            let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex'));
            let player1 = "";
            let player2 = "";
            
            if (currentIndex < storedMatches.length) {
                [player1, player2] = storedMatches[currentIndex];
                if (pongScore) {
                    pongScore.textContent = `Score: ${player1}=${gameState.generalScore[player1]} - ${player2}=${gameState.generalScore[player2]}`;
                }
            } else if (currentIndex == storedMatches.length) {
                let finalists = JSON.parse(localStorage.getItem('finalists'));
                player1 = finalists[0];
                player2 = finalists[1];
                if (pongScore) {
                    pongScore.textContent = `Score: ${player1}=${gameState.generalScore[player1]} - ${player2}=${gameState.generalScore[player2]}`;
                }
            }
        
            if (gameState.scoreP1 >= 1) {
                gameState.generalScore[player1]++;
                gameState.scoreP1 = 0;
                gameState.scoreP2 = 0;
            
            } else if (gameState.scoreP2 >= 1) {
                gameState.generalScore[player2]++;
                gameState.scoreP1 = 0;
                gameState.scoreP2 = 0;

            }
            let index = localStorage.getItem('currentMatchIndex');
            let finalists = localStorage.getItem('finalists');
            finalists = finalists ? JSON.parse(finalists) : []; 

            if (gameState.generalScore[player1] >= 1) {
                showPopup("Bravo", `${player1} gagne la partie !`, "success");
                index++;
                console.log("incr", index);
                finalists[index - 1] = player1; 
                localStorage.setItem('currentMatchIndex', JSON.stringify(index));
                localStorage.setItem('finalists', JSON.stringify(finalists)); 
                stopGameTournament();
                if (index == 3) {
                    showPopup("Bravo", `${player1} remporte le tournoi !`, "success", false);
                }
            } else if (gameState.generalScore[player2] >= 1) {
                showPopup("Bravo", `${player2} gagne la partie !`, "success");
                index++;
                console.log("incr", index);
                finalists[index - 1] = player2; 
                localStorage.setItem('currentMatchIndex', JSON.stringify(index));
                localStorage.setItem('finalists', JSON.stringify(finalists)); 
                stopGameTournament();
                if (index == 3) {
                    showPopup("Bravo", `${player2} remporte le tournoi !`, "success", false);
                }
            }
        }
        


        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = gameState.basecolor;

            ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
            ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);
            ctx.beginPath();
            ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";  
            ctx.fillText(`P1: ${gameState.scoreP1}`, 50, 20);
            ctx.fillText(`P2: ${gameState.scoreP2}`, canvas.width - 70, 20);
        }

        function gameLoop() {
            if (!gameState.gameRunning) return;
            update();
            draw();
            updateScore();
            requestAnimationFrame(gameLoop);
        }

        gameLoop();
    }

    function addPlayer() {
        const input = document.getElementById('player-name');
        const playerName = input.value.trim();
        
        if (playerName && !players.includes(playerName) && players.length < MAX_PLAYERS) {
            players.push(playerName);
            updatePlayerList();
            input.value = '';
        } else if (players.length >= MAX_PLAYERS) {
            showPopup("Error", "4 players max", "error");
        }
    }

    function updatePlayerList() {
        const list = document.getElementById('player-list');
        list.innerHTML = '';
        players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player;
            list.appendChild(li);
        });
        document.getElementById('start-tournament').disabled = players.length < 2;
    }

    function generateTournamentBracket() {
        matches = [];
        const totalPlayers = players.length;
        
        if (totalPlayers !== MAX_PLAYERS) {
            console.warn("Il faut exactement 4 joueurs pour le tournoi.");
            return;
        }
        
        matches.push([players[0], players[1]]);
        matches.push([players[2], players[3]]);

        localStorage.setItem('tournamentMatches', JSON.stringify(matches));
        localStorage.setItem('currentMatchIndex', JSON.stringify(0));
        localStorage.setItem('finalists', JSON.stringify([]));
    }


    function startTournament() {
        if (players.length !== MAX_PLAYERS) {
            console.warn("Le tournoi doit avoir exactement 4 joueurs !");
            return;
        }
        let currentIndex = 0;
        localStorage.setItem('currentMatchIndex', JSON.stringify(currentIndex));
        const button = document.getElementById('startGameButton');
        button.style.display = "none";   
        localStorage.setItem('tournamentPlayers', JSON.stringify(players));
    
        generateTournamentBracket();
    
        console.log("Tournoi démarré !");

        startNextMatch();
    }
    
    function startNextMatch() {
        if (matchInProgress) return;
        matchInProgress = true;
    
        let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
        let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex'));
        let finalists = JSON.parse(localStorage.getItem('finalists'));
    
        // if (finalists.length === 2) {
        //     console.log("🏆 Deux finalistes trouvés, lancement de la finale !");
        //     startFinal();
        //     return;
        // }
        console.log("🔵 Prochain match...");
        console.log(storedMatches.length);
        console.log(currentIndex);
        console.log(finalists);
    
        if (currentIndex < storedMatches.length) {
            const [player1, player2] = storedMatches[currentIndex];
    
            console.log(`🔵 Match ${currentIndex + 1}: ${player1} vs ${player2}`);
            console.log("➡️ Attente de la déclaration du gagnant...");
            togglePongOverlay();
        } else if (currentIndex == storedMatches.length) {
            let player1 = finalists[0];
            let player2 = finalists[1];
            isFinal = true;
            console.log(`🔵 Match final: ${player1} vs ${player2}`);
            console.log("➡️ Attente de la déclaration du gagnant...");
            togglePongOverlay();
        } else {
            console.warn("❌ Problème : aucun match trouvé.");
            return;
        }
    
        matchInProgress = false;
    }
    


    function stopGameTournament() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        gameState.gameRunning = false;
        gameState.startGame = false;
        gameState.aiScore = 0;

        let canvas = document.getElementById("pongCanvas");
        let stopGameButton = document.getElementById("stopGameButton");
        let pongScore = document.getElementById("pong-score");
        let index = localStorage.getItem('currentMatchIndex');
        let nextButton = document.getElementById("next-game");

        console.log("Game stopped");
        multiplayer = false;
        if (canvas) canvas.style.display = "none";
        if (stopGameButton) stopGameButton.style.display = "none";
        if (pongScore) pongScore.style.display = "none";
        if (index == 3) {
            nextButton.style.display = "none";
        } else if (index > 0) {
            nextButton.style.display = "block";
        } else {
            nextButton.style.display = "none";
        }
    }

    function startFinal() {
        if (matchInProgress) return;
        matchInProgress = true;
    
        let finalists = JSON.parse(localStorage.getItem('finalists')) || [];
    
        if (finalists.length !== 2) {
            console.warn("❌ Problème : la finale ne peut pas commencer.");
            matchInProgress = false;
            return;
        }
    
        console.log(`🏆 Finale : ${finalists[0]} vs ${finalists[1]}`);
    
        matches = [[finalists[0], finalists[1]]];
        localStorage.setItem('tournamentMatches', JSON.stringify(matches));
        localStorage.setItem('currentMatchIndex', JSON.stringify(0));
    
        setTimeout(() => {
            startNextMatch();
        }, 1000);
    }

    function togglePongOverlay() {
        const pongWrapper = document.getElementById('pong-wrapper');
        const pongContainer = document.getElementById('pong-container');
        const pongScore = document.getElementById('pong-score');
        const tournamentSection = document.getElementById('tournament-section');
        const nextButton = document.getElementById("next-game");
        let index = localStorage.getItem('currentMatchIndex');
        if (index) {
            nextButton.style.display = "block";
        }


        if (!pongWrapper || !pongContainer || !pongScore) return;

        if (pongWrapper.style.display === "block" && index == 3) {
            stopGameTournament();                   
            pongContainer.innerHTML = '';  
            pongWrapper.style.display = "none";
            return;
        }
        
        pongWrapper.style.display = "block";
        stopGameButton.style.display = "block";
        pongScore.style.display = "block";
        tournamentSection.classList.add("hidden");
        tournament = true;

        startPongGameTournanment();
    }

    function showPongTournament() {
        const pongContainer = document.getElementById('pong-container');
        const pongWrapper = document.getElementById('pong-wrapper');
        const historyContainer = document.getElementById('history-container');
        const profileContainer = document.getElementById('profile-container');
        const changePasswordContainer = document.getElementById('change-password-form');
        const tournamentSection = document.getElementById("tournament-section");
        const addFriendForm = document.getElementById('friend-request-form');
        const profileEditForm = document.getElementById('profile-edit-form');
        const settingsContainer = document.getElementById('settings-container');
        const fourPlayerButton = document.getElementById('fourPlayerButton');
        const twoPlayerButton = document.getElementById('twoPlayerButton');
    
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") addPlayer();
        });
    
        if (!tournamentSection) return;
    
        tournamentSection.classList.toggle("hidden");
    
        if (!tournamentSection.classList.contains("hidden")) {
            if (pongWrapper) pongWrapper.style.display = "none";
            if (pongContainer) pongContainer.innerHTML = ''; // Vide le contenu
    
            stopGameTournament();
            historyContainer.classList.add("hidden");
            profileContainer.classList.add("hidden");
            changePasswordContainer.classList.add("hidden");
            addFriendForm.classList.add("hidden");
            profileEditForm.classList.add("hidden");
            settingsContainer.classList.add("hidden");
            twoPlayerButton.style.display = "none";
            fourPlayerButton.style.display = "none";
        }
    }

    function saveGameHistory(winner) {
        let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        
        const match = {
            players: [...players],
            winner: winner || "Unknown", 
            timestamp: new Date().toLocaleString()
        };

        gameHistory.push(match);
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
        updateGameHistoryUI();
    }

    function updateGameHistoryUI() {
        const historyContainer = document.getElementById('game-history');
        historyContainer.innerHTML = ''; 

        let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        
        gameHistory.forEach((match, index) => {
            const li = document.createElement('li');
            li.textContent = `Match ${index + 1} | Joueurs: ${match.players.join(", ")} | Gagnant: ${match.winner}`;
            historyContainer.appendChild(li);
        });
    }

    function declareWinner(winnerName) {
        if (!players.includes(winnerName)) {
            console.warn("⚠️ Le gagnant n'est pas un joueur du tournoi !");
            return;
        }
    
        if (matchInProgress) return;
        matchInProgress = true;
    
        let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
        let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex')) || 0;
        let finalists = JSON.parse(localStorage.getItem('finalists')) || [];
    
        const [player1, player2] = storedMatches[currentIndex];
    
        const match = {
            players: [player1, player2],
            winner: winnerName,
            timestamp: new Date().toLocaleString()
        };
    
        let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        gameHistory.push(match);
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    
        console.log(`✅ Match ${currentIndex + 1} terminé. Gagnant: ${winnerName}`);
    
        // Ajoute le gagnant aux finalistes
        finalists.push(winnerName);
        localStorage.setItem('finalists', JSON.stringify(finalists));
    
        currentIndex++;
        localStorage.setItem('currentMatchIndex', JSON.stringify(currentIndex));
    
        // Affiche la popup avant de passer au match suivant
        showPopupTour("Bravo", `${winnerName} remporte le match !`, "success", () => {
            matchInProgress = false; // Réactive les matchs suivants
            if (finalists.length === 2) {
                startFinal();
            } else {
                startNextMatch();
            }
        });
    }
    

    function endTournament(winnerName) {
        if (!winnerName) {
            console.warn("Aucun gagnant défini !");
            return;
        }

        declareWinner(winnerName);
        players = []; 
        updatePlayerList();
    }

    function resetTournament() {
        players = [];
        updatePlayerList();

        localStorage.removeItem('tournamentPlayers');

        localStorage.removeItem('gameHistory');
        updateGameHistoryUI();

        stopGameTournament();
        const tournamentSection = document.getElementById('tournament-section');
        if (tournamentSection) {
            tournamentSection.classList.remove("hidden");
        }

        const pongWrapper = document.getElementById('pong-wrapper');
        if (pongWrapper) {
            pongWrapper.style.display = "none";
        }
    }

