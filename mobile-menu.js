// Mobile Menu Toggle Functionality - Shared across all pages

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburgerMenu');
    const nav = document.querySelector('.main-nav');
    const body = document.body;
    const headerRight = document.querySelector('.header-right');
    
    // Clone user info and social icons for mobile menu
    if (nav && headerRight && window.innerWidth <= 768) {
        const userInfo = headerRight.querySelector('.user-info');
        const socialIcons = headerRight.querySelector('.social-icons');
        
        if (userInfo && userInfo.style.display !== 'none') {
            const mobileUserInfo = document.createElement('div');
            mobileUserInfo.className = 'mobile-user-info';
            mobileUserInfo.innerHTML = userInfo.innerHTML;
            nav.appendChild(mobileUserInfo);
        }
        
        if (socialIcons) {
            const mobileSocialIcons = document.createElement('div');
            mobileSocialIcons.className = 'mobile-social-icons';
            mobileSocialIcons.innerHTML = socialIcons.innerHTML;
            nav.appendChild(mobileSocialIcons);
        }
    }
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('nav-active');
            hamburger.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Prevent body scroll when menu is open
            if (nav.classList.contains('nav-active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('nav-active');
                    hamburger.classList.remove('active');
                    body.classList.remove('menu-open');
                    body.style.overflow = '';
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (nav.classList.contains('nav-active') && 
                    !nav.contains(e.target) && 
                    !hamburger.contains(e.target)) {
                    nav.classList.remove('nav-active');
                    hamburger.classList.remove('active');
                    body.classList.remove('menu-open');
                    body.style.overflow = '';
                }
            }
        });
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                nav.classList.remove('nav-active');
                if (hamburger) hamburger.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
                
                // Remove mobile-specific elements
                const mobileUserInfo = nav.querySelector('.mobile-user-info');
                const mobileSocialIcons = nav.querySelector('.mobile-social-icons');
                if (mobileUserInfo) mobileUserInfo.remove();
                if (mobileSocialIcons) mobileSocialIcons.remove();
            } else {
                // Re-add mobile elements if needed
                if (nav && headerRight) {
                    const existingMobileUserInfo = nav.querySelector('.mobile-user-info');
                    const existingMobileSocialIcons = nav.querySelector('.mobile-social-icons');
                    const userInfo = headerRight.querySelector('.user-info');
                    const socialIcons = headerRight.querySelector('.social-icons');
                    
                    if (!existingMobileUserInfo && userInfo && userInfo.style.display !== 'none') {
                        const mobileUserInfo = document.createElement('div');
                        mobileUserInfo.className = 'mobile-user-info';
                        mobileUserInfo.innerHTML = userInfo.innerHTML;
                        nav.appendChild(mobileUserInfo);
                    }
                    
                    if (!existingMobileSocialIcons && socialIcons) {
                        const mobileSocialIcons = document.createElement('div');
                        mobileSocialIcons.className = 'mobile-social-icons';
                        mobileSocialIcons.innerHTML = socialIcons.innerHTML;
                        nav.appendChild(mobileSocialIcons);
                    }
                }
            }
        }, 250);
    });
});

