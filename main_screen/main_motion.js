      $('#bottom_bar').click(function() {
        $('.ui.bottom.sidebar')
        .sidebar({
          dimPage: false,
          closable: false
        })
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');
      });

      $('#left_bar').click(function() {
        $('.ui.left.sidebar')
        .sidebar({
          dimPage: false,
          closable: false
        })
        .sidebar('toggle');
      });

      $('#pdf').click(function(){
        document.location.href = '/pdf_screen/pdf_export.html';
      });