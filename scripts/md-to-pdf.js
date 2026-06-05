const fs = require('fs');
const PDFDocument = require('pdfkit');

const mdPath = 'CHECKLIST.md';
const outPath = 'checklist.pdf';

const md = fs.readFileSync(mdPath, 'utf8');
const lines = md.split(/\r?\n/);

const doc = new PDFDocument({ autoFirstPage: false });
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

doc.addPage({ margin: 50 });
const maxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

function writeLine(text, opts = {}) {
  const { fontSize = 11, indent = 0, bold = false } = opts;
  doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(fontSize);
  const x = doc.x + indent;
  const y = doc.y;
  doc.text(text, { width: maxWidth - indent, indent: indent });
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trimEnd();
  if (!line) {
    doc.moveDown(0.5);
    continue;
  }
  if (line.startsWith('Feature checklist')) {
    writeLine(line, { fontSize: 18, bold: true });
    doc.moveDown(0.5);
    continue;
  }
  if (line.startsWith('- ')) {
    const content = line.replace(/^-\s+/, '• ');
    writeLine(content, { fontSize: 12, indent: 10 });
    continue;
  }
  if (line.startsWith('  - ')) {
    const content = line.replace(/^\s*-\s+/, '◦ ');
    writeLine(content, { fontSize: 11, indent: 20 });
    continue;
  }
  // fallback
  writeLine(line);
}

doc.end();

stream.on('finish', () => {
  console.log('PDF generated:', outPath);
});
