document.addEventListener('DOMContentLoaded', function () {
    const tipoConsumidorForm = document.getElementById('tipoConsumidorForm');
    const tipoConsumidorIdInput = document.getElementById('tipoConsumidorId');
    const tipoConsumidorNomeInput = document.getElementById('tipoConsumidorNome');
    const valorKwhInput = document.getElementById('valor_kwh');
    const tiposConsumidorList = document.getElementById('tiposConsumidorList');
    const tipoConsumidorFormTitle = document.getElementById('formTitle');
    const addTipoConsumidorButton = document.getElementById('addTipoConsumidorButton');
 
    if (tipoConsumidorForm) {
        tipoConsumidorForm.addEventListener('submit', function (event) {
            event.preventDefault();
            saveTipoConsumidor();
        });
    }
 
    if (addTipoConsumidorButton) {
        addTipoConsumidorButton.addEventListener('click', function () {
            showAddTipoConsumidorForm();
        });
    }
 
    window.editTipoConsumidor = async function (id) {
        try {
            const response = await fetch(`http://localhost:8000/tipos-consumidores/${id}`);
            if (!response.ok) throw new Error('Failed to fetch tipo de consumidor');
            const data = await response.json();
            tipoConsumidorNomeInput.value = data.nome;
            valorKwhInput.value = data.valor_kwh;
            tipoConsumidorIdInput.value = data.id;
            tipoConsumidorForm.classList.remove('d-none');
            tipoConsumidorFormTitle.textContent = 'Editar Tipo de Consumidor';
        } catch (error) {
            console.error('Error fetching tipo de consumidor:', error);
        }
    };
 
    window.deleteTipoConsumidor = async function (id) {
        try {
            const response = await fetch(`http://localhost:8000/tipos-consumidores/${id}`, {
                method: 'DELETE'
            });
 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete tipo de consumidor: ${errorData.detail}`);
            }
 
            fetchTiposConsumidores();
        } catch (error) {
            console.error('Error deleting tipo de consumidor:', error);
        }
    };
 
    async function saveTipoConsumidor() {
        const id = tipoConsumidorIdInput.value;
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `http://localhost:8000/tipos-consumidores/${id}` : 'http://localhost:8000/tipos-consumidores';
 
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: tipoConsumidorNomeInput.value,
                    valor_kwh: parseFloat(valorKwhInput.value)
                })
            });
 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error saving tipo de consumidor: ${errorData.detail}`);
            }
 
            hideAddTipoConsumidorForm();
            fetchTiposConsumidores();
        } catch (error) {
            console.error('Error saving tipo de consumidor:', error);
        }
    }
 
    async function fetchTiposConsumidores() {
        try {
            const response = await fetch('http://localhost:8000/tipos-consumidores');
            if (!response.ok) throw new Error('Failed to fetch tipos de consumidores');
            const data = await response.json();
            if (tiposConsumidorList) {
                tiposConsumidorList.innerHTML = '';
                data.tipos_consumidores.forEach(tipo => {
                    const div = document.createElement('div');
                    div.classList.add('card', 'mb-2');
                    div.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${tipo.nome}</h5>
                            <p class="card-text">Valor kWh: ${tipo.valor_kwh}</p>
                            <button class="btn btn-primary" onclick="editTipoConsumidor(${tipo.id})">Editar</button>
                            <button class="btn btn-danger" onclick="deleteTipoConsumidor(${tipo.id})">Excluir</button>
                        </div>
                    `;
                    tiposConsumidorList.appendChild(div);
                });
            }
        } catch (error) {
            console.error('Error fetching tipos:', error);
        }
    }
 
    function showAddTipoConsumidorForm() {
        tipoConsumidorForm.classList.remove('d-none');
        tipoConsumidorFormTitle.textContent = 'Cadastrar Novo Tipo de Consumidor';
        tipoConsumidorIdInput.value = '';
        tipoConsumidorNomeInput.value = '';
        valorKwhInput.value = '';
    }
 
    function hideAddTipoConsumidorForm() {
        tipoConsumidorForm.classList.add('d-none');
    }
 
    fetchTiposConsumidores();
});
 