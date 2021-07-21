import { LightningElement, track } from 'lwc';
import { getConfirmation, getModalDetails, handleConfirmationButtonClick, CANCEL, CONFIRM } from 'c/lwcModalUtil';

export default class LwcModalTest extends LightningElement {
    @track items = [
        { id: '00000', name: 'First' },
        { id: '00001', name: 'Second' },
        { id: '00002', name: 'Third' }
    ];
    numItems = 0;

    @track confirmation = {};

    connectedCallback() {
        // this.resetItems();
    }

    get confirmationModal() {
        return this.template.querySelector('c-lwc-modal.confirmation');
    }

    get explainerModal() {
        return this.template.querySelector('c-lwc-modal.explainer');
    }

    get addItemModal() {
        return this.template.querySelector('c-lwc-modal.addItem');
    }

    resetItems() {
        let newItems = []
        // this.items = [];
        for (let i = 0; i < this.numItems; i++) {
            // this.items.push(i);
            newItems.push(i);
            console.log(newItems[i]);
        }
        this.items = newItems;
    }

    handleReset() {
        // this.resetItems();
    }

    handleDeleteClick(event) {
        let deleteIndex = event.currentTarget.dataset.index;
        let deleteName = event.currentTarget.dataset.name;
        
        let modalDetails = getModalDetails(
            'Are you sure you want to delete item '+ deleteName +'?',
            'Delete',
            'destructive',
            'Confirm Delete',
            'Abort!!'
        );

        this.confirmation = getConfirmation(
            this.confirmationModal, 
            modalDetails, 
            () => this.deleteRow(deleteIndex), 
            () => console.log('cancel!')
        );
    }

    handleConfirmationButtonClick(event) {
        console.log('in handleConfirmationButtonClick');
        console.log('confirmation = ' + JSON.stringify(this.confirmation));
        if (event.detail === CANCEL) {
            if (this.confirmation && this.confirmation.oncancel) {
                this.confirmation.oncancel();

            }
        } else if (event.detail === CONFIRM) {
            if (this.confirmation && this.confirmation.onconfirm) {
                this.confirmation.onconfirm();
            }
            this.confirmationModal.close();
        }
    }

    handleExplainerClick() {
        this.explainerModal.open();
    }

    handleExplainerConfirmClick() {
        let modalDetails = getModalDetails('DO YOU HAVE ANY IDEA WHAT YOURE ABOUT TO DO???', 'Yup', 'brand', 'Confirm?', 'Abort!!');
        this.confirmation = getConfirmation(this.confirmationModal, modalDetails, () => console.log('IT IS DONE!'), () => console.log('cancel!'));
    }

    handleAddItemClick() {
        this.addItemModal.open();
    }

    handleAddItemConfirm(event) {
        console.log('in handleAddItemConfirm');
        let itemName = this.addItemModal.querySelector('lightning-input').value;
        console.log('Item name = '+ itemName);
        if (itemName) {
            let now = Date.now().toString();
            now = now.substring(now.length - 10);
            this.items.push({
                // id: (this.items.length + 1).toString().padStart(5, '0'),
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