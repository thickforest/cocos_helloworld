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
		// 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
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
		// 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
		this.timer = 0;
		this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
		this.score = 0;
		var self = this;
		this.node.on(cc.Node.EventType.TOUCH_START, function (event){
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
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
		newStar.getComponent('Star').game = this;

		this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
		this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        // 返回星星坐标
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
		this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('Menu');
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
