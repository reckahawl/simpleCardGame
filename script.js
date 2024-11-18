/*
document.addEventListener("DOMContentLoaded", function() {
    const carouselImages = document.querySelector(".carousel-images");
    const images = document.querySelectorAll(".carousel-images img");
    let currentIndex = 0;
    const totalImages = images.length;
    //const imageWidth = images[0].clientWidth;

    function moveToNextImage() {
        currentIndex++;
        updateCarouselPosition();

        if (currentIndex >= totalImages) {
            setTimeout(()=>{
                carouselImages.style.transition = "none"; // Disable transition
                carouselImages.style.transform = `translateX(0%)`; // Jump back to the first image
                currentIndex = 0; // Reset index
                setTimeout(()=>{
                    carouselImages.style.transform = `translateX(-${currentIndex * imageWidth}px)`;

                }, 0);
            }, 500);
        }
    }

    function updateCarouselPosition(){
        const percentage = -(currentIndex * 100) / totalImages;
        carouselImages.style.transform = 'translateX(${percentage}%)';
    }

    let carouselInterval = setInterval(moveToNextImage, 3000);

    carouselImages.addEventListener("mouseover", () => {
        clearInterval(carouselInterval);
    });

    carouselImages.addEventListener("mouseout", () => {
        carouselInterval = setInterval(moveToNextImage, 3000);
    });

});

document.addEventListener("DOMContentLoaded", function() {
    const carouselImages = document.querySelector(".carousel-images");
    const images = document.querySelectorAll(".carousel-images img");
    let currentIndex = 0;
    const totalImages = images.length;

    function moveToNextImage() {
        currentIndex++;
        if (currentIndex >= totalImages) {
            // Temporarily move to the first image clone (no transition)
            carouselImages.style.transition = "none";
            carouselImages.style.transform = `translateX(0%)`;
            currentIndex = 1; // Reset to the second image which is visually the first image
            setTimeout(() => {
                // Enable transition back after the jump
                carouselImages.style.transition = "transform 0.5s ease-in-out";
                carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 0);
        } else {
            carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }

    function updateCarouselPosition() {
        const percentage = -(currentIndex * 100);
        carouselImages.style.transform = `translateX(${percentage}%)`;
    }

    // Automatically move to the next image every 3 seconds
    let carouselInterval = setInterval(moveToNextImage, 3000);

    // Pause the carousel on hover
    carouselImages.addEventListener("mouseover", () => {
        clearInterval(carouselInterval);
    });

    // Resume the carousel when hover ends
    carouselImages.addEventListener("mouseout", () => {
        carouselInterval = setInterval(moveToNextImage, 3000);
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const carouselImages = document.querySelector(".carousel-images");
    const images = document.querySelectorAll(".carousel-images img");
    const totalImages = images.length;
    let currentIndex = 0;

    function moveToNextImage() {
        currentIndex++;
        if (currentIndex >= totalImages) {
            currentIndex = 0;
            carouselImages.style.transition = "none";
            carouselImages.style.transform = `translateX(0%)`;
            setTimeout(() => {
                carouselImages.style.transition = "transform 0.5s ease-in-out";
            }, 50);
        } else {
            carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }

    // Automatically move to the next image every 3 seconds
    let carouselInterval = setInterval(moveToNextImage, 3000);

    // Pause the carousel on hover
    carouselImages.addEventListener("mouseover", () => {
        clearInterval(carouselInterval);
    });

    // Resume the carousel when hover ends
    carouselImages.addEventListener("mouseout", () => {
        carouselInterval = setInterval(moveToNextImage, 3000);
    });
});
*/
document.addEventListener("DOMContentLoaded", function() {
    const carouselImages = document.querySelector(".carousel-images");
    const images = document.querySelectorAll(".carousel-images img");
    const totalImages = images.length;
    let currentIndex = 0;

    function moveToNextImage() {
        currentIndex++;
        if (currentIndex >= totalImages) {
            currentIndex = 0;
        }
        carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Automatically move to the next image every 3 seconds
    let carouselInterval = setInterval(moveToNextImage, 3000);

    // Pause the carousel on hover
    carouselImages.addEventListener("mouseover", () => {
        clearInterval(carouselInterval);
    });

    // Resume the carousel when hover ends
    carouselImages.addEventListener("mouseout", () => {
        carouselInterval = setInterval(moveToNextImage, 3000);
    });
});
