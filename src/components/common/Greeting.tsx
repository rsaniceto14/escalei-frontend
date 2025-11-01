
import { getCurrentGreeting, formatFullDate } from "@/utils/dateUtils";

export function Greeting() {
  const greeting = getCurrentGreeting();

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-echurch-500">
        {formatFullDate()}
      </p>
      <h1 className="text-xl lg:text-2xl font-bold text-echurch-700">
        {greeting}, {localStorage.getItem("user_name")}!
      </h1>
    </div>
  );
}
