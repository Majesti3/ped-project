const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];
const LESSONS_PER_DAY = 5;
const CLASSES = ["5А", "5Б", "6А", "6Б"];

const SUBJECTS = {
    "Математика": { teacher: "Иванов", hours: 4, room: 101 },
    "Русский язык": { teacher: "Петров", hours: 4, room: 102 },
    "История": { teacher: "Сидоров", hours: 2, room: 103 },
    "Физика": { teacher: "Васильев", hours: 2, room: 201 },
    "Химия": { teacher: "Смирнова", hours: 2, room: 202 },
    "Английский язык": { teacher: "Кузнецова", hours: 3, room: 104 },

    // Потоковые предметы (группы классов)
    "Физкультура": { teacher: "Сергеев", hours: 2, room: "Спортзал", groups: [["5А", "5Б"], ["6А", "6Б"]] },
    "Музыка": { teacher: "Лебедева", hours: 1, room: 301, groups: [["5А", "5Б", "6А", "6Б"]] },
    "ОБЖ": { teacher: "Михайлов", hours: 1, room: 302, groups: [["6А", "6Б"]] }
};

// Создаем пустое расписание
let schedule = {};
CLASSES.forEach(className => {
    schedule[className] = {};
    DAYS.forEach(day => {
        schedule[className][day] = Array(LESSONS_PER_DAY).fill("—");
    });
});

// Функция проверки возможности установки урока
function canPlaceLesson(className, day, slot, subject, teacher) {
    if (slot > 0 && schedule[className][day][slot].startsWith(subject)) return false;
    return !CLASSES.some(c => schedule[c][day][slot]?.includes(teacher));
}

// Заполняем потоковые предметы
Object.entries(SUBJECTS).forEach(([subject, info]) => {
    if (!info.groups) return; // Пропускаем индивидуальные предметы

    for (let i = 0; i < info.hours; i++) {
        let placed = false;
        while (!placed) {
            let day = DAYS[Math.floor(Math.random() * DAYS.length)];
            let slot = Math.floor(Math.random() * LESSONS_PER_DAY);
            if (info.groups.every(group => group.every(className => schedule[className][day][slot] === "—"))) {
                info.groups.forEach(group => group.forEach(className => {
                    schedule[className][day][slot] = `${subject} (${info.teacher}, каб. ${info.room})`;
                }));
                placed = true;
            }
        }
    }
});

// Заполняем обычные предметы
let subjectPool = {};
Object.entries(SUBJECTS).forEach(([subject, info]) => {
    if (info.groups) return; // Пропускаем потоковые предметы

    subjectPool[subject] = CLASSES.flatMap(className => Array(info.hours).fill(className));
});

// Размещаем предметы по расписанию
Object.keys(subjectPool).sort(() => Math.random() - 0.5).forEach(subject => {
    while (subjectPool[subject].length) {
        let className = subjectPool[subject].splice(Math.floor(Math.random() * subjectPool[subject].length), 1)[0];
        let placed = false;
        while (!placed) {
            let day = DAYS[Math.floor(Math.random() * DAYS.length)];
            let slot = Math.floor(Math.random() * LESSONS_PER_DAY);
            if (schedule[className][day][slot] === "—" && canPlaceLesson(className, day, slot, subject, SUBJECTS[subject].teacher)) {
                schedule[className][day][slot] = `${subject} (${SUBJECTS[subject].teacher}, каб. ${SUBJECTS[subject].room})`;
                placed = true;
            }
        }
    }
});

// Вывод расписания
Object.entries(schedule).forEach(([className, days]) => {
    console.log(`\n=== Расписание для класса ${className} ===`);
    Object.entries(days).forEach(([day, slots]) => {
        console.log(`\n${day}:`);
        slots.forEach((lesson, i) => {
            console.log(`${i + 1}-й урок: ${lesson}`);
        });
    });
});

