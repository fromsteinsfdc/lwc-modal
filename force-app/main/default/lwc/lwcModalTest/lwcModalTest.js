import { LightningElement, track } from 'lwc';
import { getConfirmation, handleConfirmationButtonClick } from 'c/lwcModalUtil';

export default class LwcModalTest extends LightningElement {
    // List of the item objects. Starting with a few sample values for demo purposes.
    @track items = [
        { id: '00000001', name: 'First' },
        { id: '00000002', name: 'Second' },
        { id: '00000003', name: 'Third' }
    ];
    numItems = 0;

    // 
    @track confirmation;

    // Getters for each of the 3 modal components in the markup
    get confirmationModal() {
        return this.template.querySelector('c-lwc-modal.confirmation');
    }

    get explainerModal() {
        return this.template.querySelector('c-lwc-modal.explainer');
    }

    get addItemModal() {
        return this.template.querySelector('c-lwc-modal.addItem');
    }

    handleDeleteClick(event) {
        // Get the item's position in the list of items (deleteIndex) and the display label (deleteName)
        let deleteIndex = event.currentTarget.dataset.index;
        let deleteName = event.currentTarget.dataset.name;

        // Define the properties of our confirmation modal
        let modalDetails = {
            text: 'Are you sure you want to delete item "'+ deleteName +'"?',  // Modal body text
            confirmButtonLabel: 'Delete',   // Label for the Confirm button
            confirmButtonVariant: 'destructive',    // Variant for the Confirm button
            cancelButtonLabel: 'Eh, I guess not',   // Label for the Cancel button
            header: 'Confirm Delete'    // Modal header text
        };

        this.confirmation = getConfirmation(
            // this.confirmationModal,
            modalDetails,
            () => this.deleteRow(deleteIndex),
            () => console.log('cancel!')
        );
    }

    // The next two functions are called when the "What is this?" and "Add item" buttons are clicked, respectively
    // They each call the open() function on their assigned modal component
    // Note that we don't need to handle closing the modal, the modals handle that themselves
    handleExplainerClick() {
        this.explainerModal.open();
    }
    handleAddItemClick() {
        this.addItemModal.open();
    }

    // This is the function called to handle the confirmation modal's custom onbuttonclick event
    handleConfirmationButtonClick(event) {
        // We pass the event to the function in the utility class along with the confirmation object
        handleConfirmationButtonClick(event, this.confirmation);
    }

    // Demo component functions
    handleAddItemConfirm(event) {
        let itemName = this.addItemModal.querySelector('lightning-input').value;
        if (itemName) {
            let now = Date.now().toString();
            now = now.substring(now.length - 10);
            this.items.push({
                id: now,
                name: itemName
            })
            this.addItemModal.close();
        }
    }

    deleteRow(rowIndex) {
        console.log('going to delete row ' + rowIndex);
        this.items.splice(rowIndex, 1);
    }
}