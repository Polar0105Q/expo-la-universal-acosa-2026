# Google Sheets webhook para registros EXPO

1. Crea un Google Sheet nuevo llamado `Registros EXPO La Universal ACOSA 2026`.
2. En el menú del Sheet: Extensiones -> Apps Script.
3. Borra lo que aparezca y pega este código.
4. Dale Guardar.
5. Ejecuta una vez `setupSheet` y acepta permisos.
6. Ve a Implementar -> Nueva implementación.
7. Tipo: Aplicación web.
8. Ejecutar como: Tú.
9. Quién tiene acceso: Cualquier usuario.
10. Copia la URL de la app web y ponla en Vercel como `LEADS_WEBHOOK_URL`.

```javascript
const SHEET_NAME = 'Registros';
const HEADERS = [
  'Fecha de registro',
  'Nombre y Apellido',
  'Nombre de Empresa',
  'Correo electrónico',
  'Teléfono / WhatsApp',
  'Ubicación de Negocio',
  'Fecha de asistencia',
  'Cantidad de asistentes',
  'Categoría de interés'
];

function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#ff5a13')
    .setFontColor('#ffffff');
  sheet.getRange('E:E').setNumberFormat('@');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function asText(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
    }

    sheet.getRange('E:E').setNumberFormat('@');

    const nextRow = sheet.getLastRow() + 1;
    const row = [
      new Date(),
      asText(data.nombre || data.fullName),
      asText(data.empresa || data.companyName),
      asText(data.email),
      asText(data.telefono || data.phone),
      asText(data.ubicacion || data.businessLocation),
      asText(data.fecha || data.attendanceDate),
      asText(data.asistentes || data.attendeeCount),
      asText(data.categorias || data.interestCategories)
    ];

    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```
