const CATEGORIES = [
  'all', 'hover', 'gradient', '3d', 'neon',
  'glassmorphism', 'ripple', 'morph', 'outline', 'social', 'loader',
];

export default function Filters({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`chip ${active === c ? 'chip-active' : ''}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
