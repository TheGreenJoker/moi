particlesJS('particles-js', {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        shape: {
            type: 'circle',
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 5,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'top',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        },
        color: {
            value: '#00ff9c'
        },
        line_linked: {
            enable: false
        }
    },
    interactivity: {
        events: {
            onhover: {
                enable: false
            }
        }
    }
});