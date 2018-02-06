// function card(value, maple) {

//      this.value = value||0;
//      this.type = maple;
//      this.path = "";

// }

function card(id) {
    this.value = judgeValue(id[0], Number(id.substr(1, id.length)));;
    this.type = judgeType(id[0]);
    this.path = id;
}

function gameRule() {
    
}

gameRule.prototype.ONE = 1;
gameRule.prototype.PAIRS = 2;
gameRule.prototype.THREE = 3;
gameRule.prototype.THREE_WITH_ONE = 4;
gameRule.prototype.THREE_WITH_PAIRS = 5;
gameRule.prototype.PROGRESSION = 6;
gameRule.prototype.PROGRESSION_PAIRS = 7;
gameRule.prototype.PLANE = 8;
gameRule.prototype.PLANE_WITH_ONE = 9;
gameRule.prototype.PLANE_WITH_PAIRS = 10;
gameRule.prototype.FOUR_WITH_TWO = 11;
gameRule.prototype.FOUR_WITH_TWO_PAIRS = 12;
gameRule.prototype.BOMB = 13;
gameRule.prototype.KING_BOMB = 14;
gameRule.prototype.valCount = function(cards){
    var result = [];
    var addCount = function(result , v){
        for (var i = 0; i < result.length; i++) {
            if(result[i].value == v){
                result[i].count ++;
                return;
            }
        }
        result.push({'value': v, 'count': 1});
    };
    for (var i = 0; i < cards.length; i++){
        addCount(result, cards[i].value);
    }
    return result;
};
gameRule.prototype.isKingBomb = function(cards) {
        return cards.length === 2 && cards[0].value >= 16 && cards[1].value >= 16;
    };
gameRule.prototype.isPairs = function(cards) {
    return cards.length == 2 && cards[0].value === cards[1].value;
};
gameRule.prototype.isThree = function(cards) {
    return cards.length == 3 && cards[0].value === cards[1].value && cards[1].value === cards[2].value;
};
//是否是三带一
gameRule.prototype.isThreeWithOne = function(cards) {
    if(cards.length != 4)
        return false;
    var c = this.valCount(cards);
    return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
};
//是否是三带一对
gameRule.prototype.isThreeWithPairs = function(cards) {
    if(cards.length != 5)
        return false;
    var c = this.valCount(cards);
    return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
};
//是否是顺子
gameRule.prototype.isProgression = function(cards) {
    if(cards.length < 5 || cards[0].value === 15) return false;
    for (var i = 0; i < cards.length; i++) {
        if(i != (cards.length - 1) && (cards[i].value - 1) != cards[i + 1].value){
            return false;
        }
    }
    return true;
};
//是否是连对
gameRule.prototype.isProgressionPairs = function(cards) {
    if(cards.length < 6 || cards.length % 2 != 0 || cards[0].value === 15) return false;
    for (var i = 0; i < cards.length; i += 2) {
        if(i != (cards.length - 2) && (cards[i].value != cards[i + 1].value || (cards[i].value - 1) != cards[i + 2].value)){
            return false;
        }
    }
    return true;
};

gameRule.prototype.isPlane = function(cards) {
    if(cards.length < 6 || cards.length % 3 != 0 || cards[0].value === 15)
        return false;
    for (var i = 0; i < cards.length; i += 3) {
        if(i != (cards.length - 3) && (cards[i].value != cards[i + 1].value || cards[i].value != cards[i + 2].value || (cards[i].value - 1) != cards[i + 3].value)){
            return false;
        }
    }
    return true;
};
//是否是飞机带单
gameRule.prototype.isPlaneWithOne = function(cards) {
    if(cards.length < 8 || cards.length % 4 != 0)
        return false;
    var c = this.valCount(cards),
        threeList = [],
        threeCount = cards.length / 4;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count == 3){
            threeList.push(c[i]);
        }
    }
    if(threeList.length != threeCount || threeList[0].value === 15){//检测三根数量和不能为2
        return false;
    }
    for (i = 0; i < threeList.length; i++) {//检测三根是否连续
        if(i != threeList.length - 1 && threeList[i].value - 1 != threeList[i + 1].value){
            return false;
        }
    }
    return true;
};
//是否是飞机带对
gameRule.prototype.isPlaneWithPairs = function(cards) {
    if(cards.length < 10 || cards.length % 5 != 0)
        return false;
    var c = this.valCount(cards),
        threeList = [],
        pairsList = [],
        groupCount = cards.length / 5;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count == 3){
            threeList.push(c[i]);
        }
        else if(c[i].count == 2){
            pairsList.push(c[i]);
        } else {
            return false;
        }
    }
    if(threeList.length != groupCount || pairsList.length != groupCount || threeList[0].value === 15){//检测三根数量和对子数量和不能为2
        return false;
    }
    for (i = 0; i < threeList.length; i++) {//检测三根是否连续
        if(i != threeList.length - 1 && threeList[i].value - 1 != threeList[i + 1].value){
            return false;
        }
    }
    return true;
};
//是否是四带二
gameRule.prototype.isFourWithTwo = function(cards) {
    var c = this.valCount(cards);
    if(cards.length != 6 || c.length > 3)
        return false;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count === 4)
            return true;
    }
    return false;
};
//是否是四带两个对
gameRule.prototype.isFourWithPairs = function(cards) {
    if(cards.length != 8)
        return false;
    var c = this.valCount(cards);
    if(c.length != 3)
        return false;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count != 4 && c[i].count != 2)
            return false;
    }
    return true;
};
//是否是炸弹
gameRule.prototype.isBomb = function(cards) {
    return cards.length === 4 && cards[0].value === cards[1].value && cards[0].value === cards[2].value && cards[0].value === cards[3].value;
};
//是否是王炸

gameRule.prototype.getMaxVal = function(cards, n){
    var c = this.valCount(cards);
    var max = 0;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count === n && c[i].value > max){
            max = c[i].value;
        }
    }
    return max;
};
//牌型判断
gameRule.prototype.typeJudge = function(cards){
    var self = this,
        len = cards.length;
    switch (len) {
        case 1:
            return {'cardKind': self.ONE, 'value': cards[0].value, 'size': len};
        case 2:
            if(self.isPairs(cards))
                return {'cardKind': self.PAIRS, 'value': cards[0].value, 'size': len};
            else if (self.isKingBomb(cards))
                return {'cardKind': self.KING_BOMB, 'value': cards[0].value, 'size': len};
            else
                return null;
        case 3:
            if(self.isThree(cards))
                return {'cardKind': self.THREE, 'value': cards[0].value, 'size': len};
            else
                return null;
        case 4:
            if(self.isThreeWithOne(cards)){
                return {'cardKind': self.THREE_WITH_ONE, 'value': self.getMaxVal(cards, 3), 'size': len};
            } else if (self.isBomb(cards)) {
                return {'cardKind': self.BOMB, 'value': cards[0].value, 'size': len};
            }
            return null;
        default:
            if(self.isProgression(cards))
                return {'cardKind': self.PROGRESSION, 'value': cards[0].value, 'size': len};
            else if(self.isProgressionPairs(cards))
                return {'cardKind': self.PROGRESSION_PAIRS, 'value': cards[0].value, 'size': len};
            else if(self.isThreeWithPairs(cards))
                return {'cardKind': self.THREE_WITH_PAIRS, 'value': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlane(cards))
                return {'cardKind': self.PLANE, 'value': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlaneWithOne(cards))
                return {'cardKind': self.PLANE_WITH_ONE, 'value': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlaneWithPairs(cards))
                return {'cardKind': self.PLANE_WITH_PAIRS, 'value': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isFourWithTwo(cards))
                return {'cardKind': self.FOUR_WITH_TWO, 'value': self.getMaxVal(cards, 4), 'size': len};
            else if(self.isFourWithPairs(cards))
                return {'cardKind': self.FOUR_WITH_TWO_PAIRS, 'value': self.getMaxVal(cards, 4), 'size': len};
            else
                return null;

    }

};
//牌型类
function CardsType(value, list) {
    this.value = value;
    this.cardList = list;
}
function gameLogic(p) {
    this.player = p;
    this.cards = p.cardList.slice(0);
    this.cardsAnalyse();
}
gameLogic.prototype.judgeThree = function (cards){
    var self = this,
        stat = G.myGameRule.valCount(cards);
    for (i = 0; i < stat.length; i++) {
        if(stat[i].count === 3){
            var list = [];
            self.moveItem(cards, list, stat[i].value);
            self._three.push(new CardsType(list[0].value, list));
        }
    }
};

