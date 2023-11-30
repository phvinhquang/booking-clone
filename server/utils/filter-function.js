exports.filterByType = function (arr, keyword) {
  const filteredArr = arr.filter((item) => item.type === keyword);

  return filteredArr;
};
