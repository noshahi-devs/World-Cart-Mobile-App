// Desktop App Simulation Logic
let isTracking = false;
let isOnBreak = false;
let seconds = 0;
let breakSeconds = 0;
let timerInterval;

function showView(view) {
    document.getElementById('desktop-view').classList.remove('active');
    document.getElementById('admin-view').classList.remove('active');
    document.getElementById('btn-desktop').classList.remove('active');
    document.getElementById('btn-admin').classList.remove('active');

    document.getElementById(view + '-view').classList.add('active');
    document.getElementById('btn-' + view).classList.add('active');
}

function desktopAction(action) {
    const loginView = document.getElementById('desktop-login');
    const dashView = document.getElementById('desktop-dash');
    const btnCheckin = document.getElementById('btn-checkin');
    const btnCheckout = document.getElementById('btn-checkout');
    const btnBreak = document.getElementById('btn-break');
    const btnResume = document.getElementById('btn-resume');

    switch (action) {
        case 'login':
            loginView.classList.add('hidden');
            dashView.classList.remove('hidden');
            break;
        case 'checkin':
            isTracking = true;
            btnCheckin.classList.add('hidden');
            btnCheckout.classList.remove('hidden');
            btnBreak.classList.remove('hidden');
            startTimer();
            break;
        case 'checkout':
            isTracking = false;
            isOnBreak = false;
            btnCheckin.classList.remove('hidden');
            btnCheckout.classList.add('hidden');
            btnBreak.classList.add('hidden');
            btnResume.classList.add('hidden');
            stopTimer();
            break;
        case 'break':
            isOnBreak = true;
            btnBreak.classList.add('hidden');
            btnResume.classList.remove('hidden');
            break;
        case 'resume':
            isOnBreak = false;
            btnResume.classList.add('hidden');
            btnBreak.classList.remove('hidden');
            break;
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (!isOnBreak) {
            seconds++;
            document.getElementById('session-timer').innerText = formatTime(seconds);
        } else {
            breakSeconds++;
            document.getElementById('break-timer').innerText = formatTime(breakSeconds);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(s) {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
