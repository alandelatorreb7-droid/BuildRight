const EXPORT_CATEGORIES = [
  { name: 'Materials',        slug: 'materials' },
  { name: 'Labor',            slug: 'labor' },
  { name: 'Concrete',         slug: 'concrete' },
  { name: 'Plumbing',         slug: 'plumbing' },
  { name: 'Electrical',       slug: 'electrical' },
  { name: 'HVAC',             slug: 'hvac' },
  { name: 'Framing',          slug: 'framing' },
  { name: 'Roofing',          slug: 'roofing' },
  { name: 'Finishes',         slug: 'finishes' },
  { name: 'Equipment Rental', slug: 'equipment' },
  { name: 'Permits & Fees',   slug: 'permits' },
];

// BuildRight brand palette (ARGB, fully opaque)
const C = {
  charcoal:  'FF1A1A2E',
  rust:      'FFC0392B',
  darkHdr:   'FF2D3748',
  white:     'FFFFFFFF',
  rowAlt:    'FFF1F5F9',
  muted:     'FF718096',
  secondary: 'FF4A5568',
  border:    'FFE2E8F0',
  text:      'FF1A202C',
};

const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
const fnt  = (opts)  => ({ name: 'Calibri', ...opts });

function buildSheet(wb, sheetName, items, includeCategory) {
  const ws = wb.addWorksheet(sheetName, {
    views:     [{ state: 'frozen', ySplit: 3 }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });

  if (includeCategory) {
    ws.columns = [
      { key: 'cat',   width: 18 },
      { key: 'name',  width: 36 },
      { key: 'desc',  width: 50 },
      { key: 'unit',  width: 11 },
      { key: 'price', width: 13 },
    ];
  } else {
    ws.columns = [
      { key: 'name',  width: 38 },
      { key: 'desc',  width: 52 },
      { key: 'unit',  width: 11 },
      { key: 'price', width: 13 },
    ];
  }

  const colCount      = includeCategory ? 5 : 4;
  const lastColLetter = 'ABCDE'[colCount - 1];
  const dateStr       = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  // ── Row 1: Title banner ──────────────────────────────────────
  ws.mergeCells(`A1:${lastColLetter}1`);
  const r1 = ws.getRow(1);
  r1.height = 32;
  r1.getCell(1).value = `BuildRight Construction Price List  ·  El Paso, TX  ·  ${dateStr}`;
  r1.getCell(1).style = {
    font:      fnt({ bold: true, size: 13, color: { argb: C.white } }),
    fill:      fill(C.charcoal),
    alignment: { vertical: 'middle', horizontal: 'left', indent: 1 },
  };

  // ── Row 2: Category sub-header ───────────────────────────────
  ws.mergeCells(`A2:${lastColLetter}2`);
  const r2 = ws.getRow(2);
  r2.height = 20;
  r2.getCell(1).value = `${sheetName}  —  ${items.length} item${items.length !== 1 ? 's' : ''}`;
  r2.getCell(1).style = {
    font:      fnt({ bold: true, size: 10, color: { argb: C.white } }),
    fill:      fill(C.rust),
    alignment: { vertical: 'middle', horizontal: 'left', indent: 1 },
  };

  // ── Row 3: Column headers ────────────────────────────────────
  const headers = includeCategory
    ? ['Category', 'Item Name', 'Description', 'Unit', 'Price']
    : ['Item Name', 'Description', 'Unit', 'Price'];

  const r3 = ws.getRow(3);
  r3.height = 22;
  headers.forEach((h, i) => {
    const isPrice = h === 'Price';
    const isUnit  = h === 'Unit';
    const cell    = r3.getCell(i + 1);
    cell.value    = h;
    cell.style    = {
      font:      fnt({ bold: true, size: 10, color: { argb: C.white } }),
      fill:      fill(C.darkHdr),
      alignment: {
        vertical:   'middle',
        horizontal: isPrice ? 'right' : isUnit ? 'center' : 'left',
        indent:     (isPrice || isUnit) ? 0 : 1,
      },
      border: { bottom: { style: 'medium', color: { argb: C.charcoal } } },
    };
  });

  // ── Data rows ────────────────────────────────────────────────
  items.forEach((item, idx) => {
    const bg  = idx % 2 === 0 ? C.white : C.rowAlt;
    const row = ws.addRow(
      includeCategory
        ? [item.category_name || '', item.name, item.description || '', item.unit, parseFloat(item.unit_price)]
        : [item.name, item.description || '', item.unit, parseFloat(item.unit_price)]
    );
    row.height = 18;

    row.eachCell({ includeEmpty: true }, (cell, col) => {
      const isPrice = col === colCount;
      const isUnit  = col === colCount - 1;
      const isDesc  = includeCategory ? col === 3 : col === 2;
      cell.style = {
        font: fnt({
          size:  9.5,
          color: { argb: isDesc ? C.secondary : isUnit ? C.muted : C.text },
        }),
        fill:      fill(bg),
        alignment: {
          vertical:   'middle',
          horizontal: isPrice ? 'right' : isUnit ? 'center' : 'left',
          indent:     (isPrice || isUnit) ? 0 : 1,
        },
        numFmt: isPrice ? '"$"#,##0.00' : undefined,
        border: { bottom: { style: 'hair', color: { argb: C.border } } },
      };
    });
  });

  // ── Footer ───────────────────────────────────────────────────
  ws.addRow([]);
  const fNum = ws.rowCount + 1;
  ws.mergeCells(`A${fNum}:${lastColLetter}${fNum}`);
  const fr = ws.getRow(fNum);
  fr.height = 16;
  fr.getCell(1).value =
    `BuildRight  ·  El Paso, TX  ·  Prices updated ${new Date().toLocaleDateString('en-US')}  ·  Regional 2024/2025 pricing`;
  fr.getCell(1).style = {
    font:      fnt({ italic: true, size: 8, color: { argb: C.muted } }),
    alignment: { horizontal: 'center' },
  };
}

export async function exportPriceList(items) {
  const { default: ExcelJS } = await import('exceljs');
  const wb      = new ExcelJS.Workbook();
  wb.creator    = 'BuildRight';
  wb.created    = new Date();
  wb.modified   = new Date();

  // Summary sheet — all categories with a Category column
  buildSheet(wb, 'All Items', items, true);

  // One sheet per category
  EXPORT_CATEGORIES.forEach(({ name, slug }) => {
    const catItems = items.filter(i => i.category_slug === slug);
    if (catItems.length) buildSheet(wb, name, catItems, false);
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `BuildRight_Price_List_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
