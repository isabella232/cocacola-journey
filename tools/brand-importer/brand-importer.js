function createTable(name, tableData, keys) {
  const table = document.createElement('table');
  table.innerHTML = `<tr><th colspan="${keys.length}">${name}</th>`;
  tableData.forEach((row) => {
    const tr = document.createElement('tr');
    keys.forEach((key) => {
      const td = document.createElement('td');
      td.textContent = row[key] || '';
      tr.append(td);
    });
    table.append(tr);
  });
  return (table);
}

{
  const h1 = document.querySelector('h1');
  const image = document.querySelector('.product-img');
  const nutritionData = {};
  const facts = [];
  document.querySelectorAll('.tabs .row').forEach((row) => {
    const label = row.dataset.nutritionLabel;
    if (label) {
      let fact = nutritionData[label];
      if (!fact) {
        fact = { label };
        facts.push( fact );
        nutritionData[label] = fact;
      }

      [...row.children].forEach((cell) => {
        let col = 'value';
        if (cell.classList.contains('fact-name')) col = 'name';
        if (cell.classList.contains('isDI')) col = 'isDI';
        if (cell.classList.contains('isRDI')) col = 'isRDI';
        fact[col] = cell.textContent;
      });
    }
  });
  document.body.textContent = '';
  document.body.append(h1, image, createTable('Nutrition Facts', facts, ['label', 'name', 'value', 'isDI', 'isRDI']));
}