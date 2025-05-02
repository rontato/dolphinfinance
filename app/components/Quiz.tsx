import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Results from './Results';
import { useInputLogger } from './useInputLogger';

interface QuestionOption {
  value: string;
  label: string;
}

interface BaseQuestion {
  id: number;
  section: string;
  text: string;
  condition?: {
    questionId: number;
    expectedValue: string;
  };
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple_choice";
  options: QuestionOption[];
}

interface SliderQuestion extends BaseQuestion {
  type: "slider";
  min: number;
  max: number;
  step: number;
  prefix?: string;
}

interface TextQuestion extends BaseQuestion {
  type: "text";
}

interface MultiSelectQuestion extends BaseQuestion {
  type: "multi_select";
  options: QuestionOption[];
}

type Question = MultipleChoiceQuestion | SliderQuestion | TextQuestion | MultiSelectQuestion;

const questions: Question[] = [
  // Section 1: Income & Budgeting
  {
    id: 1,
    section: "💵 Section 1: Income & Budgeting",
    text: "Do you currently have a source of income?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: 2,
    section: "💵 Section 1: Income & Budgeting",
    text: "What is your monthly income after taxes? (Include any money given/gifted to you)",
    type: "slider",
    min: 0,
    max: 20000,
    step: 100,
    prefix: "$",
    condition: {
      questionId: 1,
      expectedValue: "yes"
    }
  },
  {
    id: 3,
    section: "💵 Section 1: Income & Budgeting",
    text: "What are your total monthly expenses?",
    type: "slider",
    min: 0,
    max: 20000,
    step: 100,
    prefix: "$",
    condition: {
      questionId: 1,
      expectedValue: "yes"
    }
  },
  {
    id: 3.5,
    section: "💵 Section 1: Income & Budgeting",
    text: "What is your age?",
    type: "text",
  },
  {
    id: 4,
    section: "🏦 Section 2: Banking & Accounts",
    text: "Do you have a checking account?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unknown", label: "I don't know what a checking account is" }
    ]
  },
  {
    id: 5,
    section: "🏦 Section 2: Banking & Accounts",
    text: "Which bank is your checking account with?",
    type: "text",
    condition: { questionId: 4, expectedValue: "yes" }
  },
  {
    id: 6,
    section: "🏦 Section 2: Banking & Accounts",
    text: "What's your typical checking account balance?",
    type: "slider",
    min: 0,
    max: 50000,
    step: 100,
    prefix: "$",
    condition: { questionId: 4, expectedValue: "yes" }
  },
  {
    id: 7,
    section: "🏦 Section 2: Banking & Accounts",
    text: "Do you have a savings account?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unknown", label: "I don't know what a savings account is" }
    ]
  },
  {
    id: 8,
    section: "🏦 Section 2: Banking & Accounts",
    text: "Which bank is your savings account with?",
    type: "text",
    condition: { questionId: 7, expectedValue: "yes" }
  },
  {
    id: 9,
    section: "🏦 Section 2: Banking & Accounts",
    text: "What's your typical savings account balance?",
    type: "slider",
    min: 0,
    max: 100000,
    step: 100,
    prefix: "$",
    condition: { questionId: 7, expectedValue: "yes" }
  },
  {
    id: 10,
    section: "🏦 Section 2: Banking & Accounts",
    text: "Do you have a high-yield savings account?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unknown", label: "I don't know what a high-yield savings account is" }
    ]
  },
  {
    id: 11,
    section: "🏦 Section 2: Banking & Accounts",
    text: "Which bank is your high-yield savings account with?",
    type: "text",
    condition: { questionId: 10, expectedValue: "yes" }
  },
  {
    id: 12,
    section: "🏦 Section 2: Banking & Accounts",
    text: "What's your typical high-yield savings account balance?",
    type: "slider",
    min: 0,
    max: 100000,
    step: 100,
    prefix: "$",
    condition: { questionId: 10, expectedValue: "yes" }
  },
  // Section 3: Debt Management
  {
    id: 13,
    section: "🏛️ Section 3: Debt Management",
    text: "Do you have any student loans?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: 14,
    section: "🏛️ Section 3: Debt Management",
    text: "What's your total student loan debt?",
    type: "slider",
    min: 0,
    max: 200000,
    step: 1000,
    prefix: "$",
    condition: { questionId: 13, expectedValue: "yes" }
  },
  {
    id: 15,
    section: "🏛️ Section 3: Debt Management",
    text: "Do you have a car loan?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: 16,
    section: "🏛️ Section 3: Debt Management",
    text: "What's your car loan balance?",
    type: "slider",
    min: 0,
    max: 100000,
    step: 1000,
    prefix: "$",
    condition: { questionId: 15, expectedValue: "yes" }
  },
  {
    id: 17,
    section: "🏛️ Section 3: Debt Management",
    text: "Do you have a mortgage?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: 18,
    section: "🏛️ Section 3: Debt Management",
    text: "What's your mortgage balance?",
    type: "slider",
    min: 0,
    max: 1000000,
    step: 5000,
    prefix: "$",
    condition: { questionId: 17, expectedValue: "yes" }
  },
  {
    id: 19,
    section: "🏛️ Section 3: Debt Management",
    text: "Do you have any credit card debt you carry month-to-month?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: 20,
    section: "🏛️ Section 3: Debt Management",
    text: "What's your credit card debt?",
    type: "slider",
    min: 0,
    max: 50000,
    step: 500,
    prefix: "$",
    condition: { questionId: 19, expectedValue: "yes" }
  },
  {
    id: 21,
    section: "🏛️ Section 3: Debt Management",
    text: "Do you have any other forms of debt? (personal loans, medical bills, etc.)",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: 22,
    section: "🏛️ Section 3: Debt Management",
    text: "What type of debt do you have? (Select all that apply)",
    type: "multi_select",
    options: [
      { value: "personal", label: "Personal loans" },
      { value: "medical", label: "Medical debt" },
      { value: "payday", label: "Payday loans" },
      { value: "other", label: "Other" }
    ],
    condition: { questionId: 21, expectedValue: "yes" }
  },
  {
    id: 23,
    section: "🏛️ Section 3: Debt Management",
    text: "What's your total other debt?",
    type: "slider",
    min: 0,
    max: 100000,
    step: 1000,
    prefix: "$",
    condition: { questionId: 21, expectedValue: "yes" }
  },
  // Section 4: Debt & Credit Health
  {
    id: 24,
    section: "💳 Section 4: Debt & Credit Health",
    text: "How many credit cards do you have? (Not including any card you are an authorized user on)",
    type: "multiple_choice",
    options: [
      { value: "none", label: "0" },
      { value: "one", label: "1" },
      { value: "two", label: "2" },
      { value: "three", label: "3" },
      { value: "four_plus", label: "4+" }
    ]
  },
  {
    id: 25,
    section: "💳 Section 4: Debt & Credit Health",
    text: "What is your credit score?",
    type: "multiple_choice",
    options: [
      { value: "excellent", label: "800+" },
      { value: "very_good", label: "740–799" },
      { value: "good", label: "670–739" },
      { value: "fair", label: "580–669" },
      { value: "poor", label: "300–579" },
      { value: "unknown", label: "I don't know how to check" }
    ]
  },
  // Section 5: Investing Knowledge & Habits
  {
    id: 26,
    section: "📈 Section 5: Investing Knowledge & Habits",
    text: "Do you have a brokerage account?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unknown", label: "I don't know what a brokerage account is" }
    ]
  },
  {
    id: 27,
    section: "📈 Section 5: Investing Knowledge & Habits",
    text: "Which brokerage do you use?",
    type: "text",
    condition: { questionId: 26, expectedValue: "yes" }
  },
  {
    id: 28,
    section: "📈 Section 5: Investing Knowledge & Habits",
    text: "What's your total investment balance?",
    type: "slider",
    min: 0,
    max: 1000000,
    step: 1000,
    prefix: "$",
    condition: { questionId: 26, expectedValue: "yes" }
  },
  {
    id: 29,
    section: "📈 Section 5: Investing Knowledge & Habits",
    text: "What are you invested in? (Select all that apply)",
    type: "multi_select",
    options: [
      { value: "stocks", label: "Individual stocks" },
      { value: "index_funds", label: "Index funds" },
      { value: "bonds", label: "Bonds" },
      { value: "options", label: "Stock options" },
      { value: "other", label: "Other" }
    ],
    condition: { questionId: 26, expectedValue: "yes" }
  },
  // Section 6: Long-Term Savings & Retirement
  {
    id: 30,
    section: "🏦 Section 6: Long-Term Savings & Retirement",
    text: "Do you have a Roth IRA?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unknown", label: "I don't know what a Roth IRA is" }
    ]
  },
  {
    id: 31,
    section: "🏦 Section 6: Long-Term Savings & Retirement",
    text: "Which bank is your Roth IRA with?",
    type: "text",
    condition: { questionId: 30, expectedValue: "yes" }
  },
  {
    id: 32,
    section: "🏦 Section 6: Long-Term Savings & Retirement",
    text: "What's your Roth IRA balance?",
    type: "slider",
    min: 0,
    max: 500000,
    step: 1000,
    prefix: "$",
    condition: { questionId: 30, expectedValue: "yes" }
  },
  {
    id: 33,
    section: "🏦 Section 6: Long-Term Savings & Retirement",
    text: "What are you invested in? (Select all that apply)",
    type: "multi_select",
    options: [
      { value: "stocks", label: "Individual stocks" },
      { value: "index_funds", label: "Index funds" },
      { value: "bonds", label: "Bonds" },
      { value: "options", label: "Stock options" },
      { value: "other", label: "Other" }
    ],
    condition: { questionId: 30, expectedValue: "yes" }
  },
  {
    id: 34,
    section: "🏦 Section 6: Long-Term Savings & Retirement",
    text: "Do you have a 401(k)?",
    type: "multiple_choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unknown", label: "I don't know what a 401(k) is" }
    ]
  },
  {
    id: 35,
    section: "🏦 Section 6: Long-Term Savings & Retirement",
    text: "What's your 401(k) balance?",
    type: "slider",
    min: 0,
    max: 1000000,
    step: 1000,
    prefix: "$",
    condition: { questionId: 34, expectedValue: "yes" }
  }
];

