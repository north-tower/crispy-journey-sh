// pages/ExpandedCalendar.tsx

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";

function getDaysInMonth(year: number, month: number) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getTimeSlots() {
  const times = [];
  for (let i = 9; i <= 18; i++) {
    times.push(`${i % 12 === 0 ? 12 : i % 12} ${i < 12 ? "AM" : "PM"}`);
  }
  return times;
}

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  start.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // Adjust for Monday start
  start.setHours(0, 0, 0, 0);
  return start;
}

export default function ExpandedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month");
  const router = useRouter();

  const scheduledProducts = {
    "2024-11-05": { "12 PM": ["Product A"], "3 PM": ["Product B"] },
    "2024-11-12": { "10 AM": ["Product C"] },
    "2024-11-18": { "9 AM": ["Product D"], "2 PM": ["Product E", "Product F"] },
    "2024-11-25": { "4 PM": ["Product G"] }
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const timeSlots = getTimeSlots();

  const goToPrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === "week") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
    }
  };

  const goToNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === "week") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    }
  };

  const handleDateClick = (day: Date) => {
    setCurrentDate(day);
    setViewMode("day");
  };

  return (
    <div className="flex flex-col items-center p-8">
   

      <div className="flex justify-between items-center mb-4 w-full max-w-4xl">
        <button onClick={goToPrevious} className="text-gray-500 hover:text-gray-900">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-lg font-bold text-primary-600">
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </div>
        <button onClick={goToNext} className="text-gray-500 hover:text-gray-900">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex space-x-2 mb-6">
        {["day", "week", "month"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as "day" | "week" | "month")}
            className={cn(
              "px-4 py-1 rounded-lg font-semibold transition-colors duration-200",
              viewMode === mode ? "bg-primary-500 text-white" : "text-gray-700 bg-gray-200"
            )}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      <div className="w-full max-w-5xl mt-4">
        {viewMode === "month" && (
          <div className="grid grid-cols-7 gap-4 text-center text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold text-gray-500">{day}</div>
            ))}
            {daysInMonth.map((day) => {
              const dateString = day.toISOString().split("T")[0];
              const eventData = scheduledProducts[dateString];

              return (
                <div
                  key={dateString}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "h-24 flex flex-col items-center justify-center rounded-lg cursor-pointer transition duration-200",
                    eventData ? "bg-gradient-to-br from-primary-200 to-primary-500 text-white shadow-md" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  <div className="font-bold text-lg">{day.getDate()}</div>
                  {eventData && <div className="text-xs mt-1">{Object.keys(eventData).length} Events</div>}
                </div>
              );
            })}
          </div>
        )}

        {viewMode === "week" && (
          <div>
            <div className="grid grid-cols-8 gap-4 text-center text-sm font-semibold text-gray-600 mb-2">
              <div></div> {/* Spacer for timeline */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const weekStart = getStartOfWeek(currentDate);
                const weekDate = new Date(weekStart);
                weekDate.setDate(weekStart.getDate() + i);
                const isToday = weekDate.toDateString() === new Date().toDateString();
                return (
                  <div key={day} className={cn("flex flex-col items-center", isToday ? "bg-blue-100 rounded-lg p-2" : "")}>
                    <span>{day}</span>
                    <span className="font-bold">{weekDate.getDate()}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-8 gap-4 text-sm">
              <div className="flex flex-col items-center text-gray-500">
                {timeSlots.map((time) => (
                  <div key={time} className="h-12 flex items-center justify-center">{time}</div>
                ))}
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const weekStart = getStartOfWeek(currentDate);
                const dayDate = new Date(weekStart);
                dayDate.setDate(weekStart.getDate() + dayIndex);
                const dateString = dayDate.toISOString().split("T")[0];
                const dayEvents = scheduledProducts[dateString] || {};

                return (
                  <div key={dayIndex} className="relative grid grid-rows-10 gap-1 border-l border-gray-200">
                    {Object.entries(dayEvents).map(([time, events], i) => {
                      const start = timeSlots.indexOf(time) + 1;
                      const end = start + 2;
                      return (
                        <div
                          key={i}
                          style={{ gridRow: `${start} / ${end}` }}
                          className="absolute bg-primary-100 text-primary-800 font-semibold p-2 rounded-md shadow-md"
                        >
                          {events.join(", ")}
                        </div>
                      );
                    })}
                    {timeSlots.map((time) => (
                      <div key={time} className="h-12 border-b border-gray-200"></div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <div className="w-full max-w-md mx-auto">
            <div className="text-2xl font-bold text-primary-600 mb-4">
              {currentDate.toLocaleDateString("default", { weekday: "long" })}, {currentDate.getDate()}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-semibold mb-4 text-gray-800">Scheduled Products</p>
              <div className="grid grid-cols-1 gap-2">
                {timeSlots.map((time) => (
                  <div key={time} className="flex items-center space-x-2 border-b border-gray-200 py-2">
                    <span className="font-semibold text-gray-500 w-12 text-right">{time}</span>
                    <div className={cn(
                      "px-3 py-1 rounded-md w-full",
                      scheduledProducts[currentDate.toISOString().split("T")[0]]?.[time]
                        ? "bg-primary-100 text-primary-800"
                        : "text-gray-500 bg-gray-100"
                    )}>
                      {scheduledProducts[currentDate.toISOString().split("T")[0]]?.[time]?.join(", ") || "Free"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
