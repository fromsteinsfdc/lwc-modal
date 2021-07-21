import { LightningElement, api, track } from 'lwc';
const ESC_KEY_CODE = 27;
const ESC_KEY_STRING = 'Escape';
const TAB_KEY_CODE = 9;
const TAB_KEY_STRING = 'Tab';
const LIGHTNING_BUTTON = 'lightning-button';

const CANCEL = 'cancel';
const CONFIRM = 'confirm';
const DEFAULT_CANCEL_BUTTON_LABEL = 'Cancel';
const DEFAULT_CONFIRM_BUTTON_LABEL = 'Confirm';
const DEFAULT_CONFIRM_BUTTON_VARIANT = 'brand';
const DEFAULT_HEADER = 'Confirm';
const CUSTOM_BUTTON_CLASS = 'customButton';

const VALIDATEABLE_COMPONENTS = ['input', 'combobox', 'checkbox', 'dual-listbox', 'radio-group', 'slider'];
const LIGHTNING_COMPONENT_PREFIX = 'lightning-';

export default class LwcModal extends LightningElement {
    static delegatesFocus = true; // Does this do anything?

    /* PUBLIC PROPERTIES */
    @api showModal;

    @api header;
    @api bodyText;
    @api cancelButtonLabel = DEFAULT_CANCEL_BUTTON_LABEL;
    @api confirmButtonLabel;
    @api confirmButtonVariant = DEFAULT_CONFIRM_BUTTON_VARIANT
    @api customButtons; // Reserved for future use
    @api isDefault;
    @api validateOnConfirm;

    @api focusSelectorString;

    /* PUBLIC GETTERS/SETTERS */
    @api 
    get isConfirmationModal() {
        return this._isConfirmationModal;
    }
    set isConfirmationModal(isConfirmationModal) {
        this._isConfirmationModal = isConfirmationModal;
        // console.log('isConfirmationModal', isConfirmationModal);
    }
    _isConfirmationModal;

    @api 
    get focusIndex() {
        return this._focusIndex;
    }
    set focusIndex(newIndex) {
        console.log('focusIndex is being set to '+ newIndex);
        this._focusIndex = newIndex;
        // let focusElement = this.focusableElements[this._focusIndex];
        // focusElement.focus();
    }
    _focusIndex = 0;

    @api
    get confirmation() {
        return this._confirmation;
    }
    set confirmation(confirmation) {
        this._confirmation = confirmation || {};
        this.header = confirmation.header || DEFAULT_HEADER;
        this.bodyText = confirmation.text || this.bodyText;
        console.log('confirmation.cancelButtonLabel = '+ confirmation.cancelButtonLabel);
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
        for (let el of this.focusableElements) {            
            // el.removeEventListener('focus', (e) => { this.handleElementFocus(e) });
            let newEl = el.cloneNode(true);
            let parentEl = el.parentNode;
            if (parentEl) {
                console.log(el.tagName +' parentNode is '+ parentEl.tagName);
            }
        }

        this.showModal = false;        
    }

    @api
    focusElement(el) {
        console.log('in focusElement');
        if (el) {
            console.log('focusing on '+ el);
            el.focus();
            return true;
        }
        return false;
    }

    @api
    focusSelector(selector) {
        this.updateFocusableElements();
        console.log('In focusSelector, selector = '+ selector);
        const selectedElement = this.querySelector(selector);
        console.log('selectedElement = '+ selectedElement);
        if (selectedElement && selectedElement.tabIndex >= 0 && !selectedElement.disabled) {
            selectedElement.focus();
            return true;
        }
        return false;
    }   

    @api validate() {
        // let els = VALIDATEABLE_COMPONENTS.map(tagName => this.querySelectorAll(LIGHTNING_COMPONENT_PREFIX + tagName))
        let allValid = true;
        for (let el of this.querySelector(LIGHTNING_COMPONENT_PREFIX + tagName)) {
            allValid = allValid && el.reportValidity();
        }
        return allValid;
    }

    /* PRIVATE PROPERTIES */
    @track focusableElements = [];
    @track buttons = [];    
    cancelValue = CANCEL;
    confirmValue = CONFIRM;
    rendered;

    renderedCallback() {
        if (!this.rendered && this.showModal) {
            this.rendered = true;
            this.loadModal();                
        } else if (this.focusSelectorString) {
            console.log('in renderedCallback, focusSelectorString = '+ this.focusSelectorString);
            this.focusSelector(this.focusSelectorString);
            this.focusSelectorString = null;
        }
    }

    loadModal() {
        // this.updateFocusableElements();
        this.focusIndex = 0;
        this.setFocus();
    }

    isFocusable(el) {
        return el.tabIndex >= 0 && !el.disabled;
    }

