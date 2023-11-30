module.exports = (data, req) => {
  const page = Number(req.query.page) || 1;
  const resultsPerPage = Number(req.query.resultsPerPage) || data.length;
  const totalPage = Math.ceil(data.length / resultsPerPage);

  const startIndex = (page - 1) * resultsPerPage;
  const endIndex = page * resultsPerPage;

  const finalResult = {};

  if (page > totalPage) {
    finalResult.error = "Not found";
  }

  finalResult.page = page;
  finalResult.total_pages = totalPage;
  finalResult.results = data.slice(startIndex, endIndex);

  return finalResult;
};
