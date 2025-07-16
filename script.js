document.addEventListener('DOMContentLoaded', () => {
    // === 1. 获取所有元素 ===
    const pages = document.querySelectorAll('.page');
    const homePage = document.getElementById('home-page');
    const idCardPage = document.getElementById('id-card-page');
    const wishPage = document.getElementById('wish-page');
    const blessingPage = document.getElementById('blessing-page');
    const gamePage = document.getElementById('game-page');
    const rewardPage = document.getElementById('reward-page');

    const showIdBtn = document.getElementById('show-id-btn');
    const goToWishBtn = document.getElementById('go-to-wish-btn');
    const showBlessingBtn = document.getElementById('show-blessing-btn');
    const showGameBtn = document.getElementById('show-game-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    
    const wishForm = document.getElementById('wish-form');
    const wishInput = document.getElementById('wish-input');
    const submitWishBtn = document.getElementById('submit-wish-btn');
    const wishFeedback = document.getElementById('wish-feedback');

    const unlockBtn = document.getElementById('unlock-btn');
    const passwordInput = document.getElementById('password-input');
    const treasureBox = document.getElementById('treasure-box');
    const hintText = document.getElementById('hint-text');

    const bgMusic = document.getElementById('bg-music');
    const musicToggleBtn = document.getElementById('music-toggle-btn');

    // 新创意：隐藏彩蛋元素
    const secretBtn = document.getElementById('secret-btn');
    const secretMessage = document.getElementById('secret-message');
    
    // === 2. 配置信息 ===
    const CORRECT_PASSWORD = '我一定会回来的';

    // === 3. 页面切换逻辑 ===
    function showPage(pageToShow) {
        pages.forEach(page => page.classList.remove('active'));
        pageToShow.classList.add('active');
    }

    showIdBtn.addEventListener('click', () => showPage(idCardPage));
    goToWishBtn.addEventListener('click', () => { showPage(wishPage); wishFeedback.textContent = ''; });
    showBlessingBtn.addEventListener('click', () => showPage(blessingPage));
    showGameBtn.addEventListener('click', () => {
        showPage(gamePage);
        passwordInput.value = '';
        hintText.textContent = '（提示：那句经典台词是什么来着？）';
        hintText.style.color = '#555';
        treasureBox.src = 'images/box_locked.png';
        treasureBox.classList.remove('shake');
    });
    backBtns.forEach(btn => btn.addEventListener('click', () => showPage(homePage)));

    // === 4. 许愿逻辑 (Formspree) ===
    wishForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const wishText = wishInput.value.trim();
        if (!wishText) {
            wishFeedback.textContent = '愿望不能为空哦，快写点什么吧！';
            wishFeedback.style.color = 'red';
            return;
        }

        submitWishBtn.disabled = true;
        wishFeedback.textContent = '正在发射愿望，请稍候...';
        wishFeedback.style.color = 'blue';

        fetch(wishForm.action, {
            method: 'POST',
            body: new FormData(wishForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                wishFeedback.textContent = '发射成功！喜羊羊已经收到你的愿望啦！';
                wishFeedback.style.color = 'green';
                wishInput.value = '';
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
            } else {
                throw new Error('网络问题');
            }
        })
        .catch(error => {
            wishFeedback.textContent = '哎呀，发射途中好像遇到了灰太狼... 请稍后再试！';
            wishFeedback.style.color = 'red';
        })
        .finally(() => {
            submitWishBtn.disabled = false;
        });
    });

    // === 5. 游戏逻辑 ===
    unlockBtn.addEventListener('click', () => {
        if (passwordInput.value.trim() === CORRECT_PASSWORD) {
            hintText.textContent = '密码正确！宝箱正在打开...';
            hintText.style.color = 'green';
            treasureBox.src = 'images/box_open.png';
            confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
            setTimeout(() => showPage(rewardPage), 1500);
        } else {
            hintText.textContent = '密码错误！灰太狼的平底锅飞过来了！';
            hintText.style.color = 'red';
            treasureBox.classList.add('shake');
            setTimeout(() => treasureBox.classList.remove('shake'), 500);
        }
    });

    // === 6. 音乐播放逻辑 (点击页面任意处开始播放) ===
    let isMusicPlaying = false;
    let hasInteracted = false;

    function startMusic() {
        if (!hasInteracted) {
            bgMusic.play().catch(() => {});
            hasInteracted = true;
            musicToggleBtn.textContent = '⏸️ 暂停音乐';
            isMusicPlaying = true;
        }
    }

    document.body.addEventListener('click', startMusic, { once: true }); // 第一次点击页面任意处开始播放

    musicToggleBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // 防止触发body点击
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggleBtn.textContent = '🎵 播放音乐';
        } else {
            bgMusic.play();
            musicToggleBtn.textContent = '⏸️ 暂停音乐';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // === 7. 鼠标拖尾特效 ===
    document.body.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'trail';
        document.body.appendChild(trail);
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        setTimeout(() => trail.remove(), 500);
    });

    // 新创意：隐藏彩蛋逻辑
    secretBtn.addEventListener('click', () => {
        secretMessage.style.display = 'block';
        confetti({ particleCount: 50, spread: 60 });
    });
});