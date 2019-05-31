class Modal {
    constructor(options) {
        this.domElement = null;

        this.text = options.text;
        this.confirmButton = options.confirmButton;
        this.confirmHandler = options.confirmHandler;
        this.rejectButton = options.rejectButton;
        this.rejectHandler = options.rejectHandler;

        this.confirm = this.confirm.bind(this);
        this.reject = this.reject.bind(this);
        this.close = this.close.bind(this);
    }

    close() {
        setTimeout(() => {
            this.domElement.remove();
        }, 25);
    }

    confirm() {
        this.close();
        this.confirmHandler();
    }

    reject() {
        this.close();
        this.rejectHandler();
    }

    render() {
        this.domElement = $('<div>', {class: 'modal'});

        const shadow = $('<div>', {class: 'modal-shadow'}).on('click', this.close);

        const modalContent = $('<div>', {class: 'modal-content'}).append(
            $('<div>', {class: 'modal-text'}).append(
                $('<span>', {text: this.text}))
        );

        const modalButtons = $('<div>', {class: 'modal-buttons'});

        const confirmButton = $('<button>', {id: 'modal-confirm', text: this.confirmButton, class: 'modal-button'});
        confirmButton.on('click', this.confirmHandler ? this.confirm : this.close);
        modalButtons.append(confirmButton);

        if (this.rejectButton) {
            const rejectButton = $('<button>', {id: 'modal-reject', text: this.rejectButton, class: 'modal-button'});
            rejectButton.on('click', this.rejectHandler ? this.reject : this.close);
            modalButtons.append(rejectButton);
        }

        modalContent.append(modalButtons);
        this.domElement.append(shadow, modalContent);

        return this.domElement;
    }
}