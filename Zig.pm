package Zig;

use strict;

use Data::Dumper;

use constant ITEM_TYPE_BOOK => 1;
use constant ITEM_TYPE_SECTION => 2;
use constant ITEM_TYPE_GAME => 3;

use vars qw (
  @GAMES
  @TABS
  );

BEGIN {
  @GAMES = (
    895232428,
    411883451,
    971361256,
    893182939,
    715997743,
    925691367,
    847756336,
    402317669,
    263735683,
    605450099
    );

  @TABS = (
    { label => 'Intro', tab => 'i', url => '/' },
    { label => 'Games', tab => 'g', url => '/games/' },
    { label => 'Play', tab => 'p' },
    { label => 'Score', tab => 's', url => '/score/' },
    { label => 'App', tab => 'a', url => '/app/' }
    );
  }


sub GetRandomGrid {
  my ( $size ) = @_;

  return Hoo::DB::SelectH( \"SELECT * FROM t_item WHERE c_size = ? ORDER BY RAND() LIMIT 1", [ $size ] );
  }


sub bottom_left {
  my ( $gridA, $size, $val_max_tr, $val_min_tr ) = @_;
  my ( $graphH, $greedy_max, $greedy_min, $idx_init, $val_init );

  $graphH = graph_bottom_left( $gridA, $size );

  $idx_init = $size * ( $size - 1 ) + 1;
  $val_init = $gridA->[ $size - 1 ][ 0 ];

  ( $greedy_max, $greedy_min ) = greedy( $graphH, $idx_init, $val_init );

  return ( $greedy_max == $val_max_tr, $greedy_min == $val_min_tr );
  }


sub bottom_right {
  my ( $gridA, $size, $val_max_tl, $val_min_tl ) = @_;
  my ( $graphH, $greedy_max, $greedy_min, $idx_init, $val_init );

  $graphH = graph_bottom_right( $gridA, $size );

  $idx_init = $size * $size;
  $val_init = $gridA->[ $size - 1 ][ $size - 1 ];

  ( $greedy_max, $greedy_min ) = greedy( $graphH, $idx_init, $val_init );

  return ( $greedy_max == $val_max_tl, $greedy_min == $val_min_tl );
  }


sub graph_bottom_left {
  my ( $gridA, $size ) = @_;
  my ( %graph, $i, $j );

  for ( $i = 0; $i < ( $size - 1 ); $i++ ) {
    for ( $j = 0; $j < ( $size - 1 ); $j++ ) {
      $graph{ ( $j + 1 ) * $size + $i + 1 } = { ( ( $j + 1 ) * $size + $i + 2 ) => $gridA->[ $j + 1 ][ $i + 1 ], ( $j * $size + $i + 1 ) => $gridA->[ $j ][ $i ] };
      }
    }

  for ( $j = 0; $j < ( $size - 1 ); $j++ ) {
    $graph{ ( $j + 1 ) * $size + $size } = { ( $j * $size + $size ) => $gridA->[ $j ][ $size - 1 ] };
    }

  for ( $i = 0; $i < ( $size - 1 ); $i++ ) {
    $graph{ $i + 1 } = { ( $i + 2 ) => $gridA->[ 0 ][ $i + 1 ] };
    }

  return \%graph;
  }


sub graph_bottom_right {
  my ( $gridA, $size ) = @_;
  my ( %graph, $i, $j );

  for ( $i = 0; $i < ( $size - 1 ); $i++ ) {
    for ( $j = 0; $j < ( $size - 1 ); $j++ ) {
      $graph{ ( $j + 1 ) * $size + $i + 2 } = { ( ( $j + 1 ) * $size + $i + 1 ) => $gridA->[ $j + 1 ][ $i ], ( $j * $size + $i + 2 ) => $gridA->[ $j ][ $i + 1 ] };
      }
    }

  for ( $j = 0; $j < ( $size - 1 ); $j++ ) {
    $graph{ ( $j + 1 ) * $size + 1 } = { ( $j * $size + 1 ) => $gridA->[ $j ][ 0 ] };
    }

  for ( $i = 0; $i < ( $size - 1 ); $i++ ) {
    $graph{ $i + 2 } = { ( $i + 1 ) => $gridA->[ 0 ][ $i ] };
    }

  return \%graph;
  }


sub graph_top_left {
  my ( $gridA, $size ) = @_;
  my ( %graph, $i, $j );

  for ( $i = 0; $i < ( $size - 1 ); $i++ ) {
    for ( $j = 0; $j < ( $size - 1 ); $j++ ) {
      $graph{ $j * $size + $i + 1 } = { ( $j * $size + $i + 2 ) => $gridA->[ $j ][ $i + 1 ], ( ( $j + 1 ) * $size + $i + 1 ) => $gridA->[ $j + 1 ][ $i ] };
      }
    }

  for ( $j = 0; $j < ( $size - 1 ); $j++ ) {
    $graph{ $j * $size + $size } = { ( ( $j + 1 ) * $size + $size ) => $gridA->[ $j + 1 ][ $size - 1 ] };
    }

  for ( $i = 0; $i < ( $size - 1 ); $i++ ) {
    $graph{ ( $size - 1 ) * $size + $i + 1 } = { ( ( $size - 1 ) * $size + $i + 2 ) => $gridA->[ $size - 1 ][ $i + 1 ] };
    }

  return \%graph;
  }


