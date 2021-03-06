import {ElementRef, Component, Directive} from 'angular2/angular2';
import {FormBuilder, Control, ControlGroup, Validators} from 'angular2/angular2';

import {App, Modal, Animation, Content} from 'ionic/ionic';
import {NavController, NavParams, IonicView} from 'ionic/ionic';
import {dom} from 'ionic/util';


@Directive({
  selector: '[parallax]',
  inputs: [
    'parallax',
    'counter'
  ]
})
export class ParallaxEffect {
  constructor(
    content: Content,
    elementRef: ElementRef
  ) {
    this.ele = elementRef.nativeElement;
    this.scroller = this.ele.querySelector('scroll-content');
    this.scroller.addEventListener('scroll', (e) => {
      //this.counter.innerHTML = e.target.scrollTop;
      dom.raf(() => {
        this.parallax.style[dom.CSS.transform] = 'translateY(' + -Math.min(300, (e.target.scrollTop / 4)) + 'px) scale(1)';

        if(e.target.scrollTop < 0) {
          this.parallax.style[dom.CSS.transform] = 'translateY(0) scale(' + (1 + Math.abs(e.target.scrollTop / 500)) + ')';
        }
      })

    });

    setTimeout(() => {
      console.log('Watching', this.target, this.counter);
    })
  }
}


@App({
  templateUrl: 'main.html',
  directives: [ParallaxEffect]
})
class IonicApp {
  constructor() {

    this.items = [];
    for(let i = 0; i < 100; i++) {
      this.items.push({
        title: 'Item ' + i
      })
    }
  }
}
