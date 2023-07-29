import React, { useState, useEffect } from 'react';
import './Quiz.css';


const Quiz = () => {

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [showTimer, setShowTimer] = useState(false);
  const [countDown, setCountDown] = useState(30);
  // const [countDown, setCountDown] = useState(5);
  // const [questionLoaded, setQuesitonLoaded] = useState(true);
  let timerInterval;
  let timeOut;
  // let questionTimeOut;
  // useEffect(()=>{
  //   if(questionLoaded){

  //   }
  //   setTimeout(()=> {
  //     setShowTimer(true);
  //   }, 1000 * 10);
  // },[]);
  useEffect(() => {
    fetchQuestions();
  }, []);

  // useEffect(() => {
  //   if (questionLoaded) {
  //     timerInterval = setInterval(() => {
  //       countDown >= 0 && setCountDown((prev) => {
  //         if (prev < 10) {
  //           setShowTimer(true);
  //         }
  //         if (prev > 0) {           
  //           return prev - 1;
  //         } else {
  //           clearInterval(timerInterval);
  //           // handleAnswerSelect("");
  //           // handleNextQuestion();
  //           return prev;
  //         }
  //       });
  //     }, 1000);

  //   } 
  //   return () => clearInterval(timerInterval);
  // }, [questionLoaded])


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



  // Fetch quiz questions from the backend API when the component mounts
  // You need to implement the fetchQuestions function to fetch data from the backend


  const fetchQuestions = async () => {
    try {
      //  const response = await fetch('http://localhost:3000/getQuiz?questionCount=10');
      // const data = await response.json();
      const data = [
        {
          question_id: 1,
          question: "What famous Roman general and statesman was assassinated on the Ides of March in 44 BC?",
          answer_index: 0,
          choices: ["Julius Caesar", "Augustus", "Nero", "Caligula"],
          hint: "He was also a renowned military commander.",
        },
        {
          question_id: 2,
          question: "What was the name of the ancient Roman currency?",
          answer_index: 1,
          choices: ["Sestertius", "Denarius", "Aureus", "As"],
          hint: "It was a silver coin.",
        },
        {
          question_id: 3,
          question: "What famous building in Rome was originally built as a stadium for chariot races and other public events?",
          answer_index: 1,
          choices: ["The Colosseum", "Circus Maximus", "Pantheon", "Forum Romanum"],
          hint: "It could hold up to 250,000 spectators.",
        },
        {
          question_id: 4,
          question: "What famous Roman emperor built a wall in northern Britain to protect against Scottish tribes?",
          answer_index: 0,
          choices: ["Hadrian", "Constantine", "Trajan", "Augustus"],
          hint: "The wall is named after him.",
        },
        {
          question_id: 5,
          question: "What was the name of the first Roman emperor?",
          answer_index: 3,
          choices: ["Julius Caesar", "Tiberius", "Caligula", "Augustus"],
          hint: "He was the nephew of Julius Caesar.",
        }]
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Handle user selection of answers
  const handleAnswerSelect = (answer) => {
    const updatedAnswers = [...userAnswers];
    if(countDown ==0){ 
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
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setShowScore(false);
    setCountDown(30);
    setSelectedOption('');
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
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
      <h2 >Question {currentQuestion + 1}</h2>
      <p className="question-text">{currentQuestionData.question}</p>
      <ul className="answer-list">
        {currentQuestionData?.choices?.map((answer, index) => (
          <li key={index}>
            <button className={(selectedOption === answer) ? 'answer-button  selected' : 'answer-button '} onClick={() => handleAnswerSelect(answer)}>{answer}</button>
          </li>
        ))}
      </ul>
      <span>{countDown}</span>
      <div className='countdown-section'>
        {countDown < 20 && countDown > 0 && <span >{currentQuestionData.hint}</span>}
        {countDown == 0 && selectedOption=='' && setSelectedOption(currentQuestionData.choices[currentQuestionData.answer_index])}
        {countDown <= 10 && <span className='timer'> {countDown < 0 ? 'Time UP. Failed to answer the question. Here is the answer':'Time left: ' + countDown +'\'s'}</span>}
      </div>
      <button className="next-button" onClick={handleNextQuestion}>Next Question</button>
    </div>
  );
};

export default Quiz;