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



