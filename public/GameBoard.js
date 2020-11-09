const socket = io();
let buzzedNames = [];
let InAnswer = false;
let AllWinnerDivs = document.getElementsByClassName("winner");
const ShowQuestion = (e) => {
  if(e.className == 'tile active') {
    InAnswer = false;
    e.className = 'tile';
    buzzedNames = [];
    for (let i=0; i<AllWinnerDivs.length;i++) {
      AllWinnerDivs[i].innerHTML ="";
    }
    console.log("buzzers reset")
  } else {
    InAnswer = true;
    e.className = 'tile active';
    socket.emit("nextQuestion");
    e.firstChild.innerHTML = "&nbsp;"
  }
}

// On Winner:

socket.on("buzzed",(BuzzedName) => {
  if (InAnswer && !buzzedNames.includes(BuzzedName))
  {
    buzzedNames.push(BuzzedName)
    for (let i=0; i<AllWinnerDivs.length;i++) {
      AllWinnerDivs[i].innerHTML +=BuzzedName + "<BR />";
    }
  }
});


const GameData = {
  Categories : [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
    'Category 5'
  ],
  Questios: [
    {value: 100,Answers: ["Answer for $100 1","Answer for $100 2","Answer for $100 3", "Answer for $100 4","Answer for $100 5"]},
    {value: 200,Answers: ["Answer for $200 1","Answer for $200 2","Answer for $200 3", "Answer for $200 4","Answer for $100 5"]},
    {value: 300,Answers: ["Answer for $300 1","Answer for $300 2","Answer for $300 3", "Answer for $300 4","Answer for $100 5"]},
    {value: 400,Answers: ["Answer for $400 1","Answer for $400 2","Answer for $400 3", "Answer for $400 4","Answer for $100 5"]},
    {value: 500,Answers: ["Answer for $500 1","Answer for $500 2","Answer for $500 3", "Answer for $500 4","Answer for $100 5"]},
  ]
}
  

  // setup the board
const categories =  document.getElementById("categories");

GameData.Categories.map((category) => {
  let Category = document.createElement("div");
  Category.classList.add("tile");
  Category.innerHTML = category;
  categories.appendChild(Category);
});

// Questions
const boardDiv = document.getElementById("board");
GameData.Questios.map((question) => {
  let row = document.createElement("div");
  row.classList.add("row");
  row.classList.add("clues");
  question.Answers.map((answer) => {
    let AnswerDiv = document.createElement("div");
    AnswerDiv.classList.add("tile");
    AnswerDiv.setAttribute("onclick",'ShowQuestion(this)');

      let QuestionValue = document.createElement("div");
      QuestionValue.classList.add("question-value");
      QuestionValue.innerHTML= "$"+question.value;
      AnswerDiv.appendChild(QuestionValue);

      let QuestionAnswer = document.createElement("div");
      QuestionAnswer.classList.add("question-answer");
      QuestionAnswer.innerHTML = answer;

      let WinnerDiv = document.createElement('div');
      WinnerDiv.classList.add("winner");
      QuestionAnswer.appendChild(WinnerDiv);

      AnswerDiv.appendChild(QuestionAnswer);

    row.appendChild(AnswerDiv);
  });
  
  boardDiv.appendChild(row);


});