/**
 * 判断给定牌中的飞机
 * @method judgePlane
 */
gameLogic.prototype.judgePlane = function (){
    var self = this;
    if(self._three.length > 1){
        var proList = [];
        for (i = 0; i < self._three.length; i++) {//遍历统计结果
            if(self._three[i].value >= 15)
                continue;//三顺必须小于2
            if(proList.length == 0){
                proList.push({'obj': self._three[i], 'fromIndex': i});
                continue;
            }
            if(proList[proList.length - 1].value - 1 == self._three[i].value){//判定递减
                proList.push({'obj': self._three[i], 'fromIndex': i});
            } else {
                if(proList.length > 1){//已经有三顺，先保存
                    var myplaneCards = [];
                    for (var j = 0; j < proList.length; j++) {
                        myplaneCards = myplaneCards.concat(proList[j].obj.cardList);
                    }
                    self._plane.push(new CardsType(proList[0].obj.value, myplaneCards));
                    for (var k = proList.length - 1; k >= 0; k--) {//除去已经被取走的牌
                        self._three.splice(proList[k].fromIndex, 1);
                    }
                }
                //重新计算
                proList = [];
                proList.push({'obj': self._three[i], 'fromIndex': i});
            }
        }
        if(proList.length > 1){//有三顺，保存
            var planeCards = [];
            for (var j = 0; j < proList.length; j++) {
                planeCards = planeCards.concat(proList[j].obj.cardList);
            }
            self._plane.push(new CardsType(proList[0].obj.value, planeCards));
            for (var k = proList.length - 1; k >= 0; k--) {//除去已经被取走的牌
                self._three.splice(proList[k].fromIndex, 1);
            }
        }
    }
};

/**
 * 判断给定牌中的顺子(五连)
 * @method judgeProgression
 * @param  {[array]}         cards 指定的牌
 */
gameLogic.prototype.judgeProgression = function (cards){
    var self = this;

    var saveProgression = function (proList){
        var progression = [];
        for (var j = 0; j < proList.length; j++) {
            progression.push(proList[j].obj);
        }
        self._progression.push(new CardsType(proList[0].obj.value, progression));
        for (var k = proList.length - 1; k >= 0; k--) {//除去已经被取走的牌
            cards.splice(proList[k].fromIndex, 1);
        }
    };
    //判定顺子
    if(cards.length >= 5){
        var proList = [];
        for (var i = 0; i < cards.length; i++) {
            if(cards[i].value >= 15)
                continue;//顺子必须小于2
            if(proList.length == 0){
                proList.push({'obj': cards[i], 'fromIndex': i});
                continue;
            }
            if(proList[proList.length - 1].obj.value - 1 === cards[i].value){//判定递减
                proList.push({'obj': cards[i], 'fromIndex': i});
                if(proList.length === 5)
                    break;
            } else if (proList[proList.length - 1].obj.value === cards[i].value) {//相等跳出本轮
                continue;
            } else {
                if(proList.length >= 5){//已经有顺子，先保存
                    break;
                }
                else {
                    //重新计算
                    proList = [];
                    proList.push({'obj': cards[i], 'fromIndex': i});
                }
            }
        }
        if(proList.length === 5){//有顺子，保存
            saveProgression(proList);
            self.judgeProgression(cards);//再次判断顺子
        } else {
            self.joinProgression(cards);
        }
    }
};

/**
 * 将顺子与剩下的牌进行拼接，组成更大的顺子
 * @method judgeProgression
 * @param  {[array]}         cards 指定的牌
 */
gameLogic.prototype.joinProgression = function (cards){
    var self = this;
    for (var i = 0; i < self._progression.length; i++) {//拼接其他散牌
        for (var j = 0; j < cards.length; j++) {
            if(self._progression[i].value != 14 && self._progression[i].value === cards[j].value - 1){
                self._progression[i].cardList.unshift(cards.splice(j, 1)[0]);
            }
            else if(cards[j].value === self._progression[i].value - self._progression[i].cardList.length){
                self._progression[i].cardList.push(cards.splice(j, 1)[0]);
            }
        }
    }
    var temp = self._progression.slice(0);
    for (i = 0; i < temp.length; i++) {//连接顺子
        if( i < temp.length - 1 && temp[i].value - temp[i].cardList.length === temp[i + 1].value){
            self._progression[i].cardList = self._progression[i].cardList.concat(self._progression[i + 1].cardList);
            self._progression.splice( ++i, 1);
        }
    }
};

/**
 * 判断给定牌中的连对
 * @method judgeProgressionPairs
 * @param  {[array]}         cards 指定的牌
 */
gameLogic.prototype.judgeProgressionPairs = function (cards){
    var self = this;

    var saveProgressionPairs = function (proList){
        var progressionPairs = [];
        for (var i = proList.length - 1; i >= 0; i--) {//除去已经被取走的牌
            for (var j = 0; j < cards.length; j++) {
                if(cards[j].value === proList[i]){
                    progressionPairs = progressionPairs.concat(cards.splice(j, 2));
                    break;
                }
            }
        }
        progressionPairs.sort(G.myGameRule.cardSort);
        self._progressionPairs.push(new CardsType(proList[0], progressionPairs));
    };
    //判定连对
    if(cards.length >= 6){
        var proList = [];
        var stat = G.myGameRule.valCount(cards);//统计
        for (var i = 0; i < stat.length; i++) {
            if(stat[i].value >= 15){//连对必须小于2
                continue;
            }
            if(proList.length == 0  && stat[i].count >= 2){
                proList.push(stat[i].value);
                continue;
            }
            if(proList[proList.length - 1] - 1 === stat[i].value && stat[i].count >= 2){//判定递减
                proList.push(stat[i].value);
            } else {
                if(proList.length >= 3){//已经有连对，先保存
                    //saveProgressionPairs(proList);
                    //proList = [];
                    break;
                } else {
                    //重新计算
                    proList = [];
                    if(stat[i].count >= 2) proList.push(stat[i].value);
                }
            }
        }
        if(proList.length >= 3){//有顺子，保存
            saveProgressionPairs(proList);
            self.judgeProgressionPairs(cards);
        }
    }
};

