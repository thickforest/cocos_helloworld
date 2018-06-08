// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
		// �����������������Ԥ����Դ
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // ���ǲ�������ʧʱ��������Χ
        maxStarDuration: 0,
        minStarDuration: 0,
        // ����ڵ㣬����ȷ���������ɵĸ߶�
        ground: {
            default: null,
            type: cc.Node
        },
        // player �ڵ㣬���ڻ�ȡ���ǵ����ĸ߶ȣ��Ϳ��������ж�����
        player: {
            default: null,
            type: cc.Node
        },
		scoreDisplay: {
			default: null,
			type: cc.Label
		},
		scoreAudio: {
			default: null,
			url: cc.AudioClip
		}
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		// ��ȡ��ƽ��� y ������
        this.groundY = this.ground.y + this.ground.height/2;
		this.timer = 0;
		this.starDuration = 0;
        // ����һ���µ�����
        this.spawnNewStar();
		this.score = 0;
		var self = this;
		this.node.on(cc.Node.EventType.TOUCH_START, function (event){
			cc.log(event);
			cc.log(self.player);
			cc.log(self.node);
			cc.log(event.touch._point.x + "," + self.node.width/2);
			cc.log(self.player.getComponent('Player'));
			if (event.touch._point.x > self.node.width/2)
			{
				self.player.getComponent('Player').accLeft = false;
				self.player.getComponent('Player').accRight = true;
			}
			else
			{
				self.player.getComponent('Player').accLeft = true;
				self.player.getComponent('Player').accRight = false;
			}
		}, this);
	},

	spawnNewStar: function() {
        // ʹ�ø�����ģ���ڳ���������һ���½ڵ�
        var newStar = cc.instantiate(this.starPrefab);
        // �������Ľڵ����ӵ� Canvas �ڵ�����
        this.node.addChild(newStar);
        // Ϊ��������һ�����λ��
        newStar.setPosition(this.getNewStarPosition());
		newStar.getComponent('Star').game = this;

		this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
		this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // ���ݵ�ƽ��λ�ú�������Ծ�߶ȣ�����õ�һ�����ǵ� y ����
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        // ������Ļ���ȣ�����õ�һ������ x ����
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        // ������������
        return cc.p(randX, randY);
    },

	gainScore: function () {
		this.score += 1;
		this.scoreDisplay.string = "Score: " + this.score;
		cc.audioEngine.playEffect(this.scoreAudio, false);
	},

    start () {

    },
		
	gameOver: function() {
		this.player.stopAllActions(); //ֹͣ player �ڵ����Ծ����
        cc.director.loadScene('Game');
	},

    update (dt) {
		if (this.timer > this.starDuration)
		{
			this.gameOver();
			return;
		}
		this.timer += dt;
	},

});