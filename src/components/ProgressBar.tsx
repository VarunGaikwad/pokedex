export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex-grow h-4 w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-current shadow-none rounded-r-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
