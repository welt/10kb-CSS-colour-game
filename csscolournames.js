(function(){
  var cols = ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse',
  'Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Green','GreenYellow','HoneyDew','HotPink','IndianRed ','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen'];
  function $(x) { return document.querySelector(x);}
  var levels = {
    'easy': [40, 20], 
    'normal': [80, 15], 
    'hard': [120, 10], 
    'expert': ['all',10]
  };
  var moves = levels['easy'][1];
  var swabnumber = levels['easy'][0];
  var currentcol = 'white';
  var correct = 0;
  var currentlevel = false;
  function setlevel(button) {
    currentlevel = button;
  }
  function drawbuttons(container) {
    var out = '';
    for (level in levels) {
      out += '<li><button data-amount="' + levels[level][0] + '" data-moves="' + 
              levels[level][1] + '">' + level + '</button></li>';
    }
    container.innerHTML = out;
  }
  $('#levelbuttons').addEventListener('click', function(ev) {
    ev.preventDefault();
    var target = ev.target;
    if (target.tagName === 'BUTTON') {
      swabnumber = target.getAttribute('data-amount');
      moves = target.getAttribute('data-moves');
      setlevel(target);
      drawswabs(swabnumber, cols);
      updatecounter(0, moves);
      document.body.classList.remove('loaded');
    }
  });
  function init(correct, swabnumber, moves) {
    drawbuttons($('#levelbuttons'));
    drawswabs(swabnumber, cols);
    updatecounter(correct, moves);
  }
  function updatecounter(correct, allmoves) {
    $('#counter').innerHTML = '<span class="correct">' + correct +
                              '</span>/<span class="wrong">' +
                               allmoves+'</span>';
  }
  $('ul.swabs').addEventListener('click', function(ev) {
    ev.preventDefault();
    var target = ev.target;
    if (target.tagName === 'A') {
      var col = target.getAttribute('data-title');
        validatecol(col, target.offsetTop);
    }
  });
  function validatecol(col, y) {
    if (col === currentcol) {
      ++correct;
      updatecounter(correct, moves);
      $('#result').innerHTML = '';
      drawswabs(swabnumber, cols);
    } else {
      --moves;
      if (moves === 0) {
        gameover(correct);
      } else {
        updatecounter(correct, moves);
        $('#result').innerHTML = 'nope… <b style="color: ' + col +
                                 '">(' + col + ')</b>';
        result.style.top = y + 40 + 'px';
        document.body.classList.add('fault');
        window.setTimeout(function(){document.body.classList.remove('fault');}, 1000);
      }  
    }
  } 
  function gameover(correct) {
    $('.scores').innerHTML = 'You recognised ' + correct + ' colours on the ' + 
                              currentlevel.innerHTML + ' level.';
    $('.share').innerHTML = '' + 
      '<a target="_blank" href="http://twitter.com/share?url=' +
      'https://codepo8.github.io/10kb-CSS-colour-game/&text=' +
      encodeURIComponent('I played "Find the named CSS colour" ' +
      'and recognised ' + correct + ' colours on the ' + 
      currentlevel.innerHTML + ' level') + 
      '">' + 'Share on Twitter</a>';                          
    document.body.classList.add('ended');
  }
  function drawswabs(swabnumber, cols) {
    var list = $('ul.swabs');
    var out ='';
    var newrand = [];
    if (swabnumber === 'all') {
      newrand = shuffle(cols);
    } else {
      newrand = shuffle(cols).slice(0, +swabnumber);
    }
    var all = newrand.length;
    var index = Math.floor(Math.random() * newrand.length);
    currentcol = newrand[index];
    $('#colourname').innerHTML = currentcol;
    for (var i = 0; i < all; i++) {
      out += '<li><a href="#"  data-title="' + newrand[i] +
             '" style="background:' + newrand[i] +
             '"></a></li>';
    }
    list.innerHTML = out;
  }
  function shuffle(array) {
    var na = array.slice(0);
    var ci = na.length, tv, ri;
    while (0 !== ci) {
      ri = Math.floor(Math.random() * ci);
      ci -= 1;
      tv = na[ci];
      na[ci] = na[ri];
      na[ri] = tv;
    }
    return na;
  }
  $('.gameover button').addEventListener('click', function(ev) {
      document.body.classList.remove('ended');
      $('#result').innerHTML = '';
      correct = 0;
      document.body.classList.add('loaded');
  });
  init(0, levels['easy'][0], levels['easy'][1]);
  document.body.classList.add('loaded');
;})();