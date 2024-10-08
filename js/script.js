document.addEventListener("DOMContentLoaded", function () {
    fetchBandeiras();
 
    const bandeiraFormElement = document.getElementById('bandeiraFormElement');
    if (bandeiraFormElement) {
        bandeiraFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveBandeira();
        });
    } else {
        console.error("Error: Element with ID 'bandeiraFormElement' not found.");
    }
});
 
function fetchBandeiras() {
    fetch('http://localhost:8000/bandeiras')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('bandeirasList');
            if (!list) {
                console.error("Error: Element with ID 'bandeirasList' not found.");
                return;
            }
 
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.bandeiras.forEach(bandeira => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${bandeira.nome} - R$ ${bandeira.tarifa}</strong></div>
                            <div class="col">
                                <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${bandeira.id}, '${bandeira.nome}', ${bandeira.tarifa})">Editar</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-danger btn-sm float-end" onclick="deleteBandeira(${bandeira.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error("Error fetching bandeiras:", error);
        });
}
 
function showAddForm() {
    document.getElementById('bandeiraForm').classList.remove('d-none');
    document.getElementById('bandeiraId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('tarifa').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Bandeira';
}
 
function showEditForm(id, nome, tarifa) {
    document.getElementById('bandeiraForm').classList.remove('d-none');
    document.getElementById('bandeiraId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('tarifa').value = tarifa;
    document.getElementById('formTitle').innerText = 'Editar Bandeira';
}
 
function saveBandeira() {
    const id = document.getElementById('bandeiraId').value;
    const nome = document.getElementById('nome').value;
    const tarifa = parseFloat(document.getElementById('tarifa').value);
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/bandeiras/${id}` : 'http://localhost:8000/bandeiras';
 
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, tarifa })
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
        fetchBandeiras();
        document.getElementById('bandeiraForm').classList.add('d-none');
    })
    .catch(error => {
        console.error("Error saving bandeira:", error);
    });
}
 
 
function deleteBandeira(id) {
    fetch(`http://localhost:8000/bandeiras/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => fetchBandeiras())
        .catch(error => {
            console.error("Error deleting bandeira:", error);
        });
}


document.addEventListener("DOMContentLoaded", function () {
    fetchBandeiras();
 
    const bandeiraFormElement = document.getElementById('bandeiraFormElement');
    if (bandeiraFormElement) {
        bandeiraFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveBandeira();
        });
    } else {
        console.error("Error: Element with ID 'UniConFormElement' not found.");
    }
});
 