/**
 * 将src中对应值的牌数据移到dest中
 */
gameLogic.prototype.moveItem = function(src, dest, v){
    for (var i =  src.length - 1; i >= 0; i--) {
        if(src[i].value === v){
            dest.push(src.splice(i, 1)[0]);
        }
    }
};

/**
 * 设置返回牌的类型
 * @method setCardKind
 * @param  {[object]}    obj  对象
 * @param  {[kind]}    kind 牌型
 */
gameLogic.prototype.setCardKind = function (obj, kind){
    obj.cardKind = kind;
    obj.size = obj.cardList.length;
    return obj;
};

gameLogic.prototype.cardsAnalyse = function(){
    var self = this,
        target = self.cards.slice(0),//拷贝一份牌来分析
        stat = null,//统计信息
        targetWob = null,//除去炸弹之后的牌组
        targetWobt = null,//除去炸弹、三根之后的牌组
        targetWobp = null,//除去炸弹、顺子之后的牌组
        targetWobpp = null;//除去炸弹、连对之后的牌组
    //定义牌型
    self._one = [];
    self._pairs =[];
    self._kingBomb = [];
    self._bomb = [];
    self._three = [];
    self._plane = [];
    self._progression = [];
    self._progressionPairs = [];
    target.sort(G.myGameRule.cardSort);
    //判定王炸
    if(G.myGameRule.isKingBomb(target.slice(0,2))){
        self._kingBomb.push(new CardsType(17, target.splice(0, 2)));
    }
    //判定炸弹
    stat = G.myGameRule.valCount(target);
    for (var i = 0; i < stat.length; i++) {
        if(stat[i].count === 4){
            var list = [];
            self.moveItem(target, list, stat[i].value);
            self._bomb.push(new CardsType(list[0].value, list));
        }
    }
    targetWob = target.slice(0);
    //判定三根，用于判定三顺
    targetWobt = targetWob.slice(0);
    self.judgeThree(targetWobt);
    //判定三顺(飞机不带牌)
    self.judgePlane();

    //把三根加回用于判定顺子
    for (i = 0; i < self._three.length; i++) {
        targetWobt = targetWobt.concat(self._three[i].cardList);
    }
    self._three = [];
    targetWobt.sort(G.myGameRule.cardSort);
    //判定顺子，先确定五连
    targetWobp = targetWobt.slice(0);
    self.judgeProgression(targetWobp);
    //判断连对
    //targetWobpp = targetWobp.slice(0);
    self.judgeProgressionPairs(targetWobp);
    //判定三根，用于判定三顺
    //targetWobt = targetWob.slice(0);
    self.judgeThree(targetWobp);
    //除去顺子、炸弹、三根后判断对子、单牌
    stat = G.myGameRule.valCount(targetWobp);
    for (i = 0; i < stat.length; i++) {
        if(stat[i].count === 1){//单牌
            for (var j = 0; j < targetWobp.length; j++) {
                if(targetWobp[j].value === stat[i].value){
                    self._one.push(new CardsType(stat[i].value, targetWobp.splice(j,1)));
                }
            }
        } else if(stat[i].count === 2){//对子
            for (var j = 0; j < targetWobp.length; j++) {
                if(targetWobp[j].value === stat[i].value){
                    self._pairs.push(new CardsType(stat[i].value, targetWobp.splice(j,2)));
                }
            }
        }
    }

};
gameRule.prototype.cardSort = function (a, b){
    var va = parseInt(a.value);
    var vb = parseInt(b.value);
    if(va === vb){
        return a.type > b.type ? 1 : -1;
    } else if(va > vb){
        return -1;
    } else {
        return 1;
    }
};

gameLogic.prototype.judgeScore = function() {
    var self = this,
        score = 0;
    score += self._bomb.length * 6;//有炸弹加六分
    if(self._kingBomb.length > 0 ){//王炸8分
        score += 8;
    } else {
        if(self.cards[0].value === 17){
            score += 4;
        } else if(self.cards[0].value === 16){
            score += 3;
        }
    }
    for (var i = 0; i < self.cards.length; i++) {
        if(self.cards[i].value === 15){
            score += 2;
        }
    }
    if(score >= 7){
        return 3;
    } else if(score >= 5){
        return 2;
    } else if(score >= 3){
        return 1;
    } else {//0相当于不叫
        return 0;
    }
};

window.G = {
    cardInitialFlag: false,
    playerInitialFlag: false,
    allCards: [],
    hiddenCards: [],
    landLord: null,
    timeID: null,
    backgroundSound: null
}

G.setPlayer = function(){
    this.ownPlayer = new Player(0);
    this.rightPlayer = new Player(1);
    this.leftPlayer = new Player(2);
    this.ownPlayer.nextPlayer = this.rightPlayer;
    this.rightPlayer.nextPlayer = this.leftPlayer;
    this.leftPlayer.nextPlayer = this.ownPlayer;
    this.playerInitialFlag = true;
}

G.initialCard = function(){
    for(var i = 3; i <= 15; i++)
    {
        this.allCards.push("f" + String(i));
        this.allCards.push("h" + String(i));
        this.allCards.push("t" + String(i));
        this.allCards.push("m" + String(i));
    }
    this.allCards.push("w1");
    this.allCards.push("w2");
    this.cardInitialFlag = true;
}

G.clearCards = function(){
    document.getElementById("leftplayer").innerHTML = "";
    document.getElementById("rightplayer").innerHTML = "";
    document.getElementById("handcard").innerHTML = "";
    document.getElementById("leftidentity").style.background = "";
    document.getElementById("rightidentity").style.background = "";
    document.getElementById("ownidentity").style.background = "";
}

G.clearTips = function(){
    document.getElementById("lefttip").innerHTML = "";
    document.getElementById("righttip").innerHTML = "";
    document.getElementById("owntip").innerHTML = "";
}

G.startGame = function(){
    document.getElementById("restart").style.visibility = "hidden";
    this.isOver = false;
    if(!this.cardInitialFlag){
        this.initialCard();
    }
    for(var i = 1; i <= 3; i++){    
        var hiddenCardDiv = document.getElementById("special"+i);
        hiddenCardDiv.style.background = "";
    }
    var notecard = document.getElementById("notecard");
    var len = notecard.childNodes.length;
    for (var i = 0; i < len; i++) {
        notecard.childNodes[i].innerHTML = "";
    }
    document.getElementById("ownPlayButtons").style.display = "none";
    document.getElementById("overtable").style.display = "none";
    document.getElementById("tableback").style.display = "none";
    this.clearCards();
    this.clearTips();
    document.getElementById("bottomscore").innerHTML = 0;
    document.getElementById("times").innerHTML = 1;
    this.hiddenCards.length = 0;
    this.claimScoreLogic = new claimScoreLogic();
    this.cardUI = new cardUI();
    this.cardUI.clearOutArea();
    if(!(this.playerInitialFlag)){
        this.setPlayer();
    }
    else{
        this.ownPlayer.initial();
        this.leftPlayer.initial();
        this.rightPlayer.initial();
    }
    if(this.backgroundSound)
        this.backgroundSound.stop();
    this.backgroundSound = soundManager.playsground("playing.mp3");
    this.backgroundSound.play();
    var self = this;
    // this.timeID = setInterval(function(){
    //     self.backgroundSound.play();
    // }, 36000)
    sentCard();
}

