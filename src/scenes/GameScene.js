import { platform } from "os";

let platforms, player, cursors, logs, scoreText, score = 0, bombs, gameover = false;
let x, y, height, width;
let sky, ground, log, bomb, beaver, anims, child, children;
let j_ump, collectitem, bgm;

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.load.image('sky', '../../images/sky.png');
        this.load.image('ground', '../../images/platform.png');
        this.load.image('log', '../../images/log.png');
        this.load.image('bomb', '../../images/bomb.png');
        this.load.spritesheet('beaver', '../../images/beaver-Sheet.png',
            { frameWidth: 68, frameHeight: 68 });
        this.load.audio('bgm', '../../images/bgm.mp3');
        this.load.audio('collectitem', '../../images/collectitem.mp3');
        this.load.audio('j_ump', '../../images/j_ump.mp3');
    }

    create() {
        const width = this.scene.scene.physics.world.bounds.width;
        const height = this.scene.scene.physics.world.bounds.height;
        const x = width * 0.5;
        const y = height * 0.5;
        this.add.image(400, 300, 'sky');
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
        player = this.physics.add.sprite(100, 450, 'beaver');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, platforms);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('beaver', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'beaver', frame: 4 }],
            frameRate: 20,
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('beaver', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        cursors = this.input.keyboard.createCursorKeys();
        logs = this.physics.add.group({
            key: 'log',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })
        logs.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
        });
        this.physics.add.collider(logs, platforms);
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.physics.add.overlap(player, logs, collectlog);

        bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.overlap(player, bombs, hitBomb);

        bgm = this.sound.add('bgm', true);
        collectitem = this.sound.add('collectitem', true);
        j_ump = this.sound.add('j_ump', true);
        bgm.play({ loop: true });
        bgm.volume = -0.5;
        j_ump.volume = -0.5;
        collectitem.volume = -0.5;

    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
            j_ump.play();
        }
        if (gameover == true) {
            this.physics.pause();
        }
    }

}
function collectlog(player, log) {
    log.disableBody(true, true);
    score += 100;
    scoreText.setText('Score: ' + score);
    collectitem.play();
    if (logs.countActive() > 0) {
        logs.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        let bombx = (player.x < x) ? Phaser.Math.Between(x, width) : Phaser.Math.Between(0, x);
        bomb = bombs.create(bombx, 16, 'bomb');

        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb(player, bomb) {
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameover = true;
}
export default GameScene;
