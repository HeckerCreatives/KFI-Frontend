export function filterAndSortClients(
  clients: any[],
  search: string,
  sort: string,
  status: string = '',
  dateReleased: string = '',
  dateResigned: string = ''
) {
  let result = [...clients].filter(c => c.action !== 'delete');

  if (status) {
    result = result.filter(c => c.memberStatus === status);
  }

  if (dateReleased) {
    result = result.filter(c => c.dateRelease?.startsWith(dateReleased));
  }

  if (dateResigned) {
    result = result.filter(c => c.dateResigned?.startsWith(dateResigned));
  }

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.acctNumber?.toLowerCase().includes(term) ||
      c.name?.toLowerCase().includes(term)
    );
  }

  switch (sort) {
    case 'acctno-asc':
      result.sort((a, b) =>
        (a.acctNumber || '').localeCompare(b.acctNumber || '', 'en', { sensitivity: 'base' })
      );
      break;
    case 'acctno-desc':
      result.sort((a, b) =>
        (b.acctNumber || '').localeCompare(a.acctNumber || '', 'en', { sensitivity: 'base' })
      );
      break;
    case 'name-asc':
      result.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' })
      );
      break;
    case 'name-desc':
      result.sort((a, b) =>
        (b.name || '').localeCompare(a.name || '', 'en', { sensitivity: 'base' })
      );
      break;
    default:
      result.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' })
      );
  }

  return result;
}

export function filterAndSortCenter(center: any, search: string, sort: any) {
  let result = [...center];
  // --- SEARCH ---
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.centerNo?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term)
    );
  }

  // --- SORT ---
  switch (sort) {
    case "centerno-asc":
      result.sort((a, b) => a.centerNo.localeCompare(b.centerNo));
      break;
    case "centerno-desc":
      result.sort((a, b) => b.centerNo.localeCompare(a.centerNo));
      break;
    case "description-asc":
      result.sort((a, b) => a.description.localeCompare(b.description));
      break;
    case "description-desc":
      result.sort((a, b) => b.description.localeCompare(a.description));
      break;
  }

  return result;
}

export function filterAndSortBusinessTypes(types: any, search: string, sort: any) {
  let result = [...types];
  // --- SEARCH ---
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.type?.toLowerCase().includes(term)
    );
  }

  // --- SORT ---
  switch (sort) {
    case "type-asc":
      result.sort((a, b) => a.type.localeCompare(b.type));
      break;
    case "type-desc":
      result.sort((a, b) => b.type.localeCompare(a.type));
      break;
  }

  return result;
}

export function filterAndSortGOA(data: any, search: string, sort: any) {
  let result = [...data];
  // --- SEARCH ---
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.code?.toLowerCase().includes(term)
    );
  }

  // --- SORT ---
  switch (sort) {
    case "code-asc":
      result.sort((a, b) => a.code.localeCompare(b.code));
      break;
    case "code-desc":
      result.sort((a, b) => b.code.localeCompare(a.code));
      break;
    // case "description-asc":
    //   result.sort((a, b) => a.description.localeCompare(b.description));
    //   break;
    // case "description-desc":
    //   result.sort((a, b) => b.description.localeCompare(a.description));
    //   break;
  }

  return result;

}

export function filterAndSortCOA(data: any, search: string, sort: any) {
  let result = [...data];
  // --- SEARCH ---
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.code?.toLowerCase().includes(term)
    );
  }

  // --- SORT ---
  switch (sort) {
    case "code-asc":
      result.sort((a, b) => a.code.localeCompare(b.code));
      break;
    case "code-desc":
      result.sort((a, b) => b.code.localeCompare(a.code));
      break;
     case "description-asc":
       result.sort((a, b) => a.description.localeCompare(b.description));
       break;
     case "description-desc":
       result.sort((a, b) => b.description.localeCompare(a.description));
       break;
  }

  return result;

}

export function filterAndSortBanks(data: any, search: string, sort: any) {
  let result = [...data];
  // --- SEARCH ---
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.code?.toLowerCase().includes(term) || 
      c.description?.toLowerCase().includes(term)

    );
  }

  // --- SORT ---
  switch (sort) {
    case "code-asc":
      result.sort((a, b) => a.code.localeCompare(b.code));
      break;
    case "code-desc":
      result.sort((a, b) => b.code.localeCompare(a.code));
      break;
     case "description-asc":
       result.sort((a, b) => a.description.localeCompare(b.description));
       break;
     case "description-desc":
       result.sort((a, b) => b.description.localeCompare(a.description));
       break;
  }

  return result;

}

