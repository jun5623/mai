$(function(){
  $(".input-button").click(function(){
    $(this).next(".input-box").slideToggle();
  });
});

$(function(){
  $(".icon").click(function(){
    $(this).next(".app").slideToggle();
  });
});

const ADULT_PRICE = 10000;
const YOUTH_PRICE = 8000;
const TOTAL_SEATS = 40;
let adultCount = 0;
let youthCount = 0;
let selectedSeats = [];
let totalPrice = 0;
let isReservationFinished = false;
const adultCountInput = document.getElementById('adultCount');
const youthCountInput = document.getElementById('youthCount');
const totalPeopleSpan = document.getElementById('totalPeople');
const seatsContainer = document.getElementById('seatsContainer');
const selectedCountSpan = document.getElementById('selectedCount');
const totalPriceSpan = document.getElementById('totalPrice');
const completeButton = document.getElementById('completeButton');
const confirmation = document.getElementById('confirmation');
const finalSeatsSpan = document.getElementById('finalSeats');
const finalPriceSpan = document.getElementById('finalPrice');
function createSeats() {
  seatsContainer.innerHTML = '';
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    const seatDiv = document.createElement('div');
    seatDiv.className = 'seat';
    seatDiv.textContent = i;
    seatDiv.dataset.seatId = i;
    seatDiv.addEventListener('click', () => toggleSeat(i));
    seatsContainer.appendChild(seatDiv);
  }
}
function getTotalRequestedPeople() {
  return adultCount + youthCount;
}
function calculateTotalPrice() {
  return (adultCount * ADULT_PRICE) + (youthCount * YOUTH_PRICE);
}
function formatNumber(num) {
  return num.toLocaleString();
}
function updateUI() {
  const totalRequestedPeople = getTotalRequestedPeople();
  totalPrice = calculateTotalPrice();            
  totalPeopleSpan.textContent = totalRequestedPeople;
  selectedCountSpan.textContent = selectedSeats.length;
  totalPriceSpan.textContent = formatNumber(totalPrice);
  updateSeatsUI();
  updateButtonState();
}
function updateSeatsUI() {
  const seatElements = document.querySelectorAll('.seat');
  seatElements.forEach((seatEl, index) => {
      const seatId = index + 1;
      const isSelected = selectedSeats.includes(seatId);                
      if (isSelected) {
        seatEl.classList.add('selected');
      } else {
        seatEl.classList.remove('selected');
      }                
      if (isReservationFinished) {
        seatEl.classList.add('disabled');
      } else {
        seatEl.classList.remove('disabled');
      }
    });
}
function updateButtonState() {
  const totalRequestedPeople = getTotalRequestedPeople();
  const isButtonDisabled = isReservationFinished || totalRequestedPeople === 0 || selectedSeats.length !== totalRequestedPeople;
  completeButton.disabled = isButtonDisabled;
}
function handleCountChange(type, value) {
  if (isReservationFinished) return;
  const newCount = Math.max(0, Number(value));
  let newAdult = adultCount;
  let newYouth = youthCount;
  if (type === 'adult') {
    newAdult = newCount;
    adultCount = newCount;
  } else {
    newYouth = newCount;
    youthCount = newCount;
  }
  const newTotalRequestedPeople = newAdult + newYouth;
  if (selectedSeats.length > newTotalRequestedPeople) {
    selectedSeats = selectedSeats.slice(0, newTotalRequestedPeople);
  }
  if (newTotalRequestedPeople === 0) {
    selectedSeats = [];
  }
  updateUI();
}
// 좌석 선택/해제 토글
function toggleSeat(seatId) {
  if (isReservationFinished) return;
  const totalRequestedPeople = getTotalRequestedPeople();            
  if (selectedSeats.includes(seatId)) {
    // 좌석 선택 해제
    selectedSeats = selectedSeats.filter(seat => seat !== seatId);
  } else if (selectedSeats.length < totalRequestedPeople) {
    // 좌석 선택
    selectedSeats.push(seatId);
  } else {
    alert(`총 ${totalRequestedPeople}명 인원에 맞춰서 좌석을 선택하세요.`);
    return;
  }
  updateUI();
}
function completeReservation() {
  const totalRequestedPeople = getTotalRequestedPeople();            
  if (totalRequestedPeople === 0) {
    alert('인원수를 먼저 선택하세요');
    return;
  }            
  if (selectedSeats.length !== totalRequestedPeople) {
    alert('총 인원수에 맞춰 좌석을 모두 선택하세요.');
    return;
  }
  isReservationFinished = true;
  adultCountInput.disabled = true;
  youthCountInput.disabled = true;
  finalSeatsSpan.textContent = selectedSeats.join(', ');
  finalPriceSpan.textContent = formatNumber(totalPrice);
  confirmation.style.display = 'block';            
  updateUI();
}
function setupEventListeners() {
  adultCountInput.addEventListener('input', (e) => {
    handleCountChange('adult', e.target.value);
  });
  youthCountInput.addEventListener('input', (e) => {
    handleCountChange('youth', e.target.value);
  });
  completeButton.addEventListener('click', completeReservation);
}
function init() {
  createSeats();
  setupEventListeners();
  updateUI();
}
document.addEventListener('DOMContentLoaded', init);