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

    close(event) {
        if (event.target === event.currentTarget) {
            event.stopPropagation();
            this.domElement.remove();
        }
    }

    confirm(event) {
        this.close(event, this);
        this.confirmHandler();
    }

    reject(event) {
        this.close(event, this);
        this.rejectHandler();
    }

    render() {
        this.domElement = $('<div>', {class: 'modal'}).on('click', this.close);

        const modalContent = $('<div>', {class: 'modal-content'}).append(
            $('<div>', {class: 'modal-text'}).append(
                $('<span>', {text: this.text}))
        );

        const modalButtons = $('<div>', {class: 'modal-buttons'});

        const confirmButton = $('<button>', {class: 'modal-confirm', text: this.confirmButton});
        confirmButton.on('click', this.confirmHandler ? this.confirm : this.close);
        modalButtons.append(confirmButton);

        if (this.rejectButton) {
            const rejectButton = $('<button>', {class: 'modal-reject', text: this.rejectButton});
            rejectButton.on('click', this.rejectHandler? this.reject : this.close);
            modalButtons.append(rejectButton);
        }

        modalContent.append(modalButtons);
        this.domElement.append(modalContent);

        return this.domElement;
    }
}