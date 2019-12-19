/* eslint-disable*/
$(document).ready(function() {
  // processing Icon
  function Processing(state) {
    if (state) {
      $('#processing').css('display', 'block');
    } else {
      $('#processing').css('display', 'none');
    }
  }

  $('#startTestButton').on('click', function() {
    const id = $(this).data('id');
    console.log(id);
    $('#startTest').remove();

    $.ajax({
      type: 'GET',
      url: '/test/startTest/',
      beforeSend: function() {
        Processing(true);
      },
      data: {
        getTest: 'getTest',
        testId: id
      },
      dataType: 'json',
      success: function(response) {
        Processing(false);
        allData = response;
        console.log(response);
        startQuiz();
      },
      error: function(response) {
        console.log('Error');
        console.log(response);
      }
    });
  });
});

let allData,
  questions,
  test,
  score = 0;
const submitButton = document.getElementById('submit-btn');
const nextButton = document.getElementById('next-btn');
const finishButton = document.getElementById('finish-btn');
const quitButton = document.getElementById('quit-yes-btn');
const questionTitleElement = document.getElementById('question-title');
const scoreElement = document.getElementById('score');
const optionsElement = document.getElementById('options');
const alertElement = document.getElementById('alertTest');
const testNameElement = document.getElementById('testName');
const timerElement = document.getElementById('timer');
const questionLeftElement = document.getElementById('question-left');

let currentQuestionIndex, currentQuestion;

if (submitButton) {
  submitButton.addEventListener('click', checkAnswer);
  nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
  });
  finishButton.addEventListener('click', finishQuiz);
  quitButton.addEventListener('click', quitTest);
}

function finishQuiz() {
  $(document).ready(function() {
    console.log('finish button');
    $.ajax({
      type: 'POST',
      url: '/test/complete/',
      data: {
        completeTest: 'completeTest',
        testId: test._id,
        score: score
      },
      dataType: '',
      success: function(response) {
        // console.log('Success');
        // console.log(response);
        if (response.status == 'success') {
          DisplayAlert('Test is Completed', 'alert-success');
          setTimeout(() => {
            window.location = '/dashboard';
          }, 2000);
        }
      },
      error: function(response) {
        console.log('Error');
        console.log(response);
      }
    });
  });
}

function quitTest() {
  // console.log('Quit Button is Press');
  window.location = '/dashboard';
}

function startQuiz() {
  $('#quizMain').css('display', 'block');
  questions = allData.questions;
  test = allData.test;
  testNameElement.innerText = test.testName;
  currentQuestionIndex = 0;
  setNextQuestion();
}

function setNextQuestion() {
  ResetState();
  currentQuestion = questions[currentQuestionIndex];
  showQuestion(currentQuestion);
  DisplayQuestionLeft(questions.length - currentQuestionIndex);
}

function ResetState() {
  questionTitleElement.innerText = '';
  optionsElement.innerHTML = '';
  submitButton.classList.remove('d-none');
  nextButton.classList.add('d-none');
}

function showQuestion(question) {
  questionTitleElement.innerText = question.title;
  let displayOptions;

  switch (question.questionType) {
    case 'single':
      console.log('single');
      displayOptions = DisplaySingleMultiple(question);
      break;

    case 'multiple':
      console.log('multiple');
      displayOptions = DisplaySingleMultiple(question);
      break;

    case 'text':
      console.log('text');
      displayOptions = DisplayText();
      break;

    default:
      displayOptions = '';
      break;
  }

  optionsElement.innerHTML = displayOptions;
  //   startTimer(question.time);
  startTimer(10);
}

let myTimer;
function startTimer(time) {
  myTimer = setInterval(myClock, 1000);

  function myClock() {
    timerElement.innerText = time;
    if (time == 0) {
      // clearInterval(myTimer);
      // submitButton.classList.add('d-none');
      // nextButton.classList.remove('d-none');
      checkTestIsFinishOrNot();
      DisplayAlert('Time Up');
    }
    time--;
  }
}

function DisplayQuestionLeft(totalLeftQuestion) {
  questionLeftElement.innerText = totalLeftQuestion;
}

