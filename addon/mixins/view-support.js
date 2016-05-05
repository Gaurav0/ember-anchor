import Ember from 'ember';
import { injectConfig } from './controller-support';

const { Mixin, run: { scheduleOnce }, computed } = Ember;
const { oneWay } = computed;

export default Mixin.create({
  _anchorConfig: injectConfig(),
  anchorQueryParam: oneWay('_anchorConfig.anchorQueryParam'),
  anchor: '',

  init() {
    this._super(...arguments);
    let controllerProp = this.get('_queryParam');
    this.addObserver(controllerProp, this, this._onQpChanged);
  },

  _onQpChanged() {
    let controllerProp = this.get('_queryParam');
    let elem = Ember.$(`[data-${this.get(controllerProp)}]`);
    if (!elem) {
      return;
    }
    scheduleOnce('afterRender', this, this._scrollToElemPosition);
  },

  didInsertElement() {
    this._super(...arguments);
    this._scrollToElemPosition();
  },

  _scrollToElemPosition() {
    let qp = this.get('_queryParam');
    let qpVal = this.get(qp);
    let elem = Ember.$(`[data-${qp}="${qpVal}"]`);
    let offset = (elem && elem.offset && elem.offset()) ? elem.offset().top : null;
    if (offset) {
      Ember.$('body').scrollTop(offset);
    }
  },

  _queryParam: computed('anchorQueryParam', 'a', function() {
    let aqp = this.get('anchorQueryParam') || 'anchor';
    let qp = this.get(!!Ember.get(this, 'attrs.a') ? 'a' : aqp);
    return qp || 'anchor';
  })

});
