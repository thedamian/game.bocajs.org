const socket = io();
let buzzedNames = [];
let InAnswer = false;
let AllWinnerDivs = document.getElementsByClassName("winner");
let tiles = document.getElementsByClassName("tile");
let abc = {};
let Players = [];


// On Winner:

socket.on("buzzedFirst",(BuzzedName) => {
  console.log("BuzzedName",BuzzedName)
  if (InAnswer) // && !buzzedNames.includes(BuzzedName))
  {
    //console.log("inside")
    //buzzedNames.push(BuzzedName)
    for (let i=0; i<AllWinnerDivs.length;i++) {
      abc = AllWinnerDivs[i];
      if (AllWinnerDivs[i].parentElement.parentElement.classList.contains('active'))
      {
        let score = Number(AllWinnerDivs[i].getAttribute("value"));
        console.log(score)
        addBuzzer(BuzzedName,score,AllWinnerDivs[i]);
        addBuzzer('😞',score, AllWinnerDivs[i]);
      }
    }
  }
});



function addBuzzer(BuzzedName,score,WinnerDivs) {
  let BuzznerNameDiv = document.createElement("div");
      BuzznerNameDiv.innerHTML += BuzzedName ;
      BuzznerNameDiv.className = "buzzerName"
      WinnerDivs.appendChild(BuzznerNameDiv);
      BuzznerNameDiv.addEventListener("click", (e) => { 
        e.preventDefault();
        let winnerInfo = {name: BuzzedName, score: score};
          //erase all winners
          for (let i=0; i<AllWinnerDivs.length;i++) {
            AllWinnerDivs[i].innerHTML ="";
          }

        if ( BuzzedName == "😞") {
          socket.emit("nextQuestion");
          InAnswer = true;
        } else {
            console.log("winnerInfo",winnerInfo);
            socket.emit('winnerChosen',winnerInfo);
            addwinner(winnerInfo);
            // back to game board
            for(let i=0;i< tiles.length;i++) {
              tiles[i].classList.remove('active');
            }
            InAnswer = false;
        }
      });
}

function addwinner(winnerInfo) {
  let winnerChosen = false;
  Players.map(p=> {
      if (winnerInfo.name == p.name) {
        p.score += winnerInfo.score;
      }
  })
  if (!winnerChosen) {
      Players.push(winnerInfo);
  }
}


const GameData = {
  Categories : [
    'Programming',
    'Vanilla JS',
    'Angular',
    'ReactJS',
    'CSS'
  ],
  Questios: [
    {value: 100,Answers: ["This is a condition where 3 comes before 1"            
    ,"This is the best Javascript Meetup group in Florida"                                
    ,"This is the name of what the old Angular was called until 2.0"
    ,"This is the company that create ReactJS"
    ,"This is how we select an DIV by ID"]},
    {value: 200,Answers: ["This is a loop that comes after 3"                     
    ,"This is the most popular JS Library. Even today."
    ,"This is the company that created Angular"
    ,"This is the combination of JS, CSS and HTML used in ReactJS"
    ,"This is how we select an DIV by CLASS"]},
    {value: 300,Answers: ["This is the degree you don't need in programming"      
    ,"This is how you answer how to add two numbers in jQuery"
    ,"This is what MVC in Angular stands for"
    ,"This is the NEW way to fetch a API in React"
    ,"This is how we center the content of a div"]},
    {value: 400,Answers: ["This is a type of 'plant' that's made of zeros and one"
    ,"This is the ES6 way to 'Iterate' through an Array"
    ,"This is the type of class we use to connect to APIs"
    ,"This is what Higher Order Component (HOC) are."
    ,"This is the CSS layout that rhymes with fox"]},
    {value: 500,Answers: ["What is the worst Question a programmer can be asked"  
    ,"This is the difference between i++ and ++i"             
    ,"Answer for $500 Angular"
    ,"This is the difference between state and props"
    ,"This is a basic part of CSS animation"]},
  ]
}
  

  // setup the board
const categories =  document.getElementById("categories");

let madeRank = false;
GameData.Categories.map((category) => {
  let Category = document.createElement("div");
  Category.classList.add("tile");
  Category.innerHTML = category;
  if (!madeRank) {
    Category.setAttribute("id","rank");
    categories.setAttribute("onclick","getRank()");
    madeRank = false;
  }
  categories.appendChild(Category);
});


let categoeryName1 = ""
function getRank() {
  let rankTile = document.getElementById("rank");
  if (categoeryName1 != "") {
    // reset the board
    rankTile.classList.remove("active");
    rankTile.innerHTML = categoeryName1;
    categoeryName1 = "";
  } else {
    // Show our rank
    categoeryName1 = rankTile.innerHTML;
    rankTile.classList.add("active");
    rankTile.innerHTML = "";
    Players.sort((a,b) => b.score - a.score);

    Players.map(p=> {
      rankTile.innerHTML += p.name + ":" + p.score + "<BR />";
    })
  }
  
}

// Questions
const boardDiv = document.getElementById("board");
GameData.Questios.map((question) => {
  let row = document.createElement("div");
  row.classList.add("row");
  row.classList.add("clues");
  question.Answers.map((answer) => {
    let AnswerDiv = document.createElement("div");
    AnswerDiv.classList.add("tile");
    //AnswerDiv.setAttribute("onclick",'ShowQuestion(this)');

      let QuestionValue = document.createElement("div");
      QuestionValue.classList.add("question-value");
      QuestionValue.innerHTML= "$"+question.value;
      AnswerDiv.appendChild(QuestionValue);

      let QuestionAnswer = document.createElement("div");
      QuestionAnswer.classList.add("question-answer");
      QuestionAnswer.innerHTML = answer;

      let WinnerDiv = document.createElement('div');
      WinnerDiv.classList.add("winner");
      WinnerDiv.setAttribute("value",question.value);
      QuestionAnswer.appendChild(WinnerDiv);

      AnswerDiv.appendChild(QuestionAnswer);

    row.appendChild(AnswerDiv);
  });
  
  boardDiv.appendChild(row);


});

//readd the latest tiles
tiles = document.getElementsByClassName("tile");
 for(let i=0;i< tiles.length;i++) {
  tiles[i].addEventListener("click", (e) => {
    e.preventDefault();
    let tile = e.target;
    if(!tile.classList.contains('tile')) {
      tile = tile.parentElement;
      if(!tile) { 
        return;
      }
    }
    console.log(tile);
    if(!tile.classList.contains('active')) {
      InAnswer = true;
      tile.classList.add('active');
      socket.emit("nextQuestion");
      tile.firstChild.innerHTML = "&nbsp;"
    }
  });
 }


