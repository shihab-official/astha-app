import * as xlsx from 'sheetjs-style';
import moment from 'moment';

const generateXLSX = function(timeLogs) {
  const timeLog = timeLogs[0];
  const date = moment(timeLog.date).format('DD-MMM-YYYY');
  const workbook = xlsx.utils.book_new();

  const logs = timeLog.data;
  const users = Array.from(new Set(logs.map((d) => d.name)));
  const header1 = [],
    header2 = [],
    rowValues = [];

  users.forEach((user, i) => {
    if (i > 0) {
      header1.push('');
      header2.push('');
    }
    header1.push(user);
    header1.push('');
    header2.push('Entry');
    header2.push('Exit');
  });

  logs.forEach((l, i) => {
    if (i > 0) {
      rowValues.push('');
    }
    rowValues.push(l.entry ? moment(l.entry).format('h:mm a') : '');
    rowValues.push(l.exit ? moment(l.exit).format('h:mm a') : '');
  });

  const worksheet = xlsx.utils.aoa_to_sheet([header1, header2, rowValues]);
  for (let i in worksheet) {
    if (typeof worksheet[i] != 'object') continue;
    let cell = xlsx.utils.decode_cell(i);

    if (cell.r == 0) {
      // first row
      worksheet[i].s = {
        font: {
          sz: 12,
          bold: true,
          italic: true,
        },
      };
    } else if (cell.r == 1) {
      // second row
      worksheet[i].s = {
        font: {
          bold: true,
          italic: true,
          color: { rgb: '808080' },
        },
      };
    } else if (cell.r == 2) {
      // third row
      if (cell.c % 3 == 0) {
        worksheet[i].s = {
          font: {
            bold: true,
            color: { rgb: '16a34a' },
          },
        };
      } else if (cell.c % 3 == 1) {
        worksheet[i].s = {
          font: {
            bold: true,
            color: { rgb: 'dc2626' },
          },
        };
      }
    }
  }

  xlsx.utils.book_append_sheet(workbook, worksheet, date);
  const binary = xlsx.write(workbook, { bookType: 'xlsx', type: 'binary' });
  let buffer = new ArrayBuffer(binary.length); //convert binary to arrayBuffer
  const view = new Uint8Array(buffer); //create uint8array as viewer
  for (var i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i) & 0xff; //convert to octet
  }
  return buffer;
}

export { generateXLSX };