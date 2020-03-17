'use strict';

window.addEventListener('DOMContentLoaded', function() {

  let tab = document.querySelectorAll('.info-header-tab'),
    info = document.querySelector('.info-header'),
    tabContent = document.querySelectorAll('.info-tabcontent'),
    infoMain = document.querySelector('.info');

  function hideTabContent(a) {
    for (let i = a; i < tabContent.length; i++) {
      tabContent[i].classList.remove('show');
      tabContent[i].classList.add('hide');
    }
  }

  hideTabContent(1);

  function showTabContent(b) {
    if (tabContent[b].classList.contains('hide')) {
      tabContent[b].classList.remove('hide');
      tabContent[b].classList.add('show');
    }
  }

  info.addEventListener('click', function(e) {
    let target = event.target;
    if (target && target.classList.contains('info-header-tab')) {
      for (let i = 0; i < tab.length; i++) {
        if (target == tab[i]) {
          hideTabContent(0);
          showTabContent(i);
          break;
        }
      }
    }
  });

  // Timer 

  let deadline = '2020-12-31';

  function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date()),
      seconds = Math.floor((t / 1000) % 60) + '',
      minutes = Math.floor((t / 1000 / 60) % 60) + '',
      hours = Math.floor((t / (1000 * 60 * 60))) + '';




    return {
      'total': t,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function setClock(id, endtime) {
    let timer = document.getElementById(id),
      hours = timer.querySelector('.hours'),
      minutes = timer.querySelector('.minutes'),
      seconds = timer.querySelector('.seconds'),
      timeInterval = setInterval(updateClock, 1000);

    function updateClock() {
      let t = getTimeRemaining(endtime);

      function addZero(digit) {
        if (digit.length == 1) {
          digit = '0' + digit;
        }
        return digit;
      };

      hours.textContent = addZero(t.hours);
      minutes.textContent = addZero(t.minutes);
      seconds.textContent = addZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
        hours.textContent = '00';
        minutes.textContent = '00';
        seconds.textContent = '00';
      }
    }
  }

  setClock('timer', deadline);

  let more = document.querySelector('.more');
  let overlay = document.querySelector('.overlay');
  let close = document.querySelector('.popup-close');

  let contactForm = document.querySelector('#form');
  let inputContactForm = contactForm.getElementsByTagName('input');

  more.addEventListener('click', function() {
    overlay.style.display = 'block';
    this.classList.add('more-splash');
    document.body.style.overflow = 'hidden';
  });

  close.addEventListener('click', function() {
    overlay.style.display = 'none';
    more.classList.remove('more-splash');
    document.body.style.overflow = '';
  });

  infoMain.addEventListener('click', function(e) {
    let target = event.target;
    if (target && target.classList.contains('description-btn')) {
      overlay.style.display = 'block';
      more.classList.add('more-splash');
      document.body.style.overflow = 'hidden';
    }
  });

  let message = {
    loading: 'Загрузка...',
    success: 'Спасибо! Скоро мы с Вами свяжемся!',
    failure: 'Что-то пошло не так...'
  };

  let form = document.querySelector('.main-form');
  let input = form.getElementsByTagName('input');
  let statusMessage = document.createElement('div');

  statusMessage.classList.add('status');

  function sendForm(elem, inputs) {
    elem.addEventListener('submit', function(event) {
      event.preventDefault();
      elem.appendChild(statusMessage);
      let formData = new FormData(elem);

      function postData(data) {

        return new Promise(function(resolve, reject) {
          let request = new XMLHttpRequest();
          request.open('POST', 'server.php');
          request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

          request.onreadystatechange = function() {
            if (request.readyState < 4) {
              resolve();
            } else if (request.readyState === 4) {
              if (request.status == 200 && request.status < 300) {
                resolve();
              } else {
                reject();
              }
            }
          }

          request.send(data);
        });
      }

      function clearInput() {
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = '';
        }
      }

      postData(formData)
        .then(() => statusMessage.innerHTML = message.loading)
        .then(() => statusMessage.innerHTML = message.success)
        .catch(() => statusMessage.innerHTML = message.failure)
        .then(clearInput)
    });
  }
  sendForm(form, input);
  sendForm(contactForm, inputContactForm);


// Slider

let slideIndex = 0;
let slides = document.querySelectorAll('.slider-item');
let prev = document.querySelector('.prev');
let next = document.querySelector('.next');
let dotsWrap = document.querySelector('.slider-dots');
let dots = document.querySelectorAll('.dot');


