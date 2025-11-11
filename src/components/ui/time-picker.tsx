import * as React from "react";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TimePicker({
  value = "",
  onChange,
  className,
  placeholder = "Selecionar hora",
  disabled = false,
  ...props
}: TimePickerProps) {
  const [hours, minutes] = value ? value.split(':') : ['', ''];
  
  const hoursOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  const minutesOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  const handleHoursChange = (newHours: string) => {
    if (onChange) {
      const newTime = `${newHours}:${minutes || '00'}`;
      onChange(newTime);
    }
  };

  const handleMinutesChange = (newMinutes: string) => {
    if (onChange) {
      const newTime = `${hours || '00'}:${newMinutes}`;
      onChange(newTime);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Clock className="h-4 w-4 text-muted-foreground" />
      <div className="flex gap-1">
        <Select 
          value={hours} 
          onValueChange={handleHoursChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-16 h-10">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent>
            {hoursOptions.map(hour => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="flex items-center text-muted-foreground font-medium">:</span>
        <Select 
          value={minutes} 
          onValueChange={handleMinutesChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-16 h-10">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent>
            {minutesOptions.map(minute => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

TimePicker.displayName = "TimePicker";



