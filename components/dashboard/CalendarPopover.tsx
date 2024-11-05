// components/CalendarPopover.tsx
"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";

function getDaysInMonth(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function CalendarPopover({
  isVisible,
  currentMonth,
  goToPreviousMonth,
  goToNextMonth,
  scheduledProducts,
  eventStyles
}) {
  const [hoveredDate, setHoveredDate] = useState(null);
  const calendarRef = useRef(null);
  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const router = useRouter();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={calendarRef}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="absolute top-0 left-full mr-4 p-4 bg-white shadow-lg border border-gray-200 rounded-xl z-50 w-80"
        >
          <div className="flex justify-between items-center mb-4">
            <button onClick={goToPreviousMonth} className="text-gray-500 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-gray-800">
              {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
            </span>
            <button onClick={goToNextMonth} className="text-gray-500 hover:text-gray-900">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold text-gray-500">{day}</div>
            ))}
            {daysInMonth.map((day) => {
              const dateString = day.toISOString().split("T")[0];
              const eventData = scheduledProducts[dateString];
              const isHighlighted = Boolean(eventData);
              const eventStyle = eventData ? eventStyles[eventData.type] : "";

              return (
                <div key={dateString} className="relative">
                  <motion.div
                    className={cn(
                      "relative h-10 w-10 flex items-center justify-center rounded-full hover:scale-105 transition duration-300",
                      isHighlighted ? `${eventStyle} shadow-md` : "text-gray-700 hover:bg-muted"
                    )}
                    onMouseEnter={() => setHoveredDate(day)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    {day.getDate()}
                  </motion.div>
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredDate?.getTime() === day.getTime() && eventData && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-40 p-2 bg-white shadow-md text-xs text-gray-700 rounded-md border border-gray-200 z-50"
                      >
                        <p className="font-semibold mb-1">{eventData.type.toUpperCase()}</p>
                        {eventData.items.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => router.push("/calendar")}
            className="flex items-center justify-center w-full mt-4 p-2 text-sm text-primary-600 hover:text-primary-800"
          >
            <Expand className="w-5 h-5 mr-1" /> Expand View
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

