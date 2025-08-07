// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Counter Up initialization
$('.counter').counterUp({
    delay: 10,
    time: 1000
});


// Animation fondu pour le changement automatique des images de fond
const heroSection = $('.hero-section');
const bgImages = [
  'images/bobo.jpg',
  'images/culture.jpg',
  'images/masque.jpg',
  'images/africain.jpg',
  'images/326A6514.jpg',
  'images/326A6571.jpg',
  'images/326A6573 .jpg',
  'images/326A6574.jpg',
];

// Création dynamique de 2 divs pour le fond
heroSection.append('<div class="bg-slide bg-slide-1"></div><div class="bg-slide bg-slide-2"></div>');
const slides = [$('.bg-slide-1'), $('.bg-slide-2')];
let currentIndex = 0;
let visibleSlide = 0;

// Initialise le premier fond
slides[visibleSlide].css('background-image', `url('${bgImages[currentIndex]}')`);
slides[visibleSlide].addClass('visible');

// Fonction pour changer avec fondu
function changeBackground() {
  currentIndex = (currentIndex + 1) % bgImages.length;
  let nextSlide = 1 - visibleSlide;

  slides[nextSlide].css('background-image', `url('${bgImages[currentIndex]}')`);
  slides[nextSlide].addClass('visible');
  slides[visibleSlide].removeClass('visible');

  visibleSlide = nextSlide;
}
// Change toutes les 4 secondes
setInterval(changeBackground, 4000);

// Gallery filter functionality
$(document).ready(function() {
    $('.btn-group button').click(function() {
        $('.btn-group button').removeClass('active');
        $(this).addClass('active');

        var filterValue = $(this).attr('data-filter');
        $('.gallery-item').each(function() {
            if (filterValue === 'all' || $(this).attr('data-category') === filterValue) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Membership modal plan selection
    $('#membershipModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var plan = button.data('plan');
        var modal = $(this);

        if (plan) {
            modal.find('#membershipPlan').val(plan);
        }
    });

    // Form submissions
    $('#newsletterForm').submit(function(e) {
        e.preventDefault();
        alert('Merci pour votre abonnement à notre newsletter!');
        this.reset();
    });

    $('#membershipForm').submit(function(e) {
        e.preventDefault();
        alert('Merci pour votre inscription! Nous vous contacterons bientôt.');
        $('#membershipModal').modal('hide');
        this.reset();
    });

    $('#volunteerForm').submit(function(e) {
        e.preventDefault();
        alert('Merci pour votre candidature! Nous vous contacterons bientôt.');
        $('#volunteerModal').modal('hide');
        this.reset();
    });

    $('#donationForm').submit(function(e) {
        e.preventDefault();
        alert('Merci pour votre don généreux! Votre soutien fait la différence.');
        this.reset();
    });

    $('#quickContactForm').submit(function(e) {
        e.preventDefault();
        alert('Merci pour votre message! Nous vous répondrons bientôt.');
        this.reset();
    });

    // Scroll to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#scrollToTop').addClass('show');
        } else {
            $('#scrollToTop').removeClass('show');
        }

        // Navbar scroll effect
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    $('#scrollToTop').click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    // Smooth scrolling for anchor links
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 1000);
                return false;
            }
        }
    });

    // Loading overlay
    $(window).on('load', function() {
        $('#loadingOverlay').fadeOut('slow');
    });

    // Set current year in footer
    $('#currentYear').text(new Date().getFullYear());

    // Fermer le menu lorsque vous cliquez sur un lien
    $('.navbar-nav .nav-link').on('click', function(){
        $('.navbar-collapse').collapse('hide');
    });
});
