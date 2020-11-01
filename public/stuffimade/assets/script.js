function multiImageMove(selector) {
    //move many
    gsap.to(selector + " .image", {
        y: function(i, t) {
            return (i / $(t).siblings().length * 30) + "vh";
        },
        scrollTrigger: {
            scrub: 0.1,
            trigger: ".imageSection" + selector,
            start: "top bottom",
            end: "bottom top",
            ease: "power1.inOut"
                //ease: "liniar",
                //markers:true,
        }
    });
}

function parallax(selector) {
    //parallax 
    gsap.to(selector + " .image .img", {
        y: 40,
        scrollTrigger: {
            // scrub: 0.5,
            scrub: 0.1,
            trigger: selector + ".imageSection",
            start: "top bottom",
            end: "bottom top",
            ease: "power1.inOut"
        }
    });
}

function initAnimations() {

    multiImageMove(".s4"); //motor
    parallax(".s4");
    multiImageMove(".s3"); //arduinos
    parallax(".s3");
    parallax(".s5"); //coaster
    multiImageMove(".s6"); //lens
    parallax(".s6");
    multiImageMove(".s7"); //night light
    parallax(".s7");
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

if (!detectMob()) {
    // 3rd party library setup:
    const bodyScrollBar = Scrollbar.init(document.body, { damping: 0.1, renderByPixels: true });

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
initAnimations();