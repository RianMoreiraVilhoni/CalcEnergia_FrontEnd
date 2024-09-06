document.addEventListener('DOMContentLoaded', function () {
    const tipoForm = document.getElementById('tipoForm');
    const tipoFormElement = document.getElementById('tipoFormElement');
    const tipoIdInput = document.getElementById('tipoId');
    const nomeInput = document.getElementById('nome');
    const tiposList = document.getElementById('tiposList');
    const formTitle = document.getElementById('formTitle');
    const addTipoButton = document.getElementById('addTipoButton');
 
    addTipoButton.addEventListener('click', () => {
        showTipoForm('Cadastrar Novo Tipo de Dispositivo');
    });
 
    tipoFormElement.addEventListener('submit', async (event) => {
        event.preventDefault();
        await saveTipo();
    });
 
    async function fetchTipos() {
        try {
            const response = await fetch('http://localhost:8000/tipos-dispositivos');
            if (!response.ok) throw new Error('Failed to fetch tipos');
            const data = await response.json();
            renderTipos(data.tipos_dispositivos);
        } catch (error) {
            console.error('Error fetching tipos:', error);
        }
    }
 
    async function saveTipo() {
        const id = tipoIdInput.value;
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `http://localhost:8000/tipos-dispositivos/${id}` : 'http://localhost:8000/tipos-dispositivos';
 
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeInput.value })
            });
 
            if (!response.ok) throw new Error('Failed to save tipo');
            hideTipoForm();
            fetchTipos();
        } catch (error) {
            console.error('Error saving tipo:', error);
        }
    }
 
    function showTipoForm(title, tipo = {}) {
        tipoForm.classList.remove('d-none');
        formTitle.textContent = title;
        nomeInput.value = tipo.nome || '';
        tipoIdInput.value = tipo.id || '';
    }
 
    function hideTipoForm() {
        tipoForm.classList.add('d-none');
    }
 
    window.editTipo = async function (id) {
        try {
            const response = await fetch(`http://localhost:8000/tipos-dispositivos/${id}`);
            if (!response.ok) throw new Error('Failed to fetch tipo');
            const data = await response.json();
            showTipoForm('Editar Tipo de Dispositivo', data);
        } catch (error) {
            console.error('Error fetching tipo:', error);
        }
    }
 
    window.deleteTipo = async function (id) {
        try {
            const response = await fetch(`http://localhost:8000/tipos-dispositivos/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete tipo');
            fetchTipos();
        } catch (error) {
            console.error('Error deleting tipo:', error);
        }
    }
 
    function renderTipos(tipos) {
        tiposList.innerHTML = '';
        tipos.forEach(tipo => {
            const div = document.createElement('div');
            div.classList.add('card', 'mb-2');
            div.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${tipo.nome}</h5>
                    <button class="btn btn-primary" onclick="editTipo(${tipo.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteTipo(${tipo.id})">Excluir</button>
                </div>
            `;
            tiposList.appendChild(div);
        });
    }
 
    fetchTipos();
});