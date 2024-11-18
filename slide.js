const swiper = new Swiper('.slider-wrapper', {
    // Optional parameters
    //direction: 'vertical',
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
  
    // If we need pagination
    pagination:: true,
    spaceBetween: 30,
  
    // If we need pagination
    pagination:
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    breakpoints:{
        0:{
            slidesPerView: 1
        },
        620:{
            slidesPerView: 2
        },
        1024:{
            slidesPerView:3
        }
    },
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
  