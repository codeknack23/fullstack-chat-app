// export function formatMessageTime(date) {
//   return new Date(date).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// }

export function formatMessageTime(date) {
  const messageDate = new Date(date);
  const currentDate = new Date();

  // Check if the date is today
  const isToday = messageDate.toDateString() === currentDate.toDateString();

  if (isToday) {
    // Return only the time for today's messages
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    // Return a shortened date and time for older messages
    return messageDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
}


export function formatLastSeen(date) {
  const lastSeenDate = new Date(date);
  const currentDate = new Date();
  const timeDiff = currentDate - lastSeenDate; // Time difference in milliseconds

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // If last seen within the last minute
  if (seconds < 60) {
    return `Last seen ${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }

  // If last seen within the last hour
  if (minutes < 60) {
    return `Last seen ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  // If last seen within the last 24 hours
  if (hours < 24) {
    return `Last seen ${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  // If last seen more than 24 hours ago, show the date
  return `Last seen ${lastSeenDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}


