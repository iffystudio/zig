Zig = function () {

  var _CYCLE = { numbers: 'shading', shading: 'both', both: 'numbers' },
      _DESTINATION = { tl: 'br', tr: 'bl', bl: 'tr', br: 'tl' },
      _GAMES = [ <% join ', ', @Zig::GAMES %> ];

  var _adjacentIdx, _cookie, _copyrightJ, _current = 0, _currentJ, _gameJ, _gridJ, _idx, _lastIdx, _lastNodeJ, _len, _lenH = { }, _max_len, _maxJ, _minJ, _nextJ, _nodeJ, _origin, _pathA = [ ], _scoreH = { }, _size, _size_squared, _solved, _solvedJ;


  function __add_to_path() {
    _nodeJ.addClass( 'p' );

    _pathA.push( _idx );
    _lenH[ _idx ] = _pathA.length;

    _current += ( _nodeJ.text() - 0 );

    __check_score();

    _currentJ.text( _current );

    _scoreH[ _idx ] = _current;

    $( 'td' ).removeClass( 'v' );
    }


  function __calculate_valid_nodes() {
    if ( _origin == 'tl' ) {
      __mark_valid( __if_bottom_exists() );
      __mark_valid( __if_right_exists() );
      }
    else if ( _origin == 'tr' ) {
      __mark_valid( __if_bottom_exists() );
      __mark_valid( __if_left_exists() );
      }
    else if ( _origin == 'bl' ) {
      __mark_valid( __if_right_exists() );
      __mark_valid( __if_top_exists() );
      }
    else if ( _origin == 'br' ) {
      __mark_valid( __if_left_exists() );
      __mark_valid( __if_top_exists() );
      }
    }


  function __check( _idx ) {
    var _regex;

    if ( localStorage[ 'i-' + _size ] == ( _idx - 1 ) ) {
      localStorage[ 'i-' + _size ] = _idx;

      localStorage[ 'n-' + _size ] = localStorage[ _size + '-' + _idx ];
       localStorage.removeItem( _size + '-' + _idx );

      if ( localStorage[ _size + '-' + ( _idx + 1 ) ] ) {
        __check( _idx + 1 );
        }
      }
    }


  function __check_score() {
    if ( _current == _maxJ.text() ) {
      $( 'td.p' ).addClass( 's' );
      _currentJ.addClass( 'solved' );
      _maxJ.addClass( 'solved' );

      if ( ! _solved ) {
        localStorage[ 'max-' + _size + '-' + _data.idx ] = 1;
% if ( ! $local ) {

        ga( 'send', 'event', 'solved', 'max', _size + '-' + _data.idx, _size );
% }
        }
      }
    else if ( ( _pathA.length == _max_len ) && ( _current == _minJ.text() ) ) {
      $( 'td.p' ).addClass( 's' );
      _currentJ.addClass( 'solved' );
      _minJ.addClass( 'solved' );

      if ( ! _solved ) {
        localStorage[ 'min-' + _size + '-' + _data.idx ] = 1;
% if ( ! $local ) {

        ga( 'send', 'event', 'solved', 'min', _size + '-' + _data.idx, _size );
% }
        }
      }

    if ( localStorage[ 'max-' + _size + '-' + _data.idx ] && localStorage[ 'min-' + _size + '-' + _data.idx ] ) {
      $( 'body' ).addClass( 'solved' );

      localStorage[ 's-' + _size ] = localStorage[ 's-' + _size ] - 0 + 1;

      localStorage[ _size + '-' + _data.idx ] = _data.next;

      __check( _data.idx );

      __update_next();

      localStorage.removeItem( 'max-' + _size + '-' + _data.idx );
      localStorage.removeItem( 'min-' + _size + '-' + _data.idx );
      }
    }


  function __clear_path() {
    $( 'td.p,td.v' ).removeClass( 'p s v' );

    _pathA.length = 0;

    _current = 0;

    _currentJ.text( _current );
    }


  function __cycle() {
    __simulate_event( 'click', $( 'div.help.right li[data-value="' + _CYCLE[ localStorage[ 'display' ] ] + '"]' )[ 0 ] );
    }


  function __handle_click( _e ) {
    var _thisJ = $( this );

    if ( _thisJ.hasClass( 'c' ) ) {
      __handle_corner_click( _thisJ.data( 'i' ) );
      }

    _e.stopPropagation();
    }


  function __handle_corner_click( _i ) {
    if ( _gridJ.eq( _i ).hasClass( 'c' ) ) {
      _nodeJ = _gridJ.eq( _i );

      _idx = _nodeJ.data( 'i' );

      __clear_path();

      _current = 0;

      _origin = _nodeJ.attr( 'id' );

      __add_to_path();

      __calculate_valid_nodes();
      }
    }


  function __handle_help_panes() {
    localStorage[ 'options' ] = $( 'div.help' ).is( ':visible' ) ? '' : 'options';

    $( 'div.help' ).fadeToggle( 200 );
    }


  function __handle_options() {
    $( 'body' ).addClass( localStorage[ 'display' ] );
    $( 'body' ).addClass( localStorage[ 'valid' ] );

    $( 'div.help.right ul:nth-of-type( 1 ) li[data-value]' ).click( function () {
      var _value = $( this ).data( 'value' );

      $( 'div.help.right ul:nth-of-type( 1 ) li[data-value] span:last-child' ).hide();

      $( 'span:last-child', this ).show();

      $( 'body' ).removeClass( 'numbers shading both' ).addClass( _value );

      localStorage[ 'display' ] = _value;
% if ( ! $local ) {

      ga( 'send', 'event', 'display', _value );
% }
      } );

    $( '#cycle' ).click( __cycle );

    $( 'div.help.right li[data-value="hide"]' ).mousedown( __handle_hide ).mouseup( __handle_show );

    $( 'div.help.right li[data-value="valid"]' ).click( function () {
      var _value = $( this ).data( 'value' );

      $( 'body' ).toggleClass( _value );

      localStorage[ _value ] = localStorage[ _value ] ? '' : _value;
  
      $( 'span:last-child', this ).toggle( localStorage[ _value ] != '' );
% if ( ! $local ) {

      if ( $( 'body' ).hasclass( _value ) ) {
        ga( 'send', 'event', _value, 'true' );
        }
% }
      } );

    $( '#close' ).click( __handle_help_panes );
    }


    function __handle_hide() {
      var _value = $( this ).data( 'value' );

      if ( ! $( 'body' ).hasClass( _value ) ) {
        $( 'body' ).addClass( _value );

        $( 'span:last-child', this ).show();
% if ( ! $local ) {

        ga( 'send', 'event', _value, 'true' );
% }
        }
      }


  function __handle_path( _a ) {
    if ( _a === false ) {
      return;
      }

    _lastNodeJ = _nodeJ;

    _lastIdx = _idx;

    if ( _a.type ) {
      _nodeJ = $( this );

      _a.stopPropagation();
      }
    else {
      _nodeJ = _gridJ.eq( _a );
      }

    _idx = _nodeJ.data( 'i' );

    if ( _nodeJ.hasClass( 'c' ) ) {
      _currentJ.parent().show();

      if ( ! _pathA.length ) {
        _origin = _nodeJ.attr( 'id' );
        }

      if ( ! _pathA.length ) {
        $( 'td.c' ).not( this ).removeClass( 'v' );
        }
      }

    if ( _nodeJ.hasClass( 'v' ) ) {
      __add_to_path();

      __calculate_valid_nodes();
      }
    else if ( _nodeJ.hasClass( 'p' ) ) {
      __trim_path();

      __calculate_valid_nodes();
      }
    else {
      _nodeJ = _lastNodeJ;

      _idx = _lastIdx;
      }
    }


    function __handle_show() {
      var _value = $( this ).data( 'value' );

      if ( $( 'body' ).hasClass( _value ) ) {
        $( 'body' ).removeClass( _value );

        $( 'span:last-child', this ).hide();
        }
      }


  function __hide_solution() {
    if ( $( 'body' ).hasClass( 'solved' ) || $( this ).hasClass( 'solved' ) ) {
      $( 'td' ).removeClass( 'a' );
      }
    }


  function __if_bottom_exists() {
    _adjacentIdx = _idx + _size;

    return ( _adjacentIdx < _size_squared ) ? _adjacentIdx : false;
    }


  function __if_left_exists() {
    _adjacentIdx = _idx - 1;

    return ( _idx % _size ) ? _adjacentIdx : false;
    }


  function __if_right_exists() {
    _adjacentIdx = _idx + 1;

    return ( _adjacentIdx % _size ) ? _adjacentIdx : false;
    }


  function __if_top_exists() {
    _adjacentIdx = _idx - _size;

    return ( _adjacentIdx >= 0 ) ? _adjacentIdx : false;
    }


  function __init_games_page() {
    var _input;

    if ( _page == 'g' ) {
      _cookie.match( /s(\d+)/ );

      _size = RegExp.$1;

      $( '#g p:nth-of-type( 2 ) span:nth-of-type( 1 )' ).text( _size ).css( 'visibility', 'visible' );

      $( 'p:nth-of-type( 1 ) a' ).attr( 'href', $( '#tabs li:nth-child( 3 ) a' ).attr( 'href' ) );

      $( '#jump' ).on( 'input', function () {
        $( '#g #go' ).toggleClass( 'valid', $( '#jump' ).val().match( /(^[1-9]$)|(^[1-4]\d$)|(^50$)/ ) != null );
        } );

      $( document ).keydown( function ( _e ) { if ( _e.which == 13 ) __jump(); } );

      $( '#go' ).click( __jump );

      $( 'td' ).eq( _size - 3 ).addClass( 'p' );

      $( 'td' ).click( function () {
        var _thisJ = $( this );

        $( 'td' ).removeClass( 'p' );

        _thisJ.addClass( 'p' );
      
        $( '#tabs li:nth-child( 3 ) a, p:nth-of-type( 1 ) a' ).attr( 'href', '/' + _thisJ.data( 'id' ) + '/' );

        _size = $( this ).text();

        $( '#g p:nth-of-type( 2 ) span:nth-of-type( 1 )' ).text( _size );

        _cookie = _cookie.replace( /s\d+/, 's' + _size );

        __write_cookie();
        } );
      }
    }


  function __init_play_page() {
    var _next_id, _next_label, _regex;

    if ( _page == 'p' ) {
      __handle_options();

      $( 'td' ).click( __handle_click );
      $( 'td' ).mouseover( __handle_path );

      $( '#tab' ).click( __reset_grid );
      $( 'table' ).mouseleave( __reset_grid );

      $( '#max span:last-child, #min span:last-child' ).click( __show_solution );
      $( '#max span:last-child, #min span:last-child' ).mouseout( __hide_solution );

      _gridJ        = $( 'td' );
      _len          = _gridJ.length;
      _size         = _data.size;
      _max_len      = 2 * _size - 1;
      _size_squared = Math.pow( _size, 2 );

      _regex = new RegExp( 'c' + _size + '\\d+' );

      _cookie = _cookie.replace( _regex, 'c' + _size + _data.id );

      _cookie = _cookie.replace( /s\d+/, 's' + _size );

      __write_cookie();

      __reset_corners();

      if ( ! localStorage[ 'i-' + _size ] ) {
        localStorage[ 'i-' + _size ] = 0;
        }

      if ( ! localStorage[ 's-' + _size ] ) {
        localStorage[ 's-' + _size ] = 0;
        }

      if ( localStorage[ 'options' ] !== '' ) {
        localStorage[ 'options' ] = 'options';
        }

      $( 'div.help' ).toggle( localStorage[ 'options' ] == 'options' );

      if ( ! localStorage[ 'display' ] ) {
        localStorage[ 'display' ] = 'both';
        }

      $( 'div.help.right ul:nth-of-type( 1 ) li[data-value="' + localStorage[ 'display' ] + '"] span:last-child' ).show();

      if ( ! localStorage[ 'valid' ] ) {
        localStorage[ 'valid' ] = '';
        }

      $( 'div.help.right li[data-value="valid"] span:last-child' ).toggle( localStorage[ 'valid' ] != '' );

      _copyrightJ = $( '#copyright span' );
      _currentJ   = $( '#current span:last-child' );
      _gameJ      = $( '#game span:last-child' );
      _maxJ       = $( '#max span:last-child' );
      _minJ       = $( '#min span:last-child' );
      _nextJ      = $( '#next' );
      _solvedJ    = $( '#solved' );

      _solved = ( ( localStorage[ 'i-' + _size ] >= _data.idx ) || ( localStorage[ _size + '-' + _data.idx ] ) );

      if ( _solved ) {
        _solvedJ.show();

        $( 'body' ).addClass( 'solved' );

        __update_next();
        }
      else {
        _currentJ.parent().show();

        if ( localStorage[ 'max-' + _size + '-' + _data.idx ] ) {
          _maxJ.addClass( 'solved' );
          }
        else if ( localStorage[ 'min-' + _size + '-' + _data.idx ] ) {
          _minJ.addClass( 'solved' );
          }
        }

      $( document ).keydown( __keydown ).keyup( __keyup );
      }
    }


  function __init_score_page() {
    var _i, _next_id, _next_label, _solved, _scoreJ;

    if ( _page == 's' ) {
      _scoreJ = $( 'table' );

      for ( _i = 3; _i < 13; _i++ ) {
        _solved = localStorage[ 's-' + _i ] - 0;

        _scoreJ.append( '<tr' + ( _solved == 50 ? ' class="s"' : '' ) + ' style="opacity: ' + ( _solved / 50 * 0.4 + 0.6 ) + '"><td>' + _i + '</td><td>50</td><td>' + ( _solved ? _solved : '' ) + '</td><td><span class="r-' + __rating( _solved ) + '"></span></td></tr>' );
        }
      }
    }


  function __jump( _force ) {
    var _jumpJ = $( '#jump' );

    if ( _jumpJ.is( ':focus' ) || _force ) {
      $.get( '/api/', { idx: _jumpJ.val(), size: _size }, __jump_complete );
      }
    }


  function __jump_complete( _a ) {
    if ( _a.match( /^\d{9}$/ ) ) {
      location.href = '/' + _a + '/';
      }
    }


  function __keydown( _e ) {
    if ( ! ( _e.metaKey || _e.ctrlKey ) ) {
      if ( _e.which == 32 ) {
        __handle_help_panes();
        }
      else if ( _e.which == 37 ) {
        __handle_path( __if_left_exists() );
        }
      else if ( _e.which == 38 ) {
        __handle_path( __if_top_exists() );
        }
      else if ( _e.which == 39 ) {
        __handle_path( __if_right_exists() );
        }
      else if ( _e.which == 40 ) {
        __handle_path( __if_bottom_exists() );
        }
      else if ( _e.which == 49 ) {
        __handle_corner_click( 0 );
        }
      else if ( _e.which == 50 ) {
        __handle_corner_click( _size - 1 );
        }
      else if ( _e.which == 51 ) {
        __handle_corner_click( _len - _size );
        }
      else if ( _e.which == 52 ) {
        __handle_corner_click( _len - 1 );
        }
      else if ( _e.which == 66 ) {
        __simulate_event( 'click', $( 'div.help.right li[data-value="both"]' )[ 0 ] );
        }
      else if ( _e.which == 67 ) {
        __cycle();
        }
      else if ( _e.which == 72 ) {
        __simulate_event( 'mousedown', $( 'div.help.right li[data-value="hide"]' )[ 0 ] );
        }
      else if ( _e.which == 78 ) {
        __simulate_event( 'click', $( 'div.help.right li[data-value="numbers"]' )[ 0 ] );
        }
      else if ( _e.which == 82 ) {
        __reset_grid( true );
        }
      else if ( _e.which == 83 ) {
        __simulate_event( 'click', $( 'div.help.right li[data-value="shading"]' )[ 0 ] );
        }
      else if ( _e.which == 86 ) {
        __simulate_event( 'click', $( 'div.help.right li[data-value="valid"]' )[ 0 ] );
        }
      }
    }


  function __keyup( _e ) {
    if ( ! ( _e.metaKey || _e.ctrlKey ) ) {
      if ( _e.which == 72 ) {
        __simulate_event( 'mouseup', $( 'div.help.right li[data-value="hide"]' )[ 0 ] );
        }
      }
    }


  function __mark_valid( _idx ) {
    if ( _idx !== false ) {
      _gridJ.eq( _idx ).addClass( 'v' );
      }
    }


  function __rating( _solved ) {
    var _rating;

    if ( _solved == 0 ) {
      _rating = 0;
      }
    else if ( _solved == 50 ) {
      _rating = 9;
      }
    else {
      _rating = Math.floor( _solved / 6.25 ) + 1;
      }

    return _rating;
    }


  function __reset_corners() {
    _gridJ.eq( 0 ).addClass( 'c v' ).attr( 'id', 'tl' );
    _gridJ.eq( _size - 1 ).addClass( 'c v' ).attr( 'id', 'tr' );
    _gridJ.eq( _len - _size ).addClass( 'c v' ).attr( 'id', 'bl' );
    _gridJ.eq( _len - 1 ).addClass( 'c v' ).attr( 'id', 'br' );
    }


  function __reset_grid( _a ) {
    if ( ( _a === true ) || ( _a.type == 'click' ) || ( _pathA.length < 2 ) ) {
      _currentJ.removeClass( 'solved' );

      __clear_path();

      __reset_corners();
      }
    }


  function __show_solution( _e ) {
    var _thisJ = $( this );

    if ( $( 'body' ).hasClass( 'solved' ) || _thisJ.hasClass( 'solved' ) ) {
      $( 'td.' + _thisJ.parent().attr( 'id' ) ).addClass( 'a' );

      _e.stopPropagation();
      }
    }


  function __simulate_event( _type, _element ) {
    var _event;

    if ( ( _type == 'click' ) && _element.click ) {
      _element.click();
      }
    else if ( ( _type == 'mousedown' ) && _element.mousedown ) {
      _element.mousedown();
      }
    else if ( ( _type == 'mouseup' ) && _element.mouseup ) {
      _element.mouseup();
      }
    else if ( document.createEvent ) {
      _event = document.createEvent( 'MouseEvents' );
      _event.initMouseEvent( _type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
      _element.dispatchEvent( _event );
      }
    else if ( _element.fireEvent ) {
      _element.fireEvent( 'on' + _type );
      }
    }


  function __trim_path() {
    var _i;

    if ( _lenH[ _idx ] < _pathA.length ) {
      _currentJ.removeClass( 'solved' );

      $( 'td.s' ).removeClass( 's' );

      for ( _i = _lenH[ _idx ]; _i < _pathA.length; _i++ ) {
        _gridJ.eq( _pathA[ _i ] ).removeClass( 'p' );
        }

      _pathA.length = _lenH[ _idx ];

      _current = _scoreH[ _idx ];

      _currentJ.text( _current );

      $( 'td.v' ).removeClass( 'v' );
      }
    }


  function __update_next() {
    var _next_id = localStorage[ 'n-' + _size ];

    if ( _next_id - 0 ) {
      _nextJ.attr( 'href', '/' + _next_id + '/' );
      }
    else {
      _nextJ.addClass( 'done' ).text( 'Done' );
      }
    }


  function __write_cookie() {
    var _date = new Date();

    _date.setTime( _date.getTime() + 31622400000 );

    document.cookie = ( 'a=' + _cookie + 'v1; path=/; domain=<% $domain %><% $local ? '' : ( ( $domain eq 'zig' ) ? '.iffy.studio' : '.com' ) %>; expires=' + _date.toGMTString() );
    }


  return {

    init: function () {
      var _i;

      _page = $( 'body' ).attr( 'id' );

      if ( document.cookie.match( /a=(c3\d+c4\d+c5\d+c6\d+c7\d+c8\d+c9\d+c10\d+c11\d+c12\d+s\d+)v1/ ) ) {
        _cookie = RegExp.$1;
        }
      else {
        localStorage.clear();

        for ( _i = 3; _i < 13; _i++ ) {
          localStorage[ 'i-' + _i ] = 0;
          localStorage[ 'n-' + _i ] = _GAMES[ _i - 3 ];
          localStorage[ 's-' + _i ] = 0;
          }

        _cookie = '\
% foreach $i ( 3 .. 12 ) {
c<% $i %><% $Zig::GAMES[ $i - 3 ] %>\
% }
s3';

        __write_cookie();
        }

      __init_play_page();

      __init_games_page();

      __init_score_page();
      }

    };

  }();

$( Zig.init );\
<%init>
  my ( $i );
</%init>