G.startEvent = function() {
    document.getElementById("beginScene").style.display = "none";
    document.getElementById("center").style.display = "block";
    this.startGame();
}

G.gameOver = function(){
    this.backgroundSound.stop();
    document.getElementById("restart").style.visibility = "visible";
    // clearInterval(this.timeID);
    this.cardUI.showAICards();
    var overTable = document.getElementById("overtable");
    var tableBack = document.getElementById("tableback");
    if(this.cardUI.currentWinner.name == "Player"){
        tableBack.style.background = "url('image/win.png') no-repeat left top";
        tableBack.style.backgroundSize = "100% 100%";
        soundManager.plays("swf/winner.mp3");
    }
    else if(this.cardUI.currentWinner.isLandlord == false && this.ownPlayer.isLandlord == false){
        tableBack.style.background = "url('image/win.png') no-repeat left top";
        tableBack.style.backgroundSize = "100% 100%";
        soundManager.plays("swf/winner.mp3");
    }
    else{
        tableBack.style.background = "url('image/lose.png') no-repeat left top";
        tableBack.style.backgroundSize = "100% 100%";
         soundManager.plays("swf/fail.ogg");
    }
    this.cardUI.clearOutArea();
    var playerList = ["leftPlayer", "rightPlayer", "ownPlayer"];
    if(this.cardUI.currentWinner.name == this.landLord.name){
        this.landLord.score += 2 * this.claimScoreLogic.bottomScore * this.claimScoreLogic.times;
        document.getElementById(this.landLord.name+"change").innerHTML = "+" + 2 * this.claimScoreLogic.bottomScore * this.claimScoreLogic.times;
        document.getElementById(this.landLord.name+"score").innerHTML = this.landLord.score;
        for(let player of playerList){
            if(this[player].name != this.landLord.name){
                this[player].score -= this.claimScoreLogic.bottomScore * this.claimScoreLogic.times;
                document.getElementById(this[player].name+"change").innerHTML = "-" + this.claimScoreLogic.bottomScore * this.claimScoreLogic.times;
                document.getElementById(this[player].name+"score").innerHTML = this[player].score;
            }
        }
    }
    else{
        this.landLord.score -= 2 * this.claimScoreLogic.bottomScore * this.claimScoreLogic.times;
        document.getElementById(this.landLord.name+"change").innerHTML = "-" + 2 * this.claimScoreLogic.bottomScore * this.claimScoreLogic.times;
        document.getElementById(this.landLord.name+"score").innerHTML = this.landLord.score;
        for(let player of playerList){
            if(this[player].name != this.landLord.name){
                this[player].score += this.claimScoreLogic.bottomScore * this.claimScoreLogic.times;
                document.getElementById(this[player].name+"change").innerHTML = "+" + this.claimScoreLogic.bottomScore * this.claimScoreLogic.times;
                document.getElementById(this[player].name+"score").innerHTML = this[player].score;
            }
        }        
    }
    tableBack.style.display = "block";
    overTable.style.display = "table";
    document.getElementById("leftscore").innerHTML = this.leftPlayer.score + "分";
    document.getElementById("rightscore").innerHTML = this.rightPlayer.score + "分";
    document.getElementById("ownscore").innerHTML = this.ownPlayer.score + "分";
}

G.showNoteCard = function(){
    var notecard = document.getElementById("notecard");
    if(notecard.style.visibility == "visible"){
        notecard.style.visibility = "hidden";
    }
    else{
        notecard.style.visibility = "visible";
    }
}

function claimScoreLogic(){
    this.currentScore = 0;
    this.round = 0;
    this.currentLandlord = null;
    this.bottomScore = 0;
    this.times = 1;
}

claimScoreLogic.prototype.robLandlord = function() {
    document.getElementById("claimButtons").style.display = "none";
    var randomNum = randomBy(0, 2);
    var firstPlayer;
    switch (randomNum) {
        case 0:
            firstPlayer = G.ownPlayer;
            break;
        case 1:
            firstPlayer = G.rightPlayer;
            break;
        case 2:
            firstPlayer = G.leftPlayer;
            break;
        default:
            break;
    }
    this.provideScore(firstPlayer);
}

claimScoreLogic.prototype.bottomScoreChange = function(value){
    this.bottomScore = value;
    document.getElementById("bottomscore").innerHTML = value;
}

claimScoreLogic.prototype.setLandlord = function(player){
    G.ownPlayer.isLandlord = G.leftPlayer.isLandlord = G.rightPlayer.isLandlord = false;
    player.isLandlord = true;
    G.landLord = player;
    for(var i = 1; i <= 3; i++){
        var hiddenCardDiv = document.getElementById("special"+i);
        hiddenCardDiv.style.background = "url(image/" + G.hiddenCards[i - 1].path + ".jpg) no-repeat top left";
        hiddenCardDiv.style.backgroundSize = "100% 100%";
        hiddenCardDiv.style.border = "0px";
    }
    var cardsArea;
    var newCard;
    switch (player.name) {
        case "leftAI":
            for(let i = 0; i < 3; i++){
                cardsArea = document.getElementById("leftplayer");
                newCard = document.createElement("div");
                newCard.className = "cardback";
                cardsArea.insertBefore(newCard, cardsArea.lastChild);
                G.leftPlayer.cardList.push(G.hiddenCards[i]);
            }
            G.leftPlayer.cardList.sort(G.myGameRule.cardSort);
            document.getElementById("leftremain").innerHTML = "20";
            document.getElementById("leftidentity").style.background = "url('image/head_lord.png') no-repeat left top";
            document.getElementById("rightidentity").style.background = "url('image/head_farmer.png') no-repeat left top";
            document.getElementById("ownidentity").style.background = "url('image/head_farmer.png') no-repeat left top";
            break;
        case "rightAI":
            for(let i = 0; i < 3; i++){
                cardsArea = document.getElementById("rightplayer");
                newCard = document.createElement("div");
                newCard.className = "cardback";
                cardsArea.insertBefore(newCard, cardsArea.lastChild);
                G.rightPlayer.cardList.push(G.hiddenCards[i]);
            }
            G.rightPlayer.cardList.sort(G.myGameRule.cardSort);
            document.getElementById("rightremain").innerHTML = "20";
            document.getElementById("leftidentity").style.background = "url('image/head_farmer.png') no-repeat left top";
            document.getElementById("rightidentity").style.background = "url('image/head_lord.png') no-repeat left top";
            document.getElementById("ownidentity").style.background = "url('image/head_farmer.png') no-repeat left top";
            break;
        case "Player":
            //将底牌加入主视角手牌中
            for(var i = 0; i < 3; i++){
                G.cardUI.insertOneCard(G.hiddenCards[i]);
            }
            document.getElementById("leftidentity").style.background = "url('image/head_farmer.png') no-repeat left top";
            document.getElementById("rightidentity").style.background = "url('image/head_farmer.png') no-repeat left top";
            document.getElementById("ownidentity").style.background = "url('image/head_lord.png') no-repeat left top";
            break;
        default:
            break;
    }
    G.clearTips();
    G.cardUI.noteCards();
    G.cardUI.playCard(player);
}

