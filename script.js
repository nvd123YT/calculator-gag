let fruits = [];
let mutations = [];
let searchQuery = '';
let selectedRarities = [];
let selectedFruit = null;
let showUnobtainable = false; // default to show all

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderFruits();
});

document.querySelectorAll('.rarity-filter').forEach(cb => {
    cb.addEventListener('change', () => {
        selectedRarities = Array.from(document.querySelectorAll('.rarity-filter:checked'))
            .map(cb => cb.value);
        renderFruits();
    });
});

// ✅ Listen for the unobtainable checkbox
document.getElementById('showUnobtainable').addEventListener('change', (e) => {
    showUnobtainable = e.target.checked;
    renderFruits();
});

fetch('fruits.json')
    .then(res => res.json())
    .then(data => {
        fruits = data.fruits;
        mutations = data.mutations;
        renderFruits();
        renderMutations();
    });

function renderFruits() {
    const fruitGrid = document.getElementById('fruitGrid');
    fruitGrid.innerHTML = '';

    fruits
        .filter(fruit => {
            const matchesSearch = fruit.name.toLowerCase().includes(searchQuery);
            const matchesRarity = selectedRarities.length === 0 || selectedRarities.includes(fruit.rarity);
            const matchesObtainable = showUnobtainable || fruit.status !== 'unobtainable';
            return matchesSearch && matchesRarity && matchesObtainable;
        })
        .forEach(fruit => {
            const div = document.createElement('div');
            div.className = 'fruit';
            div.innerHTML = `
                <img src="${fruit.image}" alt="${fruit.name}">
                <p>${fruit.name}</p>
                <span class="rarity ${fruit.rarity}">
                  ${fruit.rarity.charAt(0).toUpperCase() + fruit.rarity.slice(1)}
                </span>
            `;
            div.onclick = () => {
                selectedFruit = fruit;
                document.getElementById('selectedFruitName').textContent = fruit.name;
                attachCalculateListeners();
                calculate();

                document.querySelectorAll('.fruit').forEach(f => f.classList.remove('selected'));
                div.classList.add('selected');
            };
            fruitGrid.appendChild(div);
        });
}

function renderMutations() {
    const mutationsDiv = document.getElementById('mutationsGrid');

    if (mutationsDiv.children.length > 0) {
        return; // Already rendered, do nothing
    }

    mutations.forEach(mutation => {
        const label = document.createElement('label');
        label.innerHTML = `
      <input type="checkbox" value="${mutation.multiplier}"> ${mutation.name} (x${mutation.multiplier})
    `;
        mutationsDiv.appendChild(label);
    });
}

function attachCalculateListeners() {
    const weightInput = document.getElementById('weightInput');
    weightInput.addEventListener('input', calculate);

    document.querySelectorAll('#mutationsGrid input').forEach(cb => {
        cb.addEventListener('change', calculate);
    });
}

function calculate() {
    if (!selectedFruit) {
        document.getElementById('result').textContent = 'Estimated Value: $0.00';
        return;
    }

    const weightGrams = parseFloat(document.getElementById('weightInput').value);
    if (isNaN(weightGrams) || weightGrams <= 0) {
        document.getElementById('result').textContent = 'Estimated Value: $0.00';
        return;
    }

    const weightKg = weightGrams / 1000;
    let totalMultiplier = 1;
    document.querySelectorAll('#mutationsGrid input:checked').forEach(cb => {
        totalMultiplier *= parseFloat(cb.value);
    });

    let weightValue = weightKg / selectedFruit.baseWeightKg;
    weightValue *= weightValue;
    const fruitValue = selectedFruit.baseValue * weightValue * totalMultiplier;
    document.getElementById('result').textContent = `Estimated Value: $${fruitValue.toFixed(2)}`;
}

// Dark mode toggle
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Load saved theme or system preference
if (
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
    document.body.classList.add('dark');
}