//setSong function; assignment 19
var setSong = function(songNumber) {
    
    //check to see if song is still playing and if so, then stop it before playing next
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
 
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    //assigns a new Buzz sound object; passes audio file via the audioUrl property on currentSongFromAlbum
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         //passes in a settings object that has two properties defined, formats and  preload
         formats: [ 'mp3' ],
         preload: true
     });
    
    //call function that sets song volume to current volume variable referenced below
    setVolume(currentVolume);
};

//declare function that sets song volume
var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

//getSongNumberCell function, assignment 19
var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
    '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;
 
    var $row = $(template);
     
    var clickHandler = function() {
	   var songNumber = parseInt($(this).attr('data-song-number'));
        

	   if (currentlyPlayingSongNumber !== null) {
		  // Revert to song number for currently playing song because user started playing new song.
		  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		  currentlyPlayingCell.html(currentlyPlayingSongNumber);
	   }
	   if (currentlyPlayingSongNumber !== songNumber) {
		  // Switch from Play -> Pause button to indicate new song is playing.
		  $(this).html(pauseButtonTemplate);
           setSong(songNumber);
           currentSoundFile.play();
           updatePlayerBarSong();
	   } else if (currentlyPlayingSongNumber === songNumber) {
           
            //if current song is paused
           if (currentSoundFile.isPaused()) {
                    //revert icon in the song row and the player bar to pause button
                    $(this).html(pauseButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPauseButton);
                    //start playing song again
                    currentSoundFile.play();
               
                //but if it's not paused
            } else if (currentSoundFile.isPaused === false) {
                        //set the content of the song number cell and player bar's pause button back to the play button*/
                        $(this).html(playButtonTemplate);
                        $('.main-controls .play-pause').html(playerBarPlayButton);
                        //pause it
                        currentSoundFile.pause();
            }
	   }
    };
     
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        //enforce consistent data types
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };
 
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
 };

var setCurrentAlbum = function(album) {
    currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
};

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    var lastSongNumber = currentlyPlayingSongNumber;
    setSong(currentSongIndex + 1);
    //play song when skipping
    currentSoundFile.play();
    
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    var lastSongNumber = currentlyPlayingSongNumber;
    setSong(currentSongIndex + 1);
    //play song when skipping
    currentSoundFile.play();
    
    updatePlayerBarSong();
    
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);

};

var togglePlayFromPlayerBar = function() {
    if (currentSoundFile.isPaused()) {
        //change song number cell from play button to pause button
        $(this).html(pauseButtonTemplate);
        //change HTML of the player bar's play button to pause button
        $('.main-controls .play-pause').html(playerBarPauseButton);
        //play the song
        currentSoundFile.play();
    } else if (currentSoundFile.isPaused() === false) {
        //change song number cell from pause button to a play button
        $(this).html(playButtonTemplate);
        //change HTML of the player bar's pause button to a play button
        $('.main-controls .play-pause').html(playerBarPlayButton);
        //pause the song
        currentSoundFile.pause();
    }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playerBarActivePlayPause = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playerBarActivePlayPause.click(togglePlayFromPlayerBar);
});