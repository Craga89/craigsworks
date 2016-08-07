$(document).ready(function() {
  $('img[data-src]').unveil(100, function () {
    let $this = $(this);
    $this.load(function() {
      $this.addClass('is-loaded');
    });
  });
});
