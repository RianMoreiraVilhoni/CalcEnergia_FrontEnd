document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadesConsumidorasSelect(); // Preenche o select das unidades consumidoras
    document.getElementById('dispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Previne o recarregamento da página
        saveDispositivo();
    });
});

// Função para buscar e preencher as opções do select de unidades consumidoras
function fetchUnidadesConsumidorasSelect() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            const unidadeConsumidoraSelect = document.getElementById('unidadeConsumidoraSelect');
            unidadeConsumidoraSelect.innerHTML = ''; // Limpa o select antes de adicionar novas opções
            data.unidades_consumidoras.forEach(unidade => {
                const option = document.createElement('option');
                option.value = unidade.id;
                option.text = `${unidade.nome} (ID: ${unidade.id})`;
                unidadeConsumidoraSelect.appendChild(option);
            });
            // Preenche o select no formulário de dispositivo
            fetchUnidadesConsumidorasSelectForm();
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

// Função para buscar e preencher as opções do select de unidades consumidoras no formulário de dispositivo
function fetchUnidadesConsumidorasSelectForm() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            const unidadeConsumidoraSelect = document.getElementById('dispositivoUnidadeConsumidora');
            unidadeConsumidoraSelect.innerHTML = ''; // Limpa o select antes de adicionar novas opções
            data.unidades_consumidoras.forEach(unidade => {
                const option = document.createElement('option');
                option.value = unidade.id;
                option.text = `${unidade.nome} (ID: ${unidade.id})`;
                unidadeConsumidoraSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

// Função para buscar dispositivos com base no ID da unidade consumidora selecionada
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

// Função para mostrar o formulário de adicionar dispositivo
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