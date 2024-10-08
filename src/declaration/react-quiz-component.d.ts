declare module 'react-quiz-component' {
      import { ReactElement } from 'react';
      
      type QuestionType = "text" | "photo"
      
      type AnswerSelectionType = "single" | "multiple"
  
      export type Question = {
          code?: string
          question: string
          questionType: QuestionType
          answers: string[]
          correctAnswer: string
          answerSelectionType: AnswerSelectionType
          messageForCorrectAnswer?: string
          messageForIncorrectAnswer?: string
          explanation?: string
          point?: string
          segment?: string
      }
  
      type QuizStructure = {
          quizTitle?: string
          questions: question[]
      }
  
      type QuizProps = {
          quiz: QuizStructure;
          disableSynopsis?: boolean;
          shuffleAnswer?: boolean;
          shuffle?: boolean;
          showDefaultResult?: boolean;
          showInstantFeedback?: boolean;
          continueTillCorrect?: boolean;
          timer?: number;
          allowPauseTimer?: boolean
      }
  
      const Quiz: (props: QuizProps) => ReactElement;
      export default Quiz;
  }