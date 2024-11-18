/*--------------------
Vars
--------------------
const $menu = document.querySelector('.menu')
const $items = document.querySelectorAll('.menu--item')
const $images = document.querySelectorAll('.menu--item img')
let menuWidth = $menu.clientWidth
let itemWidth = $items[0].clientWidth
let wrapWidth = $items.length * itemWidth

let scrollSpeed = 0
let oldScrollY = 0
let scrollY = 0
let y = 0


/*--------------------
Lerp
--------------------
const lerp = (v0, v1, t) => {
  return v0 * ( 1 - t ) + v1 * t
}


/*--------------------
Dispose
const dispose = (scroll) => {
  gsap.set($items, {
    x: (i) => {
      return i * itemWidth + scroll
    },
    modifiers: {
      x: (x, target) => {
        const s = gsap.utils.wrap(-itemWidth, wrapWidth - itemWidth, parseInt(x))
        return `${s}px`
      }
    }
  })
} 
dispose(0)


/*--------------------
Wheel
--------------------
const handleMouseWheel = (e) => {
  scrollY -= e.deltaY * 0.9
}


/*--------------------
Touch
--------------------
let touchStart = 0
let touchX = 0
let isDragging = false
const handleTouchStart = (e) => {
  touchStart = e.clientX || e.touches[0].clientX
  isDragging = true
  $menu.classList.add('is-dragging')
}
const handleTouchMove = (e) => {
  if (!isDragging) return
  touchX = e.clientX || e.touches[0].clientX
  scrollY += (touchX - touchStart) * 2.5
  touchStart = touchX
}
const handleTouchEnd = () => {
  isDragging = false
  $menu.classList.remove('is-dragging')
}


/*--------------------
Listeners
--------------------
$menu.addEventListener('mousewheel', handleMouseWheel)

$menu.addEventListener('touchstart', handleTouchStart)
$menu.addEventListener('touchmove', handleTouchMove)
$menu.addEventListener('touchend', handleTouchEnd)

$menu.addEventListener('mousedown', handleTouchStart)
$menu.addEventListener('mousemove', handleTouchMove)
$menu.addEventListener('mouseleave', handleTouchEnd)
$menu.addEventListener('mouseup', handleTouchEnd)

$menu.addEventListener('selectstart', () => { return false })


/*--------------------
Resize
--------------------
window.addEventListener('resize', () => {
  menuWidth = $menu.clientWidth
  itemWidth = $items[0].clientWidth
  wrapWidth = $items.length * itemWidth
})


/*--------------------
Render
--------------------
const render = () => {
  requestAnimationFrame(render)
  y = lerp(y, scrollY, .1)
  dispose(y)
  
  scrollSpeed = y - oldScrollY
  oldScrollY = y
  
  gsap.to($items, {
    skewX: -scrollSpeed * .2,
    rotate: scrollSpeed * .01,
    scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.003
  })
}
render()

// https://colorlib.com/preview/theme/seogo/

const buttonsWrapper = document.querySelector(".map");
const slides = document.querySelector(".inner");

buttonsWrapper.addEventListener("click", e => {
  if (e.target.nodeName === "BUTTON") {
    Array.from(buttonsWrapper.children).forEach(item =>
      item.classList.remove("active")
    );
    if (e.target.classList.contains("first")) {
      slides.style.transform = "translateX(-0%)";
      e.target.classList.add("active");
    } else if (e.target.classList.contains("second")) {
      slides.style.transform = "translateX(-33.33333333333333%)";
      e.target.classList.add("active");
    } else if (e.target.classList.contains('third')){
      slides.style.transform = 'translatex(-66.6666666667%)';
      e.target.classList.add('active');
    }
  }
});


class VerticalMouseDrivenCarousel {
	constructor(options = {}) {
		const _defaults = {
			carousel: ".js-carousel",
			bgImg: ".js-carousel-bg-img",
			list: ".js-carousel-list",
			listItem: ".js-carousel-list-item"
		};

		this.posY = 0;

		this.defaults = Object.assign({}, _defaults, options);

		this.initCursor();
		this.init();
		this.bgImgController();
	}

	//region getters
	getBgImgs() {
		return document.querySelectorAll(this.defaults.bgImg);
	}

	getListItems() {
		return document.querySelectorAll(this.defaults.listItem);
	}

	getList() {
		return document.querySelector(this.defaults.list);
	}

	getCarousel() {
		return document.querySelector(this.defaults.carousel);
	}

	init() {
		TweenMax.set(this.getBgImgs(), {
			autoAlpha: 0,
			scale: 1.05
		});

		TweenMax.set(this.getBgImgs()[0], {
			autoAlpha: 1,
			scale: 1
		});

		this.listItems = this.getListItems().length - 1;
		
		this.listOpacityController(0);
	}

	initCursor() {
		const listHeight = this.getList().clientHeight;
		const carouselHeight = this.getCarousel().clientHeight;

		this.getCarousel().addEventListener(
			"mousemove",
			event => {
				this.posY = event.pageY - this.getCarousel().offsetTop;
				let offset = -this.posY / carouselHeight * listHeight;

				TweenMax.to(this.getList(), 0.3, {
					y: offset,
					ease: Power4.easeOut
				});
			},
			false
		);
	}

	bgImgController() {
		for (const link of this.getListItems()) {
			link.addEventListener("mouseenter", ev => {
				let currentId = ev.currentTarget.dataset.itemId;

				this.listOpacityController(currentId);

				TweenMax.to(ev.currentTarget, 0.3, {
					autoAlpha: 1
				});

				TweenMax.to(".is-visible", 0.2, {
					autoAlpha: 0,
					scale: 1.05
				});

				if (!this.getBgImgs()[currentId].classList.contains("is-visible")) {
					this.getBgImgs()[currentId].classList.add("is-visible");
				}

				TweenMax.to(this.getBgImgs()[currentId], 0.6, {
					autoAlpha: 1,
					scale: 1
				});
			});
		}
	}

	listOpacityController(id) {
		id = parseInt(id);
		let aboveCurrent = this.listItems - id;
		let belowCurrent = parseInt(id);

		if (aboveCurrent > 0) {
			for (let i = 1; i <= aboveCurrent; i++) {
				let opacity = 0.5 / i;
				let offset = 5 * i;
				TweenMax.to(this.getListItems()[id + i], 0.5, {
					autoAlpha: opacity,
					x: offset,
					ease: Power3.easeOut
				});
			}
		}

		if (belowCurrent > 0) {
			for (let i = 0; i <= belowCurrent; i++) {
				let opacity = 0.5 / i;
				let offset = 5 * i;
				TweenMax.to(this.getListItems()[id - i], 0.5, {
					autoAlpha: opacity,
					x: offset,
					ease: Power3.easeOut
				});
			}
		}
	}
}

new VerticalMouseDrivenCarousel();

class VerticalMouseDrivenCarousel {
    constructor(options = {}) {
        const _defaults = {
            carousel: ".js-carousel",
            bgImg: ".js-carousel-bg-img",
            list: ".js-carousel-list",
            listItem: ".js-carousel-list-item"
        };

        this.posY = 0;

        this.defaults = Object.assign({}, _defaults, options);

        this.initCursor();
        this.init();
        this.bgImgController();
    }

    getBgImgs() {
        return document.querySelectorAll(this.defaults.bgImg);
    }

    getListItems() {
        return document.querySelectorAll(this.defaults.listItem);
    }

    getList() {
        return document.querySelector(this.defaults.list);
    }

    getCarousel() {
        return document.querySelector(this.defaults.carousel);
    }

    init() {
        TweenMax.set(this.getBgImgs(), {
            autoAlpha: 0,
            scale: 1.05
        });

        TweenMax.set(this.getBgImgs()[0], {
            autoAlpha: 1,
            scale: 1
        });

        this.listItems = this.getListItems().length - 1;
        this.listOpacityController(0);
    }

    initCursor() {
        const listHeight = this.getList().clientHeight;
        const carouselHeight = this.getCarousel().clientHeight;

        this.getCarousel().addEventListener(
            "mousemove",
            event => {
                this.posY = event.pageY - this.getCarousel().offsetTop;
                let offset = -this.posY / carouselHeight * listHeight;

                TweenMax.to(this.getList(), 0.3, {
                    y: offset,
                    ease: Power4.easeOut
                });
            },
            false
        );
    }

    bgImgController() {
        for (const link of this.getListItems()) {
            link.addEventListener("mouseenter", ev => {
                let currentId = ev.currentTarget.dataset.itemId;

                this.listOpacityController(currentId);

                TweenMax.to(ev.currentTarget, 0.3, {
                    autoAlpha: 1
                });

                TweenMax.to(".is-visible", 0.2, {
                    autoAlpha: 0,
                    scale: 1.05
                });

                if (!this.getBgImgs()[currentId].classList.contains("is-visible")) {
                    this.getBgImgs()[currentId].classList.add("is-visible");
                }

                TweenMax.to(this.getBgImgs()[currentId], 0.6, {
                    autoAlpha: 1,
                    scale: 1
                });
            });
        }
    }

    listOpacityController(id) {
        id = parseInt(id);
        let aboveCurrent = this.listItems - id;
        let belowCurrent = parseInt(id);

        if (aboveCurrent > 0) {
            for (let i = 1; i <= aboveCurrent; i++) {
                let opacity = 0.5 / i;
                let offset = 5 * i;
                TweenMax.to(this.getListItems()[id + i], 0.5, {
                    autoAlpha: opacity,
                    x: offset,
                    ease: Power3.easeOut
                });
            }
        }

        if (belowCurrent > 0) {
            for (let i = 0; i <= belowCurrent; i++) {
                let opacity = 0.5 / i;
                let offset = 5 * i;
                TweenMax.to(this.getListItems()[id - i], 0.5, {
                    autoAlpha: opacity,
                    x: offset,
                    ease: Power3.easeOut
                });
            }
        }
    }
}
new VerticalMouseDrivenCarousel();

*/
class VerticalMouseDrivenCarousel {
    constructor(options = {}) {
        const _defaults = {
            carousel: ".js-carousel",
            bgImg: ".js-carousel-bg-img",
            list: ".js-carousel-list",
            listItem: ".js-carousel-list-item"
        };

        this.posY = 0;

        this.defaults = Object.assign({}, _defaults, options);

        this.initCursor();
        this.init();
        this.bgImgController();
    }

