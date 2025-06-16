
import { getCurrentGreeting, formatFullDate } from "@/utils/dateUtils";

export function Greeting() {
  const greeting = getCurrentGreeting();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h1 className="text-xl lg:text-2xl font-bold text-echurch-700">
          {greeting}, Maria!
        </h1>
      </div>
      <p className="text-sm text-echurch-500 mt-1">
        {formatFullDate()}
      </p>
    </div>
  );
}
