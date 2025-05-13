const getVisiblePages = (currentPage: number, totalPages: number, visibleRange: number = 2): number[] => {
  let startPage = Math.max(1, currentPage - visibleRange);
  let endPage = Math.min(totalPages, currentPage + visibleRange);

  if (currentPage <= visibleRange + 1) {
    endPage = Math.min(1 + visibleRange * 2, totalPages);
  }

  if (currentPage >= totalPages - visibleRange) {
    startPage = Math.max(1, totalPages - visibleRange * 2);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};

export default getVisiblePages;
