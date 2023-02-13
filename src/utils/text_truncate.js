const text_truncate = function(str, length, ending) {
  str = str.replace(/(?:\r\n|\r|\n)/g, '<br>')
  str = str.replace(/\[([^\]]+)\]\(([^\)]+)\)/, '<a href="$2" style="color: rgb(29, 155, 240);">$1</a>');
  if (length == null) {
    length = 280;
  }
  if (ending == null) {
    ending = ' ... <br><a href="" style="color: rgb(29, 155, 240);">Show more</a>';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

export { text_truncate };