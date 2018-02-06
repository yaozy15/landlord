gameLogic.prototype.makeObj = function (obj, kind){
    obj.cardKind = kind;
    obj.size = obj.cardList.length;
    return obj;
}
gameLogic.prototype.giveMinCards = function (list, kind, v){
    var self = this;
    if(v)
    {
        v = v;
    }
    else
        v = 2;
    if(list.length > 0){
        for (var i = list.length - 1; i >= 0 ; i--) {
            if(v < list[i].value){
                return this.makeObj(list[i], kind);
            }
        }
    }
    return null;
}


gameLogic.prototype.giveMaxCards = function (list, kind, v){
    var max = null;
    if(list.length > 0){
        for (var i = 0; i < list.length ; i++) {
            if(!max)
            {
                max = list[i];
            }
            else if(list[i].value > max.value){
                max = list[i];
            }
        }
        if(max.value <= v)
        {
            return null;
        }
        else
        {
            return this.makeObj(max, kind);
        }

    }
    return null;
}


gameLogic.prototype.matchCards = function(list, kind, winc, isWinnerBeLandlord, winnerCardCount) {
    var self = this;
    if(this.player.isLandlord){
        if(this.player.nextPlayer.cardList.length < 3 || self.player.nextPlayer.nextPlayer.cardList.length < 3 ){
            return this.giveMaxCards(list, kind, winc.value);
        }
        else {
            return this.giveMinCards(list, kind, winc.value);
        }
    }
    else {

        if(isWinnerBeLandlord){
            if(winnerCardCount < 3){
                return self.giveMaxCards(list, kind, winc.value);
            }
            else {
                return self.giveMinCards(list, kind, winc.value);
            }
        }
        else {
            var show = null;
            if(this.player.nextPlayer.isLandlord && self.player.nextPlayer.cardList.length < 3){
                return self.giveMaxCards(list, kind, winc.value);
            } else {
                show = self.giveMinCards(list, kind, winc.value);
                return show;
            }
        }
    }
}


