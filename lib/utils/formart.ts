// lib/utils/format.ts
interface FormatDateOptions {
  relative?: boolean;
  includeTime?: boolean;
  format?: "short" | "medium" | "long" | "full";
  timeZone?: string;
}

export function formatDate(
  date: string | Date,
  options: FormatDateOptions = {}
) {
  const {
    relative = false,
    includeTime = false,
    format = "medium",
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  } = options;

  // Convert string to Date if necessary
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // For relative dates (e.g., "2 hours ago")
  if (relative) {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000
    );
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Just now
    if (diffInSeconds < 30) {
      return "just now";
    }
    // Seconds
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    // Minutes
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }
    // Hours
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }
    // Days
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
    // Months
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    }
    // Years
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  }

  // For absolute dates
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
  };

  // Add date format options based on the format parameter
  switch (format) {
    case "short":
      dateFormatOptions.year = "numeric";
      dateFormatOptions.month = "numeric";
      dateFormatOptions.day = "numeric";
      break;
    case "medium":
      dateFormatOptions.year = "numeric";
      dateFormatOptions.month = "short";
      dateFormatOptions.day = "numeric";
      break;
    case "long":
      dateFormatOptions.year = "numeric";
      dateFormatOptions.month = "long";
      dateFormatOptions.day = "numeric";
      break;
    case "full":
      dateFormatOptions.year = "numeric";
      dateFormatOptions.month = "long";
      dateFormatOptions.day = "numeric";
      dateFormatOptions.weekday = "long";
      break;
  }

  // Add time if requested
  if (includeTime) {
    dateFormatOptions.hour = "numeric";
    dateFormatOptions.minute = "numeric";
    dateFormatOptions.hour12 = true;
  }

  return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(dateObj);
}

// Additional utility functions for specific date formatting needs
export const dateUtils = {
  // Format just the time
  formatTime(date: Date | string): string {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(date));
  },

  // Format just the date
  formatDateOnly(date: Date | string): string {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date(date));
  },

  // Get relative time with "from now" (future dates)
  formatFromNow(date: Date | string): string {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (dateObj.getTime() - now.getTime()) / 1000
    );

    if (diffInSeconds < 0) {
      return formatDate(date, { relative: true });
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return "in a few seconds";
    if (diffInMinutes < 60) return `in ${diffInMinutes} minutes`;
    if (diffInHours < 24) return `in ${diffInHours} hours`;
    if (diffInDays < 30) return `in ${diffInDays} days`;
    if (diffInMonths < 12) return `in ${diffInMonths} months`;
    return `in ${diffInYears} years`;
  },

  // Get month name
  getMonthName(date: Date | string, format: "short" | "long" = "long"): string {
    return new Intl.DateTimeFormat("en-US", { month: format }).format(
      new Date(date)
    );
  },

  // Get day name
  getDayName(date: Date | string, format: "short" | "long" = "long"): string {
    return new Intl.DateTimeFormat("en-US", { weekday: format }).format(
      new Date(date)
    );
  },

  // Check if date is today
  isToday(date: Date | string): boolean {
    const dateObj = new Date(date);
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  },

  // Check if date is yesterday
  isYesterday(date: Date | string): boolean {
    const dateObj = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateObj.toDateString() === yesterday.toDateString();
  },

  // Format with smart relative time
  formatSmartDate(date: Date | string): string {
    if (dateUtils.isToday(date)) {
      return `Today at ${dateUtils.formatTime(date)}`;
    }
    if (dateUtils.isYesterday(date)) {
      return `Yesterday at ${dateUtils.formatTime(date)}`;
    }
    return formatDate(date, { format: "medium", includeTime: true });
  },
};

// Usage examples:
/*
// Basic usage
formatDate('2024-01-15') // Jan 15, 2024

// With time
formatDate('2024-01-15', { includeTime: true }) // Jan 15, 2024, 12:00 PM

// Relative time
formatDate('2024-01-15', { relative: true }) // 2 months ago

// Different formats
formatDate('2024-01-15', { format: 'short' }) // 1/15/2024
formatDate('2024-01-15', { format: 'medium' }) // Jan 15, 2024
formatDate('2024-01-15', { format: 'long' }) // January 15, 2024
formatDate('2024-01-15', { format: 'full' }) // Monday, January 15, 2024

// Using utility functions
dateUtils.formatTime(new Date()) // 12:00 PM
dateUtils.formatDateOnly(new Date()) // 1/15/2024
dateUtils.formatFromNow('2024-12-25') // in 11 months
dateUtils.formatSmartDate(new Date()) // Today at 12:00 PM
*/
