document.addEventListener('DOMContentLoaded', () => {
    const countdownsDiv = document.getElementById('countdowns');

    const fetchData = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/all-drama/Nxnx/refs/heads/main/ok.txt');
            const data = await response.text();
            const lines = data.split('\n').filter(line => line.trim() !== '');
            const birthdays = [];

            // Collect names and dates into an array
            for (let i = 0; i < lines.length; i += 2) {
                if (lines[i + 1]) { // Ensure there's a date for each name
                    const name = lines[i].trim();
                    const dateParts = lines[i + 1].trim().split(' ');
                    if (dateParts.length === 3) { // Check if dateParts has three elements
                        const birthday = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // month is 0-based
                        birthdays.push({ name, birthday });
                    }
                }
            }

            // Sort birthdays
            const today = new Date();
            birthdays.sort((a, b) => {
                const nextBirthdayA = new Date(today.getFullYear(), a.birthday.getMonth(), a.birthday.getDate());
                const nextBirthdayB = new Date(today.getFullYear(), b.birthday.getMonth(), b.birthday.getDate());

                // If birthday has already passed this year, move to next year
                if (nextBirthdayA < today) {
                    nextBirthdayA.setFullYear(today.getFullYear() + 1);
                }
                if (nextBirthdayB < today) {
                    nextBirthdayB.setFullYear(today.getFullYear() + 1);
                }

                return nextBirthdayA - nextBirthdayB;
            });

            // Display the countdowns
            displayCountdowns(birthdays);
            // Start the countdown timer
            startCountdowns(birthdays);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const displayCountdowns = (birthdays) => {
        const today = new Date();
        countdownsDiv.innerHTML = ''; // Clear previous countdowns

        // Separate today's birthdays from upcoming ones
        const todayBirthdays = [];
        const upcomingBirthdays = [];

        // Iterate over sorted birthdays
        birthdays.forEach(({ name, birthday }) => {
            const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

            // If birthday has already passed this year, move to next year
            if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }

            // Check if today is the birthday
            if (nextBirthday.getDate() === today.getDate() && nextBirthday.getMonth() === today.getMonth()) {
                todayBirthdays.push(name); // Collect today's birthdays
            } else {
                upcomingBirthdays.push({ name, nextBirthday }); // Collect upcoming birthdays
            }
        });

        // Display today's birthdays first
        todayBirthdays.forEach(name => {
            const birthdayElement = document.createElement('div');
            birthdayElement.classList.add('birthday');
            birthdayElement.innerHTML = `<h2>${name}</h2>
                                         <p class="flicker">Happy Birthday!</p>`;
            countdownsDiv.appendChild(birthdayElement);
        });

        // Display upcoming birthdays
        upcomingBirthdays.forEach(({ name, nextBirthday }) => {
            const birthdayElement = document.createElement('div');
            birthdayElement.classList.add('birthday');
            birthdayElement.setAttribute('data-next-birthday', nextBirthday);

            birthdayElement.innerHTML = `<h2>${name}</h2>
                                         <p class="countdown">Countdown to birthday:</p>
                                         <p class="time">Calculating...</p>`;
            countdownsDiv.appendChild(birthdayElement);
        });
    };

    const startCountdowns = (birthdays) => {
        const updateCountdowns = () => {
            const today = new Date();
            const birthdayElements = countdownsDiv.getElementsByClassName('birthday');

            Array.from(birthdayElements).forEach(birthdayElement => {
                const nextBirthday = new Date(birthdayElement.getAttribute('data-next-birthday'));

                // Calculate the time difference
                const timeDiff = nextBirthday - today;

                if (timeDiff > 0) {
                    // Calculate days, hours, minutes, and seconds
                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                    // Update the countdown display
                    birthdayElement.querySelector('.time').innerHTML = `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
                } else {
                    // If the birthday has passed, update to show Happy Birthday
                    birthdayElement.innerHTML = `<h2>${birthdayElement.querySelector('h2').innerText}</h2>
                                                 <p class="flicker">Happy Birthday!</p>`;
                }
            });
        };

        // Initial countdown update
        updateCountdowns();
        // Update countdown every second
        setInterval(updateCountdowns, 1000); // Update every second
    };

    // Fetch data initially
    fetchData();

    // Update data every minute to refresh the countdowns
    setInterval(fetchData, 60000); // Adjust this interval as needed
});
