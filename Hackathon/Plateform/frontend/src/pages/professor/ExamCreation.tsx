import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ChevronLeft } from 'lucide-react';

interface QuestionForm {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text';
  options: string[];
}

const ExamCreation: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('60');
  const [examType, setExamType] = useState<'written' | 'programming'>('written');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { id: '1', text: '', type: 'multiple-choice', options: ['', '', '', ''] }
  ]);
  const [instructions, setInstructions] = useState('');
  const [githubRequired, setGithubRequired] = useState(false);
  const [commitInterval, setCommitInterval] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a new question
  const addQuestion = () => {
    const newQuestion: QuestionForm = {
      id: (questions.length + 1).toString(),
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', '']
    };
    setQuestions([...questions, newQuestion]);
  };

  // Remove a question
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Update question text
  const updateQuestionText = (id: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, text } : q
    ));
  };

  // Update question type
  const updateQuestionType = (id: string, type: 'multiple-choice' | 'text') => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, type } : q
    ));
  };

  // Update option text
  const updateOptionText = (questionId: string, optionIndex: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = text;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Add new option for multiple choice
  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  // Remove option
  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = [...q.options];
        newOptions.splice(optionIndex, 1);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare exam data
    const examData = {
      title,
      course,
      date,
      duration,
      examType,
      questions,
      instructions,
      githubRequired,
      commitInterval
    };

    try {
      const response = await fetch("http://localhost:5000/api/plateforme/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examData)
      });
      if (!response.ok) throw new Error("Erreur lors de la création de l'examen");
      setIsSubmitting(false);
      navigate('/professor');
    } catch (error) {
      setIsSubmitting(false);
      alert("Erreur lors de la création de l'examen");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/professor')}
          className="mr-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Créer un nouvel examen</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Informations de base</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre de l'examen
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
              Cours
              </label>
              <input
                type="text"
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date et heure
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Durée (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="5"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="examType" className="block text-sm font-medium text-gray-700">
                Type d'examen
                </label>
                <select
                  id="examType"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as 'written' | 'programming')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="written">Examen écrit</option>
                  <option value="programming">Devoir de programmation</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Programming Assignment Settings (conditional) */}
        {examType === 'programming' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres d'affectation de programmation</h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Instructions (Markdown pris en charge)
                </label>
                <textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="# Assignment Title&#10;&#10;## Instructions&#10;&#10;1. First step&#10;2. Second step&#10;&#10;## Requirements&#10;&#10;- Requirement 1&#10;- Requirement 2"
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  id="githubRequired"
                  type="checkbox"
                  checked={githubRequired}
                  onChange={(e) => setGithubRequired(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="githubRequired" className="ml-2 block text-sm text-gray-700">
                Nécessite une connexion au référentiel GitHub
                </label>
              </div>
              
              {githubRequired && (
                <div>
                  <label htmlFor="commitInterval" className="block text-sm font-medium text-gray-700">
                  Intervalle de validation requis (minutes)
                  </label>
                  <input
                    type="number"
                    id="commitInterval"
                    value={commitInterval}
                    onChange={(e) => setCommitInterval(e.target.value)}
                    min="1"
                    max="60"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questions (only for written exams) */}
        {examType === 'written' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Questions</h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-900">Question {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Retirer
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`question-${question.id}-text`} className="block text-sm font-medium text-gray-700">
                      Texte de la question
                      </label>
                      <textarea
                        id={`question-${question.id}-text`}
                        value={question.text}
                        onChange={(e) => updateQuestionText(question.id, e.target.value)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor={`question-${question.id}-type`} className="block text-sm font-medium text-gray-700">
                      Type de question
                      </label>
                      <select
                        id={`question-${question.id}-type`}
                        value={question.type}
                        onChange={(e) => updateQuestionType(question.id, e.target.value as 'multiple-choice' | 'text')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="multiple-choice">Choix multiples</option>
                        <option value="text">Réponse textuelle</option>
                      </select>
                    </div>
                    
                    {question.type === 'multiple-choice' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options
                        </label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOptionText(question.id, optionIndex, e.target.value)}
                              className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(question.id, optionIndex)}
                              className="ml-2 inline-flex items-center p-1 border border-transparent text-xs rounded text-gray-500 hover:bg-gray-100"
                              disabled={question.options.length <= 2}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Ajouter une option
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une question
              </button>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Créer un examen
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamCreation;