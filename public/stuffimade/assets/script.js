function multiImageMove(selector) {
    //move many
    //in a container of .shuttleContainer
    $(selector + ".shuttleContainer").each((pi, pe) => {
        var lastChildIndex = $(pe).children().length - 1;
        $(pe).children().each((i, e) => {
            gsap.to(e, {
                y: (30 * i / lastChildIndex) + "vh",

                scrollTrigger: {
                    scrub: 0.1,
                    trigger: $(e).parent(".shuttleContainer"),
                    start: "top bottom",
                    end: "bottom top",
                    ease: "power1.inOut"
                }
            });
        });
    });
}

function parallax(selector) {
    //parallax 
    //put .parallax on a container and everything inside will have parallax.
    $(selector + ".parallax > *").each((i, e) => {
        gsap.to(e, {
            y: 70,
            scrollTrigger: {
                scrub: true,
                trigger: $(e).parent()[0],
                start: "top bottom",
                end: "bottom top",
                ease: "linear"
            }
        });
    })
}

function initAnimations() {
    parallax("");
    multiImageMove(""); //motor
}


function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

$(function() {
    setTimeout(() => {
        try {
            if (!detectMob()) {
                var Scrollbar = window.Scrollbar;

                // 3rd party library setup:
                const bodyScrollBar = Scrollbar.init(document.querySelector('#my-scrollbar'), {
                    damping: 0.1,
                    renderByPixels: true
                });

                // Tell ScrollTrigger to use these proxy getter/setter methods for the "body" element: 
                ScrollTrigger.scrollerProxy(document.body, {
                    scrollTop(value) {
                        if (arguments.length) {
                            bodyScrollBar.scrollTop = value; // setter
                        }
                        return bodyScrollBar.scrollTop; // getter
                    },
                    getBoundingClientRect() {
                        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                    }
                });

                // when the smooth scroller updates, tell ScrollTrigger to update() too: 
                bodyScrollBar.addListener(ScrollTrigger.update);

            }
        } catch (e) {
            console.log(e);
        }

        initAnimations();
    }, 1000);
});