    updateFocusableElements() {
        const focusableElements = [...this.querySelectorAll('*')].filter(el => this.isFocusable(el));   // Select all slot elements that can receive focus (tabIndex >= 0) and are not disabled
        const slotContentElements = focusableElements.filter(el => !el.classList.contains(CUSTOM_BUTTON_CLASS));    // Select the ones not marked with the custom button class
        const slotCustomButtons = focusableElements.filter(el => el.classList.contains(CUSTOM_BUTTON_CLASS));   // Select the ones marked as custom buttons
        const standardButtons = this.template.querySelectorAll(LIGHTNING_BUTTON);   // Select the standard buttons: cancel and (if present) confirm
        this.buttons = [...standardButtons, ...slotCustomButtons];  // Append any custom buttons after the standard buttons
        this.focusableElements = [...slotContentElements, ...this.buttons]; // Ordering focusable elements so the tab order is: slot content elements, standard buttons, slot custom buttons   
        // console.log('Finished updateFocusableElements. There are '+ standardButtons.length +' standard buttons, '+ slotCustomButtons.length +' custom buttons, and '+ slotContentElements.length +' focusable slot elements');
        this.addButtonListeners();
        this.addFocusListeners();
    }

    addFocusListeners() {
        let index = 0;
        for (let el of this.focusableElements) {            
            el.dataset.focusIndex = index;
            index++;
            // el.addEventListener('focus', (e) => { this.handleElementFocus(e) });
            el.addEventListener('focus', this.handleElementFocus);
        }
    }

    addButtonListeners() {
        for (let el of this.buttons) {
            // el.addEventListener('click', (e) => { this.handleButtonClick(e) });
            el.addEventListener('click', this.handleButtonClick);
        }
    }


    setFocus() {
        this.updateFocusableElements();
        if (this.focusableElements[this.focusIndex])
            this.focusableElements[this.focusIndex].focus();
    }

    handleButtonClick = (event) => {
        // console.log('in handle buttonclick');
        let buttonValue = event.currentTarget.value;
        // console.log('buttonValue = '+ buttonValue);
        this.dispatchEvent(new CustomEvent('buttonclick', { detail: buttonValue }));
        if (buttonValue === this.cancelValue) {
            this.cancel();
        } else if (buttonValue === this.confirmValue) {            
            if (!this.validateOnConfirm || this.validate())
                this.dispatchEvent(new CustomEvent(this.confirmValue, { detail: buttonValue }));
        }
    }

    handleElementFocus = (event) => {
        // console.log('setting focus in '+ event.currentTarget.tagName +' to '+ event.currentTarget.dataset.focusIndex);
        this.focusIndex = event.currentTarget.dataset.focusIndex;
    }

    handleModalFocus(event) {
        // console.log('in handleModalFocus');
        // console.log('currentTarget = '+ event.currentTarget.tagName, 'target = '+ event.target.tagName);
    }

    dispatchButtonclick(buttonValue) {
        this.dispatchEvent(new CustomEvent('buttonclick', { detail: buttonValue }));
    }

    cancel() {
        this.dispatchEvent(new CustomEvent(this.cancelValue));
        this.close();
    }

    handleSlotChange (e) {
        // console.log("New slotted content has been added or removed!");
     }
     
     handleKeyDown(event) {
        if (event.keyCode === ESC_KEY_CODE || event.code === ESC_KEY_STRING) {
            event.stopPropagation();
            event.preventDefault();
            // this.close();
            this.cancel();
        } else if (event.keyCode === TAB_KEY_CODE || event.code === TAB_KEY_STRING) {
            console.log('in tab keydown');
            event.stopPropagation();
            event.preventDefault();
            let newIndex = Number(this.focusIndex) + (event.shiftKey ? -1 : 1);
            console.log('newIndex = '+ newIndex, 'focusEls.length = '+ this.focusableElements.length);
            if (newIndex >= this.focusableElements.length) {
                newIndex = 0;
            } else if (newIndex < 0) {
                newIndex = this.focusableElements.length - 1;
            }
            this.focusIndex = newIndex;
            this.setFocus();
        }
    }

    /* Moved into setFocus()
    getFocusableElements() {
        const focusableElements = [...this.querySelectorAll('*')].filter(el => el.tabIndex >= 0 && !el.disabled);
        const slotContentElements = focusableElements.filter(el => !el.classList.contains(CUSTOM_BUTTON_CLASS));
        const slotCustomButtons = focusableElements.filter(el => el.classList.contains(CUSTOM_BUTTON_CLASS));
        const standardButtons = this.template.querySelectorAll(LIGHTNING_BUTTON);
        this.buttons = [...standardButtons, ...slotCustomButtons];
        this.focusableElements = [...slotContentElements, ...this.buttons]; // Ordering focusable elements so the tab order is: slot content elements, standard buttons, slot custom buttons           
    }
    */

     /* no longer in use
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
        
        let promise = new Promise((resolve, reject) => {
            //setTimeout(() => resolve("done!"), 3000)
            this.loadModal(resolve, reject).then;
        });
        return promise;
    }
    */
}