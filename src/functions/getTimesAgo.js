export default function GetTimesAgo(x, y) {
  if (x) {
    const timesAgoInSeconds = ((new Date().getTime() - x) / 1000).toFixed(0);
    const timesAgoInMinutes = (timesAgoInSeconds / 60).toFixed(0);
    const timesAgoInHours = (timesAgoInMinutes / 60).toFixed(0);
    let currentPostTime;
    if (timesAgoInSeconds < 61) {
      currentPostTime = { numbers: '', title: 'Just Now' };
    } else if (timesAgoInSeconds > 60 && timesAgoInSeconds < 3601) {
      currentPostTime = { numbers: timesAgoInMinutes, title: 'min' };
    } else if (timesAgoInSeconds > 3601 && timesAgoInSeconds < 86400) {
      currentPostTime = { numbers: timesAgoInHours, title: 'h' };
    } else {
      currentPostTime = { numbers: '', title: y?.slice(0, 10) };
    }

    return currentPostTime;
  }
}
