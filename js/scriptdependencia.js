document.addEventListener("DOMContentLoaded", function () {
    fetchDependencias();
 
    const DependenciasFormElement = document.getElementById('dependenciasFormElement');
    if (DependenciasFormElement) {
        DependenciasFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveDependencias();
        });
    } else {
        console.error("Error: Element with ID 'dependenciasFormElement' not found.");
    }
});
 
function fetchDependencias() {
    fetch(`http://localhost:8000/dependencias`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('DependenciasList');
            if (!list) {
                console.error("Error: Element with ID 'DependenciasList' not found.");
                return;
            }
 
            list.innerHTML = '<ul class="list-group border border-danger">';
            console.log(data.nome);
            data.dependencias.nome.forEach(dependencias => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${dependencias.nome} - R$ ${dependencias.unidade_consumidora_id}</strong></div>
                            <div class="col">
                                <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${dependencias.id}, '${dependencias.nome}', ${dependencias.unidade_consumidora_id})">Editar</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-danger btn-sm float-end" onclick="deleteDependencias(${dependencias.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error("Error fetching dependencias:", error);
        });
}
 
function showAddForm() {
    document.getElementById('DependenciasForm').classList.remove('d-none');
    document.getElementById('DependenciasId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('unidade_consumidora_id').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Dependencias';
}
 
function showEditForm(id, nome, unidade_consumidora_id) {
    document.getElementById('dependenciasForm').classList.remove('d-none');
    document.getElementById('dependenciasId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('unidade_consumidora_id').value = unidade_consumidora_id;
    document.getElementById('formTitle').innerText = 'Editar Dependencias';
}
 
function saveDependencias() {
    const id = document.getElementById('dependenciasId').value;
    const nome = document.getElementById('nome').value;
    const unidade_consumidora_id = parseFloat(document.getElementById('unidade_consumidora_id').value);
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/dependencias/${id}` : 'http://localhost:8000/dependencias';
 
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, unidade_consumidora_id })
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
        fetchDependencias();
        document.getElementById('dependenciasForm').classList.add('d-none');
    })
    .catch(error => {
        console.error("Error saving dependencias:", error);
    });
}
 
 
function deleteDependencias(id) {
    fetch(`http://localhost:8000/dependencias/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => fetchDependencias())
        .catch(error => {
            console.error("Error deleting Dependencias:", error);
        });
}


document.addEventListener("DOMContentLoaded", function () {
    fetchDependencias();
 
    const dependenciasFormElement = document.getElementById('dependenciasFormElement');
    if (dependenciasFormElement) {
        dependenciasFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveDependencias();
        });
    } else {
        console.error("Error: Element with ID 'UniConFormElement' not found.");
    }
});
 









