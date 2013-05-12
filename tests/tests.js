describe( "JSS", function() {

  it( "Should be able to index styles on the current page", function() {
    var allStyles = jss.getStyles();
    expect( allStyles && allStyles.length ).toBeTruthy();
  });

  it( "Should be able to index the specificity of the styleRules within a stylesheet", function() {
    var allSelectors = jss.getSelectors();
    expect( allSelectors && allSelectors.length ).toBeTruthy();
  });

  it( "Should be able to indicate the right specificity of the styleRules within a stylesheet", function() {
    var allSelectors = jss.getSelectors();
    expect( allSelectors[ 0 ].getSpecificity() ).toEqual( [3,3,0,0,2] );
  });


  // describe("when song has been paused", function() {
  //   beforeEach(function() {
  //     player.play(song);
  //     player.pause();
  //   });

  //   it("should indicate that the song is currently paused", function() {
  //     expect(player.isPlaying).toBeFalsy();

  //     // demonstrates use of 'not' with a custom matcher
  //     expect(player).not.toBePlaying(song);
  //   });

  //   it("should be possible to resume", function() {
  //     player.resume();
  //     expect(player.isPlaying).toBeTruthy();
  //     expect(player.currentlyPlayingSong).toEqual(song);
  //   });
  // });

  // // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');

  //   player.play(song);
  //   player.makeFavorite();

  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

  // //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);

  //     expect(function() {
  //       player.resume();
  //     }).toThrow("song is already playing");
  //   });
  // });
});