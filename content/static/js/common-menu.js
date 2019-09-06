// author: Taehong Kim
// email: peppy0510@hotmail.com


var navbarElement = {
    proxy: {},
    get: function(selector, reload) {
        let namespace = selector.replace(/[ |.|#|:|(|)|\-\s]/g, '');
        if (reload || (!this.proxy[namespace] || !this.proxy[namespace].length)) {
            this.proxy[namespace] = $(selector);
        }
        return this.proxy[namespace];
    }
}

function getComputedTranslateY(obj) {
    if (!window.getComputedStyle) return;
    let style = getComputedStyle(obj),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    let mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) { return parseFloat(mat[1].split(', ')[13]) };
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}

var modalMask = {
    show: function(timeout) {
        if (timeout === undefined) { timeout = 150; }
        let mask = navbarElement.get('.navbar .navbar-modal-mask');
        mask.fadeIn(timeout);
    },
    hide: function(timeout) {
        if (timeout === undefined) { timeout = 150; }
        let mask = navbarElement.get('.navbar .navbar-modal-mask');
        mask.fadeOut(timeout);
    }
}

var dropdownMenuCtrl = {
    transition: {
        'transition-duration': '0.15s',
        'transition-property': 'transform',
        'transition-timing-function': 'ease',
    },
    removeTransition: function() {
        let element = navbarElement.get('.navbar .dropdown-menu');
        element.css({
            'transform': '',
            'transition-duration': '',
            'transition-property': '',
            'transition-timing-function': '',
        });
    },
    slideIn: function() {
        let element = navbarElement.get('.navbar .dropdown-menu');
        element.css($.extend(this.transition, {
            'transform': 'translate3d(0, 0 ,0) scale(1, 1)'
        }));
    },
    slideOut: function() {
        let element = navbarElement.get('.navbar .dropdown-menu');
        let active = navbarElement.get('.navbar .dropdown-menu.active', true);
        let y = -active.outerHeight() * 0.5;
        element.css($.extend(this.transition, {
            'transform': 'translate3d(0, ' + y + 'px, 0) scale(1, 0)'
        }));
    },
    toggle: function(index) {
        // console.log(index);
        let useAnimation = true;
        var navbarDivWidth = 520;
        let width = $(document).width();
        let isNarrow = Boolean(width < navbarDivWidth);
        if (isNarrow) { return; }
        let navbar = $('.navbar');
        navbar.css({ 'transform': '' });
        let otherMenus = navbar.find('.active.dropdown-menu:not(.dropdown-menu-' + index + ')');
        if (otherMenus) { otherMenus.removeClass('active'); }
        let otherToggles = navbar.find('.active.dropdown-toggle:not(.dropdown-toggle-' + index + ')');
        if (otherToggles) { otherToggles.removeClass('active'); }
        let dropdownMenu = navbar.find('.dropdown-menu-' + index);
        let dropdownToggle = navbar.find('.dropdown-toggle-' + index);
        if (!dropdownMenu.hasClass('active') || !dropdownToggle.hasClass('active')) {
            dropdownMenu.addClass('active');
            dropdownToggle.addClass('active');
            if (useAnimation) {
                this.slideOut();
                setTimeout(function() {
                    dropdownMenuCtrl.slideIn();
                }, 10);
            }

        } else {
            if (useAnimation) {
                this.slideOut();
                setTimeout(function() {
                    dropdownMenuCtrl.removeTransition();
                    dropdownMenu.removeClass('active');
                    dropdownToggle.removeClass('active');
                }, this.transitionDuration() * 1000);
            } else {
                dropdownMenu.removeClass('active');
                dropdownToggle.removeClass('active');
            }
        }
    },
    close: function() {
        let navbar = $('.navbar');
        navbar.find('.dropdown-menu').removeClass('active');
        navbar.find('.dropdown-toggle').removeClass('active');
        this.removeTransition();
    },
    transitionDuration: function() {
        return parseFloat(this.transition['transition-duration'].replace(/[ ms]/g, ''));
    }
}

var navbarHamburgerCtrl = {
    transition: {
        'transition-duration': '0.15s',
        'transition-property': 'transform',
        'transition-timing-function': 'ease',
    },
    removeTransition: function() {
        let element = navbarElement.get('.navbar .navbar-menu');
        element.css({
            'transform': '',
            'transition-duration': '',
            'transition-property': '',
            'transition-timing-function': '',
        });
    },
    slideIn: function() {
        let element = navbarElement.get('.navbar .navbar-menu');
        element.css($.extend(this.transition, {
            'transform': 'translateX(0)'
        }));
    },
    slideOut: function() {
        let element = navbarElement.get('.navbar .navbar-menu');
        element.css($.extend(this.transition, {
            'transform': 'translateX(260px)'
        }));
    },
    toggle: function() {
        let body = navbarElement.get('body');
        let navbar = navbarElement.get('.navbar');
        let navbarMenu = navbarElement.get('.navbar .navbar-menu');
        navbar.css({ 'transform': '' });
        if (!navbarMenu.hasClass('active')) {
            body.addClass('overflow-hidden');
            navbarMenu.addClass('active');
            this.slideOut();
            setTimeout(function() {
                navbarHamburgerCtrl.slideIn();
                modalMask.show();
            }, 10);
        } else {
            body.removeClass('overflow-hidden');
            this.slideOut();
            setTimeout(function() {
                navbarHamburgerCtrl.removeTransition();
                navbarMenu.removeClass('active');
                modalMask.hide();
            }, this.transitionDuration() * 1000);
        }
    },
    close: function(withoutAnimation) {
        withoutAnimation = Boolean(withoutAnimation);
        let body = navbarElement.get('body');
        let navbar = navbarElement.get('.navbar');
        let navbarMenu = navbarElement.get('.navbar .navbar-menu');
        body.removeClass('overflow-hidden');
        if (navbarMenu.hasClass('active') && withoutAnimation === false) {
            this.slideOut();
            setTimeout(function() {
                navbarHamburgerCtrl.removeTransition();
                navbarMenu.removeClass('active');
                modalMask.hide();
            }, this.transitionDuration() * 1000);
        } else {
            // this.slideOut();
            this.removeTransition();
            navbarMenu.removeClass('active');
            modalMask.hide();
        }
    },
    transitionDuration: function() {
        return parseFloat(this.transition['transition-duration'].replace(/[ ms]/g, ''));
    }
}

$(document).ready(function() {
    let navbar = $('.navbar');
    let dropdownToggles = navbar.find('.dropdown-toggle');
    for (let index = 0; index < dropdownToggles.length; index++) {
        let childNodes = dropdownToggles[index].parentNode.childNodes;
        // dropdownToggles[index].href = 'javascript:void(0)';
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].classList &&
                childNodes[i].classList.contains('dropdown-menu')) {
                childNodes[i].classList.add('dropdown-menu-' + index);
            }
        }
        dropdownToggles[index].classList.add('dropdown-toggle-' + index);
        let newIndex = index;
        dropdownToggles[index].onclick = function(event) {
            dropdownMenuCtrl.toggle(newIndex);
        }
    }
    $('body').bind('click', function(event) {
        // console.log(event);
        let exceptionalClasses = [
            'navbar-menu', 'navbar-toggle',
            'dropdown', 'dropdown-menu', 'dropdown-toggle'
        ];
        let targetClassList = event.target.classList;
        let parentClassList = event.target.parentNode && event.target.parentNode.classList;
        if ((targetClassList && targetClassList.contains('navbar-menu-mask')) ||
            (parentClassList && parentClassList.contains('navbar-menu-mask'))) {
            navbarHamburgerCtrl.close();
            dropdownMenuCtrl.close();
            return;
        }
        for (let i = 0; i < exceptionalClasses.length; i++) {
            let className = exceptionalClasses[i];
            if ((targetClassList && targetClassList.contains(className)) ||
                (parentClassList && parentClassList.contains(className))) {
                return;
            }
        }
        navbarHamburgerCtrl.close();
        dropdownMenuCtrl.close();
    });

    $('.navbar-toggle').bind('click', function(event) {
        navbarHamburgerCtrl.toggle();
    });

    var navbarHeight = 50 + 8;
    var navbarDivWidth = 520;
    var prevDocumentWidth = $(document).width();
    $(window).resize(function() {
        let width = $(document).width();
        let isNarrow = Boolean(width < navbarDivWidth);
        if (prevDocumentWidth === width) { return; }
        if (isNarrow) {
            dropdownMenuCtrl.close();
        } else {
            let navbar = $('.navbar');
            navbar.css({ 'transform': 'translateY(0)' });
            navbarHamburgerCtrl.close(true);
        }
        prevDocumentWidth = width;
    });

    var prevWindowScrollTop = 0;
    $(document).bind('scroll', function(event) {
        let isNarrow = Boolean(prevDocumentWidth < navbarDivWidth);
        let windowScrollTop = $(window).scrollTop();
        let delta = prevWindowScrollTop - windowScrollTop;
        let isUpward = Boolean(delta < 0);
        let navbar = $('.navbar');
        let translateY = getComputedTranslateY(navbar[0]);
        newTranslateY = translateY + delta;
        if (newTranslateY < -navbarHeight) {
            newTranslateY = -navbarHeight;
        }
        if (newTranslateY > 0) {
            newTranslateY = 0;
        }
        if (isNarrow) {
            if (newTranslateY !== translateY) {
                navbar.css({ 'transform': 'translateY(' + newTranslateY + 'px)' });
            }
            if (isUpward) {
                navbarHamburgerCtrl.close();
                dropdownMenuCtrl.close();
            }
        }
        prevWindowScrollTop = windowScrollTop;
    });
});