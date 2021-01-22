export default function TextStore() {
  function truncate(str, n, useWordBoundary) {
    if (str.length <= n) {
      return str;
    }
    const subString = str.substr(0, n - 1); // the original check
    return (
      (useWordBoundary
        ? subString.substr(0, subString.lastIndexOf(" "))
        : subString) + "…"
    );
  }
  function truncateAndClamps(str, n, useWordBoundary) {
    let string = str.replace(/\(.*?\)/, "");
    return truncate(string, n, useWordBoundary);
  }
  return {
    truncate,
    truncateAndClamps,
  };
}