function DisplayAlert(data, className = 'alert-warning') {
  console.log(className);
  alertElement.classList.add(className);
  alertElement.classList.remove('d-none');
  $(alertElement)
    .find('p')
    .text(data);

  window.setTimeout(function() {
    $(alertElement)
      .addClass('d-none')
      .removeClass(className);
  }, 2000);
}

function checkAnswer(e) {
  console.log(getCheckboxesValues());

  switch (currentQuestion.questionType) {
    case 'single':
      // answer = console.log('Check answer single');
      checkAnswerSinOrMul(currentQuestion, getCheckboxesValues());
      break;

    case 'multiple':
      // console.log('Check answer Mutiple');
      checkAnswerSinOrMul(currentQuestion, getCheckboxesValues());
      break;

    case 'text':
      console.log('text');
      checkTextAnswer(currentQuestion);
      break;

    default:
      break;
  }
}

function checkTestIsFinishOrNot() {
  if (questions.length > currentQuestionIndex + 1) {
    // user have question for test  .... Test is not finish
    submitButton.classList.add('d-none');
    nextButton.classList.remove('d-none');
  } else {
    // test is finish
    submitButton.classList.add('d-none');
    nextButton.classList.add('d-none');
    quitButton.classList.add('d-none');
    finishButton.classList.remove('d-none');
  }
  clearInterval(myTimer);
}

function getCheckboxesValues() {
  return [].slice
    .apply(document.querySelectorAll('input[type=checkbox]'))
    .filter(function(c) {
      return c.checked;
    })
    .map(function(c) {
      return c.name - 1;
    });
}

function checkAnswerSinOrMul(question, answer) {
  if (_.isEmpty(answer)) {
    DisplayAlert('Please Select Options');
  } else {
    // check answer is right or wrong
    if (_.isEqual(question.answer, answer)) {
      console.log('Right Answer');
      score = score + question.points;
      scoreElement.innerText = score;
    } else {
      console.log('Wrong Answer');
    }

    document.querySelectorAll('.custom-control').forEach(element => {
      const i =
        $(element)
          .find('input[type=checkbox]')
          .attr('name') - 1;
      if (_.contains(question.answer, i)) {
        element.classList.add('text-success');
      } else {
        element.classList.add('text-danger');
      }
    });

    checkTestIsFinishOrNot();
  }
}

function getTextAnswer() {
  // const textAnswer = document.querySelectorAll('#textAnswer').values();
  return $('#textAnswer').val();
}

function checkTextAnswer(question) {
  const userAnswer = Number(getTextAnswer());
  if (_.contains(question.answer, userAnswer)) {
    DisplayAlert('Right Answer', 'alert-success');
    score = score + question.points;
    scoreElement.innerText = score;
  } else {
    DisplayAlert('Wrong Answer');
    console.log('Wrong');
  }

  checkTestIsFinishOrNot();
}

function DisplaySingleMultiple(question) {
  // building Options
  let displayOptions = '<div id="singleMultiple">';

  for (let i = 0; i < question.options.length; i++) {
    displayOptions += '  <div class="custom-control custom-checkbox"> ';
    displayOptions +=
      ' <input type="checkbox" class="custom-control-input" name="' +
      (i + 1) +
      '" id="' +
      (i + 1) +
      '"> ' +
      ' <label class="custom-control-label" for="' +
      (i + 1) +
      '" id="label' +
      (i + 1) +
      '">';

    displayOptions += question.options[i];
    displayOptions += '</label>  </div>';
  }

  displayOptions += ' </div>';
  return displayOptions;
}

function DisplayText() {
  let displayOptions = '<div id="textQuestion">';
  displayOptions +=
    '<div class="input-group"> ' +
    '<textarea class="form-control" name="textAnswer" id="textAnswer" aria-label="With textarea"></textarea>';
  displayOptions += '</div></div>';

  return displayOptions;
}

$('#quit-btn').on('click', function() {
  console.log($(finishButton).length);
  if ($(finishButton).css('display') !== 'none') {
    $('#modal-paragraph-message').text(
      'Test is already done. Please Click on Finish.'
    );
  } else {
    $('#modal-paragraph-message').text(
      'Nothing will save to system. You have to redo this test again.'
    );
    clearInterval(myTimer);
  }
});

$('#quit-no-btn').on('click', function() {
  if ($(submitButton).css('display') !== 'none') {
    startTimer(Number($(timerElement).text()));
  }
});
