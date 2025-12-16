export function filterAndSortClients(clients: any, search: string, sort: any) {
  let result = [...clients];

  console.log('clients', clients)

  // --- SEARCH ---
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c =>
      c.acctNumber?.toLowerCase().includes(term) ||
      c.name?.toLowerCase().includes(term)
    );
  }

  // --- SORT ---
  switch (sort) {
    case "acctno-asc":
      result.sort((a, b) => a.acctNumber.localeCompare(b.acctno));
      break;
    case "acctno-desc":
      result.sort((a, b) => b.acctNumber.localeCompare(a.acctno));
      break;
    case "name-asc":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
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
  data: any,
  search: any,
  sort: any,
  from: any,
  to: any
) {
  let result = [...data];


  
  if (from || to) {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    result = result.filter(c => {
      const itemDate = new Date(c.date); 

      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;

      return true;
    });
  }

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



