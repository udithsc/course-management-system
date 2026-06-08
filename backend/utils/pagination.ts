export interface PaginationOptions {
  pageNo?: string;
  pageSize?: string;
  searchText?: string;
  searchField?: string;
}

export const getPaginationParams = (query: any, defaultSize = 10) => {
  const pageNo = parseInt(query.pageNo as string, 10) || 0;
  const pageSize = parseInt(query.pageSize as string, 10) || defaultSize;
  const searchText = (query.name as string) || (query.searchText as string) || '';

  return { pageNo, pageSize, searchText };
};

export const paginate = async (
  model: any,
  query: any,
  options: {
    searchField?: string;
    include?: any;
    select?: any;
    orderBy?: any;
    where?: any;
  } = {},
) => {
  const { pageNo, pageSize, searchText } = getPaginationParams(query);
  const {
    searchField = 'name',
    include,
    select,
    orderBy,
    where: extraWhere = {},
  } = options;

  const where = {
    ...extraWhere,
    ...(searchText
      ? { [searchField]: { contains: searchText, mode: 'insensitive' as const } }
      : {}),
  };

  const totalElements = await model.count({ where });
  const totalPages = Math.ceil(totalElements / pageSize);

  const data = await model.findMany({
    where,
    skip: pageNo * pageSize,
    take: pageSize,
    include,
    select,
    orderBy: orderBy || { [searchField]: 'asc' as const },
  });


  return { data, totalElements, pageNo, totalPages };
};
