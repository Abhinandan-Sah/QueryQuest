import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Question from "./Question"
import SentenceQuiz from "./SentenceQuiz"
import { ArrowLeft, ArrowRight } from "lucide-react"
import useFetchQuestion from "@/lib/useFetchQuestion"

const Quiz = ({ category }) => {
  const [quizData, setQuizData] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  console.log(category)
  const data = useFetchQuestion(category);

  useEffect(() => {
    if (data && data.length > 0) {
      setQuizData(data)
      setUserAnswers(new Array(data.length).fill(""))
      setLoading(false)
    }
  }, [data])



  const handleAnswer = (answer) => {
    const updatedAnswers = [...userAnswers]
    updatedAnswers[currentQuestion] = answer
    setUserAnswers(updatedAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    const newScore = quizData.reduce((acc, question, index) => {
      if (question.type === "ANAGRAM") {
        return userAnswers[index].trim() === question.solution.trim() ? acc + 1 : acc
      } else {
        return userAnswers[index] === question.solution ? acc + 1 : acc
      }
    }, 0)
    setScore(newScore)
    setShowResults(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-center text-secondary">
            Your score: {score} out of {quizData.length}
          </p>
          <div className="mt-8 flex justify-center">
            <Button onClick={() => window.location.reload()} className="px-8 py-4 text-lg">
              Restart Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestionData = quizData[currentQuestion]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
        <div className="h-2 bg-secondary rounded-full mt-4">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
            }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        {currentQuestionData.type === "ANAGRAM" ? (
          <SentenceQuiz
            question={currentQuestionData}
            userAnswer={userAnswers[currentQuestion]}
            onAnswer={handleAnswer}
          />
        ) : (
          <Question question={currentQuestionData} userAnswer={userAnswers[currentQuestion]} onAnswer={handleAnswer} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePrevious} disabled={currentQuestion === 0} className="flex items-center">
          <ArrowLeft className="mr-2" /> Previous
        </Button>
        {currentQuestion === quizData.length - 1 ? (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex items-center">
            Next <ArrowRight className="ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default Quiz

