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

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

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
    
    //assignment 21 - wrap songLength in filterTimeCode()
    filterTimeCode(songLength);
     
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
            updateSeekBarWhileSongPlays();
           
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
           
            updatePlayerBarSong();
	   } else if (currentlyPlayingSongNumber === songNumber) {
           
            //if current song is paused
            if (currentSoundFile.isPaused()) {
                    //revert icon in the song row and the player bar to pause button
                    $(this).html(pauseButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPauseButton);
                    //start playing song again
                    currentSoundFile.play();
                    updateSeekBarWhileSongPlays();
               
            //but if it's not paused
            } else if (currentSoundFile.isPaused() === false) {
                        //set the content of the song number cell and player bar's pause button back to the play button
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

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        //bind() the timeupdate event (custom Buzz event that fires repeatedly while time elapses during song playback) to currentSoundFile
        currentSoundFile.bind('timeupdate', function(event) {
        //new method for calculating the seekBarFillRatio, returns time in seconds
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
            
            setCurrentTimeInPlayerBar(this.getTime());
        });
    }
    
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    //set ratio for seek bar
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    //convert percentage above into a string that the css can interpret as a percent
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
 
    $seekBars.click(function(event) {
        //subtract the offset() of the seek bar held in $(this) from the left side
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
         
        //divide offsetX by the width of the entire bar to calculate  seekBarFillRatio
        var seekBarFillRatio = offsetX / barWidth;
 
        
        //sets volume or place in song depending on parent class of seek bar
        if ($(this).parent().attr("class") === ("seek-control")) {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
                    
        
        //pass $(this) as $seekBar argument & seekBarFillRatio for its eponymous argument to updateSeekBarPercentage()
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    //find elements with 'thumb' class in seekbars and add event listener for moousedown
    $seekBars.find('.thumb').mousedown(function(event) {
        //taking event and wrapping it in jquery
        var $seekBar = $(this).parent();
 
        //tracks events by jquery bind() event, allow for mouse dragging off of seek bar that still continues drag behavior 
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
 
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
 
        //bind the mouseup event with a .thumb namespace, removes event handlers above so when user releases the mouse, drag behavior on the player bar stops
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
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
    updateSeekBarWhileSongPlays();
    
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
    updateSeekBarWhileSongPlays();
    
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
    
    setTotalTimeInPlayerBar("songLength");
    
};

//assignment 21 - create setCurrentTimeInPlayerBar()
var setCurrentTimeInPlayerBar = function(currentTime) {
    filterTimeCode(currentTime);
    $('.current-time').text(currentTime);
};

//assignment 21 - create setTotalTimeInPlayerBar()
var setTotalTimeInPlayerBar = function(totalTime) {
    filterTimeCode(totalTime);
    $('.total-time').text(totalTime);
};

//assignment 21 - create filterTimeCode()
var filterTimeCode = function(timeInSeconds) {
    //use parseFloat() to get seconds in number form
    var secondCount = parseFloat(timeInSeconds);
    
    //store variables for whole seconds and whole minutes
    var wholeMinutes = Math.floor(secondCount/60);
    var wholeSeconds = secondCount % 60; 
    
    if (wholeSeconds.length = 1) {
        wholeSeconds = "0" + wholeSeconds;
    }
    
    //return time in the format X:XX
    return wholeMinutes + ":" + wholeSeconds;
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

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});