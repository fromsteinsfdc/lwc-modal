const CANCEL = 'cancel';
const CONFIRM = 'confirm';

const getConfirmation = (modalEl, details, onconfirm, oncancel) => {
    console.log('in getConfirmation');
    console.log('details = '+ JSON.stringify(details));

    console.log('onconfirm = '+ onconfirm);
    let confirmation = {
        onconfirm: onconfirm,
        oncancel: oncancel
    }
    console.log('confirmation = '+ JSON.stringify(confirmation));
    if (details) {
        if (typeof details === 'string') {
            confirmation.text = details;
        } else {
            confirmation.text = details.text;
            confirmation.confirmButtonLabel = details.confirmButtonLabel;
            confirmation.confirmButtonVariant = details.confirmButtonVariant;
            confirmation.header = details.header;
        }
    }
    modalEl.open();
    return confirmation;
}

const getModalDetails = (text, confirmButtonLabel, confirmButtonVariant, header, cancelButtonLabel) => {
    return {
        text: text,
        confirmButtonLabel: confirmButtonLabel,
        confirmButtonVariant: confirmButtonVariant,
        header: header,
        cancelButtonLabel: cancelButtonLabel
    }
}

const handleConfirmationButtonClick = (event) => {
    if (event.detail === CANCEL) {
        if (this.confirmation && this.confirmation.oncancel)
            this.confirmation.oncancel();
    } else if (event.detail === CONFIRM) {
        if (this.confirmation && this.confirmation.onconfirm)
            this.confirmation.onconfirm();
        this.defaultModal.close();
    }
}

export { getConfirmation, getModalDetails, handleConfirmationButtonClick, CANCEL, CONFIRM }