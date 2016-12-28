var game;
var height = 800;
var width = 600;
var platforms;
var player;
var cursors;
var spaceParts;
var score = 0;
var scoreText;
var playerSpeed = 250;
var backgroundMusic;
var background;
var collectSpacePartSound;
window.onload = function(){
  game = new Phaser.Game(height, width, Phaser.AUTO, '');
  game.state.add("Preload", preload);
  game.state.add("PlayGame", playGame);
  game.state.start("Preload");
}

// Tomt array. Jeg må forresten ordne noe på instillingene. jeg blir gal av å bruke musa. Jeg bruker egentlig kun tastaturet i text editorer. VIM mode. nice.
// Men jeg er fortsatt usikker på hvorfor ikke player blir rendered riktig. Ser du 10 sprites? ja, men jeg trur ikke du har gjort at den viser dem en etter en, men at den viser alle sammen hele tiden.
// Prøv å se om den kan gå hos deg. nei, du har ikke lagt til controls og sånn, om du mener å bevege seg
var preload = function(game){}
preload.prototype = {
  preload: function(){
    game.load.image('sky', 'img/space-background.jpg');
    game.load.image('platform', 'img/platform.png');
    game.load.image('SpacePart', 'img/spacepart.png');
    game.load.spritesheet('dude', 'img/Astronaut.png', 32, 32);

    game.load.audio('backgroundMusic', ['audio/background.mp3']);
    game.load.audio('pickUpPartsSound', ['audio/shimmer_1.mp3']);
  },
  create: function(){
    this.game.state.start("PlayGame");
  }
}
  var playGame = function(game){}
  playGame.prototype = {
    create: function(){
      game.physics.startSystem(Phaser.Physics.ARCADE);
      backgroundMusic = game.add.audio('backgroundMusic');
      backgroundMusic.play();


      collectSpacePartSound = game.add.audio('pickUpPartsSound');
      // Så, game variabelen er et nytt Phaser.game. I phaser er det en "class" som heter add. Og vi bruker funksjonen sprite, inni add, til å legge til sprites. Skjønner? ja
      // Vi har brukt 3 arguments, jeg regner med du skjønner hva de alle er forno? x, y, hvilken sprite. Jepp

      background = game.add.sprite(0, 0, 'sky');
      background.height = game.height;
      background.width = game.width;


      scoreText = game.add.text(16, 16, 'Parts collected: 0', {fontSize: '22px', fill: '#fff'});
      // Legger til player, og litt instillinger.
      // Phaser inneholder flere typer physics engines. Vi bruker denne som heter arcade. Den er simepl, litt lik gosu.
      // Legge til bakgrunn!
      // Vi lager en grupering av platforms
      platforms = game.add.group();
      // Vi setter på physics på platform
      platforms.enableBody = true;
      // Vi legger til et nytt element til platforms. Phaser vet ikke hva platforms variabelen er, men vi sier her at den skal ha ground elementet, og hvor den skal plasseres, og hvilken sprite som skal brukes.
      var ground = platforms.create(0, game.world.height - 64, 'platform');
      // Vi scaler opp bakken slik at den passer inn.
      ground.scale.setTo(3, 2);
      // Bakken har jo physics. Hvis vi lar den være som den er, så vil den falle ned når vi starter spillet, eller når noe kommer borti den.
      // Ved å sette body.immovable = true, låser vi den fast. Henger du med? ja, men hva er elements? Det er det vi legger til platform. Vi har en gruppering av forskjellige platformer.
      // Ground er et av de. Man kan f eks ha andre platformer man kan hoppe på,uosu.
      ground.body.immovable = true;
    	var block = platforms.create(260, 500, 'platform');
    	block.scale.setTo(0.1, 2);
    	block.body.immovable = true;
      // Her legger vi til en ny platform, i tillegg til ground som vi allerede har
      var ledge = platforms.create(400, 400, 'platform');
    	ledge.scale.setTo(1,0.5);
      ledge.body.immovable = true;

    	var ledge = platforms.create(290, 300, 'platform');
      ledge.scale.setTo(0.2, 0.5);
    	ledge.body.immovable = true;
      // Og her legger vi til ennå et platform element. Henger du med? du skjønner hva alle parameterne er? for det meste ja. Det er egentlig bare plassering av objekter, og hvilket sprite som skal brukes..
      ledge = platforms.create(-150, 250, 'platform');
      ledge.body.immovable = true;
      player = game.add.sprite(32, game.world.height - 150, 'dude');
      // Vi legger til physics på player
      game.physics.arcade.enable(player);
      // Vi setter på litt physics ting.
      player.body.bounce.y = 0.2;
      player.body.gravity.y = 300;
      player.body.collideWorldBounds = true;
      // Animasjoner. Du vet hva et sprite sheet er? ja, men kan du se playeren? eller er det bare jeg som ikke kan se hane
      // Jeg ser ingenting akkurat nå. Jeg må se litt hvorfor den ikke blir drawed. jeg trur bakgrunnen er foran den, når du la til bakgrunnen, forsvant stjerna også
      player.animations.add('left', [3, 4, 5, 3], 10, true);
      player.animations.add('right', [9, 10, 11, 9], 10, true);

      // Phaser.io har en innebygget keyboard manager, for å lage kontroller. Vi lager en variabel som inneholder den kontrollen. Dette gjøres i create, slik at de ikke blir laget ved hvert frame.
      cursors = game.input.keyboard.createCursorKeys();

      // Her lager vi en ny gruppe med elementer.
      spaceParts = game.add.group();
      spaceParts.enableBody = true;

      // Nå skal vi gjøre litt loop
      // Vi legger til 12 nye stjerner med en for loop
    	for (var i = 0; i < 12; i++){
        // Vi lager en stjerne inni stars gruppen vi laget i sta
        var spacePart = spaceParts.create(i * 70, 0, 'SpacePart');
        spacePart.height = 20;
        spacePart.width = 20;

        // Vi setter på litt gravitasjon
        spacePart.body.gravity.y = 100;
        // Vi lar de sprette litt random
        spacePart.body.bounce.y = 0.9 + Math.random() * 0.01;

      }
    },
    update: function(){

  // Dette binder player og platforms. Dvs alt som er i platforms group. Det er for samspill mellom elementene i physics motoren. Skjønner? ikke helt
  // Vi har jo lagt til de platformene, og bakken i platforms. Vi grupperer alt som er platform der. jeg skjønner nå. Good! kansje å få han til å røre på seg er det neste vi kan gjøre
  var hitplatform = game.physics.arcade.collide(player, platforms);
  // Resetter playeren velocity (fart)
  player.body.velocity.x = -2;

  // Her er selve kontrollene.
  // Hvis venstre knappen trykkes ned
  // Sett farten på player til venstre
  // Spill av animasjonen
  // Eller, hvis høyre knappen trykkes ned
  // Sett farten på player til høyre
  // Spill av animasjonen
  // Hvis ikke,
  // Stopp animasjonen
  // Spill av frame 2 i sprite sheet. Henger du med? jaja. Dette er vel kjent fra gosu jepp jeg kjønner nesten alt, untatt physicsa da, det er nytt.
  // Jepp. Men alt av slik spillprogrammering fungerer ca likt. Er bare selve biblioteket og syntaksen som er annerledes.
  if(cursors.left.isDown){
    player.body.velocity.x = -playerSpeed;
    player.animations.play('left');
  } else if(cursors.right.isDown){
    //fullfør
    player.body.velocity.x = playerSpeed;
    player.animations.play('right'); // Du må jo prøve også
  } else {
    player.animations.stop();
    player.frame = 7;
  }
  // Hvis nedknappen trykkes, og at player er nede, og at hitplatform er true (player og platform collide), så setter vi y til -352, slik at den hopper.
  if (cursors.up.isDown && player.body.touching.down && hitplatform){
    player.body.velocity.y = -352;
  }
  // Vi binder stars gruppen og platforms gruppen slik at physics virker. Henger med? ja
  game.physics.arcade.collide(spaceParts, platforms);

  game.physics.arcade.overlap(player, spaceParts, collectSpacePart, null, this);
    }
  }

function collectSpacePart(player, spacePart){
  spacePart.kill();
  collectSpacePartSound.play();



  score += 1;
  scoreText.text = 'Parts collected: ' + score;
}
