const getConfirmation2 = (modalEl, details, onconfirm, oncancel) => {
    console.log('in getConfirmation');
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

export { getConfirmation2, getModalDetails }