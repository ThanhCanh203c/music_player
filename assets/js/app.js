/* 
    1. Render songs x
    2. Scroll top x
    3. Play / pause / seek x
    4. CD rotate x
    5. Next / prev x
    6. Random x
    7. Next / Repeat when ended x
    8. Active song x 
    9. Scroll active song into view x
    10. Play song when click x
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const prevBtn = $('.btn-prev');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progressbar = $('.progress');
const currentTime = $('.progress-current');
const currentDuration = $('.progress-duration');
const playlist = $('.playlist');

var app = {
    currentIndex: 2,
    isRandom: false,
    isRepeat: false,
    isPlaying: false,
    songs: [
        {
            name: 'Hướng Dương',
            singer: 'Changg',
            path: './music/changg_huong_duong.mp3',
            image: './img/huong_duong_changg.jpg'
        },
        {
            name: 'Em không hiểu',
            singer: 'Changg',
            path: './music/changg_em_khong_hieu.mp3',
            image: './img/em_khong_hieu_changg_ft_minhhuy.jpg'
        },
        {
            name: 'Lỡ say bye là bye',
            singer: 'Lemese x Changg',
            path: './music/lemese_x_changg_lo_say_bye_la_bye.mp3',
            image: './img/lo_say_bye_la_bye_changg_lemese.jpg'
        },
        {
            name: 'Sài gòn đâu có lạnh',
            singer: 'Changg x LeWiuy',
            path: './music/sai_gon_dau_co_lanh_changg.mp3',
            image: './img/sai_gon_dau_co_lanh_changg_lewiuy.jpg'
        },
        {
            name: 'Yêu lâu có chán không',
            singer: 'Changg',
            path: './music/changg_yeu_lau_co_chan_khong.mp3',
            image: './img/yeu_lau_co_chan_khong_changg.jfif'
        },
        {
            name: 'Quá non',
            singer: 'The Fillin x Changg ',
            path: './music/the_fillin_changg_qua_non.mp3',
            image: './img/qua_non_changg_fillin.jfif'
        },
        {
            name: 'Tuesday',
            singer: 'Minchu x Changg x Liu Grace',
            path: './music/minchu_changg_liugrace_tuesday.mp3',
            image: './img/tuesday_changg_minchu_liugrace.jpg'
        },
        {
            name: 'Changg live liên khúc',
            singer: 'Changg',
            path: './music/changg_hat_live_lien_khuc_em_khong_hieu_huong_duong_lo_say_bye_la_bye.mp3',
            image: './img/changg_live.jpg'
        }
    ],
    render: function () {
        let that = this;
        let htmls = this.songs.map(function (song, index) {
            return `
            <div class="song${index === that.currentIndex ? ' active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        });

        playlist.innerHTML = htmls.join('');;
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const that = this;
        const cdWidth = cd.clientWidth;

        // cd rotate
        let cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 12000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // hide cd when scroll
        document.onscroll = function () {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            var newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        // when click play
        playBtn.onclick = function () {
            if (that.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // when music is playing
        audio.onplay = function () {
            that.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // when music is pause
        audio.onpause = function () {
            that.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // when click next
        nextBtn.onclick = function () {
            if (that.isRandom) {
                that.randomSong();
            } else {
                that.nextSong();
            }
            audio.play();
        }

        // when click previous
        prevBtn.onclick = function () {
            if (that.isRandom) {
                that.randomSong();
            } else {
                that.prevSong();
            }
            audio.play();
        }

        // progressbar value change
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                // progress bar
                progressbar.value = progressPercent;
                progressbar.style.background = `linear-gradient(90deg, #66BB6A 0%, #66BB6A ${progressPercent}%, #d3d3d3 ${progressPercent}%, #d3d3d3 100%)`;

                // progress text
                let timeText = that.convertToMinutes(audio.currentTime);
                let durationText = that.convertToMinutes(audio.duration);
                currentTime.innerHTML = timeText;
                currentDuration.innerHTML = durationText;
            }
        }

        // handle seek progressbar
        progressbar.oninput = function () {
            let seekTime = audio.duration * progressbar.value / 100;
            audio.currentTime = seekTime;

        }

        // when click random btn
        randomBtn.onclick = function () {
            that.isRandom = !that.isRandom;
            randomBtn.classList.toggle('active', that.isRandom);
        }

        // when click repeat btn
        repeatBtn.onclick = function () {
            that.isRepeat = !that.isRepeat;
            repeatBtn.classList.toggle('active', that.isRepeat);
        }

        // handle when audio ended\
        audio.onended = function () {
            if (that.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        
        // handle when click on song
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    that.currentIndex = Number(songNode.dataset.index);
                    that.loadCurrentSong();
                    that.loadActiveSong();
                    audio.play();
                }

                if (e.target.closest('.option')) {

                }
            }
        }
    },

    loadCurrentSong: function () {
        let currentSong = this.currentSong;

        heading.innerHTML = currentSong.name;
        cdThumb.style.backgroundImage = `url(${currentSong.image})`;
        audio.src = currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadActiveSong();
        this.scrollToActiveSong();
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadActiveSong();
        this.scrollToActiveSong();
        this.loadCurrentSong();
    },

    randomSong: function () {
        let newSongIndex;
        do {
            newSongIndex = Math.floor(Math.random() * this.songs.length);
        } while (newSongIndex === this.currentIndex);

        this.currentIndex = newSongIndex;
        this.loadCurrentSong();
    },

    convertToMinutes: function (seconds) {
        let minues = Math.floor(seconds / 60);
        let secondRest = Math.floor(seconds % 60);

        let htmls = `${minues < 10 ? 0 : ''}${minues}:${secondRest < 10 ? 0 : ''}${secondRest}`;

        return htmls;
    },

    scrollToActiveSong: function () {
        let songActive = $('.song.active');
        setTimeout(() => {
            if (this.currentIndex <= 2) {
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            } else {
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }
        }, 400);

    },

    loadActiveSong: function () {
        $('.song.active').classList.remove('active');
        $(`.song[data-index="${this.currentIndex}"]`).classList.add('active');
    },

    loadStorageData() {

    },

    start: function () {
        // define properties
        this.defineProperties();

        // hande events
        this.handleEvents();

        // load first song
        this.loadCurrentSong();

        // render songs
        this.render();
    }
}

app.start();