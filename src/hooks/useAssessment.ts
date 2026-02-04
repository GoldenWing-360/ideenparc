import { useState, useCallback } from 'react';
import { allQuestions, blocks, type BlockId } from '../data/questions';

export interface AssessmentState {
  answers: Record<string, number>;
  currentIndex: number;
  isComplete: boolean;
}

export function useAssessment() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const setAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === allQuestions.length;
  const currentQuestion = allQuestions[currentIndex];
  const currentBlock = blocks.find((b) => b.id === currentQuestion?.blockId);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, allQuestions.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, allQuestions.length - 1)));
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
  }, []);

  const isQuestionAnswered = useCallback(
    (questionId: string) => answers[questionId] !== undefined,
    [answers]
  );

  const isBlockComplete = useCallback(
    (blockId: BlockId) => {
      const blockQuestions = blocks.find((b) => b.id === blockId)?.questions || [];
      return blockQuestions.every((q) => answers[q.id] !== undefined);
    },
    [answers]
  );

  const blockAnsweredCount = useCallback(
    (blockId: BlockId) => {
      const blockQuestions = blocks.find((b) => b.id === blockId)?.questions || [];
      return blockQuestions.filter((q) => answers[q.id] !== undefined).length;
    },
    [answers]
  );

  const getBlockStartIndex = useCallback((blockId: BlockId) => {
    let idx = 0;
    for (const block of blocks) {
      if (block.id === blockId) return idx;
      idx += block.questions.length;
    }
    return 0;
  }, []);

  return {
    answers,
    setAnswer,
    currentIndex,
    currentQuestion,
    currentBlock,
    answeredCount,
    isComplete,
    goNext,
    goPrev,
    goTo,
    reset,
    isQuestionAnswered,
    isBlockComplete,
    blockAnsweredCount,
    getBlockStartIndex,
    totalQuestions: allQuestions.length,
  };
}