export function filterAndSortSavings(data: any, search: string, sort: any) {
  console.log(sort, data)
  let result = [...data];
  //  if (search) {
  //    const term = search.toLowerCase();
  //    result = result.filter(c =>
  //      c.rangeAmountFrom?.toLowerCase().includes(term)
  //    );
  //  }

   switch (sort) {
    case "from-asc":
      result.sort((a, b) => Number(a.rangeAmountFrom) - Number(b.rangeAmountFrom));
      break;

    case "from-desc":
      result.sort((a, b) => Number(b.rangeAmountFrom) - Number(a.rangeAmountFrom));
      break;

    case "to-asc":
      result.sort((a, b) => Number(a.rangeAmountTo) - Number(b.rangeAmountTo));
      break;

    case "to-desc":
      result.sort((a, b) => Number(b.rangeAmountTo) - Number(a.rangeAmountTo));
      break;
  }

  return result;

}

export function filterAndSortSuppliers(data: any, search: string, sort: any) {
  console.log(sort, data)
  let result = [...data];
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.code?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) 
    );
  }

  switch (sort) {
    case "code-asc":
      result.sort((a, b) => a.code.localeCompare(b.code));
      break;
    case "code-desc":
      result.sort((a, b) => b.code.localeCompare(a.code));
      break;
     case "description-asc":
       result.sort((a, b) => a.description.localeCompare(b.description));
       break;
     case "description-desc":
       result.sort((a, b) => b.description.localeCompare(a.description));
       break;
  }

  return result;

}

export function filterAndSortNatures(data: any, search: string, sort: any) {
  console.log(sort, data)
  let result = [...data];
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.nature?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) 
    );
  }

  return result;

}

export function filterAndSortProducts(data: any, search: string, sort: any) {
  let result = [...data];
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.code?.toLowerCase().includes(term)
    );
  }

  switch (sort) {
    case "code-asc":
      result.sort((a, b) => a.code.localeCompare(b.code));
      break;
    case "code-desc":
      result.sort((a, b) => b.code.localeCompare(a.code));
      break;
   
  }

  return result;

}

export function filterAndSortLoanRelease(
  data: any[],
  search: string,
  sort: string,
  from: string,
  to: string
) {
  let result = [...data];

  // Date range filter (normalize to midnight to avoid time-of-day issues)
  if (from || to) {
    const fromDate = from ? new Date(new Date(from).setHours(0, 0, 0, 0)) : null;
    const toDate = to ? new Date(new Date(to).setHours(23, 59, 59, 999)) : null;

    result = result.filter(c => {
      const itemDate = new Date(c.date);
      if (isNaN(itemDate.getTime())) return false; // skip invalid dates
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });
  }

  //  Search: by code, bank, checkNo, encodedBy
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.code?.toLowerCase().includes(term)
    );
  }

  //  Sort: all SORTS cases handled
  switch (sort) {
    case 'code-asc':
      result.sort((a, b) => (a.code || a.cvNo).localeCompare(b.code || b.cvNo, 'en', { sensitivity: 'base' }));
      break;
    case 'code-desc':
      result.sort((a, b) => (b.code || b.cvNo).localeCompare(a.code || a.cvNo, 'en', { sensitivity: 'base' }));
      break;
    case 'date-asc':
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case 'date-desc':
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'bank-asc':
      result.sort((a, b) => (a.bank || '').localeCompare(b.bank || '', 'en', { sensitivity: 'base' }));
      break;
    case 'bank-desc':
      result.sort((a, b) => (b.bank || '').localeCompare(a.bank || '', 'en', { sensitivity: 'base' }));
      break;
    case 'checkno-asc':
      result.sort((a, b) => (a.checkNo || '').localeCompare(b.checkNo || '', 'en', { sensitivity: 'base' }));
      break;
    case 'checkno-desc':
      result.sort((a, b) => (b.checkNo || '').localeCompare(a.checkNo || '', 'en', { sensitivity: 'base' }));
      break;
    case 'amount-asc':
      result.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
      break;
    case 'amount-desc':
      result.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
      break;
    case 'encodedby-asc':
      result.sort((a, b) => (a.encodedBy || '').localeCompare(b.encodedBy || '', 'en', { sensitivity: 'base' }));
      break;
    case 'encodedby-desc':
      result.sort((a, b) => (b.encodedBy || '').localeCompare(a.encodedBy || '', 'en', { sensitivity: 'base' }));
      break;
    default:
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return result;
}