interface QuizProps {
  onShowResults?: () => void;
}

// Helper to format numbers with commas
function formatNumberWithCommas(value: number | string) {
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return value;
  return num.toLocaleString();
}

export default function Quiz({ onShowResults }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[] | number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [sliderValue, setSliderValue] = useState<string | number>(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const logInput = useInputLogger('Quiz');

  const handleAnswer = (value: string | string[] | number) => {
    logInput({
      target: {
        name: `question_${questions[currentQuestion].id}`,
        value,
        type: questions[currentQuestion].type,
      }
    } as any);
    const updatedAnswers = {
      ...answers,
      [questions[currentQuestion].id]: value
    };
    setAnswers(updatedAnswers);

    // Find next applicable question
    let nextQuestionIndex = currentQuestion + 1;
    while (nextQuestionIndex < questions.length) {
      const nextQuestion = questions[nextQuestionIndex];
      if (!nextQuestion.condition) {
        break;
      }
      const conditionMet = updatedAnswers[nextQuestion.condition.questionId] === nextQuestion.condition.expectedValue;
      if (conditionMet) {
        break;
      }
      nextQuestionIndex++;
    }

    if (nextQuestionIndex < questions.length) {
      setCurrentQuestion(nextQuestionIndex);
      // Reset input states
      setTextInput("");
      setSliderValue(0);
      setSelectedOptions([]);
    } else {
      setIsComplete(true);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (option.value === 'other') {
                      // Do not auto-advance, show text input
                      setAnswers(prev => ({ ...prev, [question.id]: 'other' }));
                    } else {
                      handleAnswer(option.value);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 border rounded-lg text-gray-900 font-medium bg-white hover:bg-indigo-50 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm hover:shadow-md ${answers[question.id] === option.value ? 'border-indigo-500' : ''}`}
                >
                  {option.label}
                </button>
                {option.value === 'other' && answers[question.id] === 'other' && (
                  <input
                    type="text"
                    value={otherText}
                    onChange={e => setOtherText(e.target.value)}
                    placeholder="Please specify"
                    className="ml-2 px-2 py-1 border rounded-md text-black"
                  />
                )}
              </div>
            ))}
            {answers[question.id] === 'other' && (
              <button
                onClick={() => handleAnswer(`other:${otherText}`)}
                className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={!otherText.trim()}
              >
                Next
              </button>
            )}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min={question.min}
                max={question.max}
                step={50}
                value={typeof answers[question.id] === 'number' ? answers[question.id] : sliderValue}
                onFocus={e => {
                  e.target.select();
                  setSliderValue("");
                  setAnswers(prev => ({ ...prev, [question.id]: "" }));
                }}
                onChange={e => {
                  let val = Number(e.target.value);
                  if (isNaN(val)) val = question.min;
                  if (val < question.min) val = question.min;
                  if (val > question.max) val = question.max;
                  setSliderValue(val);
                  setAnswers(prev => ({ ...prev, [question.id]: val }));
                }}
                className="w-32 px-2 py-1 border rounded-md text-right font-semibold text-black"
              />
              <input
                type="range"
                min={question.min}
                max={question.max}
                step={50}
                value={typeof answers[question.id] === 'number' ? answers[question.id] : sliderValue}
                onChange={e => {
                  const val = Number(e.target.value);
                  setSliderValue(val);
                  setAnswers(prev => ({ ...prev, [question.id]: val }));
                }}
                className="w-full"
              />
            </div>
            <div className="text-center text-lg font-semibold text-gray-700">
              {question.prefix || ''}
              {(() => {
                const val = answers[question.id];
                if (typeof val === 'number' || typeof val === 'string') {
                  return formatNumberWithCommas(val);
                } else {
                  return formatNumberWithCommas(sliderValue);
                }
              })()}
            </div>
            <button
              onClick={() => handleAnswer(typeof answers[question.id] === 'number' ? answers[question.id] : sliderValue)}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Next
            </button>
            <button
              onClick={() => handleAnswer('not_sure')}
              className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              I'm not sure
            </button>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <input
              type={question.id === 3.5 ? "number" : "text"}
              value={textInput}
              onChange={(e) => {
                logInput(e);
                setTextInput(e.target.value);
              }}
              className="w-full px-3 py-2 border rounded-md text-gray-900 font-medium bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
              placeholder={question.id === 3.5 ? "Enter your age (18-100)" : "Enter your answer"}
              min={question.id === 3.5 ? 18 : undefined}
              max={question.id === 3.5 ? 100 : undefined}
            />
            {question.id !== 3.5 &&
              typeof textInput !== 'object' &&
              !Array.isArray(textInput) &&
              !isNaN(Number(textInput)) &&
              textInput !== '' && (
                <div className="text-center text-lg font-semibold text-gray-700">
                  {formatNumberWithCommas(textInput)}
                </div>
            )}
            <button
              onClick={() => {
                if (question.id === 3.5) {
                  const age = Number(textInput);
                  if (isNaN(age) || age < 18 || age > 100) {
                    alert("Please enter a valid age between 18 and 100");
                    return;
                  }
                  handleAnswer(age);
                } else {
                  handleAnswer(textInput);
                }
              }}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Continue
            </button>
          </div>
        );

      case 'multi_select':
        return (
          <div className="space-y-4">
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    let newSelection = selectedOptions.includes(option.value)
                      ? selectedOptions.filter(v => v !== option.value)
                      : [...selectedOptions, option.value];
                    setSelectedOptions(newSelection);
                  }}
                  className={`w-full text-left px-4 py-3 border rounded-lg text-gray-900 font-medium transition-all shadow-sm hover:shadow-md ${
                    selectedOptions.includes(option.value)
                      ? 'bg-indigo-100 border-indigo-500 shadow-md'
                      : 'bg-white hover:bg-indigo-50 hover:border-indigo-300'
                  }`}
                >
                  {option.label}
                </button>
                {option.value === 'other' && selectedOptions.includes('other') && (
                  <input
                    type="text"
                    value={otherText}
                    onChange={e => setOtherText(e.target.value)}
                    placeholder="Please specify"
                    className="ml-2 px-2 py-1 border rounded-md text-black"
                  />
                )}
              </div>
            ))}
            <button
              onClick={() => {
                let answer = selectedOptions.includes('other')
                  ? selectedOptions.filter(v => v !== 'other').concat(otherText ? [`other:${otherText}`] : [])
                  : selectedOptions;
                handleAnswer(answer);
              }}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={selectedOptions.includes('other') && !otherText.trim()}
            >
              Continue
            </button>
          </div>
        );
    }
  };

  const progressPercentage = ((currentQuestion) / questions.length) * 100;

  if (isComplete) {
    if (onShowResults) onShowResults();
    return <Results answers={answers} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Section title */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {questions[currentQuestion].section}
      </h2>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {questions[currentQuestion].text}
            </h3>
            {renderQuestion()}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Question counter */}
      <p className="text-sm text-gray-500 mt-4 text-center">
        Question {currentQuestion + 1} of {questions.length}
      </p>
    </div>
  );
} 