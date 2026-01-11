async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    if(!res.ok) throw new Error(res.statusText);
    return await res.json();
}

// ==================== MODELS ====================
async function loadModels() {
    const container = document.getElementById('modelsList');
    container.innerHTML = 'Loading models...';
    try {
        const data = await fetchJSON('/api/overlays/models');
        if(!data.models || data.models.length === 0) {
            container.innerHTML = '<em>No models found</em>';
            return;
        }
        const ul = document.createElement('ul');
        ul.classList.add('list-group');
        data.models.forEach(m => {
            const li = document.createElement('li');
            li.textContent = m.name;
            li.onclick = () => loadEffects(m.id);
            ul.appendChild(li);
        });
        container.innerHTML = '';
        container.appendChild(ul);
    } catch(e) {
        container.innerHTML = `<span class="text-danger">Error: ${e.message}</span>`;
    }
}

// ==================== EFFECTS ====================
async function loadEffects(modelId) {
    document.getElementById('currentModel').textContent = modelId;
    const container = document.getElementById('effectsList');
    container.innerHTML = 'Loading effects...';
    try {
        const effects = await fetchJSON(`/api/overlays/models/${encodeURIComponent(modelId)}/effects`);
        const ul = document.createElement('ul');
        ul.classList.add('list-group');
        effects.forEach(e => {
            const li = document.createElement('li');
            li.textContent = e.name;
            li.onclick = () => startEffect(modelId, e.name);
            ul.appendChild(li);
        });
        container.innerHTML = '';
        container.appendChild(ul);
    } catch(e) {
        container.innerHTML = `<span class="text-danger">Error: ${e.message}</span>`;
    }
}

async function startEffect(modelId, effectName) {
    try {
        await fetch(`/api/overlays/models/${encodeURIComponent(modelId)}/effects/${encodeURIComponent(effectName)}/start`, { method: 'POST' });
        alert(`Started effect "${effectName}" on model "${modelId}"`);
    } catch(e) {
        alert(`Error starting effect: ${e.message}`);
    }
}

async function stopModel(modelId) {
    try {
        await fetch(`/api/overlays/models/${encodeURIComponent(modelId)}/stop`, { method: 'POST' });
        alert(`Stopped model "${modelId}"`);
    } catch(e) {
        alert(`Error stopping model: ${e.message}`);
    }
}

// ==================== PRESETS ====================
async function savePreset(presetName, modelId, effectName) {
    if(!presetName) { alert('Preset name required'); return; }
    const body = { model: modelId, effect: effectName };
    await fetch(`/api/plugin/settings/FPP_WLED_MegaControl/${encodeURIComponent(presetName)}`, {
        method:'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(body)
    });
    alert(`Preset "${presetName}" saved`);
    loadPresets();
}

async function loadPresets() {
    const container = document.getElementById('presetsList');
    container.innerHTML = 'Loading presets...';
    try {
        const presets = await fetchJSON('/api/plugin/settings/FPP_WLED_MegaControl');
        const ul = document.createElement('ul');
        ul.classList.add('list-group');
        Object.keys(presets).forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p} → ${presets[p].model}/${presets[p].effect}`;
            li.onclick = () => startEffect(presets[p].model, presets[p].effect);
            ul.appendChild(li);
        });
        container.innerHTML = '';
        container.appendChild(ul);
    } catch(e) {
        container.innerHTML = `<span class="text-danger">Error loading presets: ${e.message}</span>`;
    }
}

// ==================== SCHEDULER ====================
async function schedulePreset(presetName, datetime) {
    try {
        await fetch('/api/scheduler', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                type: 'plugin',
                plugin: 'FPP_WLED_MegaControl',
                action: 'startPreset',
                parameters: { preset: presetName },
                time: datetime
            })
        });
        alert(`Scheduled preset "${presetName}" at ${datetime}`);
    } catch(e) {
        alert(`Error scheduling preset: ${e.message}`);
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('modelsList')) loadModels();
    if(document.getElementById('presetsList')) loadPresets();
});
