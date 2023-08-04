
        
        
$(document).ready(function() {

    $('.counter').each(function () {
$(this).prop('Counter',0).animate({
    Counter: $(this).text()
}, {
    duration: 4000,
    easing: 'swing',
    step: function (now) {
        $(this).text(Math.ceil(now));
    }
});
});

});  


const loadingmdb = document.querySelector('.loading-mdb');

const newloading = new mdb.Loading(loadingmdb, {
  parentSelector: '#loading-test-1'
});



if (!sessionStorage.adModal) {
    setTimeout(function() {
        $('#admodal').find('.item').first().addClass('active');
        $('#admodal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }, 10000);
    $('#adCarousel').carousel({
      interval: 9000,
      cycle: true
    });

    $("#buttonSuccess").click(function(e){
        e.preventDefault();
        var url = $(this).attr("href");
        var win = window.open(url, '_blank');
        $('#admodal').modal('hide');
    })
    sessionStorage.adModal = 20;
}