showSlides(slideIndex);
// function showSlides(n) {

//   if (n > slides.length) {
//     slideIndex = 1;
//   }
//   if (n < 1) {
//     slideIndex = slides.length;
//   }

//   slides.forEach((item) => item.style.display = 'none');
//   dots.forEach((item) => item.classList.remove('dot-active'));

//   slides[slideIndex - 1].style.display = 'block';
//   dots[slideIndex - 1].classList.add('dot-active');
// }

// function plusSlides(n) {
//   showSlides(slideIndex += n);
// }
// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

// prev.addEventListener('click', function() {
//   plusSlides(-1);
// })

// next.addEventListener('click', function() {
//   plusSlides(1);
// })

function showSlides(n) {
  n = checkSlideIndex(n);
  slides.forEach((item) => item.style.display = 'none');
  dots.forEach((item) => item.classList.remove('dot-active'));
  slides[n].style.display = 'block';
  dots[n].classList.add('dot-active');
  slideIndex = n;
}

function checkSlideIndex(n) {
  if (n < 0) {
    n = slides.length - 1;
  }
  if (n > slides.length - 1) {
    n = 0;
  }
  return n;
}

function nextSlide() {
  showSlides(++slideIndex);
}

function prevSlide() {
  showSlides(--slideIndex);
}

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

dotsWrap.addEventListener('click', function(e) {
  for (let i = 0; i < dots.length; i++) {
    if (e.target.classList.contains('dot') && e.target == dots[i]) {
      showSlides(i);
    }
  }
})

// Calculator

let persons = document.querySelectorAll('.counter-block-input')[0];
let restDays = document.querySelectorAll('.counter-block-input')[1];
let place = document.getElementById('select');
let totalValue = document.getElementById('total');
let personsSum = 0;
let daysSum = 0;
let total = 0;

totalValue.innerHTML = 0;

// persons.addEventListener('change', function() {
//   personsSum = +this.value;
//   total = (daysSum + personsSum) * 4000;

//   if (restDays.value == '') {
//     totalValue.innerHTML = 0;
//   } else {
//     totalValue.innerHTML = total;
//   }
// });

persons.addEventListener('change', function() {
  if (restDays.value == '' || this.value == '' || restDays.value == 0 || this.value == 0) {
    totalValue.innerHTML = 0;
  } else {
    personsSum = +this.value;
    total = (daysSum + personsSum) * 4000;
    totalValue.innerHTML = total;
  }
});

restDays.addEventListener('change', function() {
  if (persons.value == '' || this.value == '' || persons.value == 0 || this.value == 0) {
    totalValue.innerHTML = 0;
  } else {
    daysSum = +this.value;
    total = (daysSum + personsSum) * 4000;
    totalValue.innerHTML = total;
  }
});

place.addEventListener('change', function() {
  if (restDays.value == '' || persons.value == '') {
    totalValue.innerHTML = 0;
  } else {
    let a = total;
    totalValue.innerHTML = a * this.options[this.selectedIndex].value;
  }
})

});



// let drink = 1;

// function shoot(arrow, headshot, fail) {
//   console.log('Вы выстрелили...');

//   setTimeout(function() {
//     Math.random() > .5 ? headshot({}) : fail('Вы промахнулись');
//   }, 3000)
// };

// function win() {
//   console.log('Вы победили!');
//   (drink == 1) ? buyBeer(): giveMoney();
// }

// function buyBeer() {
//   console.log('Вам купили пиво');
// }

// function giveMoney() {
//   console.log('Вам заплатили');
// }

// function loose() {
//   console.log('Вы проиграли');
// }

// shoot({},
//   function(mark) {
//     console.log('Вы попали в цель!');
//     win(mark);
//   },
//   function(miss) {
//     console.error(miss);
//     loose();
//   }
// )


// let drink = 0;

// function shoot(arrow) {
//   console.log('Вы сделали выстрел..');

//   let promise = new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       Math.random() > .5 ? resolve({}) : reject('Вы промахнулись');
//     }, 3000);
//   });

//   return promise;

// };


// function win() {
//   console.log('Вы победили!');
//   (drink == 1) ? buyBeer(): giveMoney();
// }

// function buyBeer() {
//   console.log('Вам купили пиво');
// }

// function giveMoney() {
//   console.log('Вам заплатили');
// }

// function loose() {
//   console.log('Вы проиграли');
// }

// shoot({})
//   .then(mark => console.log('Вы попали в цель!'))
//   .then(win)
//   .catch(loose)