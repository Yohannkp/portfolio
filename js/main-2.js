(function ($) {
    "use strict";
    var wWidth = $(window).width();

    jQuery(document).ready(function ($) {

        $('.humbarger').on('click', function(){
           $('.menu-wrapper').toggleClass('show-menu') ;
           $(this).parents('.header').toggleClass('show-menu') ;
        });
        $('.main-menu li a').on('click', function(){
           $('.menu-wrapper').removeClass('show-menu') ;
           $('.header').removeClass('show-menu') ;
        });
        
        
        //set a waypoint for all the page parts on the page
        var ppWaypoint = $('.animate-me').waypoint(function (direction) {
            
            if (direction == 'down') {
                $(this.element).addClass('animated');
                
                this.destroy();
            }
            
        }, {
            offset: '90%'
        });
        
        //-----------------auto year change------------
        var new_date = new Date();
        var new_year = new_date.getFullYear();
        $(".update-year").append(new_year);
        
        
        //---------fullpage js---------
        $('#fullpage').fullpage({
            anchors: ['Acceuil', 'aboutMe', 'portfolio', 'skill', 'services', 'blog', 'instagram', 'contact'],
            menu: '#main-menu',
            responsiveWidth: 1200,
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: ['Acceuil', 'A propos de moi', 'Mes Projets', 'Compétences', 'Live Coding', 'Autres Projets','Réseaux Sociaux', 'contact'],
            scrollingSpeed: 1500,
            css3: false,
            easing: 'easeInOutExpo',
            easingcss3: 'ease',

        });
        
        
    });//----end document ready function-----
    
    
    //--------Sticky menu---------
    $(window).scroll(function () {
        if($(this).scrollTop() > 20) {
            $('.header').addClass('sticky');
        } else {
            $('.header').removeClass('sticky');
        }
    });
    
    //-------portfolio carousel--------
    var $portfolio_paging_status = $('.portfolio-paging-status');
    var $portfolio_slide_element = $('.portfolio-content-wrapper');

    $portfolio_slide_element.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
        var i = (currentSlide ? currentSlide : 0) + 1;
        $portfolio_paging_status.text(i + '/' + slick.slideCount);
    });
    $('.portfolio-content-wrapper').slick({
        slidesToShow: 1,
        autoplay: false,
        slidesToScroll: 1,
        asNavFor: '.portfolio-img',
        speed: 2000,
        prevArrow: '<button type="button" class="slick-prev"> <img src="images/arrow-right-white.png" alt="arrow"></button>',
        nextArrow: '<button type="button" class="slick-next"> <img src="images/arrow-right-white.png" alt="arrow"></button>',
        pauseOnHover:true,
    });
    $('.portfolio-img').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.portfolio-content-wrapper',
        dots: false,
        fade: true,
        speed: 1500,
        arrows: false,
        focusOnSelect: false,
        pauseOnHover:true,
    });
    
    
    //-------testimonial carousel--------
    $('.single-testimonial').slick({
        slidesToShow: 1,
        autoplay: true,
        slidesToScroll: 1,
        asNavFor: '.author-img-wrapper',
        speed: 2500,
        arrows: false,
        dots: true,
        pauseOnHover:true,
    });
    $('.author-img-wrapper').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.single-testimonial',
        dots: false,
        fade: true,
        speed: 3000,
        arrows: false,
        focusOnSelect: false,
        pauseOnHover:true,
    });
    
    
    //------home-2 sevice section carousel------
    var $paging_status = $('.service2-paging-status');
    var $slideElement = $('#home2-service');

    $slideElement.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
        var i = (currentSlide ? currentSlide : 0) + 1;
        $paging_status.text(i + '/' + slick.slideCount);
    });
    $slideElement.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        speed: 2000,
        fade: true,
        focusOnSelect: false,
        pauseOnHover:true,
        prevArrow: '<button type="button" class="slick-prev"> <img src="images/arrow-right-white.png" alt="arrow"></button>',
        nextArrow: '<button type="button" class="slick-next"> <img src="images/arrow-right-white.png" alt="arrow"></button>',
    });

    
    //--------Scroll Top---------
    $(window).scroll(function () {
        if($(this).scrollTop() > 200) {
            $('.scroll-top').fadeIn();
            $('.scroll-top').removeClass('not-visible');
        } else {
            $('.scroll-top').fadeOut();
        }
    });
    $('.scroll-top').on('click', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });


}(jQuery));
