class Game2 extends Phaser.Scene {

    constructor() {
        super({ key: 'GameScene3'});
        this.buttonCoordinates = [
            { x: 7500, y: 2000 },
            { x: 7200, y: 2600 },
            { x: 7900, y: 2800 }
        ];
        this.buttonIndex = 0;
        this.buttons = []; // Array to store buttons
        this.direction = false;
        this.background = []; // Initialize background as an object
    }    

    Text;

    preload() {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
    
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
    
        progressBox.fillRect(width / 2 - 30, height / 2 - 30, 2, 2);
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '22px monospace',
                fill: '#ddddd'
            }
        });
    
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '22px monospace',
                fill: '#ddddd'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '22px monospace',
                fill: '#ddddd'

            }
        });
        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 160, height / 2 - 30, 320 * value, 50);
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
    
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    
        this.load.image('player1', 'assets/images/piskel1.png');
        this.load.image('player2', 'assets/images/piskel2.png');
        this.load.image('coin1', 'assets/images/coin1.png');
        this.load.image('coin2', 'assets/images/coin2.png');
        this.load.image('tiles3', 'assets/tiles/spritesheet3.png');

        this.load.tilemapTiledJSON('map3', 'assets/tiles/map3.json');

        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('ceiling', 'assets/images/untitled.png');  
        this.load.image('water', 'assets/images/water.png');
        this.load.image('rocket', 'assets/images/rocket.png');
        this.load.image('jetpack', 'assets/images/jetPack.png');
        this.load.image('red', 'assets/images/red.png');

        this.load.image('button', 'assets/images/button.png');
        this.load.image('background', 'assets/images/parallax.png');

        for(let i = 0; i < 500; i++) {
            this.load.image('ground' + i, 'assets/images/ground.png');
        }
    };

    create() {
        const { width, height } = this.scale;
    
        this.background.push({
			ratioX: 0.3,
			sprite: this.add.tileSprite(0, -20, width, height, 'background')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
                .setScale(1.4)
		});
    
        this.cameras.main.setBackgroundColor("#6c6c6c");
    
        const map = this.make.tilemap({ 
            key: 'map3'
        });
        const tileset = map.addTilesetImage('walls', 'tiles3');
        this.direction = true;
        
        const groundLayer = map.createLayer('Tile Layer 1', tileset, 0, 20);
        const layer = map.createLayer('walls', tileset, 0, 20);
        layer.setDepth(0);
        groundLayer.setDepth(1);
    
        var player1 = this.physics.add.sprite(400, 400, 'player1');
        this.water = this.physics.add.sprite(1950, 1160, 'water');
        this.btn = this.physics.add.sprite(8600, 3180, 'button');

        this.jetPack = this.physics.add.sprite(1200, 700, 'jetpack');
        this.jetPack.setScale(0.3);
        this.jetPack.body.allowGravity = false;
        this.isjetpackTrue = false;
        
        this.btn.setDepth(-1)
        this.btn.body.allowGravity = false;

        this.water.setDepth(-1)
        this.water.setScale(5,1)
        this.water.body.allowGravity = false;
    
        this.Text = this.add.text(500, 350, 'Level 3', { fontSize: '50px', fill: '#fff' });

        this.anims.create({
            key: 'playerFrames',
            frames:[
                {key: 'player1'},
                {key: 'player2'},
            ],
            frameRate: 4,
            repeat: -1
        });
    
        player1.play('playerFrames');
        player1.setDepth(1);
        player1.setBounce(0);
        player1.setDrag(100);
        player1.setGravityY(300);
        player1.setScale(0.6);
        player1.setMaxVelocity(1000, 800)

    
        this.player = player1;

        this.coins2 = this.physics.add.group({
            key: 'coin1',
            repeat: 12,
            setXY: { x: 1000, y: 300, stepX: 400 }
        });
    
        this.coins2.children.iterate(function (coin) {
            coin.setScale(0.15);
            coin.setGravityY(500);
            coin.setBounce(0.5);
            coin.play('coinframes');
        }, this);
    
        this.score = 0;
    
        this.scoreText = this.add.text(20, 60, 'Score: ' + scoreManager.score, { fontSize: '50px', fill: '#fff' });       
    
        this.physics.add.overlap(this.player, this.coins2, this.collectCoin, null, this);
        this.cameras.main.zoomTo(1.3);
    
        this.keys = this.input.keyboard.addKeys('W,A,S,D,right,left,up');
    
        this.isPlayerOnGround = false;
    
        this.groundGroup = this.physics.add.staticGroup();
    
        groundLayer.setCollisionBetween(0, 100);
        layer.setCollisionBetween(0, 100);
    
        this.physics.add.collider(player1, groundLayer, () => {
            this.isPlayerOnGround = true;
        }, null, this);
    
        this.physics.add.collider(this.coins2, groundLayer);
        this.physics.add.collider(this.player, this.jetPack, () => {
            this.isjetpackTrue = true;
            this.jetPack.setVisible(false);

        });

        this.physics.add.collider(this.player, this.btn, () => {
            this.scene.start("GameScene3");
        });
    
        this.score = 0;
        this.scoreText.setDepth(2);
    
        this.physics.add.collider(this.player, this.water, this.restartScene, null, this); 
        this.physics.add.collider(this.player, this.buttons, this.restartScene, null, this); 
    
    
        this.groundHitbox = this.physics.add.sprite(player1.x, player1.y + player1.height / 2, 'ground');
        this.groundHitbox.setVisible(false);
    };
    
    update() {

        for (let i = 0; i < this.background.length; ++i) {
            const bg = this.background[i];

            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX;
        }

        if(this.player.body.velocity.y > 30) {
            this.isPlayerOnGround = false;
        }
    
        // Adjust camera scroll
        this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
        this.scoreText.setPosition(this.player.x - 100, 250);
        
        this.player.x += 10;

        if ((this.keys.W.isDown || this.keys.up.isDown) && (this.isPlayerOnGround || this.isjetpackTrue)) {
            this.player.setVelocityY(-400);
            this.isPlayerOnGround = false;

            if (this.isjetpackTrue) {
                // Create particles
                const particles = this.add.particles(0, 0, 'red', {
                    speed: 40,
                    scale: { start: 0.6, end: 0 },
                    blendMode: 'ADD'
                });
                particles.setDepth(0);
                particles.startFollow(this.player);
            }
        }
    }
 
    restartScene() {
        scoreManager.score = 0;
        this.scene.restart();
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true); // Remove the coin from the screen
        scoreManager.increaseScore(10); // Increase the score
        this.scoreText.setText("Score: " + scoreManager.getScore()); // Update score text
    }
};