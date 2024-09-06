document.addEventListener("DOMContentLoaded", function () {
    fetchUniCon();

    document.getElementById('UniConFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveUniCon();
    });
});


function fetchUniCon() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.unidades_consumidoras);
            const list = document.getElementById('UniConList');
            if (!list) {
                console.error("Error: Element with ID 'UniConList' not found.");
                return;
            }

            list.innerHTML = '<ul class="list-group border border-danger">';
            data.unidades_consumidoras.forEach(UniCon => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${UniCon.nome} - R$ ${UniCon.tipo_id}</strong></div>
                            <div class="col">
                                <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditFormUniCon(${UniCon.id}, '${UniCon.nome}', ${UniCon.tipo_id})">Editar</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-danger btn-sm float-end" onclick="deleteUniCon(${UniCon.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error("Error fetching UniCon:", error);
        });
}

function showAddFormUniCon() {
    document.getElementById('unidadeForm').classList.remove('d-none');
    document.getElementById('UniConId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('tipo_id').value = '';  // Aqui, mantendo consistência com o fetchUniCon
    document.getElementById('formTitle').innerText = 'Adicionar Unidade Consumidora';
}

function showEditFormUniCon(id, nome, tipo_id) {  // Consistência com tipo_id
    document.getElementById('UniConForm').classList.remove('d-none');
    document.getElementById('UniConId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('tipo_id').value = tipo_id;  // Usar tipo_id em vez de tipo
    document.getElementById('formTitle').innerText = 'Editar Unidade Consumidora';
}

function saveUniCon() {
    const id = document.getElementById('UniConId').value;
    const nome = document.getElementById('nome').value;
    const tipo_id = parseFloat(document.getElementById('tipo_id').value);  // Consistência com tipo_id
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/unidades-consumidoras/${id}` : 'http://localhost:8000/unidades-consumidoras';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, tipo_id })  // Corrigir nome da propriedade enviada
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                });
            }
            return response.json();
        })
        .then(() => {
            fetchUniCon();
            document.getElementById('UniConForm').classList.add('d-none');
        })
        .catch(error => {
            console.error("Error saving UniCon:", error);
        });
}

function deleteUniCon(id) {
    fetch(`http://localhost:8000/unidades-consumidoras/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => fetchUniCon())
        .catch(error => {
            console.error("Error deleting UniCon:", error);
        });
}
