import { useEffect, useState } from "react";

export default function ProgressBar({
  percentage = 0,
}: {
  percentage: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setValue(percentage);
    }, 0);
  }, [percentage]);

  return (
    <div className="flex-grow h-4 w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-current shadow-none rounded-r-full"
        style={{
          width: `${value}%`,
          transition: "width 2s, background-color 1s",
        }}
      ></div>
    </div>
  );
}
