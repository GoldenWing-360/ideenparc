import { blocks, type BlockId } from '../../data/questions';

interface BlockScoresProps {
  scores: Record<BlockId, number>;
}

const blockMeta: Record<BlockId, { label: string; color: string }> = {
  markt: { label: 'Markt & Kunden', color: '#00ADE0' },
  wettbewerb: { label: 'Wettbewerb', color: '#F39401' },
  unternehmen: { label: 'Mein Unternehmen', color: '#39A958' },
};

export default function BlockScores({ scores }: BlockScoresProps) {
  return (
    <div className="space-y-4 w-full">
      {blocks.map((block) => {
        const meta = blockMeta[block.id];
        const score = scores[block.id];
        return (
          <div key={block.id}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{meta.label}</span>
              <span className="text-sm font-bold" style={{ color: meta.color }}>
                {score}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${score}%`,
                  backgroundColor: meta.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
