import React, { useState, useEffect } from 'react';
import './Quiz.css';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';

import {TailSpin} from 'react-loader-spinner';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = queryString.parse(location.search);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [countDown, setCountDown] = useState(30);
  // const [countDown, setCountDown] = useState(5);
  // const [questionLoaded, setQuesitonLoaded] = useState(true);

  let timeOut;

  useEffect(() => {
    console.log("!!!!!!!!!!!!!!!!!!!")

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (countDown > 0) {
      timeOut = setTimeout(() => {
        setCountDown((prev) => {
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timeOut);
  }, [countDown])



  const fetchQuestions = async () => {
    try {
      let count = queryParams.qtncount;
      console.log(count);
      if (count == undefined || count == null) {
        count = 10
      };
      const response = await fetch('https://green-betta-wig.cyclic.app/getQuiz?questionCount=' + count);
      const data = await response.json();
      if (data.status) {
        setQuestions(data.result);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Handle user selection of answers
  const handleAnswerSelect = (answer) => {
    const updatedAnswers = [...userAnswers];
    if (countDown === 0) {
      answer = '';
    }
    updatedAnswers[currentQuestion] = answer;
    setUserAnswers(updatedAnswers);
    setSelectedOption(answer)
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {

    if (currentQuestion + 1 < questions.length) {
      setCountDown(30);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption('');

    } else {
      // Calculate and display the final score
      calculateScore();
      setShowScore(true);
    }
  };

  // Calculate user's score based on their answers
  const calculateScore = () => {
    let updatedScore;
    if (questions.length > 0) {
      updatedScore = userAnswers.reduce((acc, val, index) => {
        // console.log(val, acc);
        if (questions[index]?.choices?.indexOf(val) === questions[index]?.answer_index) {
          return acc + 1;
        } else {
          return acc;
        };
      }, 0);
      setScore(updatedScore);
    }
  };


  const restartQuiz = () => {
    navigate('/');
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setShowScore(false);
    setCountDown(30);
    setSelectedOption('');
  };

  if (questions.length === 0) {
    return <div className='loader-section'>
      <TailSpin className="tailspin"
        color="#00BFFF" // color of the spinner
        height={80} // height of the spinner
        width={80} // width of the spinner
        timeout={3000} // timeout in milliseconds (optional, defaults to 0 which means the spinner won't stop automatically)
      />
    </div>;
  }
  if (showScore) {
    return (
      <div className="quiz-completed">
        <h2 >Quiz Completed!</h2>
        <h3>Your Score: {score}</h3>
        <button onClick={restartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <h2 className='qns'>Question {currentQuestion + 1}</h2>
      <p className="question-text">{currentQuestionData.question}</p>
      <ul className="answer-list">
        {currentQuestionData?.choices?.map((answer, index) => (
          <li key={index}>
            <button className={(selectedOption === answer) ? 'answer-button  selected' : 'answer-button '} onClick={() => handleAnswerSelect(answer)}>{answer}</button>
          </li>
        ))}
      </ul>
      <div className='countdown-section'>
        {countDown < 20 && countDown > 0 && <span >{currentQuestionData.hint}</span>}
        {countDown === 0 && selectedOption === '' && setSelectedOption(currentQuestionData.choices[currentQuestionData.answer_index])}
        {countDown <= 10 && <span className='timer'> {countDown < 0 ? 'Time UP. Failed to answer the question. Here is the answer' : 'Time left: ' + countDown + '\'s'}</span>}
      </div>
      <button className="next-button" onClick={handleNextQuestion}>Next Question</button>
    </div>
  );
};

export default Quiz;