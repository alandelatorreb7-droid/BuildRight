import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// RGB color palette — mirrors the app's design tokens
const CH  = [26,  26,  46 ]; // --charcoal
const RST = [192, 57,  43 ]; // --rust
const BG  = [248, 249, 250]; // --bg
const BDR = [226, 232, 240]; // --border
const TXT = [26,  32,  44 ]; // --text-primary
const MUT = [113, 128, 150]; // --text-muted
const AMB = [180, 83,  9  ]; // --amber
const WHT = [255, 255, 255];
const TH  = [38,  38,  65 ]; // table head (slightly lighter charcoal)
const STR = [252, 252, 254]; // table stripe
const SUB = [243, 244, 248]; // subtotal row bg

export function generatePDF({
  projectName, clientName,
  companyName, contractorPhone, contractorEmail, contractorLicense,
  materials, labor, other,
  matSub, labSub, othSub,
  base, margin, profit, total,
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const W  = doc.internal.pageSize.getWidth();   // 215.9 mm
  const H  = doc.internal.pageSize.getHeight();  // 279.4 mm
  const ML = 16, MR = 16;
  const CW = W - ML - MR;                        // 183.9 mm

  // ── Helpers ───────────────────────────────────────────────────────────────
  const set = (font, style, size, color) => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  // ── 1. Header bar ─────────────────────────────────────────────────────────
  doc.setFillColor(...CH);
  doc.rect(0, 0, W, 20, 'F');

  // BR badge
  doc.setFillColor(...RST);
  doc.roundedRect(ML, 4, 12, 12, 1.5, 1.5, 'F');
  set('helvetica', 'bold', 7.5, WHT);
  doc.text('BR', ML + 6, 11.6, { align: 'center' });

  // Wordmark
  set('helvetica', 'bold', 13, WHT);
  doc.text('BuildRight', ML + 15, 12);

  // Right tag
  set('helvetica', 'normal', 7, [158, 163, 190]);
  doc.text('CONSTRUCTION ESTIMATOR', W - MR, 12, { align: 'right' });

  // ── 2. Contractor info (left) + Estimate meta (right) ─────────────────────
  let leftY = 28;

  if (companyName) {
    set('helvetica', 'bold', 11, TXT);
    doc.text(companyName, ML, leftY);
    leftY += 5;
  }
  set('helvetica', 'normal', 8.5, MUT);
  if (contractorPhone)   { doc.text(contractorPhone,              ML, leftY); leftY += 4.5; }
  if (contractorEmail)   { doc.text(contractorEmail,              ML, leftY); leftY += 4.5; }
  if (contractorLicense) { doc.text(`License: ${contractorLicense}`, ML, leftY); leftY += 4.5; }

  // "ESTIMATE" heading — large, rust, right-aligned
  set('helvetica', 'bold', 22, RST);
  doc.text('ESTIMATE', W - MR, 35, { align: 'right' });

  const estimateNo = `EST-${new Date().getFullYear()}` +
    `${String(new Date().getMonth() + 1).padStart(2, '0')}` +
    `${String(new Date().getDate()).padStart(2, '0')}-` +
    `${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  set('helvetica', 'normal', 8.5, MUT);
  doc.text(`No. ${estimateNo}`, W - MR, 44,   { align: 'right' });
  doc.text(dateStr,             W - MR, 49.5, { align: 'right' });

  let y = Math.max(leftY, 54) + 5;

  // ── 3. Separator ──────────────────────────────────────────────────────────
  doc.setDrawColor(...BDR);
  doc.setLineWidth(0.25);
  doc.line(ML, y, W - MR, y);
  y += 7;

  // ── 4. Project / client box ───────────────────────────────────────────────
  if (projectName || clientName) {
    const lines  = [projectName, clientName].filter(Boolean);
    const boxH   = 9 + lines.length * 5.5 + 3;

    doc.setFillColor(...BG);
    doc.roundedRect(ML, y, CW, boxH, 2, 2, 'F');
    doc.setDrawColor(...BDR);
    doc.setLineWidth(0.2);
    doc.roundedRect(ML, y, CW, boxH, 2, 2, 'S');

    set('helvetica', 'bold', 6.5, MUT);
    doc.text('PREPARED FOR', ML + 7, y + 5.5);

    let bY = y + 11;
    if (projectName) {
      set('helvetica', 'bold', 10, TXT);
      doc.text(projectName, ML + 7, bY);
      bY += 5.5;
    }
    if (clientName) {
      set('helvetica', 'normal', 9, MUT);
      doc.text(clientName, ML + 7, bY);
    }
    y += boxH + 7;
  }

  // ── 5. Items table ────────────────────────────────────────────────────────
  const body = [];

  const pushSection = (title, items, sub) => {
    if (!items.length) return;

    // Section header row
    body.push([{
      content: title.toUpperCase(),
      colSpan: 6,
      styles: {
        fillColor: CH, textColor: WHT, fontStyle: 'bold', fontSize: 7.5,
        cellPadding: { top: 3.5, bottom: 3.5, left: 6, right: 6 },
      },
    }]);

    // Item rows
    items.forEach(item => {
      const nameText = item.description
        ? `${item.name}\n${item.description}`
        : item.name;
      const qtyText = (+item.qty % 1 === 0)
        ? String(item.qty)
        : (+item.qty).toFixed(2);

      body.push([
        { content: nameText },
        { content: item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1), styles: { halign: 'center', textColor: MUT } },
        { content: qtyText,              styles: { halign: 'center' } },
        { content: item.unit,            styles: { halign: 'center', textColor: MUT } },
        { content: fmt(item.unit_price), styles: { halign: 'right'  } },
        { content: fmt(item.unit_price * item.qty), styles: { halign: 'right', fontStyle: 'bold' } },
      ]);
    });

    // Subtotal row
    body.push([
      { content: '', colSpan: 4, styles: { fillColor: SUB } },
      { content: `${title} Subtotal`, styles: { fillColor: SUB, fontStyle: 'bold', fontSize: 8, halign: 'right', textColor: MUT } },
      { content: fmt(sub),            styles: { fillColor: SUB, fontStyle: 'bold', halign: 'right', textColor: TXT } },
    ]);
  };

  pushSection('Materials', materials, matSub);
  pushSection('Labor',     labor,     labSub);
  pushSection('Other',     other,     othSub);

  autoTable(doc, {
    startY: y,
    margin: { left: ML, right: MR },
    head: [[
      { content: 'Description' },
      { content: 'Type',       styles: { halign: 'center' } },
      { content: 'Qty',        styles: { halign: 'center' } },
      { content: 'Unit',       styles: { halign: 'center' } },
      { content: 'Unit Price', styles: { halign: 'right'  } },
      { content: 'Amount',     styles: { halign: 'right'  } },
    ]],
    body,
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: { top: 3, bottom: 3, left: 6, right: 6 },
      textColor: TXT,
    },
    headStyles: {
      fillColor: TH, textColor: WHT, fontStyle: 'bold', fontSize: 8,
      cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
    },
    columnStyles: {
      0: { cellWidth: 'auto'           }, // Description — fills remaining space
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 26, halign: 'right'  },
      5: { cellWidth: 28, halign: 'right'  },
    },
    alternateRowStyles: { fillColor: STR },
    tableLineColor: BDR,
    tableLineWidth: 0.2,
    showHead: 'firstPage',
  });

  y = doc.lastAutoTable.finalY + 10;

  // ── 6. Totals block ───────────────────────────────────────────────────────
  const sectionCount =
    (materials.length > 0 ? 1 : 0) +
    (labor.length     > 0 ? 1 : 0) +
    (other.length     > 0 ? 1 : 0);
  const totalsH = sectionCount * 7 + 52; // generous pre-calculated height
  const footerH = 68;                    // notes + signature + footer text

  if (y + totalsH + footerH > H - 8) {
    doc.addPage();
    y = 20;
  }

  const BW = 85;           // block width
  const BX = W - MR - BW; // block x
  const LX = BX + 8;      // label x (inside block)
  const VX = BX + BW - 8; // value x (inside block, right-aligned)

  // Draw background first (so text renders on top)
  doc.setFillColor(...BG);
  doc.roundedRect(BX, y, BW, totalsH, 2, 2, 'F');
  doc.setDrawColor(...BDR);
  doc.setLineWidth(0.25);
  doc.roundedRect(BX, y, BW, totalsH, 2, 2, 'S');

  let tY = y + 10;

  const tRow = (label, value, bold = false, color = TXT) => {
    set('helvetica', bold ? 'bold' : 'normal', 9, color);
    doc.text(label, LX, tY);
    doc.text(value, VX, tY, { align: 'right' });
    tY += 6.5;
  };

  if (materials.length) tRow('Materials',   fmt(matSub));
  if (labor.length)     tRow('Labor',       fmt(labSub));
  if (other.length)     tRow('Other',       fmt(othSub));

  // Thin separator before base cost
  doc.setDrawColor(...BDR);
  doc.setLineWidth(0.2);
  doc.line(LX, tY, VX, tY);
  tY += 5;

  tRow('Base Cost',           fmt(base),   true);
  tRow(`Margin (${margin}%)`, fmt(profit), false, AMB);

  // Rust accent line before grand total
  doc.setDrawColor(...RST);
  doc.setLineWidth(0.5);
  doc.line(LX, tY, VX, tY);
  tY += 5;

  // Grand total — two-size row (label smaller, value larger)
  set('helvetica', 'bold', 9.5, TXT);
  doc.text('TOTAL ESTIMATE', LX, tY);
  set('helvetica', 'bold', 15, RST);
  doc.text(fmt(total), VX, tY, { align: 'right' });

  y += totalsH + 10;

  // ── 7. Notes & terms ──────────────────────────────────────────────────────
  doc.setDrawColor(...BDR);
  doc.setLineWidth(0.25);
  doc.line(ML, y, W - MR, y);
  y += 7;

  set('helvetica', 'bold', 7, MUT);
  doc.text('NOTES & TERMS', ML, y);
  y += 5;

  set('helvetica', 'normal', 8, MUT);
  const noteLines = [
    'This estimate is valid for 30 days from the date shown above. Prices reflect current material and labor costs',
    'for El Paso, TX (2024/2025). Final costs may vary based on actual site conditions and material availability.',
    'Payment terms: 50% deposit upon contract signing, balance due upon project completion.',
  ];
  noteLines.forEach(line => { doc.text(line, ML, y); y += 4.5; });

  // ── 8. Signature lines ────────────────────────────────────────────────────
  y += 8;
  const SIG_W  = 72; // signature line width
  const DATE_X = ML + SIG_W + 10;
  const DATE_W = 44;

  const drawSigRow = (sigLabel, dateLabel) => {
    doc.setDrawColor(...BDR);
    doc.setLineWidth(0.3);
    doc.line(ML,     y, ML + SIG_W,          y);
    doc.line(DATE_X, y, DATE_X + DATE_W,     y);
    set('helvetica', 'normal', 7.5, MUT);
    doc.text(sigLabel,  ML,     y + 4);
    doc.text(dateLabel, DATE_X, y + 4);
    y += 16;
  };

  drawSigRow('Authorized Signature', 'Date');
  drawSigRow('Client / Owner Acceptance', 'Date');

  // ── 9. Footer ─────────────────────────────────────────────────────────────
  set('helvetica', 'normal', 7, [178, 183, 196]);
  doc.text(
    'Generated by BuildRight Construction Estimator  ·  El Paso, TX',
    W / 2, H - 7, { align: 'center' },
  );

  // ── Save ──────────────────────────────────────────────────────────────────
  const safeName = (projectName || 'estimate')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  const dateTag = new Date().toISOString().split('T')[0];
  doc.save(`buildright_${safeName}_${dateTag}.pdf`);
}