sub graph_top_right {
  my ( $gridA, $size ) = @_;
  my ( %graph, $i, $j );

  for ( $i = 0; $i < ( $size - 1 ); $i++ ) {
    for ( $j = 0; $j < ( $size - 1 ); $j++ ) {
      $graph{ $j * $size + $i + 2 } = { ( $j * $size + $i + 1 ) => $gridA->[ $j ][ $i ], ( ( $j + 1 ) * $size + $i + 2 ) => $gridA->[ $j + 1 ][ $i + 1 ] };
      }
    }

  for ( $j = 0; $j < ( $size - 1 ); $j++ ) {
    $graph{ $j * $size + 1 } = { ( ( $j + 1 ) * $size + 1 ) => $gridA->[ $j + 1 ][ 0 ] };
    }

  for ( $i = 0; $i < ( $size - 1 ); $i++ ) {
    $graph{ ( $size - 1 ) * $size + $i + 2 } = { ( ( $size - 1 ) * $size + $i + 1 ) => $gridA->[ $size - 1 ][ $i ] };
    }

  return \%graph;
  }


sub greedy {
  my ( $graphH, $idx_init, $val_init ) = @_;
  my ( $idx_max, $idx_min, $idx_next, $key, $val, $val_next, $val_max, $val_min );

  $idx_max = $idx_min = $idx_init;
  $val_max = $val_min = $val_init;

  while ( exists $graphH->{ $idx_max } ) {
    $val_next = 0;

    foreach $key ( keys %{ $graphH->{ $idx_max } } ) {
      $val = $graphH->{ $idx_max }{ $key };

      if ( $val > $val_next ) {
        $idx_next = $key;
        $val_next = $val;
        }
      }

    $idx_max = $idx_next;
    $val_max += $val_next;

    $val_next = 9999;

    foreach $key ( keys %{ $graphH->{ $idx_min } } ) {
      $val = $graphH->{ $idx_min }{ $key };

      if ( $val < $val_next ) {
        $idx_next = $key;
        $val_next = $val;
        }
      }

    $idx_min = $idx_next;
    $val_min += $val_next;
    }

  return ( $val_max, $val_min );
  }


sub top_left {
  my ( $gridA, $size ) = @_;
  my ( @path_max, $val_max, @path_min, $val_min );
  my ( $alg, $destiny, $graphH, $greedy_max, $greedy_min, $idx_init, $origin, $val_init );

  $origin = '1';
  $destiny = ( $size * $size ) . '';

  $graphH = graph_top_left( $gridA, $size );

  $idx_init = 1;
  $val_init = $gridA->[ 0 ][ 0 ];

  ( $greedy_max, $greedy_min ) = greedy( $graphH, $idx_init, $val_init );

  $alg = Zig::Alg->new( -origin => $origin, -destiny => $destiny, -graph => $graphH );

  @path_max = $alg->longest_path();
  $val_max = $alg->get_path_cost( @{ $path_max[ 0 ] } ) + $val_init;

  $alg = Zig::Alg->new( -origin => $origin, -destiny => $destiny, -graph => $graphH );

  @path_min = $alg->shortest_path();
  $val_min = $alg->get_path_cost( @{ $path_min[ 0 ] } ) + $val_init;

  return ( $path_max[ 0 ], $val_max, $greedy_max == $val_max, @path_max == 1, $path_min[ 0 ], $val_min, $greedy_min == $val_min, @path_min == 1 );
  }


sub top_right {
  my ( $gridA, $size ) = @_;
  my ( @path_max, $val_max, @path_min, $val_min );
  my ( $alg, $destiny, $graphH, $greedy_max, $greedy_min, $idx_init, $origin, $val_init );

  $origin = ( $size . '' );
  $destiny = ( ( $size * ( $size - 1 ) + 1 ) . '' );

  $graphH = graph_top_right( $gridA, $size );

  $idx_init = $size;
  $val_init = $gridA->[ 0 ][ $size - 1 ];

  ( $greedy_max, $greedy_min ) = greedy( $graphH, $idx_init, $val_init );

  $alg = Zig::Alg->new( -origin => $origin, -destiny => $destiny, -graph => $graphH );

  @path_max = $alg->longest_path();
  $val_max = $alg->get_path_cost( @{ $path_max[ 0 ] } ) + $val_init;

  $alg = Zig::Alg->new( -origin => $origin, -destiny => $destiny, -graph => $graphH );

  @path_min = $alg->shortest_path();
  $val_min = $alg->get_path_cost( @{ $path_min[ 0 ] } ) + $val_init;

  return ( $path_max[ 0 ], $val_max, $greedy_max == $val_max, @path_max == 1, $path_min[ 0 ], $val_min, $greedy_min == $val_min, @path_min == 1 );
  }

1;
