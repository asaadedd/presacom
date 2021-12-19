import { UploadedFile } from "express-fileupload";
import { read, utils } from "xlsx";
import { toArrayBuffer } from "./bufToArrayBuffer";

function formatTableData(data: string[][]): { [key: string]: string }[] {
  if (!data.length) {
    return [];
  }

  const headers = data[0];

  return data
    .slice(1)
    .map((row) => {
      return headers.reduce((acc, header, index) => {
        if (row[index] !== undefined) {
          acc[header] = row[index];
        }

        return acc;
      }, {})
    })
    .filter((row) => !!Object.keys(row).length);
}

export function getDataFromFile(file: UploadedFile): { [key: string]: string }[] {
  const wb = read(toArrayBuffer(file.data));
  const data: string[][] = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header:1 });

  return formatTableData(data);
}