    getBgImgs() {
        return document.querySelectorAll(this.defaults.bgImg);
    }

    getListItems() {
        return document.querySelectorAll(this.defaults.listItem);
    }

    getList() {
        return document.querySelector(this.defaults.list);
    }

    getCarousel() {
        return document.querySelector(this.defaults.carousel);
    }

    init() {
        gsap.set(this.getBgImgs(), {
            autoAlpha: 0,
            scale: 1.05
        });

        gsap.set(this.getBgImgs()[0], {
            autoAlpha: 1,
            scale: 1
        });

        this.listItems = this.getListItems().length - 1;
        this.listOpacityController(0);
    }

    initCursor() {
        const listHeight = this.getList().clientHeight;
        const carouselHeight = this.getCarousel().clientHeight;

        this.getCarousel().addEventListener(
            "mousemove",
            event => {
                this.posY = event.pageY - this.getCarousel().offsetTop;
                let offset = -this.posY / carouselHeight * listHeight;

                gsap.to(this.getList(), 0.3, {
                    y: offset,
                    ease: "power4.out"
                });
            },
            false
        );
    }

    bgImgController() {
        for (const link of this.getListItems()) {
            link.addEventListener("mouseenter", ev => {
                let currentId = ev.currentTarget.dataset.itemId;

                this.listOpacityController(currentId);

                gsap.to(ev.currentTarget, 0.3, {
                    autoAlpha: 1
                });

                gsap.to(".is-visible", 0.2, {
                    autoAlpha: 0,
                    scale: 1.05
                });

                if (!this.getBgImgs()[currentId].classList.contains("is-visible")) {
                    this.getBgImgs()[currentId].classList.add("is-visible");
                }

                gsap.to(this.getBgImgs()[currentId], 0.6, {
                    autoAlpha: 1,
                    scale: 1
                });
            });
        }
    }

    listOpacityController(id) {
        id = parseInt(id);
        let aboveCurrent = this.listItems - id;
        let belowCurrent = parseInt(id);

        if (aboveCurrent > 0) {
            for (let i = 1; i <= aboveCurrent; i++) {
                let opacity = 0.5 / i;
                let offset = 5 * i;
                gsap.to(this.getListItems()[id + i], 0.5, {
                    autoAlpha: opacity,
                    x: offset,
                    ease: "power3.out"
                });
            }
        }

        if (belowCurrent > 0) {
            for (let i = 0; i <= belowCurrent; i++) {
                let opacity = 0.5 / i;
                let offset = 5 * i;
                gsap.to(this.getListItems()[id - i], 0.5, {
                    autoAlpha: opacity,
                    x: offset,
                    ease: "power3.out"
                });
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new VerticalMouseDrivenCarousel();
});
