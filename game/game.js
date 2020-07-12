const question = document.getElementById("question"),
      choices = Array.from(document.getElementsByClassName("choice-text")),
      progressText = document.getElementById("progressText"),
      scoreText = document.getElementById("score"),
      progressBarFull = document.getElementsByClassName("progress-bar-full")[0],
      loader = document.getElementById("loader"),
      game = document.getElementById("game");

let   currentQuestion = {},
      acceptingAnswers = false,
      score = 0,
      questionCounter = 0,
      avalaibleQuestions = [];

let   questions = [];

//fetch local json file here
// fetch("../questions.json")
//      .then( res => res.json())
//      .then( loadedQuestions => {
//        questions = loadedQuestions;
//        startGame()
//      })
//      .catch( err => console.error(err));


     fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
          .then( res => res.json())
          .then( loadedQuestions => {
            questions = loadedQuestions.results.map( loadedQuestion => {
              const formattedQuestions = {
                question: loadedQuestion.question
              };
              const answerChoices = [...loadedQuestion.incorrect_answers];
              formattedQuestions.answer = Math.floor(Math.random() * 3) + 1;
              answerChoices.splice(formattedQuestions.answer - 1, 0, loadedQuestion.correct_answer);

              answerChoices.forEach( (choice, index) => {
                formattedQuestions["choice" + (index+1)] = choice;
              });
              return formattedQuestions;
            })
            // questions = loadedQuestions;

            startGame();
          })
          .catch( err => console.error(err));

const CORRECT_BONUS = 10,
      MAX_QUESTIONS = 3;

      startGame = () => {
         questionCounter = 0;
         score = 0;
         avalaibleQuestions = [...questions];  //fully copy all the questions from questions array
         getNewQuestion();
         game.classList.remove("hidden");
         loader.classList.add("hidden");
      }

      getNewQuestion = () => {
        if(avalaibleQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
          localStorage.setItem('mostRecentScore', score);
          //go to the end page
          return window.location.assign('../end/end.html');
        }

         questionCounter++;
         progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
         //update the progress bar
         progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`

         const questionIndex = Math.floor(Math.random() * avalaibleQuestions.length);
         currentQuestion = avalaibleQuestions[questionIndex];
         question.innerText = currentQuestion.question;

         choices.forEach(choice => {
           const number = choice.dataset['number']; //get number property
           choice.innerText = currentQuestion['choice' + number];
         });

         avalaibleQuestions.splice(questionIndex,1); //get rid of the question we just used in this array

         acceptingAnswers = true;
      };

      choices.forEach(choice => {
        choice.addEventListener('click', e => {
          if(!acceptingAnswers) return;
          const selectedChoice = e.target;
          const selectedAnswer = selectedChoice.dataset["number"];
          let classToApply;
          selectedAnswer == currentQuestion.answer?  classToApply = 'correct': classToApply = 'incorrect';
          selectedChoice.classList.add(classToApply);

          if(classToApply === 'correct') incrementScore(CORRECT_BONUS);

          setTimeout(()=>{
              selectedChoice.classList.remove(classToApply);
              getNewQuestion();
          }, 1000);
        });
      });

      incrementScore = num =>{
        score += num;
        scoreText.innerText = score;
      }
