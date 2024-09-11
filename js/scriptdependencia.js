document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadesConsumidorasSelect(); // Preenche o select das unidades consumidoras
    document.getElementById('dependenciaFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDependencia();
        saveDispositivo();
    });
});

function fetchUnidadesConsumidorasSelect() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const unidadeConsumidoraSelect = document.getElementById('unidadeConsumidoraSelect');
            const dependenciaUnidadeConsumidoraSelect = document.getElementById('dependenciaUnidadeConsumidora');
            unidadeConsumidoraSelect.innerHTML = '';
            dependenciaUnidadeConsumidoraSelect.innerHTML = '';
            data.unidades_consumidoras.forEach(unidade => {
                const option = document.createElement('option');
                option.value = unidade.id;
                option.text = `${unidade.nome} (ID: ${unidade.id})`;
                unidadeConsumidoraSelect.appendChild(option);
                dependenciaUnidadeConsumidoraSelect.appendChild(option.cloneNode(true));
            });
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

function fetchDependencias() {
    const unidadeConsumidoraId = document.getElementById('unidadeConsumidoraSelect').value;
    fetch(`http://localhost:8000/dependencias/unidade-consumidora/${unidadeConsumidoraId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const dependenciasList = document.getElementById('dependenciasList');
            dependenciasList.innerHTML = '<ul class="list-group">';
            data.dependencias.forEach(dependencia => {
                dependenciasList.innerHTML += `
                    <li class="list-group-item">
                        <strong>Nome:</strong> ${dependencia.nome} <br>
                        <strong>ID:</strong> ${dependencia.id} <br>
                        <button class="btn btn-info btn-sm mt-2" onclick="showEditDependenciaForm(${dependencia.id}, '${dependencia.nome}', ${dependencia.unidade_consumidora_id})">Editar</button>
                        <button class="btn btn-danger btn-sm mt-2" onclick="deleteDependencia(${dependencia.id})">Deletar</button>
                        <button class="btn btn-success btn-sm mt-2" onclick="fetchDispositivos()">Dispositivos</button>
                    </li>`;
            });
            dependenciasList.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar dependências:', error));
}
///////////////////////////////////////////DISPOSITIVO//////////////////////////////////////////////////////


function fetchDispositivos() {
    const unidadeConsumidoraId = document.getElementById('unidadeConsumidoraSelect').value;
    fetch(`http://localhost:8000/dispositivos/unidades-consumidoras/${unidadeConsumidoraId}`)
        .then(response => response.json())
        .then(data => {
            const dispositivosList = document.getElementById('dispositivosList');
            dispositivosList.innerHTML = '<ul class="list-group">';
            data.dispositivos.forEach(dispositivo => {
                dispositivosList.innerHTML += `
                    <li class="list-group-item">
                        <strong>Nome:</strong> ${dispositivo.nome} <br>
                        <strong>ID do Tipo:</strong> ${dispositivo.tipo_id} <br>
                        <button class="btn btn-info btn-sm mt-2" onclick="showEditDispositivoForm(${dispositivo.id}, '${dispositivo.nome}', ${dispositivo.tipo_id}, ${dispositivo.dependencia_id}, ${dispositivo.unidade_consumidora_id}, ${dispositivo.consumo}, ${dispositivo.uso_diario})">Editar</button>
                        <button class="btn btn-danger btn-sm mt-2" onclick="deleteDispositivo(${dispositivo.id})">Deletar</button>
                    </li>`;
            });
            dispositivosList.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar dispositivos:', error));
}

function showAddDispositivoForm() {
    document.getElementById('dispositivoForm').classList.remove('d-none');
    document.getElementById('formTitle').innerText = 'Adicionar Novo Dispositivo';
    document.getElementById('dispositivoId').value = '';
    document.getElementById('dispositivoNome').value = '';
    document.getElementById('dispositivoConsumo').value = '';
    document.getElementById('dispositivoUsoDiario').value = '';
    document.getElementById('dispositivoTipoId').value = '';
    document.getElementById('dispositivoDependencia').value = '';
    document.getElementById('dispositivoUnidadeConsumidora').value = ''; // Limpa o select
}

// Função para mostrar o formulário de edição de dispositivo
function showEditDispositivoForm(id, nome, tipo_id, dependencia_id, unidade_consumidora_id, consumo, uso_diario) {
    document.getElementById('dispositivoForm').classList.remove('d-none');
    document.getElementById('formTitle').innerText = 'Editar Dispositivo';
    document.getElementById('dispositivoId').value = id;
    document.getElementById('dispositivoNome').value = nome;
    document.getElementById('dispositivoConsumo').value = consumo; // Preencher campo
    document.getElementById('dispositivoUsoDiario').value = uso_diario; // Preencher campo
    document.getElementById('dispositivoTipoId').value = tipo_id;
    document.getElementById('dispositivoDependencia').value = dependencia_id;
    document.getElementById('dispositivoUnidadeConsumidora').value = unidade_consumidora_id;
}

// Função para salvar dispositivo (adicionar ou editar)
function saveDispositivo() {
    const id = document.getElementById('dispositivoId').value;
    const nome = document.getElementById('dispositivoNome').value;
    const consumo = document.getElementById('dispositivoConsumo').value;
    const uso_diario = document.getElementById('dispositivoUsoDiario').value;
    const tipo_id = document.getElementById('dispositivoTipoId').value;
    const dependencia_id = document.getElementById('dispositivoDependencia').value;
    const unidade_consumidora_id = document.getElementById('dispositivoUnidadeConsumidora').value;

    const url = id ? `http://localhost:8000/dispositivos/${id}` : 'http://localhost:8000/dispositivos';
    const method = id ? 'PATCH' : 'POST';
    const body = id ? JSON.stringify({
        nome: nome,
        consumo: consumo,
        uso_diario: uso_diario,
        tipo_id: tipo_id
    }) : JSON.stringify({
        nome: nome,
        consumo: consumo,
        uso_diario: uso_diario,
        tipo_id: tipo_id,
        dependencia_id: dependencia_id,
        unidade_consumidora_id: unidade_consumidora_id
    });

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(response => response.json())
    .then(() => {
        alert('Dispositivo salvo com sucesso!');
        fetchDispositivos(); // Atualiza a lista de dispositivos
        document.getElementById('dispositivoForm').classList.add('d-none');
    })
    .catch(error => console.error('Erro ao salvar dispositivo:', error));
}

// Função para deletar um dispositivo
function deleteDispositivo(id) {
    fetch(`http://localhost:8000/dispositivos/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        alert('Dispositivo deletado com sucesso!');
        fetchDispositivos(); // Atualiza a lista de dispositivos
    })
    .catch(error => console.error('Erro ao deletar dispositivo:', error));
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showAddDependenciaForm() {
    document.getElementById('dependenciaForm').classList.remove('d-none');
    document.getElementById('formTitle').innerText = 'Adicionar Nova Dependência';
    document.getElementById('dependenciaId').value = '';
    document.getElementById('dependenciaNome').value = '';
    document.getElementById('dependenciaUnidadeConsumidora').value = '';
}

function showEditDependenciaForm(id, nome, unidadeConsumidoraId) {
    document.getElementById('dependenciaForm').classList.remove('d-none');
    document.getElementById('formTitle').innerText = 'Editar Dependência';
    document.getElementById('dependenciaId').value = id;
    document.getElementById('dependenciaNome').value = nome;
    document.getElementById('dependenciaUnidadeConsumidora').value = unidadeConsumidoraId;
}

function saveDependencia() {
    const id = document.getElementById('dependenciaId').value;
    const nome = document.getElementById('dependenciaNome').value;
    const unidade_consumidora_id = document.getElementById('dependenciaUnidadeConsumidora').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:8000/dependencias/${id}` : 'http://localhost:8000/dependencias';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, unidade_consumidora_id })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            fetchDependencias();
            document.getElementById('dependenciaForm').classList.add('d-none');
        })
        .catch(error => console.error('Erro ao salvar dependência:', error));
}

function deleteDependencia(id) {
    fetch(`http://localhost:8000/dependencias/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            fetchDependencias();
        })
        .catch(error => console.error('Erro ao deletar dependência:', error));
}