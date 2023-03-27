(function() {
    'use strict';

    class CountdownTimer {
        constructor(_ref) {
            let {
                selector,
                targetDate
            } = _ref;
            this.selector = selector;
            this.targetDate = targetDate;
            this.refs = {
                days: document.querySelector(`${this.selector} [data-value="days"]`),
                hours: document.querySelector(`${this.selector} [data-value="hours"]`),
                mins: document.querySelector(`${this.selector} [data-value="minutes"]`),
                secs: document.querySelector(`${this.selector} [data-value="seconds"]`)
            };
            this.intervalId = null;
        }
        getTimeRemaining(endtime) {
            const total = Date.parse(endtime) - Date.parse(new Date());
            const days = total > 0 ? Math.floor(total / (1000 * 60 * 60 * 24)) : 0;
            const hours = total > 0 ? Math.floor(total / (1000 * 60 * 60) % 24) : 0;
            const mins = total > 0 ? Math.floor(total / 1000 / 60 % 60) : 0;
            const secs = total > 0 ? Math.floor(total / 1000 % 60) : 0;
            if (total <= 0) this.stopTimer();
            return {
                total,
                days,
                hours,
                mins,
                secs
            };
        }
        getDaysEnding(number) {
            const lastNum = number % 10;
            if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return 'дней';
            if (lastNum === 1) return 'день';
            if ([2, 3, 4].includes(lastNum)) return 'дня';
            if ([5, 6, 7, 8, 9, 0].includes(lastNum)) return 'дней';
        }
        updateTimer(_ref2) {
            let {
                days,
                hours,
                mins,
                secs
            } = _ref2;
            this.refs.days.textContent = days > 0 ? days + ' ' + this.getDaysEnding(days) : '';
            this.refs.hours.textContent = hours < 10 ? '0' + hours : hours;
            this.refs.mins.textContent = mins < 10 ? '0' + mins : mins;
            this.refs.secs.textContent = secs < 10 ? '0' + secs : secs;
        }
        startTimer() {
            const timer = this.getTimeRemaining(this.targetDate);
            this.updateTimer(timer);
            this.intervalId = setInterval(() => {
                const timer = this.getTimeRemaining(this.targetDate);
                this.updateTimer(timer);
            }, 1000);
        }
        stopTimer() {
            clearInterval(this.intervalId);
        }
    }

    /* eslint-disable no-undef */
    const Common = {
        init() {
            // Getting real vh for mobile browsers
            (function() {
                const customViewportCorrectionVariable = 'vh';

                function setViewportProperty(doc) {
                    const customVar = '--' + (customViewportCorrectionVariable);
                    let prevClientHeight;

                    function handleResize() {
                        const clientHeight = doc.clientHeight;
                        if (clientHeight === prevClientHeight) return;
                        requestAnimationFrame(function updateViewportHeight() {
                            doc.style.setProperty(customVar, clientHeight * 0.01 + 'px');
                            prevClientHeight = clientHeight;
                        });
                    }
                    handleResize();
                    return handleResize;
                }
                window.addEventListener('resize', setViewportProperty(document.documentElement));
            })();

            // Parallax
            (function() {
                const parallax = document.querySelector('.parallax');
                if (!parallax) return;
                new Parallax(parallax);
            })();

            // Countdown modal example
            (function() {
                const modalEl = document.getElementById('modalCountdown');
                if (!modalEl) return;
                const modal = new bootstrap.Modal(modalEl);
                const timer = new CountdownTimer({
                    selector: '#countdown',
                    targetDate: new Date('March, 30 2023 12:00:00')
                });
                setTimeout(() => {
                    modal.show();
                    timer.startTimer();
                }, 10000);
                modalEl.addEventListener('hidden.bs.modal', () => {
                    timer.stopTimer();
                });
            })();
        }
    };

    function getRandomInt(min, max) {
        const minimum = Math.ceil(min);
        const maximum = Math.floor(max);
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    function scrollTo(yPos) {
        let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
        const startY = window.scrollY;
        const difference = yPos - startY;
        const startTime = performance.now();
        step();

        function step() {
            const progress = (performance.now() - startTime) / duration;
            const amount = easeInOutCubic(progress);
            window.scrollTo({
                top: startY + amount * difference
            });
            if (progress < .999) {
                window.requestAnimationFrame(step);
            }
        }
    }

    function easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    /* eslint-disable no-undef */
    const MyFullpage = {
        config: {
            breakpoint: window.matchMedia('(min-width: 744px)'),
            linksToSection: document.querySelectorAll('[data-scrollto]'),
            buttonScrollDown: document.querySelector('.btn-scroll'),
            fp: null,
            timer: null
        },
        initFp() {
            this.config.fp = new fullpage('#fullpage', {
                licenseKey: '73438E6B-32424808-B5E93D50-0E3A4BE3',
                menu: '#menu',
                scrollOverflow: true,
                controlArrows: false,
                scrollingSpeed: 500,
                lazyLoading: false,
                credits: {
                    enabled: false
                },
                beforeLeave: (origin, destination) => {
                    if (this.config.buttonScrollDown) {
                        this.config.buttonScrollDown.classList.toggle('btn-scroll--texty', destination.anchor === 'whois');
                        this.config.buttonScrollDown.classList.toggle('btn-scroll--start', destination.anchor === 'hero');
                        this.config.buttonScrollDown.classList.toggle('btn-light', destination.anchor !== 'whois');
                        this.config.buttonScrollDown.classList.toggle('invisible', destination.anchor === 'contacts');
                    }
                }
            });
            this.config.fp.setAllowScrolling(false, 'left, right');
            this.config.fp.setKeyboardScrolling(false, 'left, right');
        },
        scrollByHash() {
            if (window.location.hash) {
                const anchor = window.location.hash.substring(1);
                const section = document.querySelector('[data-anchor=' + anchor + ']') || document.querySelector('[data-anchor="hero"');
                const scrollTargetPosition = section.getBoundingClientRect().top + window.scrollY;
                scrollTo(scrollTargetPosition);
            }
        },
        breakpointCheck() {
            if (this.config.breakpoint.matches) {
                if (this.config.fp === null) {
                    this.initFp();
                }
            } else {
                if (this.config.fp !== null) {
                    this.config.fp.destroy('all');
                    this.config.fp = null;
                }
            }
        },
        init() {
            this.breakpointCheck();
            if (!this.config.breakpoint.matches) {
                this.scrollByHash();
            }
            window.addEventListener('resize', () => {
                clearTimeout(this.config.timer);
                this.config.timer = setTimeout(() => {
                    this.breakpointCheck();
                }, 100);
            });
            if (this.config.buttonScrollDown) {
                this.config.buttonScrollDown.addEventListener('click', () => {
                    this.config.fp.moveSectionDown();
                });
            }
            Array.prototype.slice.call(this.config.linksToSection).forEach(link => {
                link.addEventListener('click', event => {
                    const anchor = event.target.getAttribute('data-scrollto') || 'hero';
                    const scrollTargetPosition = document.querySelector('.section--' + anchor).getBoundingClientRect().top + window.scrollY;
                    if (this.config.fp !== null) {
                        this.config.fp.moveTo(anchor);
                    } else {
                        scrollTo(scrollTargetPosition);
                    }
                });
            });
        }
    };

    /* eslint-disable no-undef */
    const Header = {
        config: {
            body: document.body,
            nav: document.querySelector('#navigation'),
            navLinks: document.querySelectorAll('#menu .nav-link'),
            mql: window.matchMedia('(min-width: 744px)')
        },
        navHide() {
            new bootstrap.Collapse(this.config.nav, {
                hide: true
            });
        },
        init() {
            if (!this.config.nav) {
                return;
            }
            Array.prototype.slice.call(this.config.navLinks).forEach(link => {
                link.addEventListener('click', event => {
                    const anchor = event.target.closest('.nav-item').getAttribute('data-menuanchor') || 'hero';
                    const scrollTargetPosition = document.querySelector('.section--' + anchor).getBoundingClientRect().top + window.scrollY;
                    if (!this.config.mql.matches) {
                        this.navHide();
                        scrollTo(scrollTargetPosition);
                    }
                });
            });
            this.config.body.addEventListener('keyup', event => {
                if (this.config.nav.classList.contains('show') && event.key === 'Escape') {
                    this.navHide();
                }
            });
            this.config.nav.addEventListener('show.bs.collapse', () => {
                this.config.nav.classList.add('show');
                this.config.body.classList.add('overflow-hidden');
            });
            this.config.nav.addEventListener('hide.bs.collapse', () => {
                this.config.body.classList.remove('overflow-hidden');
            });
        }
    };

    /* eslint-disable no-undef */
    const Quiz = window.Quiz = {
        config: {
            body: document.body,
            screenQuiz: document.querySelector('.quizz-container--quiz'),
            screenResult: document.querySelector('.quizz-container--result'),
            sectionSliderEl: document.querySelector('.section--quiz .section-slider'),
            sectionSlider: null,
            quizSliderEl: document.querySelector('.quizz-slider'),
            quizSlider: null,
            quizButton: document.querySelector('.btn-quiz'),
            elements: document.querySelectorAll('.quizz-vars-item input[type="radio"]'),
            progress: document.querySelector('.quizz-progress .progress'),
            bar: document.querySelector('.quizz-progress .bar'),
            offsetProperty: '--offset',
            animatedClass: 'animated',
            hiddenClass: 'hidden',
            processClass: 'page-quiz-process'
        },
        setOffset(el, counter, count) {
            const offset = Math.PI * (380 - 57) * ((100 - counter * 100 / count) / 100);
            el.style.setProperty(this.config.offsetProperty, offset + 'px');
        },
        init() {
            const count = this.config.quizSliderEl.querySelectorAll('.quizz-item').length;
            let inProgress = false;
            this.initQuizSlider();
            const quizSwiper = this.config.quizSliderEl.swiper;
            this.config.body.classList.add(this.config.processClass);
            Array.prototype.slice.call(this.config.elements).forEach(el => {
                el.addEventListener('click', event => {
                    if (inProgress) {
                        event.preventDefault();
                    }
                });
                el.addEventListener('change', event => {
                    if (inProgress || quizSwiper.destroyed) {
                        event.preventDefault();
                        return;
                    }
                    this.config.quizSliderEl.classList.add('disabled');
                    inProgress = true;
                    if (quizSwiper.activeIndex + 1 < count) {
                        setTimeout(() => {
                            this.config.quizSliderEl.classList.remove('disabled');
                            if (this.config.progress) {
                                this.setOffset(this.config.bar, quizSwiper.activeIndex + 1, count);
                            }
                            quizSwiper.slideNext();
                            inProgress = false;
                        }, 350);
                    } else {
                        this.config.body.classList.remove(this.config.processClass);
                        if (this.config.progress) {
                            this.config.progress.classList.add(this.config.animatedClass);
                            this.setOffset(this.config.bar, quizSwiper.activeIndex + 1, count);
                        }
                        this.config.quizSliderEl.classList.add(this.config.hiddenClass);
                        const waiter = document.createElement('div');
                        waiter.className = 'quizz-waiter';
                        waiter.textContent = 'Секунду, мы считаем твой результат! Пока можешь немного позаниматься творожной аэробикой.';
                        this.config.quizSliderEl.parentNode.appendChild(waiter);
                        setTimeout(() => {
                            document.querySelector('.quizz-waiter').classList.add('show');
                        }, 350);
                        setTimeout(() => {
                            const sectionSwiper = this.config.sectionSliderEl.swiper;
                            this.config.quizSliderEl.classList.remove('disabled');
                            sectionSwiper.slideNext();
                            inProgress = false;
                            const scrollTargetPosition = document.querySelector('.section--quiz').getBoundingClientRect().top + window.scrollY;
                            scrollTo(scrollTargetPosition);
                        }, 4000);
                    }
                });
            });
        },
        initSectionSlider() {
            this.config.sectionSlider = new Swiper(this.config.sectionSliderEl, {
                allowTouchMove: false,
                autoHeight: true
            });
            if (this.config.quizButton) {
                this.config.quizButton.addEventListener('click', () => {
                    const scrollTargetPosition = document.querySelector('.section--quiz').getBoundingClientRect().top + window.scrollY;
                    const swiper = this.config.sectionSliderEl.swiper;
                    scrollTo(scrollTargetPosition);
                    swiper.slideNext();
                    this.init();
                });
            }
        },
        initQuizSlider() {
            this.config.quizSlider = new Swiper(this.config.quizSliderEl, {
                allowTouchMove: false,
                autoHeight: true,
                pagination: {
                    el: '.quizz-pages',
                    type: 'fraction'
                }
            });
        }
    };

    /* eslint-disable no-undef */
    const Wheel = {
        config: {
            screenStart: document.querySelector('.wheel-container--start'),
            screenResult: document.querySelector('.wheel-container--result'),
            button: document.querySelector('.btn-rotate'),
            buttonAgain: document.querySelector('.btn-rotate-again'),
            drum: document.querySelector('.wheel-drum'),
            isRunning: false,
            startOffset: 0
        },
        rotate() {
            const duration = 10;
            const index = getRandomInt(1, 8);
            const section = 360 / 8;
            const offset = (index - 1) * section + section / 2;
            const rotate = 360 * duration + offset;
            if (this.config.isRunning) return;
            this.config.isRunning = true;
            gsap.fromTo(this.config.drum, {
                rotate: this.config.startOffset
            }, {
                rotate: rotate,
                duration: duration,
                ease: 'power2.inOut'
            });
            this.config.startOffset = rotate % 360;
            setTimeout(() => {
                this.config.isRunning = false;
                this.config.startOffset = 0;
                this.toggleScreens(this.config.screenStart, this.config.screenResult, true);
                const scrollTargetPosition = document.querySelector('.section--wheel').getBoundingClientRect().top + window.scrollY;
                scrollTo(scrollTargetPosition);
            }, duration * 1000);
        },
        toggleScreens(first, second, showSpinner) {
            first.classList.add('hidden');
            if (showSpinner) {
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                first.closest('.section').appendChild(spinner);
            }
            setTimeout(() => {
                first.classList.add('d-none');
                second.classList.remove('d-none');
                setTimeout(() => {
                    second.classList.remove('hidden');
                    if (showSpinner) {
                        document.querySelector('.spinner').remove();
                    }
                }, 400);
            }, 400);
        },
        init() {
            if (this.config.button) {
                this.config.button.addEventListener('click', () => {
                    const scrollTargetPosition = document.querySelector('.wheel-image').getBoundingClientRect().top + window.scrollY - 140;
                    scrollTo(scrollTargetPosition);
                    this.rotate();
                    this.config.button.disabled = true;
                });
            }
            if (this.config.buttonAgain) {
                this.config.buttonAgain.addEventListener('click', () => {
                    this.toggleScreens(this.config.screenResult, this.config.screenStart);
                    this.config.button.parentNode.classList.add('d-none');
                    setTimeout(() => {
                        const scrollTargetPosition = document.querySelector('.wheel-image').getBoundingClientRect().top + window.scrollY - 140;
                        scrollTo(scrollTargetPosition);
                        this.rotate();
                    }, 800);
                });
            }
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        Common.init();
        MyFullpage.init();
        Header.init();
        Quiz.initSectionSlider();
        window.Quiz = Quiz;
        Wheel.init();
    });

})();