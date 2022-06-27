/* 
    1. Render songs
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('audio');
const playBtn = $('.btn.btn-toggle-play');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const timeCurrent = $('.progress-current');
const timeDuration = $('.progress-duration');
const playlist = $('.playlist');

var app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
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
        const htmls = this.songs.map((song, index) => {
            return `<div class="song${index === this.currentIndex ? ' active' : ''}" data-index=${index}>
            <div class="thumb"
                style="background-image: url(${song.image})">
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
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function () {
        const that = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 15000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            // Chắc rằng nó có thể chạy trên nhiều trình duyệt
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (that.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi song is play
        audio.onplay = function () {
            that.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song is pause
        audio.onpause = function () {
            that.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                progress.style.background = `linear-gradient(90deg, #66BB6A 0%, #66BB6A ${progressPercent}%, #d3d3d3 ${progressPercent}%, #d3d3d3 100%)`;

                // time text
                let audioCurrent = that.convertSecondToMinutes(audio.currentTime);
                let audioDuration = that.convertSecondToMinutes(audio.duration);
                timeCurrent.textContent = audioCurrent;
                timeDuration.textContent = audioDuration;
            }
        }

        // Xử lý khi tua song
        progress.oninput = function (e) {
            let seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Xử lý khi next
        nextBtn.onclick = function () {
            if (that.isRandom) {
                that.playRandomSong();
            } else {
                that.nextSong();
            }

            audio.play();
            that.render();
            that.scrollToActiveSong();
        }

        // Xử lý khi previous
        prevBtn.onclick = function () {
            if (that.isRandom) {
                that.playRandomSong();
            } else {
                that.prevSong();
            }

            audio.play();
            that.render();
            that.scrollToActiveSong();
        }

        //  Xử lý khi bấm random
        randomBtn.onclick = function () {
            that.isRandom = !that.isRandom;
            randomBtn.classList.toggle('active', that.isRandom);
        }

        // Xử lý khi bấm repeat
        repeatBtn.onclick = function () {
            that.isRepeat = !that.isRepeat;
            repeatBtn.classList.toggle('active', that.isRepeat);
        }

        // Xử lý khi end audio
        audio.onended = function () {
            if (that.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                // Xử lí vào song
                if (songNode) {
                    that.currentIndex = Number(songNode.dataset.index);
                    that.loadCurrentSong();
                    that.render();
                    audio.play();
                }

                // Xử lí ấn vào song option
                if (e.target.closest('.option')) {
                    console.log('option')
                }
            }
        }
    },

    convertSecondToMinutes: function (seconds) {
        let minutes = Math.floor(seconds / 60) || 0;
        let restSeconds = Math.floor(seconds % 60) || 0;
        return `${minutes < 10 ? '0' : ''}${minutes}:${restSeconds < 10 ? '0' : ''}${restSeconds}`
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newSong;
        do {
            newSong = Math.floor(Math.random() * this.songs.length);
        } while (newSong === this.currentIndex);

        this.currentIndex = newSong;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            if (this.currentIndex <= 2) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }
            else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 300);
    },

    start: function () {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lí các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }
}

app.start();