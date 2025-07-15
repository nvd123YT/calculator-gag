let timers = [];

fetch('data/timers.json')
  .then(res => res.json())
  .then(data => {
    timers = data;
    renderActiveTimers();
    renderTimers();
  });

function renderTimers() {
  const timerGrid = document.getElementById('timerGrid');
  timerGrid.innerHTML = '';

  Object.keys(timers).forEach(sectionName => {
    const section = document.createElement('section');
    section.className = 'timerTypeSection';

    timers[sectionName].forEach(timer => {
      const div = document.createElement('div');
      div.className = 'timer';
      div.innerHTML = `
      <img src="${timer.image}" alt="${timer.name}">
      <p>${timer.name}</p>
    `;
      section.appendChild(div);
    });

    timerGrid.appendChild(section);
  });
}

//TODO
function renderActiveTimers() {

}