claimScoreLogic.prototype.provideScore = function(player){
    var self = this;
    if(player.isAI){
        document.getElementById("claimButtons").style.display = "none";
        setTimeout(function() {
            var ai = new gameLogic(player);
            var s = ai.judgeScore();
            //console.log("h");
            //ai.log();
            if(s > 0 && s > self.currentScore){
                self.currentScore = s;
                self.currentLandlord = player;
                self.bottomScoreChange(s);
                console.info(player.name + ":叫" + s + "分");
                if(s === 3){
                    self.setLandlord(player);//函数中完成开始游戏处理
                    console.info("地主是："+player.name);
                    return;
                }
                if(player.name == "leftAI"){
                    document.getElementById("lefttip").innerHTML = s + "分";
                }
                else{
                    document.getElementById("righttip").innerHTML = s + "分";
                }
            }
            else{
                console.info(player.name + "不叫分");
                if(player.name == "leftAI"){
                    document.getElementById("lefttip").innerHTML = "不叫";
                }
                else{
                    document.getElementById("righttip").innerHTML = "不叫";
                }
            }
            ++self.round;
            if(self.round === 3){
                if(self.currentLandlord){
                    self.setLandlord(self.currentLandlord);//函数中完成开始游戏处理
                    console.info("地主是："+self.currentLandlord.name);
                    return;
                }
                else{
                    console.info("没有人叫分，重新发牌")
                    //重新发牌处理
                    G.startGame();
                }
            }
            else{
                self.provideScore(player.nextPlayer);
            }
        }, 1000);
    }
    else{
        document.getElementById("claimButtons").style.display = "block";
        document.getElementById("one").style.visibility = "hidden";
        document.getElementById("two").style.visibility = "hidden";
        document.getElementById("three").style.visibility = "visible";
        document.getElementById("no").style.visibility = "visible";
        if(this.currentScore < 2){
            document.getElementById("two").style.visibility = "visible";
        }
        if(this.currentScore < 1){
            document.getElementById("one").style.visibility = "visible";
        }
    }
}

function playerClaimScore(id){
    document.getElementById("claimButtons").style.display = "none";
    var score;
    switch (id) {
        case "one":
            score = 1;
            break;
        case "two":
            score = 2;
            break;
        case "three":
            score = 3;
            break;
        case "no":
            score = 0;
            break;
        default:
            break;
    }
    if(score > 0){
        G.claimScoreLogic.currentScore = score;
        G.claimScoreLogic.currentLandlord = G.ownPlayer;
        G.claimScoreLogic.bottomScoreChange(score);
        console.info(G.ownPlayer.name + ":叫" + score + "分");
        if(score === 3){
            G.claimScoreLogic.setLandlord(G.ownPlayer);//函数中完成开始游戏处理
            console.info("地主是："+G.ownPlayer.name);
            return;
        }
        document.getElementById("owntip").innerHTML = score + "分";
    }
    else{
        console.info(G.ownPlayer.name + "不叫分");
        document.getElementById("owntip").innerHTML = "不叫";
    }
    ++G.claimScoreLogic.round;
    if(G.claimScoreLogic.round === 3){
        if(G.claimScoreLogic.currentLandlord){
            G.claimScoreLogic.setLandlord(G.claimScoreLogic.currentLandlord);//函数中完成开始游戏处理
            console.info("地主是："+G.claimScoreLogic.currentLandlord.name);
            return;
        }
        else{
            console.info("没有人叫分，重新发牌");
            //重新发牌处理
            G.startGame();
        }
    }
    else{
        G.claimScoreLogic.provideScore(G.ownPlayer.nextPlayer);
    }
}

function randomBy(under, over){//范围随机数
    return parseInt(Math.random() * (over - under + 1) + under);
}

function cardUI(){
    this.chooseCards = new Array();
    this.currentCards = null;
    this.currentWinner = null;
    this.currentPlayer = null;
    this.ownTypeDiv = document.getElementById("owncardtype");
    this.leftTypeDiv = document.getElementById("leftcardtype");
    this.rightTypeDiv = document.getElementById("rightcardtype");
}

cardUI.prototype.insertOneCard = function(card){
    G.ownPlayer.cardList.push(card);
    G.ownPlayer.cardList.sort(G.myGameRule.cardSort);
    var count = G.ownPlayer.cardList.length;
    for(var i = 0; i < count; i++){
        if(G.ownPlayer.cardList[i].path == card.path){
            break;
        }
    }
    var cardArea = document.getElementById("handcard");
    var newCard = document.createElement("div");
    if(i == 0){
        newCard.className = "mycard first";
        cardArea.childNodes[0].className = "mycard";
    }
    else{
        newCard.className = "mycard";
    }
    newCard.id = card.path;
    newCard.style.background = "url(image/" + card.path + ".jpg) no-repeat top left";
    newCard.style.backgroundSize = "100% 100%";
    newCard.addEventListener("click", G.cardUI.clickCard);
    cardArea.insertBefore(newCard, cardArea.childNodes[i]);
}

cardUI.prototype.indexInChooseCards = function(card){
    for(var i = 0; i < this.chooseCards.length; i++){
        if(card.path === this.chooseCards[i].path){
            return i;
        }
    }
    return -1;
}

cardUI.prototype.clickCard = function(event){
    var cardpath = this.id;
    var aimCard = new card(cardpath);
    var cardDiv = document.getElementById(cardpath);
    if(G.cardUI.indexInChooseCards(aimCard) == -1){//点击的牌尚未被选中
        cardDiv.style.top = (Number(cardDiv.style.top.substr(0, cardDiv.style.top.length - 2)) - 25) + 'px';
        G.cardUI.chooseCards.push(aimCard);
    }
    else{//点击的牌原已被选中
        cardDiv.style.top = (Number(cardDiv.style.top.substr(0, cardDiv.style.top.length - 2)) + 25) + 'px';
        G.cardUI.chooseCards.splice(G.cardUI.indexInChooseCards(aimCard), 1);
    }
}

cardUI.prototype.takeBackCards = function(){//收回所有已选择的牌
    var cardDiv;
    for(var i = 0; i < this.chooseCards.length; i++){
        cardDiv = document.getElementById(this.chooseCards[i].path);
        cardDiv.style.top = (Number(cardDiv.style.top.substr(0, cardDiv.style.top.length - 2)) + 25) + 'px';
    }
    this.chooseCards.length = 0;
}

cardUI.prototype.showAICards = function(){
    var leftCardDiv = document.getElementById("leftplayer");
    for(var i = 0; i < G.leftPlayer.cardList.length; i++){
        var cardDiv = leftCardDiv.childNodes[i];
        cardDiv.style.background = "url(image/" + G.leftPlayer.cardList[i].path + ".jpg) no-repeat top left";
        cardDiv.style.backgroundSize = "100% 100%";
        cardDiv.style.border = "0px";
    }
    var rightCardDiv = document.getElementById("rightplayer");
    for(var i = 0; i < G.rightPlayer.cardList.length; i++){
        var cardDiv = rightCardDiv.childNodes[i];
        cardDiv.style.background = "url(image/" + G.rightPlayer.cardList[i].path + ".jpg) no-repeat top left";
        cardDiv.style.backgroundSize = "100% 100%";
        cardDiv.style.border = "0px";
    }    
}

