class Modal {
    constructor(options) {
        this.domElement = null;

        this.text = options.text;
        this.confirmHandler = options.confirmHandler;
        this.confirmButtonText = options.confirmButtonText;

        this.rejectHandler = options.rejectHandler;
        this.rejectButtonText = options.rejectButtonText;

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

        const confirmButton = $('<button>', {class: 'modal-confirm', text: this.confirmButtonText});
        confirmButton.on('click', this.confirm);
        modalButtons.append(confirmButton);

        if (this.rejectButtonText) {
            const rejectButton = $('<button>', {class: 'modal-reject', text: this.rejectButtonText});

            if (this.rejectHandler) {
                rejectButton.on('click', this.reject);
            } else {
                rejectButton.on('click', this.close);
            }

            modalButtons.append(rejectButton);
        }

        modalContent.append(modalButtons);
        this.domElement.append(modalContent);

        return this.domElement;
    }
}