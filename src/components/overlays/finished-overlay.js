import { PLAY_STATES } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/overlay--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class FinishedOverlay extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="overlay--style-module">
        #container__finished_overlay {
          display: flex;
          flex-wrap: wrap;
          padding: 25px;
          background-color: rgba(0, 0, 0, 0.85);
          @apply --box-sizing-border-box;
        }

        .container__related_video {
          position: relative;
          background-size: cover;
          margin: 4px;
        }

        .container_related_overlay {
          display: none;
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          padding: 10px;
          @apply --box-sizing-border-box;
          font-size: 0.8vw;
          background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0) 75%);
          color: #FFFFFF;
        }

        .container__related_video:hover .container_related_overlay {
          display: block;
        }

        .container__related_video a:focus .container_related_overlay {
          display: block;
          outline: -webkit-focus-ring-color auto 5px;
        }

        .related_video__time {
          position: absolute;
          bottom: 3px;
          right: 3px;
          background: rgba(0, 0, 0, 0.75);
          padding: 3px;
        }
        .related_video__time.empty {
          display: none !important;
        }

        @media (max-width: 768px) {
          #container__finished_overlay {
            display: block;
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
          }
          .container__related_video {
            display: inline-block;
            border: 1px solid #FFFFFF;
            height: calc(100% - 8px) !important;
            width: 50%;
            max-height: 200px;
            top: calc(50% - 100px);
          }
          .container_related_overlay {
            display: block;
            font-size: 12px;
            white-space: normal;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      </style>

      <div id="container__finished_overlay" class="overlay" style$="visibility: [[ifThenElse(_isVisible, 'visible', 'hidden')]];">
        <template is="dom-repeat" items="[[relatedVideos]]">
          <div class="container__related_video" style$="height: calc([[_getHeight()]]); flex-basis: calc([[_getFlexBasis()]]); background-image: url('[[item.thumbnail]]');">
            <a href="[[item.url]]">
              <div class="container_related_overlay">
                <span>[[item.title]]</span>
                <span class$="related_video__time [[ifNotThen(item.duration, 'empty')]]">[[secondsToHms(item.duration)]]</span>
              </div>
            </a>
          </div>
        </template>
      </div>
    `;
  }

  static get is() { return 'finished-overlay'; }

  static get properties() {
    return {
      state: Object,
      relatedVideos: Array,
      _isVisible: {
        type: Boolean,
        computed: '_getIsVisible(state.playState)',
      },
    };
  }

  _getIsVisible(playState) {
    return playState === PLAY_STATES.FINISHED;
  }

  _getRows() {
    return Math.round(Math.sqrt(this.relatedVideos.length));
  }

  _getColumns() {
    return Math.ceil(Math.sqrt(this.relatedVideos.length));
  }

  _getFlexBasis() {
    /*
    * Calculate the flex-basis for each element.
    * Each element has 100% divided by the number of columns.
    * Further the margin of 4px (and an additional px for IE 🙄) needs to
    * be substracted each time in order to keep this width.
    */
    return '(100% - 5px * 2 * ' + this._getColumns() + ') / ' + this._getColumns();
  }

  _getHeight() {
    /*
    * Similar to the flexbasis the margin needs be calculated
    */
    return '(100% - 5px * 2 * ' + this._getRows() + ') / ' + this._getRows();
  }
}

window.customElements.define(FinishedOverlay.is, FinishedOverlay);