cardUI.prototype.clearOutArea = function(...args){
    if (args.length == 0){//清空三个出牌区域
        var leftout = document.getElementById("leftout");
        while(leftout.hasChildNodes()){
            leftout.removeChild(leftout.firstChild);
        }
        var rightout = document.getElementById("rightout");
        while(rightout.hasChildNodes()){
            rightout.removeChild(rightout.firstChild);
        }
        var myout = document.getElementById("myout");
        while(myout.hasChildNodes()){
            myout.removeChild(myout.firstChild);
        }
    }
    else{//清空玩家args[0]的出牌区域
        var cardArea;
        switch (args[0].name) {
            case "leftAI":
                cardArea = document.getElementById("leftout");
                break;
            case "rightAI":
                cardArea = document.getElementById("rightout");
                break;
            case "Player":
                cardArea = document.getElementById("myout");
                break;
            default:
                break;
        }
        while(cardArea.hasChildNodes()){
            cardArea.removeChild(cardArea.firstChild);
        }
    }
}

cardUI.prototype.putCardOut = function(player, cards){//出牌并将所出的牌显示到出牌区
    var cardArea;
    var handcard;
    var tipDiv;
    var remain = "";
    switch (player.name) {
        case "leftAI":
            cardArea = document.getElementById("leftout");
            handcard = document.getElementById("leftplayer");
            tipDiv = document.getElementById("lefttip");
            remain = "leftremain";
            break;
        case "rightAI":
            cardArea = document.getElementById("rightout");
            handcard = document.getElementById("rightplayer");
            tipDiv = document.getElementById("righttip");
            remain = "rightremain";
            break;
        case "Player":
            cardArea = document.getElementById("myout");
            handcard = document.getElementById("handcard");
            tipDiv = document.getElementById("owntip");
            break;
        default:
            break;
    }
    tipDiv.innerHTML = "";
    for(var i = 0; i < cards.length; i++){
        var newTipCard = document.createElement("div");
        newTipCard.className = "outcard";
        newTipCard.style.background = "url(image/" + cards[i].path + ".jpg) no-repeat top left";
        newTipCard.style.backgroundSize = "100% 100%";
        cardArea.appendChild(newTipCard);
        for(var j = 0; j < player.cardList.length; j++){
            if(player.cardList[j].path == cards[i].path){
                player.cardList.splice(j, 1);
                if(player.name == "Player"){
                    handcard.removeChild(handcard.childNodes[j]);
                    if(j == 0 && player.cardList.length > 0){
                        handcard.childNodes[0].className += " first";
                    }
                }
                break;
            }
        }
        if(player.name != "Player"){
            handcard.removeChild(handcard.childNodes[handcard.childNodes.length - 2]);
        }
    }
    
    if(remain != ""){
        document.getElementById(remain).innerHTML = player.cardList.length;
    }
}
soundManager.plays = function (string) {

    var sound = soundManager.createSound({

        id:  string,

        url: string,

        autoPlay: false //same as default

    });
    sound.play();
}
soundManager.playsground = function (string) {

    var sound = soundManager.createSound({

        id:  string,

        url: string,

        autoPlay: false //same as default

    });
    return sound;
}
cardUI.prototype.playCard = function(player){//出牌
    this.currentPlayer = player;
    if(player.isAI){
        console.info(player.name+"出牌中");
        var self = this;
        var ai = new gameLogic(player);//构造AI对象
        //ai.log();
        if(player.name == "leftAI"){
            document.getElementById("lefttip").innerHTML = "";
        }
        else{
            document.getElementById("righttip").innerHTML = "";
        }
        self.clearOutArea(player);
        setTimeout(function(){
            var result = null;
            
            if(self.currentWinner == null || self.currentWinner.name == player.name){//此AI是上轮的赢家，则必须出牌
                self.clearOutArea();//清空出牌显示区域
                //调用函数，将result赋为AI所出的牌组对象
                result = ai.play(G.landLord.cardList.length);
            }
            else{//AI跟牌
                //调用函数，将result赋为AI所出的牌组对象，如果AI不出，则result = null
                result = ai.follow(self.currentCards, self.currentWinner.isLandlord, self.currentWinner.cardList.length);
            }
            if(result){//如果出了牌，将所出的牌显示到出牌区
                console.info(result.cardKind);
                if(typeof result.value !== "undefined"){
                switch (result.cardKind) {
                case G.myGameRule.THREE_WITH_ONE:
                    soundManager.plays("female_voice/three_with_one.ogg");
                    break;
                case G.myGameRule.ONE:
                      soundManager.plays("female_voice/" + String(result.value) + ".ogg");
                    break;
                case G.myGameRule.PAIRS:
                    soundManager.plays("female_voice/pair" + String(result.value) + ".ogg")
                    break;
                case G.myGameRule.PROGRESSION:
                    soundManager.plays("female_voice/shunzi.ogg");
                    soundManager.plays("shunzi.ogg");
                    if(player.name == "leftAI"){
                        var typeDiv = self.leftTypeDiv;
                    }
                    else{
                        var typeDiv = self.rightTypeDiv;
                    }
                    typeDiv.style.background = "url('image/shunzi.png') no-repeat left top";
                    typeDiv.style.backgroundSize = "100% 100%";
                    typeDiv.style.opacity = "1";
                    setTimeout(function(){
                        typeDiv.style.opacity = "0";
                    }, 1500);                    
                    break;
                case G.myGameRule.PROGRESSION_PAIRS:
                    soundManager.plays("female_voice/continuous_pair.ogg");
                    if(player.name == "leftAI"){
                        var typeDiv = self.leftTypeDiv;
                    }
                    else{
                        var typeDiv = self.rightTypeDiv;
                    }
                    typeDiv.style.background = "url('image/liandui.png') no-repeat left top";
                    typeDiv.style.backgroundSize = "100% 100%";
                    typeDiv.style.opacity = "1";
                    setTimeout(function(){
                        typeDiv.style.opacity = "0";
                    }, 1500);                    
                    break;
                case G.myGameRule.BOMB:
                    soundManager.plays("female_voice/bomb.ogg");
                    soundManager.plays("Special_Bomb.ogg");
                    if(player.name == "leftAI"){
                        var typeDiv = self.leftTypeDiv;
                    }
                    else{
                        var typeDiv = self.rightTypeDiv;
                    }
                    typeDiv.style.height = "153px";
                    typeDiv.style.background = "url('image/zhadan.gif') no-repeat";
                    typeDiv.style.backgroundPosition = "center bottom";
                    typeDiv.style.opacity = "1";
                    setTimeout(function(){
                        typeDiv.style.opacity = "0";
                        typeDiv.style.height = "61.2px";
                    }, 1700);
                    break;
                case G.myGameRule.FOUR_WITH_TWO:
                    soundManager.plays("female_voice/four_with_two.ogg");break;
                case G.myGameRule.FOUR_WITH_TWO_PAIRS:
                    soundManager.plays("female_voice/four_with_two_pair.ogg");break;
                case G.myGameRule.PLANE:
                case G.myGameRule.PLANE_WITH_ONE:
                case G.myGameRule.PLANE_WITH_PAIRS:
                    soundManager.plays("female_voice/airplane.ogg");
                    soundManager.plays("Special_plane.ogg");
                    break;
                case G.myGameRule.KING_BOMB:
                    var rocketDiv = document.getElementById("rocket");
                    if(player.name == "leftAI"){
                        rocketDiv.style.left = "29%";
                    }
                    else{
                        rocketDiv.style.left = "71%";
                    }
                    rocketDiv.style.visibility = "visible";
                    rocketDiv.style.transition = "top 3s";
                    rocketDiv.style.top = "-175px";
                    setTimeout(function(){
                        rocketDiv.style.visibility = "hidden";
                        rocketDiv.style.transition = "none";
                        rocketDiv.style.top = "732px";
                    }, 3000);
                    soundManager.plays("female_voice/rocket.ogg");soundManager.plays("Special_Bomb.ogg");break;
                case G.myGameRule.THREE_WITH_PAIRS:
                    soundManager.plays("female_voice/three_with_one_pair.ogg");break;
                case G.myGameRule.THREE:
                    soundManager.plays("female_voice/three_one" + String(result.value) + ".ogg");break;
                default:
                     soundManager.plays("female_voice/bomb.ogg");
            }
                }
                self.putCardOut(player, result.cardList);
                if(result.cardKind === G.myGameRule.BOMB || result.cardKind === G.myGameRule.KING_BOMB){//出炸弹翻倍
                    G.claimScoreLogic.times *= 2;
                    document.getElementById("times").innerHTML = G.claimScoreLogic.times;
                }
                self.currentWinner = player;
                self.currentCards = result;
                self.noteCards();
            }
            else{//屏幕上显示"不出"
                console.info(player.name+"不出");
                var number = parseInt(10 * Math.random()) % 4
                if(number === 0)
                    number = 4;
                soundManager.plays("female_voice/no_"+ String(number)+ ".ogg");
                if(player.name == "leftAI"){
                    document.getElementById("lefttip").innerHTML = "不出";
                }
                else{
                    document.getElementById("righttip").innerHTML = "不出";
                }
            }
            if(player.cardList.length == 0){
                //游戏结束处理
                G.gameOver();
                console.info(player.name+"的牌出完，游戏结束");
                return;
            }
            self.playCard(player.nextPlayer);
        }, 1000);
    }
    else{
        console.info("轮到玩家出牌");
        document.getElementById("owntip").innerHTML = "";
        this.clearOutArea(player);
        document.getElementById("ownPlayButtons").style.display = "block";
        if(this.currentWinner == null || this.currentWinner.name == player.name){//玩家是上轮的赢家，则不显示不出按钮
            document.getElementById("pass").style.display = "none";
        }
        else{
            document.getElementById("pass").style.display = "";
        }
        //此处可添加出牌提示处理
    }
}

