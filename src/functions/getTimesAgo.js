export default function GetTimesAgo(x) {
  if (x !== undefined) {
    let currentPostTime;
    let hoursAgo;
    let definedTitle;
    if (parseInt((new Date().getTime() - x * 1000) / 3600000) < parseInt(1)) {
      hoursAgo = ((new Date().getTime() - x * 1000) / 60000)?.toFixed(0);
      definedTitle = "min";
    } else {
      hoursAgo = ((new Date().getTime() - x * 1000) / 3600000)?.toFixed(0);
      definedTitle = "h";
    }
    if (new Date().getTime() - x * 1000 > 86400000) {
      currentPostTime = {
        numbers: "",
        title: new Date(x * 1000).toString().slice(4, 10),
      };
    } else {
      if (hoursAgo < 1 && definedTitle === "min") {
        currentPostTime = "Just now";
      } else if (hoursAgo >= 1 && definedTitle === "min") {
        currentPostTime = { numbers: hoursAgo, title: definedTitle };
      } else {
        if (definedTitle[4] === "0") {
          var timeTitle = definedTitle?.replace(definedTitle[4], "");
          currentPostTime = { numbers: hoursAgo, title: timeTitle };
        } else {
          currentPostTime = { numbers: hoursAgo, title: definedTitle };
        }
      }
    }
    return currentPostTime;
  }
}
