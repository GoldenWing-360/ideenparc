import { useMemo } from 'react';
import { blocks, type BlockId } from '../data/questions';
import {
  clarityQuestionIds,
  executionQuestionIds,
  getMaturityLevel,
  getMatrixQuadrant,
} from '../data/evaluation';

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function useEvaluation(answers: Record<string, number>) {
  const overallScore = useMemo(() => {
    const values = Object.values(answers);
    return Math.round(average(values));
  }, [answers]);

  const maturityLevel = useMemo(() => getMaturityLevel(overallScore), [overallScore]);

  const blockScores = useMemo(() => {
    const scores: Record<BlockId, number> = { markt: 0, wettbewerb: 0, unternehmen: 0 };
    for (const block of blocks) {
      const values = block.questions
        .map((q) => answers[q.id])
        .filter((v) => v !== undefined);
      scores[block.id] = Math.round(average(values));
    }
    return scores;
  }, [answers]);

  const clarityScore = useMemo(() => {
    const values = clarityQuestionIds
      .map((id) => answers[id])
      .filter((v) => v !== undefined);
    return Math.round(average(values));
  }, [answers]);

  const executionScore = useMemo(() => {
    const values = executionQuestionIds
      .map((id) => answers[id])
      .filter((v) => v !== undefined);
    return Math.round(average(values));
  }, [answers]);

  const matrixQuadrant = useMemo(
    () => getMatrixQuadrant(clarityScore >= 50, executionScore >= 50),
    [clarityScore, executionScore]
  );

  return {
    overallScore,
    maturityLevel,
    blockScores,
    clarityScore,
    executionScore,
    matrixQuadrant,
  };
}