cardUI.prototype.getReadyCardsKind = function(){
    var self = this;
    if(self.chooseCards.length === 0){
        return null;
    }
    self.chooseCards.sort(G.myGameRule.cardSort);
    var type = G.myGameRule.typeJudge(self.chooseCards);
    // console.log("kl");
    // console.log(type.cardKind);
    if(type){//正确牌型，出牌
        if(self.currentWinner && self.currentWinner.name != G.ownPlayer.name){//跟牌
            return (function (winc, ownc){//判断自己的牌是否合法且应该上家的牌
                //王炸大过任何牌
                //炸弹可大其他牌型
                //同牌型大
                console.log(ownc.cardKind);
                if(ownc.cardKind === G.myGameRule.KING_BOMB
                    || (ownc.cardKind === G.myGameRule.BOMB && winc.cardKind != G.myGameRule.BOMB)
                    || (ownc.cardKind === winc.cardKind && ownc.size === winc.size && ownc.value > winc.value)){
                    return type;
                }
                return null;
            }(self.currentCards, type));
        } else {
            return type;
        }
    } else {
        return null;
    }
};

cardUI.prototype.playEvent = function(){
    // console.info(this);
    var cardObj = this.getReadyCardsKind();
    if(cardObj != null){
        if(cardObj.cardKind === G.myGameRule.BOMB || cardObj.cardKind === G.myGameRule.KING_BOMB){
            G.claimScoreLogic.times *= 2;
            document.getElementById("times").innerHTML = G.claimScoreLogic.times;
        }
        this.currentCards = cardObj;
        this.currentWinner = G.ownPlayer;
        document.getElementById("ownPlayButtons").style.display = "none";
         var result = cardObj;
         var self = this;
         if(typeof result.value !== "undefined"){
        switch (result.cardKind) {
            case G.myGameRule.THREE_WITH_ONE:
                soundManager.plays("male_voice/three_with_one.ogg");
                break;
            case G.myGameRule.ONE:
                soundManager.plays("male_voice/" + String(result.value) + ".ogg");
                break;
            case G.myGameRule.PAIRS:
                soundManager.plays("male_voice/pair" + String(result.value) + ".ogg")
                break;
            case G.myGameRule.PROGRESSION:
                soundManager.plays("male_voice/shunzi.ogg");
                soundManager.plays("shunzi.ogg");
                this.ownTypeDiv.style.background = "url('image/shunzi.png') no-repeat left top";
                this.ownTypeDiv.style.backgroundSize = "100% 100%";
                this.ownTypeDiv.style.opacity = "1";
                setTimeout(function(){
                    self.ownTypeDiv.style.opacity = "0";
                }, 1500);
                break;
            case G.myGameRule.PROGRESSION_PAIRS:
                soundManager.plays("male_voice/continuous_pair.ogg");
                this.ownTypeDiv.style.background = "url('image/liandui.png') no-repeat left top";
                this.ownTypeDiv.style.backgroundSize = "100% 100%";
                this.ownTypeDiv.style.opacity = "1";
                setTimeout(function(){
                    self.ownTypeDiv.style.opacity = "0";
                }, 1500);                    
                break;
            case G.myGameRule.BOMB:
                soundManager.plays("male_voice/bomb.ogg");
                soundManager.plays("Special_Bomb.ogg");
                this.ownTypeDiv.style.height = "153px";
                this.ownTypeDiv.style.background = "url('image/zhadan.gif') no-repeat";
                this.ownTypeDiv.style.backgroundPosition = "center bottom";
                this.ownTypeDiv.style.opacity = "1";
                setTimeout(function(){
                    self.ownTypeDiv.style.opacity = "0";
                    self.ownTypeDiv.style.height = "61.2px";
                }, 1700);
                break;
            case G.myGameRule.FOUR_WITH_TWO:
                soundManager.plays("male_voice/four_with_two.ogg");break;
            case G.myGameRule.FOUR_WITH_TWO_PAIRS:
                soundManager.plays("male_voice/four_with_two_pair.ogg");break;
            case G.myGameRule.PLANE:
            case G.myGameRule.PLANE_WITH_ONE:
            case G.myGameRule.PLANE_WITH_PAIRS:
                var planeDiv = document.getElementById("plane");
                planeDiv.style.visibility = "visible";
                planeDiv.style.transition = "left 4s";
                planeDiv.style.left = "-210px";
                setTimeout(function(){
                    planeDiv.style.visibility = "hidden";
                    planeDiv.style.transition = "none";
                    planeDiv.style.left = "1200px";
                }, 4000);
                soundManager.plays("male_voice/airplane.ogg");
                soundManager.plays("Special_plane.ogg");
                break;
            case G.myGameRule.KING_BOMB:
                var rocketDiv = document.getElementById("rocket");
                rocketDiv.style.left = "50%";
                rocketDiv.style.visibility = "visible";
                rocketDiv.style.transition = "top 3s";
                rocketDiv.style.top = "-175px";
                setTimeout(function(){
                    rocketDiv.style.visibility = "hidden";
                    rocketDiv.style.transition = "none";
                    rocketDiv.style.top = "732px";
                }, 3000);
                soundManager.plays("male_voice/rocket.ogg");
                soundManager.plays("Special_Bomb.ogg");
                break;
            case G.myGameRule.THREE_WITH_PAIRS:
                soundManager.plays("male_voice/three_with_one_pair.ogg");break;
            case G.myGameRule.THREE:
                soundManager.plays("male_voice/three_one" + String(result.value) + ".ogg");break;
            default:
                soundManager.plays("male_voice/bomb.ogg");
        }
         }
        this.putCardOut(G.ownPlayer, this.chooseCards);
       
        this.chooseCards.length = 0;
        if(G.ownPlayer.cardList.length === 0){
            G.gameOver();
            console.info("玩家出完，游戏结束");
            return;
        }
        this.playCard(G.ownPlayer.nextPlayer);
    }
}

