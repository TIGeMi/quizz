import './App.css';
import Quiz from 'react-quiz-component';
import { questions } from './data/questions';
import { useState } from 'react';
import QuestionList from './questionList';

enum QuizState {
  Uninitialized = 'Uninitialized',
  InProgress = 'InProgress',
  Finished = 'Finished',
}

function App() {
  const [quizState, setQuizState] = useState<QuizState>(
    QuizState.Uninitialized
  );

  const [startQuestionIndex, setStartQuestionIndex] = useState<number>(1);
  const [endQuestionIndex, setEndQuestionIndex] = useState<number>(15);
  const [studyMode, setStudyMode] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(true);

  const renderWelcomeScreen = (): JSX.Element => {
    return (
      <div className="welcome-screen">
        <form
          className="quiz-option-form"
          style={{ display: showForm ? 'block' : 'none' }}
        >
          <label htmlFor="startNumber">Chọn câu bắt đầu</label>
          <input
            id="startNumber"
            type="number"
            max={500}
            min={1}
            value={startQuestionIndex}
            onChange={(e) => setStartQuestionIndex(+e.target.value)}
          />
          <label htmlFor="endNumber">Chọn câu kết thúc</label>
          <input
            id="endNumber"
            type="number"
            max={questions.questions.length}
            min={1}
            value={endQuestionIndex}
            onChange={(e) => setEndQuestionIndex(+e.target.value)}
          />
          <div>
            <input
              type="radio"
              id="studyMode"
              name="selectMode"
              value="studyMode"
              defaultChecked
              onChange={() => setStudyMode(true)}
            />
            <label htmlFor="studyMode">Học</label>
            <input
              type="radio"
              id="testMode"
              name="selectMode"
              value="testMode"
              onChange={() => setStudyMode(false)}
            />
            <label htmlFor="testMode">Thi</label>
          </div>
          <button
            className="app-button"
            onClick={() => setQuizState(QuizState.InProgress)}
          >
            Bắt đầu làm bài
          </button>
        </form>
        <div className="quiz-question-list">
          <QuestionList
            onSingleQuestionDisplayedChanged={(questionShown: boolean) =>
              setShowForm(!questionShown)
            }
          />
        </div>
      </div>
    );
  };

  const renderQuizScreen = (): JSX.Element => {
    const questionList = questions.questions.slice(
      startQuestionIndex,
      endQuestionIndex + 1
    );
    return (
      <div className="quiz-screen">
        <div className="quiz-container">
          <Quiz
            quiz={{ questions: questionList }}
            disableSynopsis={true}
            continueTillCorrect={studyMode}
          />
        </div>
        <button
          className="app-button"
          onClick={() => setQuizState(QuizState.Uninitialized)}
        >
          Kết thúc
        </button>
      </div>
    );
  };

  return (
    <div>
      {quizState === QuizState.Uninitialized && renderWelcomeScreen()}
      {quizState === QuizState.InProgress && renderQuizScreen()}
    </div>
  );
}

export default App;
