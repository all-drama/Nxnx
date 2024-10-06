const TOKEN = '2101997776:AAHj-bUlVvLfgrZxfnLTodZYh2JXAlVF024';
const CHAT_ID = '608204273';

const sendTelegramMessage = async (message) => {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const payload = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
    };

    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        console.log('Message sent:', message);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const checkUpcomingBirthdays = (birthdays) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date

    birthdays.forEach(({ name, birthday }) => {
        const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

        // If birthday has already passed this year, move to next year
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        // Check if tomorrow is the birthday
        if (nextBirthday.toDateString() === tomorrow.toDateString()) {
            sendTelegramMessage(`🎉 Reminder: Tomorrow is ${name}'s birthday! 🎂`);
        }
    });
};

const displayCountdowns = (birthdays) => {
    const countdownsDiv = document.getElementById('countdowns');
    countdownsDiv.innerHTML = '';

    birthdays.forEach(({ name, birthday }) => {
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'birthday';
        countdownDiv.innerHTML = `
            <h2>${name}</h2>
            <p>Birthday Countdown:<br><span id="countdown-${name}"><br></span></p>
        `;
        countdownsDiv.appendChild(countdownDiv);
    });
};



const startCountdowns = (birthdays) => {
    birthdays.forEach(({ name, birthday }) => {
        const countdownElement = document.getElementById(`countdown-${name}`);
        const updateCountdown = () => {
            const now = new Date();
            let nextBirthday = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());

            if (nextBirthday < now) {
                nextBirthday.setFullYear(now.getFullYear() + 1);
            }

            const timeRemaining = nextBirthday - now;
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            if (timeRemaining < 0) {
                countdownElement.innerHTML = "🎉 Happy Birthday!";
            } else {
                countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        };
        updateCountdown();
        setInterval(updateCountdown, 1000); // Update every second
    });
};

const fetchData = async () => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/all-drama/Nxnx/refs/heads/main/ok.txt');
        const data = await response.text();
        const lines = data.split('\n').filter(line => line.trim() !== '');

        // Log the fetched data for debugging
        console.log('Fetched Data:', lines);

        const birthdays = [];

        for (let i = 0; i < lines.length; i += 2) {
            const name = lines[i].trim();
            const dateLine = lines[i + 1] ? lines[i + 1].trim() : null;

            if (name && dateLine) {
                const dateParts = dateLine.split(' ');
                if (dateParts.length === 3) {
                    const birthday = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                    birthdays.push({ name, birthday });
                }
            }
        }

        console.log('Processed Birthdays:', birthdays);

        birthdays.sort((a, b) => {
            const today = new Date();
            const nextBirthdayA = new Date(today.getFullYear(), a.birthday.getMonth(), a.birthday.getDate());
            const nextBirthdayB = new Date(today.getFullYear(), b.birthday.getMonth(), b.birthday.getDate());

            if (nextBirthdayA < today) {
                nextBirthdayA.setFullYear(today.getFullYear() + 1);
            }
            if (nextBirthdayB < today) {
                nextBirthdayB.setFullYear(today.getFullYear() + 1);
            }

            return nextBirthdayA - nextBirthdayB;
        });

        displayCountdowns(birthdays);
        startCountdowns(birthdays);
        checkUpcomingBirthdays(birthdays); // Check for upcoming birthdays
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Fetch data initially
fetchData();

// Update data every minute to refresh the countdowns
setInterval(fetchData, 60000); // Adjust this interval as needed
    
