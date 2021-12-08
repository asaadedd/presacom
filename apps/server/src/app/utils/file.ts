export function formatTableData(data: string[][]): { [key: string]: string }[] {
  if (!data.length) {
    return [];
  }

  const headers = data[0];

  return data.slice(1).map((row) => {
    return headers.reduce((acc, header, index) => {
      acc[header] = row[index];

      return acc;
    }, {})
  })

}
