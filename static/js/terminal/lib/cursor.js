/**
 * Created by nuintun on 2015/11/24.
 */

'use strict';

module.exports = function (Terminal){
  /**
   * showCursor
   */
  Terminal.prototype.showCursor = function (){
    if (this.cursor) {
      this._cursor = true;
      this.cursorState = 1;

      this.refresh(this.y, this.y);
    }
  };

  /**
   * hideCursor
   */
  Terminal.prototype.hideCursor = function (){
    if (this._cursor) {
      delete this._cursor;

      this.cursorState = 0;

      if (this._blink && this._blinker) {
        clearInterval(this._blink);

        delete this._blink;
        delete this._blinker;
      }

      this.refresh(this.y, this.y);
    }
  };

  /**
   * startBlink
   */
  Terminal.prototype.startBlink = function (){
    if (this.cursor && this.cursorBlink && Terminal.focus === this) {
      var context = this;

      this.stopBlink();
      this._blinker = function (){
        context.cursorState ^= 1;

        context.refresh(this.y, this.y);
      };

      this._blink = setInterval(this._blinker, this.cursorBlinkSpeed);
    }
  };

  /**
   * stopBlink
   */
  Terminal.prototype.stopBlink = function (){
    if (this._blink && this._blinker) {
      clearInterval(this._blink);

      delete this._blink;
      delete this._blinker;

      if (this.cursor && this._cursor) {
        this.cursorState = 1;
      } else {
        this.cursorState = 0;
      }

      this.refresh(this.y, this.y);
    }
  };
};
