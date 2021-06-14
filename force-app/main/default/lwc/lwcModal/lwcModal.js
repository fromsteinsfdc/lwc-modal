import { LightningElement, api, track } from 'lwc';
const ESC_KEY_CODE = 27;
const ESC_KEY_STRING = 'Escape';
const TAB_KEY_CODE = 9;
const TAB_KEY_STRING = 'Tab';
const COMPONENT_NAME = 'c-lwc-modal';
const LIGHTNING_BUTTON = 'lightning-button';

const CANCEL = 'cancel';
const CONFIRM = 'confirm';
const DEFAULT_CANCEL_BUTTON_LABEL = 'Cancel';
const DEFAULT_CONFIRM_BUTTON_LABEL = 'Confirm';
const DEFAULT_CONFIRM_BUTTON_VARIANT = 'brand';
const DEFAULT_HEADER = 'Confirm Action';

class Observable {
    constructor(functionThatThrowsValues) {
        this._functionThatThrowsValues = functionThatThrowsValues;
      }
    
      subscribe(observer) {     
        return this._functionThatThrowsValues(observer);     
      }     
}

export default class LwcModal extends LightningElement {

    myObservable = new Observable(observer => {
        setTimeout(() => {
          observer.next("got data!")
          observer.complete()
        }, 1000)
      })
      

    /* PUBLIC PROPERTIES */
    @api showModal;

    @api header;
    @api bodyText;
    @api cancelButtonLabel = DEFAULT_CANCEL_BUTTON_LABEL;
    @api confirmButtonLabel;
    @api confirmButtonVariant = DEFAULT_CONFIRM_BUTTON_VARIANT
    @api customButtons; // Reserved for future use

    @api isDefault;

    @track focusableElements = [];
    @track buttons = [];    
    focusIndex = 0;

    @api
    get confirmation() {
        return this._confirmation;
    }
    set confirmation(confirmation) {
        // console.log('in set confirmation: '+ JSON.stringify(confirmation));
        this._confirmation = confirmation || {};
        this.header = confirmation.header || DEFAULT_HEADER;
        this.bodyText = confirmation.text || this.bodyText;
        this.cancelButtonLabel = confirmation.cancelButtonLabel || DEFAULT_CANCEL_BUTTON_LABEL;
        this.confirmButtonLabel = confirmation.confirmButtonLabel || DEFAULT_CONFIRM_BUTTON_LABEL;
        this.confirmButtonVariant = confirmation.confirmButtonVariant || DEFAULT_CONFIRM_BUTTON_VARIANT;
    }
    _confirmation = {};

    /* PUBLIC FUNCTIONS */
    @api open() {
        this.rendered = false;
        this.showModal = true;
    }

    @api close() {
        this.showModal = false;
    }

    getNewConfirmation() {
        let getButtons = () => { return this.butons };
        let buttons = this.buttons;
        let confirmation = {
            buttons: getButtons,
            header: null, //details.header,
            text: null, //details.text,
            _rendered: false,
            _requested: false,
            set rendered(isRendered) {
                // console.log('setting confirmation rendered to '+ isRendered);
                this._rendered = isRendered;
                if (this._requested) {
                    // do something
                    console.log('buttons: '+ JSON.stringify(this.buttons));
                }
            },
            set requested(isRequested) {
                console.log('setting confirmation requested to '+ isRequested);
                this._requested = isRequested;
                if (this._rendered) {
                    // do something
                    console.log('buttons: '+ JSON.stringify(this.buttons));
                }
            }
        }
        return confirmation;
    }

    @api async confirm(details) {
        console.log('text = '+ details.text);
        this.confirmation = this.getNewConfirmation();        
        this.confirmation.requested = true;
        this.open();
        // console.log('broker = '+ JSON.stringify(this.broker));
        
        // if (this.broker.rendered) {
        //     this.getConfirmation();
        // }
        

        let promise = new Promise((resolve, reject) => {
            //setTimeout(() => resolve("done!"), 3000)
            this.loadModal(resolve, reject).then;
        });
        return promise;

        // let result = await promise;
        // return result;

        // this.load
        // return new Promise((resolve, reject) => {
        //     this.bodyText = details.text;
        //     this.open();
        //     this.template.querySelector(LIGHTNING_BUTTON).addEventListener('click', clickEvent => {
        //         console.log('click!');
        //         console.log(e.target.value);
        //         resolve(e.target.value);
        //     })
        // })
    }