cardUI.prototype.notPlayEvent = function(){
    document.getElementById("ownPlayButtons").style.display = "none";
    document.getElementById("owntip").innerHTML = "不出";
    this.takeBackCards();
    var number = parseInt(10 * Math.random()) % 4
    if(number === 0)
        number = 4;
    soundManager.plays("male_voice/no_"+ String(number)+ ".ogg");
    this.playCard(G.ownPlayer.nextPlayer);
}
cardUI.prototype.noteCards = function(){
    var allleft = G.leftPlayer.cardList;
    var allright = G.rightPlayer.cardList;
    console.log(allright);
  //  this.allCount.length = 0;
    var allcount = new Array();
    for(var i = 0; i < 18; i++){
        allcount[i] = 0;
    }
    for(var i = 0; i < allleft.length; i++){
        allcount[allleft[i].value - 3]++;
    }
    for(var j = 0; j < allright.length; j++){
        allcount[allright[j].value - 3]++;
    }
    for(var k = 17; k >= 3; k--){
        var temp = document.getElementById(String(k));
        temp.innerHTML = allcount[k - 3];
    }
}
cardUI.prototype.tipEvent = function(){
    var ai = new gameLogic(G.ownPlayer);
    var tipObj;
    if(this.currentWinner == null || this.currentWinner == G.ownPlayer){
        tipObj = ai.play(G.landLord.cardList.length);
    }
    else{
       // tipObj = ai.followResult(this.currentCards, this.currentWinner.isLandlord, this.currentWinner.cardList.length);
        tipObj = ai.tipResult(this.currentCards, this.currentWinner.isLandlord, this.currentWinner.cardList.length);
        if(tipObj == null){
            this.notPlayEvent();
            return;
        }
    }
    this.takeBackCards();
    var tipCardsCount = tipObj.cardList.length;
    var ownCardsCount = G.ownPlayer.cardList.length;
    for (var i = 0; i < tipCardsCount; i++) {
        for (var j = 0; j < ownCardsCount; j++) {
            if(G.ownPlayer.cardList[j].path == tipObj.cardList[i].path){
                var cardDiv = document.getElementById(tipObj.cardList[i].path);
                cardDiv.style.top = (Number(cardDiv.style.top.substr(0, cardDiv.style.top.length - 2)) - 25) + 'px';
                this.chooseCards.push(tipObj.cardList[i]);
            }
        }
    }
}

var Player = function(n){//玩家对象
    switch (n) {
        case 0:
            this.name = 'Player';
            this.isAI = false;
            break;
        case 1:
            this.name = 'rightAI';
            this.isAI = true;
            break;
        case 2:
            this.name = 'leftAI';
            this.isAI = true;
        default:
            break;
    }
    this.isLandlord = false;
    this.cardList = [];
    this.nextPlayer = null;
    this.score = 500;
}

Player.prototype.initial = function(){
    this.isLandlord = false;
    this.cardList = [];
}

function shuffle(arr){
    var len = arr.length;
    for(var i = 0; i < len - 1; i++){
        var idx = Math.floor(Math.random() * (len - i));
        var temp = arr[idx];
        arr[idx] = arr[len - i - 1];
        arr[len - i -1] = temp;
    }
    return arr;
}

var intervalID;
G.myGameRule = new gameRule();
function judgeValue(type, v) {
    if(type === 'w')
    {
        return v+15;
    }
    else
        return v;
}
function judgeType(string) {
    switch(string)
    {
        case "w": return '0';
        case "t": return '1';
        case "m": return '2';
        case "h": return '3';
        case "f": return '4';
    }
}
function sentCard(){
    shuffle(G.allCards);
    for(var j = 0; j < 17; j++){
        var firstTemp = new card(G.allCards[3*j + 1]);
        G.rightPlayer.cardList.push(firstTemp);
        var secondTemp = new card(G.allCards[3*j + 2]);
        G.leftPlayer.cardList.push(secondTemp);
        var myTemp = new card(G.allCards[3*j]);
        G.ownPlayer.cardList.push(myTemp);
    }
    //把三张底牌加入hiddenCards中
    for(var j = 0; j < 3; j++){
        var temp = new card(G.allCards[51 + j]);
        G.hiddenCards.push(temp);
    }

    G.ownPlayer.cardList.sort(G.myGameRule.cardSort);
    G.rightPlayer.cardList.sort(G.myGameRule.cardSort);
    G.leftPlayer.cardList.sort(G.myGameRule.cardSort);
    intervalID = setInterval(addcard, 150);
}

var dom = [];
var count = 0;
var leftplayer = document.getElementById("leftplayer");
dom = leftplayer;
var rightplayer = document.getElementById("rightplayer");
var handcard = document.getElementById("handcard");
var first = leftplayer.firstElementChild;
var wholeclass;

function addcard(){
    if(count == 0){
        leftplayer.innerHTML += "<div class='cardback first'></div>";
        rightplayer.innerHTML += "<div class='cardback first'></div>";
        var newCard = document.createElement("div");
        newCard.id = G.ownPlayer.cardList[count].path;
        newCard.className = "mycard first";
        newCard.style.background = "url(image/" + G.ownPlayer.cardList[count].path + ".jpg) no-repeat top left";
        newCard.style.backgroundSize = "100% 100%";
        newCard.addEventListener("click", G.cardUI.clickCard);
        document.getElementById("handcard").appendChild(newCard);
    }
    else if(count <= 16){
        leftplayer.innerHTML += "<div class='cardback'></div>";
        rightplayer.innerHTML += "<div class='cardback'></div>";
        var newCard = document.createElement("div");
        newCard.id = G.ownPlayer.cardList[count].path;
        newCard.className = "mycard";
        newCard.style.background = "url(image/" + G.ownPlayer.cardList[count].path + ".jpg) no-repeat top left";
        newCard.style.backgroundSize = "100% 100%";
        newCard.addEventListener("click", G.cardUI.clickCard);
        document.getElementById("handcard").appendChild(newCard);
    }
    if(count == 16){
        clearInterval(intervalID);
        leftplayer.innerHTML += "<div class='remainnum'>剩余 <span id='leftremain'>17</span> 张</div>";
        rightplayer.innerHTML += "<div class='remainnum'>剩余 <span id='rightremain'>17</span> 张</div>";
        G.claimScoreLogic.robLandlord();
        count = -1;
    }
    count++;
}