const toggleViewBtn = document.getElementById('toggleView');
const contentWrapper = document.getElementById('contentWrapper');
const fruitSection = document.getElementById('fruitSection');
const timersSection = document.getElementById('timersSection');

toggleViewBtn.addEventListener('click', () => {
  contentWrapper.classList.toggle('slideToTimers');

  if (contentWrapper.classList.contains('slideToTimers')) {
    fruitSection.classList.add('hidden');
    timersSection.classList.remove('hidden');
    toggleViewBtn.textContent = 'Fruit Calculator';
  } else {
    fruitSection.classList.remove('hidden');
    timersSection.classList.add('hidden');
    toggleViewBtn.textContent = 'Timers';
  }
});