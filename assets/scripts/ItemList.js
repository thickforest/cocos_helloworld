// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Item = cc.Class({
	name: 'Item',
	properties: {
		id: 0,
		itemName: '',
		itemPrice: 0,
		iconSF: cc.SpriteFrame
	}
});

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
		items: {
			default: [],
			type: Item
		},
		itemPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		for (var i=0; i < this.items.length; ++i)
		{
			var item = cc.instantiate(this.itemPrefab);
			var data = this.items[i];
			this.node.addChild(item);
			cc.log(data.id + ',' + data.itemName + ',' + data.itemPrice);
			item.getComponent('ItemTemplate').init({
				id: data.id,
				itemName: data.itemName,
				itemPrice: data.itemPrice,
				iconSF: data.iconSF
			});
			
		}
	},

    start () {

    },

	restart: function() {
		cc.director.loadScene('Game');
	},

    // update (dt) {},
});
