export default function GetTimesAgo(x) {
  if (x !== undefined) {
    let currentPostTime;
    let hoursAgo;
    let definetTitle;
    if (parseInt((new Date().getTime() - x * 1000) / 3600000) < parseInt(1)) {
      hoursAgo = ((new Date().getTime() - x * 1000) / 60000)?.toFixed(0);
      definetTitle = "min";
    } else {
      hoursAgo = ((new Date().getTime() - x * 1000) / 3600000)?.toFixed(0);
      definetTitle = "h";
    }
    if (new Date().getTime() - x * 1000 > 86400000) {
      currentPostTime = new Date(x * 1000).toString().slice(4, 15);
    } else {
      if (hoursAgo < 1 && definetTitle === "min") {
        currentPostTime = "Just now";
      } else if (hoursAgo >= 1 && definetTitle === "min") {
        return (currentPostTime = hoursAgo + definetTitle);
      } else {
        currentPostTime = { numbers: hoursAgo, title: definetTitle };
      }
    }

    return currentPostTime;
  }
}
