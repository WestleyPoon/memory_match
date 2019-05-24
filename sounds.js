class Sounds {
    constructor() {
        this.sounds = {
            fanfare: new Audio('sounds/fanfare.mp3'),
            beep: new Audio('sounds/beep.mp3'),
            beep2: new Audio('sounds/beep.mp3'),
            right: new Audio('sounds/right.mp3'),
            wrong: new Audio('sounds/wrong.mp3'),
            bgm: new Audio('sounds/azalea.mp3'),
        };

        this.setVolume();

        this.playSound = this.playSound.bind(this);
        this.toggleBGM = this.toggleBGM.bind(this);
    }

    setVolume() {
        this.sounds.fanfare.volume = .35;
        this.sounds.beep.volume = .5;
        this.sounds.beep.volume = .5;
        this.sounds.right.volume = .7;
        this.sounds.wrong.volume = .5;
        this.sounds.bgm.volume = .25;
    }

    playSound(sound) {
        this.sounds[sound].play();
    }

    toggleBGM() {
        this.sounds.bgm.muted = !this.sounds.bgm.muted;
    }
}