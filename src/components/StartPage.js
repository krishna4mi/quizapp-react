import React, { useRef, useState } from 'react'

import './StartPage.css';
import { useNavigate } from 'react-router-dom';

const StartPage = () => {
    const navigate = useNavigate()
    const [showStartButton, setShowStartButton] = useState(true);
    const selectQuestionInput = useRef();

    const startQuiz = () => {
        setShowStartButton(false);
    }
    const showQuestions = () => {
        navigate('/quiz')
        console.log(selectQuestionInput.current.value);
    }

    const returnOptionsCount = () => {
        const rows = [];
        rows.push(<option key={0} value="">Select quesiton count</option>)
        for (let i = 5; i <= 15; i++) {
            rows.push(<option key={i} value={i}>{i}</option>);
        }
        return rows;
    }

    return (
        <div className="quiz-container">
            {showStartButton && <button onClick={startQuiz}>Start</button>}
            {!showStartButton && <div className='quiz-question-selection'>
            Select no of questions to attend:
                <select name="cars" id="cars" ref={selectQuestionInput}>
                    {returnOptionsCount()}
                </select>
                <button onClick={showQuestions}>Start</button>
            </div>}

        </div>
    )
}

export default StartPage