const username = document.getElementById("username"),
      saveScoreBtn = document.getElementById("saveScoreBtn"),
      mostRecentScore = localStorage.getItem('mostRecentScore'),
      finalScore = document.getElementById("final-score");

// localStorage.setItem("highScores", JSON.stringify([]));
const highScores = JSON.parse(localStorage.getItem("highScores")) ||[],
      MAX_HIGHSCORE = 5;  //top 5 scores

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value;
})

saveHighScore = (e) => {
  e.preventDefault();

  score = {
    score:mostRecentScore,
    name:username.value
  }
  highScores.push(score);

  highScores.sort( (a,b) => b.score - a.score);
  highScores.splice(5);  //keep the top 5 scores

  localStorage.setItem('highScores', JSON.stringify(highScores));
  window.location.assign('/');
}
