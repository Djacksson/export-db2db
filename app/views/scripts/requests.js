function onSelectTable() {
  const tableName = { table_name: document.getElementById('select_table').value }

  if (tableName.table_name !== '') {
    document.getElementById("no-data-container").style.display = 'none';

    fetch('/api/show_table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tableName),
    })
      .then(response => response.json())
      .then((data) => {
        if (data.table_data[0]) {
          const columns = Object.keys(data.table_data[0]);

          const tableHeader = `<tr>${columns.map(column => `<th>${column}</th>`).join('')}</tr>`;

          const tableRows = data.table_data.map(row => {
            return `<tr>${columns.map(column => `<td>${row[column]}</td>`).join('')}</tr>`;
          }).join('');

          document.getElementById('table-header').innerHTML = tableHeader;
          document.getElementById('table-body').innerHTML = tableRows;

          const thElements = document.querySelectorAll('#table-header th');
          thElements.forEach(th => {
            th.addEventListener('click', () => {
              const column = th.textContent;
              addNewChar(tableName.table_name + `.` + column)
            });
          });
        }
        else {
          document.getElementById("#no-data-container").style.display = 'flex';
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
  }
}


function addNewChar(character) {
  var textarea = document.getElementById('content_query');
  var currentValue = textarea.value;
  var newValue = currentValue + " " + character;
  textarea.value = newValue;
}



let timeout;
function onWriteSQL() {
  const sqlQueryArea = document.getElementById('content_query');
  const checkSyntax = document.getElementById('check_syntax');
  const btnSubmit = document.getElementById('btn_query');

  checkSyntax.style.display = "none";
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    if (sqlQueryArea.value !== '') {
      // const isValidSyntax = checkSQLSyntax(sqlQueryArea.value);

      fetch('/api/check_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sqlQuery: sqlQueryArea.value })
      })
        .then(response => response.json())
        .then((data) => {
          checkSyntax.style.display = "block";
          checkSyntax.textContent = data.check_value ? 'Requete SQL Valide !' : 'Requete SQL Invalide !';
          checkSyntax.style.color = data.check_value ? '#45a049' : '#fc2f18';
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
    } else {
      checkSyntax.style.display = "none";
    }
  }, "500");
}

function onExecuteREQ() {
  const request = { query_content: document.getElementById('content_query').textContent }

  if (request.query_content !== '') {
    fetch('/api/excute_query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);


      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
  }
}