    /* PRIVATE PROPERTIES */
    cancelValue = CANCEL;
    confirmValue = CONFIRM;
    rendered;

    // returns promise
    async getConfirmation() {

    }

    renderedCallback() {
        if (!this.rendered && this.showModal) {
            this.rendered = true;

            this.loadModal();                
        }
    }

    broker = {        
        rendered: false,
        requested: false
    }

    loadModal() {
        // if (!this.showModal) { this.open(); }
        // console.log('in loadModal');
        this.getFocusableElements();
        this.addButtonListeners();
    }

    addButtonListeners() {
        for (let el of this.buttons) {
            el.addEventListener('click', (e) => { this.handleButtonClick(e) });
            // el.addEventListener('click', (e) => { resolve(e.target.value) });
        }
    }

    getFocusableElements() {
        // console.log('in gfe');
        //const allSlotElements = [...this.querySelectorAll('*')];
        const focusableElements = [...this.querySelectorAll('*')].filter(el => el.tabIndex >= 0 && !el.disabled);
        const slotContentElements = focusableElements.filter(el => el.parentNode && el.parentNode.tagName.toLowerCase() == COMPONENT_NAME);
        const slotCustomButtons = focusableElements.filter(el => !el.parentNode || el.parentNode.tagName.toLowerCase() != COMPONENT_NAME);
        const standardButtons = this.template.querySelectorAll(LIGHTNING_BUTTON);
        // console.log('standardButtons.length = '+ standardButtons.length);
        this.buttons = [...standardButtons, ...slotCustomButtons];
        // console.log('buttons: '+ this.buttons);
        this.focusableElements = [...slotContentElements, ...this.buttons];        
        this.focusIndex = 0;
        // console.log('focus should be on '+ this.focusableElements[this.focusIndex].tagName);
        this.setFocus();
        // this.confirmation.rendered = true; // LEGACY from async
        // console.log('finished gf3');
        // for (let el of slotCustomButtons) {
        //     el.addEventListener('click', (e) => { this.handleButtonClick(e) });
        // }
    }

    setFocus() {
        // console.log('setting focus on '+ this.focusIndex);
        if (this.focusableElements[this.focusIndex])    // why do we need this again?
            this.focusableElements[this.focusIndex].focus();
    }

    // handleCancel() {
    //     this.close();
    // }

    // handleConfirmClick() {
    // }

    handleButtonClick(event) {
        // console.log('in handleButtonClick', this.cancelButtonLabel);
        let buttonValue = event.target.value;
        this.dispatchEvent(new CustomEvent('buttonclick', { detail: buttonValue }));
        if (buttonValue === this.cancelValue) {
            this.cancel();
            // this.dispatchEvent(new CustomEvent(this.cancelValue));
            // this.close();    
        } else if (buttonValue === this.confirmValue) {
            this.dispatchEvent(new CustomEvent(this.confirmValue));
        }
    }

    dispatchButtonclick(buttonValue) {
        this.dispatchEvent(new CustomEvent('buttonclick', { detail: buttonValue }));

    }

    cancel() {
        this.dispatchEvent(new CustomEvent(this.cancelValue));
        this.close();
    }

    handleKeyDown(event) {
        if (event.keyCode === ESC_KEY_CODE || event.code === ESC_KEY_STRING) {
            // this.close();
            this.cancel();
        } else if (event.keyCode === TAB_KEY_CODE || event.code === TAB_KEY_STRING) {
            event.stopPropagation();
            event.preventDefault();
            this.focusIndex += event.shiftKey ? -1 : 1;
            if (this.focusIndex >= this.focusableElements.length) {
                this.focusIndex = 0;
            }
            if (this.focusIndex < 0) {
                this.focusIndex = this.focusableElements.length - 1;
            }
            this.setFocus();
        }
    }


}