gameLogic.prototype.minPlane = function (len, winc){
    var self = this;
    if(this._plane.length > 0){
        for (var i = self._plane.length - 1; i >= 0 ; i--) {//从小值开始判断
            if(winc.value < self._plane[i].value && len <= self._plane[i].cardList.length){
                if(len === self._plane[i].cardList.length){
                    return this.makeObj(self._plane[i], G.myGameRule.PLANE);
                }
                else {
                    var valDiff = self._plane[i].value - winc.value,
                        sizeDiff = (self._plane[i].cardList.length - len) / 3;
                    for (var j = 0; j < sizeDiff; j++) {//拆顺
                        if(valDiff > 1){
                            for (var k = 0; k < 3; k++) {
                                self._plane[i].cardList.shift();
                            }
                            valDiff -- ;
                            continue;
                        }
                        for (var k = 0; k < 3; k++) {
                            self._plane[i].cardList.pop();
                        }
                    }
                    return self.makeObj(self._plane[i], G.myGameRule.PLANE);
                }
            }
        }
    }
    return null;
}
gameLogic.prototype.tipResult = function(winc, isWinnerIsLandlord, winnerCardCount){
      var self = this;
      switch(winc.cardKind){
          case G.myGameRule.ONE://单牌
            var one = this.matchCards(self._one, G.myGameRule.ONE, winc, isWinnerIsLandlord, winnerCardCount);
            if(one)
              return one;
            else{
                var newlist = [];
                for(var i = self.cards.length - 1; i >= 0; i--){
                    if(self.cards[i].value > winc.value ){
                        newlist.push(self.cards[i].value);
                        break;
                    }
                }
                console.log("hi")
                if(newlist.length === 0){
                    return null;
                }
                 var newObject = {};
                 newObject.cardList = newlist;
                 return self.makeObj(newObject, G.myGameRule.ONE);
            }
        case G.myGameRule.PAIRS://对子
            var pairs;
            if(this._pairs.length > 0){
                pairs = this.matchCards(this._pairs, G.myGameRule.PAIRS, winc, isWinnerIsLandlord, winnerCardCount);
            }
            else{
                pairs = null;
            }
            if(pairs === null){//对手需要拆牌大之
                //从连对中拿对
                if(self._three.length > 0){
                    for (var i = self._three.length - 1; i >= 0 ; i--) {
                        if(self._three[i].value > winc.value){
                            return {cardList: self._three[i].cardList.slice(0, 2),
                                cardKind: G.myGameRule.PAIRS,
                                size: 2,
                                value: self._three[i].value};
                        }
                    }
                }
            }
            return pairs;
            case G.myGameRule.THREE://三根
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            return this.matchCards(this._three, G.myGameRule.THREE, winc, isWinnerIsLandlord, winnerCardCount);

        case G.myGameRule.THREE_WITH_ONE://三带一
             if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            var three = this.giveMinCards(this._three, G.myGameRule.THREE, winc.value);
            if(three){
                var one = this.giveMinCards(self._one, G.myGameRule.ONE, 2);
                while(1){
                    if(one){
                        if(one.cardList[0] === three.value){
                            one = this.giveMinCards(self._one, G.myGameRule.ONE, 2);
                        }
                        else{
                            break;
                        }
                    }
                    else{
                        break;
                    }
                }
                if(!one){
                    return null;
                } else {
                    three.cardList.push(one.cardList[0]);
                }
                three.cardKind = G.myGameRule.THREE_WITH_ONE;
                three.size = 4;
            }
            return three;
        if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            var three = this.giveMinCards(self._three, G.myGameRule.THREE, winc.value);
            if(three){
                var pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS);
                if(pairs)
                {
                if(pairs.cardList[0].value === three.value){
                    pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS, pairs.cardList[0].value);
                }
                if(pairs){
                    three.cardList = three.cardList.concat(pairs.cardList);
                    three.cardKind = G.myGameRule.THREE_WITH_PAIRS;
                    three.size = 5;
                }
                else {
                    return null;
                }
                }
                else
                    return null;

            }
            return three;
        case G.myGameRule.PROGRESSION://顺子
            for(var i = 0; i < self._progression.length; i++){
                if(self._progression[i].length === winc.cardList.length && self._progression[i].value > winc.value){
                    return self.makeObj(self._progression[i],  G.myGameRule.PROGRESSION);
                }
            }
            return null;
           // return self.giveMinCards(self._progression, G.myGameRule.PROGRESSION, winc.value);

        case G.myGameRule.PROGRESSION_PAIRS://连对
            return self.giveMinCards(self._progressionPairs, G.myGameRule.PROGRESSION_PAIRS, winc.value);
        case G.myGameRule.PLANE://三顺
            return self.minPlane(winc.size, winc);
        case G.myGameRule.PLANE_WITH_ONE: //飞机带单
            var cnt = winc.size / 4,
                plane = self.minPlane(cnt * 3, winc);
            if(plane){
                var currOneVal = 2;
                for (var i = 0; i < cnt; i++) {
                    var one = self.giveMinCards(this._one, plane.value);//拿一张单牌
                    if(one){
                        plane.cardList.push(one);
                        currOneVal = one.value;
                    } else {
                        return null;
                    }
                }
                plane.cardKind = G.myGameRule.PLANE_WITH_ONE;
                plane.size = plane.cardList.length;
            }
            return plane;
        case G.myGameRule.PLANE_WITH_PAIRS://飞机带对
            var cnt = winc.size / 5,
                plane = this.minPlane(cnt * 3, winc);
            if(plane){
                var currPairsVal = 2;
                for (var i = 0; i < cnt; i++) {
                    var pairs = this.giveMinCards(this._pairs, G.myGameRule.PAIRS, currPairsVal);//拿一对
                    if(pairs){
                        plane.cardList = plane.cardList.concat(pairs.cardList);
                        currPairsVal = pairs.value;
                    } else {
                        return null;
                    }
                }
                plane.cardKind = G.myGameRule.PLANE_WITH_PAIRS;
                plane.size = plane.cardList.length;
            }
            return plane;

        case G.myGameRule.BOMB://炸弹
            var bomb = self.giveMaxCards(self._bomb, G.myGameRule.BOMB, winc.value);
            if(bomb){
                return bomb;
            } else {
                if(self._kingBomb.length > 0){
                    if((isWinnerIsLandlord && winnerCardCount < 6)
                        || (self.player.isLandlord && self.player.cardList.length < 6)){
                        return this.makeObj(self._kingBomb[0], G.myGameRule.KING_BOMB);
                    }
                }
                return null;
            }
        case G.myGameRule.FOUR_WITH_TWO:
            return self.giveMinCards(self._bomb, G.myGameRule.BOMB, winc.value);
        case G.myGameRule.FOUR_WITH_TWO_PAIRS:
            return self.giveMinCards(self._bomb, G.myGameRule.BOMB, winc.value);
        case G.myGameRule.KING_BOMB:
            return null;
        default:
            return null;
    }
        
      

}
gameLogic.prototype.followResult = function(winc, isWinnerIsLandlord, winnerCardCount){
    var self = this;
    switch (winc.cardKind) {//判断牌型
        case G.myGameRule.ONE://单牌
            var one = this.matchCards(self._one, G.myGameRule.ONE, winc, isWinnerIsLandlord, winnerCardCount);
            if(!one){
                if(isWinnerIsLandlord || this.player.isLandlord){
                    for (var i = 0; i < self.cards.length; i++) {
                        if(self.cards[i].value <= 15 && self.cards[i].value > winc.value){
                            var tempblock = {cardList: self.cards.slice(i, i + 1),
                                cardKind: G.myGameRule.ONE,
                                size: 1,
                                value: self.cards[i].value};
                            return tempblock;
                        }
                    }
                }
                if(this._pairs.length > 0 && this._pairs[0].value > 10){//剩下一对大于10拆牌
                    //var c = this.cards.slice(0, 1);
                    for(var j = this._pairs.length - 1; j >= 0; j--)
                    {
                        if(this._pairs[j].value > winc.value)
                        {
                            return {cardList: this._pairs[j].cardList.slice(0, 1),
                                cardKind: G.myGameRule.ONE,
                                size: 1,
                                value: this._pairs[j].value};
                        }
                    }
                    return null;

                }
            }
            return one;
        case G.myGameRule.PAIRS://对子
            var pairs;
            if(this._pairs.length > 0){
                pairs = this.matchCards(this._pairs, G.myGameRule.PAIRS, winc, isWinnerIsLandlord, winnerCardCount);
            }
            else{
                pairs = null;
            }
            if(pairs === null && (isWinnerIsLandlord || self.player.isLandlord)){//对手需要拆牌大之
                //从连对中拿对
                if(self._three.length > 0){
                    for (var i = self._three.length - 1; i >= 0 ; i--) {
                        if(self._three[i].value > winc.value){
                            return {cardList: self._three[i].cardList.slice(0, 2),
                                cardKind: G.myGameRule.PAIRS,
                                size: 2,
                                value: self._three[i].value};
                        }
                    }
                }
            }
            return pairs;
        case G.myGameRule.THREE://三根
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            return this.matchCards(this._three, G.myGameRule.THREE, winc, isWinnerIsLandlord, winnerCardCount);

        case G.myGameRule.THREE_WITH_ONE://三带一
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            var three = this.giveMinCards(this._three, G.myGameRule.THREE, winc.value);
            if(three){
                var one = this.giveMinCards(self._one, G.myGameRule.ONE, 2);
                while(1){
                    if(one){
                        if(one.cardList[0] === three.value){
                            one = this.giveMinCards(self._one, G.myGameRule.ONE, 2);
                        }
                        else{
                            break;
                        }
                    }
                    else{
                        break;
                    }
                }
                if(!one){
                    return null;
                } else {
                    three.cardList.push(one.cardList[0]);
                }
                three.cardKind = G.myGameRule.THREE_WITH_ONE;
                three.size = 4;
            }
            return three;

        case G.myGameRule.THREE_WITH_PAIRS: //三带一对
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            var three = this.giveMinCards(self._three, G.myGameRule.THREE, winc.value);
            if(three){
                var pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS);
                if(pairs)
                {
                if(pairs.cardList[0].value === three.value){
                    pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS, pairs.cardList[0].value);
                }
                if(pairs){
                    three.cardList = three.cardList.concat(pairs.cardList);
                    three.cardKind = G.myGameRule.THREE_WITH_PAIRS;
                    three.size = 5;
                }
                else {
                    return null;
                }
                }
                else
                    return null;

            }
            return three;

        case G.myGameRule.PROGRESSION://顺子
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            return null;

        case G.myGameRule.PROGRESSION_PAIRS://连对
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            return null;

        case G.myGameRule.PLANE://三顺
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            return self.minPlane(winc.size, winc);
        case G.myGameRule.PLANE_WITH_ONE: //飞机带单
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            var cnt = winc.size / 4,
                plane = self.minPlane(cnt * 3, winc);
            if(plane){
                var currOneVal = 2;
                for (var i = 0; i < cnt; i++) {
                    var one = self.giveMinCards(this._one, plane.value);//拿一张单牌
                    if(one){
                        plane.cardList.push(one);
                        currOneVal = one.value;
                    } else {
                        return null;
                    }
                }
                plane.cardKind = G.myGameRule.PLANE_WITH_ONE;
                plane.size = plane.cardList.length;
            }
            return plane;
        case G.myGameRule.PLANE_WITH_PAIRS://飞机带对
            if(!isWinnerIsLandlord && !self.player.isLandlord){
                return null;
            }
            var cnt = winc.size / 5,
                plane = this.minPlane(cnt * 3, winc);
            if(plane){
                var currPairsVal = 2;
                for (var i = 0; i < cnt; i++) {
                    var pairs = this.giveMinCards(this._pairs, G.myGameRule.PAIRS, currPairsVal);//拿一对
                    if(pairs){
                        plane.cardList = plane.cardList.concat(pairs.cardList);
                        currPairsVal = pairs.value;
                    } else {
                        return null;
                    }
                }
                plane.cardKind = G.myGameRule.PLANE_WITH_PAIRS;
                plane.size = plane.cardList.length;
            }
            return plane;

        case G.myGameRule.BOMB://炸弹
            if(!isWinnerIsLandlord && !self.player.isLandlord){//同是农民不压炸弹
                return null;
            }
            var bomb = self.giveMaxCards(self._bomb, G.myGameRule.BOMB, winc.value);
            if(bomb){
                return bomb;
            } else {
                if(self._kingBomb.length > 0){
                    if((isWinnerIsLandlord && winnerCardCount < 6)
                        || (self.player.isLandlord && self.player.cardList.length < 6)){
                        return this.makeObj(self._kingBomb[0], G.myGameRule.KING_BOMB);
                    }
                }
                return null;
            }
        case G.myGameRule.FOUR_WITH_TWO:
            return self.giveMinCards(self._bomb, G.myGameRule.BOMB, winc.value);
        case G.myGameRule.FOUR_WITH_TWO_PAIRS:
            return self.giveMinCards(self._bomb, G.myGameRule.BOMB, winc.value);
        case G.myGameRule.KING_BOMB:
            return null;
        default:
            return null;
    }
}
gameLogic.prototype.follow = function(winc, isWinnerIsLandlord, winnerCardCount) {
    var self = this;
    var followResults = this.followResult(winc, isWinnerIsLandlord, winnerCardCount);
    //如果有炸弹，根据牌数量确定是否出
    if(followResults){
        if(!isWinnerIsLandlord && !self.player.isLandlord){
            if(winc.value <= 10){
                if(followResults.value >= 14 || winnerCardCount < 5){
                    return null;
                }
                else{
                    return followResults;
                }
            }
            else{
                return null;
            }
        }
        return followResults;
    } else if(winc.cardKind != G.myGameRule.BOMB && winc.cardKind != G.myGameRule.KING_BOMB
        && (self._bomb.length > 0 || self._kingBomb.length > 0)){
        if((isWinnerIsLandlord && winnerCardCount < 5)
            || (self.player.isLandlord && (self.player.cardList.length < 5 || (self.player.nextPlayer.cardList.length < 5 || self.player.nextPlayer.nextPlayer.cardList.length < 6)))){//自己只有两手牌或只有炸弹必出炸弹
            if(self._bomb.length > 0){
                return self.giveMinCards(self._bomb, G.myGameRule.BOMB);
            } else {
                return self.makeObj(self._kingBomb[0], G.myGameRule.KING_BOMB);
            }
        }
    } else {
        return null;
    }
}
gameLogic.prototype.offPairs = function (v, notEqual){
    var self = this,
        pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS, v);
    if(pairs) {
        while(1){
        if (pairs.cardList[0].value === notEqual) {
            pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS, pairs.cardList[0].value);
        }
        else
           break;
        }
       // return pairs.cardList[0];
    }
    if(pairs)
       return pairs.cardList[0];
    else
       return null;

}
gameLogic.prototype.deleteOne = function (card){
    for (var i = 0; i < this.cards.length; i++) {
        if(this.cards[i].value === card.value && this.cards[i].type === card.type){
            this.cards.splice(i, 1);
        }
    }
   this.cardsAnalyse();
}
gameLogic.prototype.minOne = function (v, notEq){
    var self = this,
        one = self.giveMinCards(self._one, G.myGameRule.ONE, v),
        oneFromPairs = self.offPairs(notEq);
    if(!one){//没有单根，找对
        if(oneFromPairs){
            self.deleteOne(oneFromPairs);
            return oneFromPairs;
        } else {
            return null;
        }
    } else {
        if(one.value > 14){//保留2和大小王
            if(oneFromPairs){
                self.deleteOne(oneFromPairs);
                return oneFromPairs;
            } else
                return null;
        } else {
            return one.cardList[0];
        }
    }
    return null;
};
/*gameLogic.prototype.minOne = function (v, notequal){
    var self = this;
    var one = this.giveMinCards(this._one, G.myGameRule.ONE, v);
    var splitPair = this.offPairs(v, notequal);
    if(!one){//没有单根，找对
       var pair = this.giveMinCards(this._pairs, G.myGameRule.PAIRS, v);
       if(pair)
       {
           if(splitPair){
               this.deleteOne(splitPair);
               return splitPair;
           }
           else
               return null;

       }
    } else {
        if(one.value > 14){//保留2和大小王
            if(splitPair){
                self.deleteOne(splitPair);
                return splitPair;
            } else
                return null;
        }
        else {
            return one.cardList[0];
        }
    }
    return null;
}*/
gameLogic.prototype.cardsWithMin = function (index){
    var self = this;
    var minCard = self.cards[index];
    //在单根里找
    for (var i = 0; i < this._one.length; i++) {
        if(this._one[i].value === minCard.value){
            return this.giveMinCards(this._one, G.myGameRule.ONE);
        }
    }
    //对子里找
    for (i = 0; i < this._pairs.length; i++) {
        if(this._pairs[i].value === minCard.value){
            return this.giveMinCards(self._pairs, G.myGameRule.PAIRS);
        }
    }
    //三根里找
    for (i = 0; i < self._three.length; i++) {
        if(self._three[i].value === minCard.value){
            return self.giveMinCards(self._three, G.myGameRule.THREE);
        }
    }
    //炸弹里找
    for (i = 0; i < self._bomb.length; i++) {
        if(self._bomb[i].value === minCard.value){
            return self.giveMinCards(self._bomb, G.myGameRule.BOMB);
        }
    }
    //三顺里找
    for (i = 0; i < self._plane.length; i++) {
        for (var j = 0; j < self._plane[i].cardList.length; j++) {
            if(self._plane[i].cardList[j].value === minCard.value && self._plane[i].cardList[j].type === minCard.type ){
                return self.giveMinCards(self._plane, G.myGameRule.PLANE);
            }
        }
    }
    //顺子里找
    for (i = 0; i < self._progression.length; i++) {
        for (var j = 0; j < self._progression[i].cardList.length; j++) {
            if(self._progression[i].cardList[j].value === minCard.value && self._progression[i].cardList[j].type === minCard.type ){
                return self.giveMinCards(self._progression, G.myGameRule.PROGRESSION);
            }
        }
    }
    //连对里找
    for (i = 0; i < self._progressionPairs.length; i++) {
        for (var j = 0; j < self._progressionPairs[i].cardList.length; j++) {
            if(self._progressionPairs[i].cardList[j].value === minCard.value && self._progressionPairs[i].cardList[j].type === minCard.type ){
                return self.giveMinCards(self._progressionPairs, G.myGameRule.PROGRESSION_PAIRS);
            }
        }
    }
    if(self._kingBomb.length > 0){
        return self.giveMinCards(self._kingBomb, G.myGameRule.KING_BOMB);
    }
}

