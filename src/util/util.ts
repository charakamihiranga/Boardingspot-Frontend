export const getTimeAgo = (dateString: string) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();

    if (isNaN(createdDate.getTime())) {
        return "Invalid date";
    }

    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime()); // Use .getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};