const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const morgan = require('morgan');
//const helmet = require('helmet');

// DB
const low = require('lowdb');
const shortid = require('shortid')
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync('game.json'))
db.defaults({ questions: [] }).write();

// Express App
const app = express();
const port = process.env.PORT || 5012;
//app.use(helmet());
app.enable('trust proxy');

//SocketIO 
const http = require('http').Server(app);
const io = require('socket.io')(http);

// JSON Parser - parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Files
app.use(express.static(path.join(__dirname, "/public")));

// View Engine

app.use(express.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, `/views`)); 

// CORS
app.use(cors());

// For debugging;
app.use(morgan('tiny'));


// Main App
app.get("/",(req,res)=> {
      res.render('./index.ejs',{url:req.headers.host});
});

app.get("/gameboard",(req,res)=> {
    res.render('./gameboard.ejs',{url:req.headers.host});
});


let Players = [];
let NewQuestionReady = true;
let BuzzedFirst = [];

// Web Socket 
io.on('connection', (socket) => {
    console.log("New Player: " + socket.id);
    socket.on('disconnect', (reason) => {
      console.log("disconnect reason:",reason);    
      console.log('& socket.id:',socket.id);
    });

    socket.on('newPlayer', (PlayerName)=>{
        console.log("new player:",PlayerName)
        if (PlayerName) {
            socket.emit("welcome",PlayerName);
            Players.push({id: socket.id, name: PlayerName,score:0});
            console.log(Players)
        }
    });

    socket.on('nextQuestion', () => {
        console.log("NextQuestion")
        //reset question
        NewQuestionReady = true;
        BuzzedFirst = [];
    })

    socket.on('winnerChosen', (winnerInfo) => {
        io.emit('newWinner',winnerInfo);
        Players.map(p=> {
            if (p.name == winnerInfo.name) {
                p.score += winnerInfo.score;
            }
        });
    });

    socket.on('getPlayers',()=> {
        socket.emit("getPlayers",Players);
    });


    socket.on('buzz', (playerName) => {
        console.log("Buss from",playerName)
        //reset question
        BuzzedFirst.push(playerName);
        if (NewQuestionReady) {
            NewQuestionReady = false;
            io.emit("buzzedFirst",playerName);
            console.log("FirstBuzz:",playerName)
        }
        io.emit("buzzed",playerName);
    })

});


// Starting App
http.listen(port, () => {
    console.log(`App is listening on: http://localhost:${port}`);
  });