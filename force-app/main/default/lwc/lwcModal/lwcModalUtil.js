const getConfirmation = (modalEl, details, onconfirm, oncancel) => {
    let confirmation = {
        onconfirm: onconfirm,
        oncancel: oncancel
    }
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

export { getConfirmation }