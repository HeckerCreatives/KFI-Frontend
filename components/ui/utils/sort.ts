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
