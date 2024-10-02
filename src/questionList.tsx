import './questionList.css';
import Quiz, { Question as QuizQuestion } from 'react-quiz-component';
import { questions } from './data/questions';
import { useState } from 'react';

function QuestionList(props: {
  onSingleQuestionDisplayedChanged: (show: boolean) => void;
}) {
  const [selectedQuestionCode, setSelectedQuestionCode] = useState<string>('');
  return (
    <div className="question-list-container">
      <div className="question-list">
        {questions.questions.map((question) => (
          <div
            className="question-list-item"
            onClick={() => {
              setSelectedQuestionCode(question.code);
              props.onSingleQuestionDisplayedChanged(true);
            }}
          >
            <QuestionListItem key={question.code} question={question} />
          </div>
        ))}
      </div>
      {selectedQuestionCode && (
        <div className="question-list-single-question">
          <button
            className="app-button"
            onClick={() => {
              setSelectedQuestionCode('');
              props.onSingleQuestionDisplayedChanged(false);
            }}
          >
            {' '}
            {'< Quay lại'}
          </button>
          <IndividualQuestionItem
            question={questions.questions.find(
              (e) => e.code === selectedQuestionCode
            )}
          />
        </div>
      )}
    </div>
  );
}

function QuestionListItem(props: {
  question: QuizQuestion | unknown;
}): JSX.Element {
  const { question, code } = props.question as QuizQuestion;
  return (
    <p>
      <span>{code}</span>
      {question}
    </p>
  );
}

function IndividualQuestionItem(props: {
  question: QuizQuestion | unknown;
}): JSX.Element {
  return (
    <div className="individual-question-item">
      <Quiz
        quiz={{ questions: [props.question] }}
        disableSynopsis={true}
        continueTillCorrect={true}
      />
    </div>
  );
}

export default QuestionList;
