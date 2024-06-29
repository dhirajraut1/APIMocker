const form = document.getElementById('mockForm');
const message = document.getElementById('message');
const mockList = document.getElementById('mockList');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const endpointInput = document.getElementById('endpoint');

let editMode = false;
let editingEndpoint = '';

// Initialize JSONEditor
const container = document.getElementById('jsoneditor');
const options = {
    mode: 'code',
    modes: ['code', 'form', 'text', 'tree', 'view'],
    onError: function (err) {
        alert(err.toString());
    }
};
const editor = new JSONEditor(container, options);

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle('alert-danger', isError);
    message.classList.toggle('alert-success', !isError);
}

async function fetchMocks() {
    try {
        const response = await fetch('/mocks');
        const mocks = await response.json();
        mockList.innerHTML = '';
        mocks.forEach(mock => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                        ${mock.endpoint}
                        <div>
                            <button class="btn btn-sm btn-outline-primary copy-btn" data-url="${window.location.origin}${mock.endpoint}">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary edit-btn" data-endpoint="${mock.endpoint}" data-response='${JSON.stringify(mock.response)}'>
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-endpoint="${mock.endpoint}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
            mockList.appendChild(li);
        });
    } catch (error) {
        showMessage('Error fetching mocks', true);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const endpoint = endpointInput.value;
    let response;
    try {
        response = editor.get();
    } catch (error) {
        showMessage('Invalid JSON. Please correct it before submitting.', true);
        return;
    }

    try {
        let url, method;
        if (editMode) {
            url = `/edit-mock${editingEndpoint}`;
            method = 'PUT';
        } else {
            url = '/create-mock';
            method = 'POST';
        }

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint, response }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        showMessage(data.message);
        form.reset();
        editor.set({});
        fetchMocks();
        resetForm();
    } catch (error) {
        console.error('Error details:', error);
        showMessage(`Error saving mock: ${error.message}`, true);
    }
});

mockList.addEventListener('click', async (e) => {
    if (e.target.closest('.copy-btn')) {
        const url = e.target.closest('.copy-btn').dataset.url;
        navigator.clipboard.writeText(url);
        showMessage('URL copied to clipboard');
    } else if (e.target.closest('.edit-btn')) {
        const btn = e.target.closest('.edit-btn');
        editingEndpoint = btn.dataset.endpoint;
        endpointInput.value = editingEndpoint;
        editor.set(JSON.parse(btn.dataset.response));
        submitBtn.textContent = 'Update Mock';
        cancelBtn.classList.remove('d-none');
        editMode = true;
    } else if (e.target.closest('.delete-btn')) {
        const endpoint = e.target.closest('.delete-btn').dataset.endpoint;
        try {
            await fetch(`/delete-mock${endpoint}`, { method: 'DELETE' });
            showMessage('Mock deleted successfully');
            fetchMocks();
        } catch (error) {
            showMessage('Error deleting mock', true);
        }
    }
});

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    form.reset();
    editor.set({});
    submitBtn.textContent = 'Create Mock';
    cancelBtn.classList.add('d-none');
    editMode = false;
    editingEndpoint = '';
}

fetchMocks();