
import { getCurrentGreeting, formatFullDate } from "@/utils/dateUtils";

export function Greeting() {
  const greeting = getCurrentGreeting();

  return (
    <div className="flex items-end gap-3">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-echurch-700">
          {greeting}, {localStorage.getItem("user_name").split(" ")[0]}!
        </h1>
      </div>
      <div className="h-full">
        <p className="text-sm text-echurch-500 pb-1">
          {formatFullDate()}
        </p>
      </div>
    </div>
  );
}