gameLogic.prototype.play = function(landlordCardsCnt) {
    var self = this;
    for (var i = self.cards.length - 1; i >=0 ; i--) {
        var r = self.cardsWithMin(i);
        // if(typeof r === 'undefined')
        //    continue;
         if(!r){
               var newlist = [];
               newlist.push(self.cards[self.cards.length - 1]);
                 return self.makeObj(newlist, G.myGameRule.ONE);
        }
        if(r.cardKind === G.myGameRule.ONE){
            if(self._plane.length > 0){//三顺
                var plane = self.giveMinCards(self._plane, G.myGameRule.PLANE);
                var len = plane.cardList.length / 3;
                var currOneVal = 2;
                for (var i = 0; i < len; i++) {
                    var one = self.minOne(currOneVal, plane.value);//拿一张单牌
                    plane.cardList.push(one);
                    currOneVal = one.value;
                }
                return self.makeObj( plane, G.myGameRule.PLANE_WITH_ONE);
            }
            else if(self._three.length > 0){//三带一
   /*             var three = self.giveMinCards(self._three, G.myGameRule.THREE);
                var len = three.cardList.length / 3;
                var one = self.giveMinCards(self._one,G.myGameRule.ONE);//拿一张单牌
                if(one){
                    while(1){
                        if(one.value === three.cardList[0].value){
                            one = self.giveMinCards(self._one,G.myGameRule.ONE, one.value);
                        }
                        else{
                            break;
                        }
                    }
                    if(one){
                        three.cardList.push(one.cardList[0]);
                        return self.makeObj( three, G.myGameRule.THREE_WITH_ONE);
                    }
                }
                else
                   return null;*/

                var three = self.giveMinCards(self._three, G.myGameRule.THREE);
                var temp = three;
                //return three;
                var len = three.cardList.length / 3;
              /*  var one = null;
                for(var i = self.length - 1; i >= 0; i--){
                    if(self.cards[i].value != three.value){
                        one = self.cards[i];
                        break;
                    }
                }*/
                var one = self.minOne(2, three.value);//拿一张单牌
                if(one)
                {
                   three.cardList.push(one);
                   if(three.value < 14)
                      return self.makeObj(three, G.myGameRule.THREE_WITH_ONE);
                   else
                    return temp;

                }
                else
                   return temp;
               // if(three.value < 14)
                 //   return self.makeObj( three, G.myGameRule.THREE_WITH_ONE);
            }
            if(self.player.isLandlord){//坐庄打法
                //if(self.player.isLandlord){//坐庄打法
                    var myresult = self.giveMinCards(self._one, G.myGameRule.ONE);
                    if(myresult)
                        return myresult;
                    else{
                         
                            var newlist = [];
                            newlist.push(self.cards[self.cards.length - 1]);
                            var newObject = {};
                            newObject.cardList = newlist;
                            return self.makeObj(newObject, G.myGameRule.ONE);
    
                    }
               // }
            }
            else {
                    if(landlordCardsCnt < 2){

                        var myresult = self.giveMinCards(self._pairs, G.myGameRule.PAIRS);
                        if(myresult)
                            return myresult;
                          else{
                            console.log("kkk");
                            var newlist = [];
                            newlist.push(self.cards[self.cards.length - 1]);
                            var newObject = {};
                            newObject.cardList = newlist;
                            return self.makeObj(newObject, G.myGameRule.ONE);
    
                         }
                    }
                    var myresult = self.giveMinCards(self._one, G.myGameRule.ONE);
                    if(myresult)
                        return myresult;
                    else{
                         
                            var newlist = [];
                            newlist.push(self.cards[self.cards.length - 1]);
                            var newObject = {};
                            newObject.cardList = newlist;
                            return self.makeObj(newObject, G.myGameRule.ONE);
    
                    }

            }
        }
        else if(r.cardKind === G.myGameRule.THREE){
            var three = self.giveMinCards(self._three, G.myGameRule.THREE);
            var len = three.cardList.length / 3;
            if(self._one.length >= 0){//单根多带单
                var one = self.minOne(currOneVal, three.value);//拿一张单牌
                three.cardList.push(one);
                return self.makeObj( three, G.myGameRule.THREE_WITH_ONE);
            } else if(self._pairs.length > 0){
                var pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS, currPairsVal);//拿一对
                three.cardList = three.cardList.concat(pairs.cardList);
                return self.makeObj( three, G.myGameRule.THREE_WITH_PAIRS);
            } else {
                return self.makeObj( three, G.myGameRule.THREE);
            }
        } else if(r.cardKind === G.myGameRule.PLANE){
            var plane = self.giveMinCards(self._plane, G.myGameRule.PLANE);
            var len = plane.cardList.length / 3;
            if(self._one.length > len && self._pairs.length > len){
                if(self._one.length >= self._pairs.length){//单根多带单
                    var currOneVal = 2;
                    for (var i = 0; i < len; i++) {
                        var one = self.minOne(currOneVal, plane.value);//拿一张单牌
                        plane.cardList.push(one);
                        currOneVal = one.value;
                    }
                    return self.makeObj( plane, G.myGameRule.PLANE_WITH_ONE);
                } else {
                    var currPairsVal = 2;
                    for (var i = 0; i < len; i++) {
                        var pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS, currPairsVal);//拿一对
                        plane.cardList = plane.cardList.concat(pairs.cardList);
                        currPairsVal = pairs.value;
                    }
                    return self.makeObj( plane, G.myGameRule.PLANE_WITH_PAIRS);
                }
            } else if(self._pairs.length > len){
                var currPairsVal = 2;
                for (var i = 0; i < len; i++) {
                    var pairs = self.giveMinCards(self._pairs, G.myGameRule.PAIRS, currPairsVal);//拿一对
                    plane.cardList = plane.cardList.concat(pairs.cardList);
                    currPairsVal = pairs.value;
                }
                return self.makeObj( plane, G.myGameRule.PLANE_WITH_PAIRS);
            } else if(self._one.length > len){
                var currOneVal = 2;
                for (var i = 0; i < len; i++) {
                    var one = self.minOne(currOneVal, plane.value);//拿一张单牌
                    plane.cardList.push(one);
                    currOneVal = one.value;
                }
                return self.makeObj( plane, G.myGameRule.PLANE_WITH_ONE);
            } else {
                return self.makeObj( plane, G.myGameRule.PLANE);
            }
        }
        else {
            return r;
        }
    }
   
}

gameLogic.prototype.log = function (){
    var self = this;
    console.info('以下显示' + self.player.name );
    console.info('王炸');
    console.info(self._kingBomb);
    console.info('炸弹');
    console.info(self._bomb);
    console.info('三根');
    console.info(self._three);
    console.info('飞机');
    console.info(self._plane);
    console.info('顺子');
    console.info(self._progression);
    console.info('连对');
    console.info(self._progressionPairs);
    console.info('单牌');
    console.info(self._one);
    console.info('对子');
    console.info(self._pairs);
};
