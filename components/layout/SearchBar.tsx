"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  Calendar,
  Settings,
  HelpCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  Expand,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";

const quickActions = [
  { icon: Calendar, label: "Calendar", shortcut: "⌘K C" },
  { icon: Settings, label: "Settings", shortcut: "⌘K S" },
  { icon: HelpCircle, label: "Help Center", shortcut: "⌘K H" },
  { icon: Mail, label: "Inbox", shortcut: "⌘K I" },
];

function getDaysInMonth(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function SearchBar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null); // For tooltip
  const calendarRef = useRef(null);
  const router = useRouter();

  const scheduledProducts = {
    "2024-11-05": { items: ["Product A", "Product B"], type: "launch" },
    "2024-11-12": { items: ["Product C"], type: "meeting" },
    "2024-11-18": { items: ["Product D", "Product E", "Product F"], type: "workshop" },
    "2024-11-25": { items: ["Product G"], type: "launch" }
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const eventStyles = {
    launch: "bg-gradient-to-br from-primary-200 to-primary-500 text-white",
    meeting: "bg-gradient-to-br from-yellow-400 to-red-500 text-white",
    workshop: "bg-gradient-to-br from-purple-400 to-pink-500 text-white"
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Close calendar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="hidden sm:block relative group">
      <div
        className={cn(
          "relative flex items-center transition-all duration-200",
          isSearchFocused ? "w-96" : "w-64"
        )}
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search anything..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-full border transition-all duration-200",
              "text-sm text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-100",
              isSearchFocused
                ? "border-primary-200 bg-white shadow-lg"
                : "border-gray-200 bg-gray-50"
            )}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search
              className={cn(
                "w-4 h-4 transition-colors duration-200",
                isSearchFocused ? "text-primary-500" : "text-gray-400"
              )}
            />
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-md transition-opacity duration-200",
                isSearchFocused ? "opacity-100" : "opacity-0",
                "bg-gray-100 text-gray-500"
              )}
            >
              <Command className="w-3 h-3 inline-block mr-1" />K
            </span>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 w-full mt-2 py-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="px-3 pb-2 mb-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase">
                  Quick Actions
                </p>
              </div>
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  onMouseEnter={() => action.label === "Calendar" && setIsCalendarVisible(true)}
                  className="w-full px-3 py-2 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                      <action.icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-gray-600">{action.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {action.shortcut}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Popover */}
        <AnimatePresence>
          {isCalendarVisible && (
            <motion.div
              ref={calendarRef}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute top-0 left-full mr-4 p-4 bg-white shadow-lg border border-gray-200 rounded-xl z-50 w-80"
              onMouseEnter={() => setIsCalendarVisible(true)}
              onMouseLeave={() => setIsCalendarVisible(false)}
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
      </div>
    </div>
  );
}
